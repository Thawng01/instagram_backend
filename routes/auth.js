import express from "express";
import Joi from "joi";
import { User, validate } from "../model/user.js";
import bcrypt from "bcrypt";
import { randomInt } from "crypto";
import { transport } from "../utility/email.js";

const router = express.Router();

// for register new user
router.post("/", async (req, res) => {
    const { username, fullname, email } = req.body;

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).send("The email already in use!");

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        user = await new User({
            username,
            fullname,
            email,
            password,
        });

        await user.save();
        res.send({
            id: user._id,
        });
    } catch (error) {
        res.send(error);
    }
});

// confirm registration
router.post("/:id", async (req, res) => {
    const user = await User.findById({ _id: req.params.id });

    if (!user) return res.status(400).send("No user found with the given ID");

    if (user.code != req.body.code)
        return res.status(400).send("Invalid code!");

    user.confirmed = true;
    const token = user.generateAuthToken();

    await user.save();
    res.header("x_auth_token", token).status(200).send({ id: user._id });
});

//login
router.post("/account/login", async (req, res) => {
    const { email, password } = req.body;
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password");

    // check if user email is confirmed or not
    if (!user.confirmed) {
        return res.status(200).send({
            id: user._id,
            confirmed: user.confirmed,
            email: user.email,
        });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
        return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();

    res.header("x_auth_token", token).send({
        confirmed: user.confirmed,
        id: user._id,
    });
});

function validateLogin(input) {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().max(200).required().label("Password"),
    });

    return schema.validate(input);
}

// send confirmation code
router.put("/confirm/:id", async (req, res) => {
    const user = await User.findById(req.params.id);

    const code = randomInt(100_000).toString().padStart(6, "1");
    user.code = code;
    await user.save();

    transport.sendMail(
        {
            from: "Instagram Clone",
            to: user.email,
            text: code,
            subject: "Confirmation code",
        },
        (err, info) => {
            if (err)
                return res.status(400).send({ error: "Something failed." });
            res.status(200).send();
        }
    );
});

// login with facebook
router.post("/facebook/login", async (req, res) => {
    const { username, email, picture } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            //login
            const token = user.generateAuthToken();
            res.header("x_auth_token", token).send({
                confirmed: true,
                id: user._id,
            });
        } else {
            // register new user
            const randomPassword = email + new Date().getTime();
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(randomPassword, salt);
            const user = await new User({
                username: username,
                fullname: username,
                email,
                password,
                profileImg: picture,
            });

            await user.save();
            res.header("x_auth_token", token).send({ id: user._id });
        }
    } catch (error) {
        res.status(500).send("Something failed.");
    }
});

export default router;

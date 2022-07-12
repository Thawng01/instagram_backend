import express from "express";
import { User } from "../model/user.js";
import upload from "../middleware/multer.js";
import { uploads } from "../middleware/cloudinary.js";

const router = express.Router();

// fetch a user info
router.get("/:id", async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select(
        "-password -code"
    );
    if (!user) return res.status(400).send("No user with the given ID");

    res.status(200).send(user);
});

//fetch all users
router.get("/all/:id", async (req, res) => {
    const user = await User.find({ _id: { $ne: req.params.id } }).select({
        username: 1,
        profileImg: 1,
    });

    res.status(200).send(user);
});

// update birth day
router.put("/:id", async (req, res) => {
    const { year, month, day } = req.body;

    let m = month;
    if (month === "May") {
        m = 4;
    }
    const monInNum = Number(m) + 1;
    const birthDay = [year, monInNum, day].join("-");

    const user = await User.findById({ _id: req.params.id });
    user.birthDay = birthDay;

    await user.save();
    res.status(200).send({ id: user._id, email: user.email });
});

// update profile image
router.put("/profile/:id", upload.single("profile"), async (req, res) => {
    const url = await uploads(req.file.path, res);
    const user = await User.findById(req.params.id);
    user.profileImg = url;

    await user.save();
    res.status(200).send(user);
});

router.put("/info/:id", async (req, res) => {
    const { username, email, bio, website, phone, gender } = req.body;

    await User.findByIdAndUpdate(req.params.id, {
        $set: {
            username,
            email,
            bio,
            website,
            phone,
            gender,
        },
    });

    res.status(200).send();
});

// fetch suggested users
router.get("/suggest/:id/:limit", async (req, res) => {
    const { id, limit } = req.params;
    const user = await User.findById(id);
    const following = user.following;

    const users = await User.find()
        .and([{ _id: { $nin: following } }, { _id: { $ne: user._id } }])
        .limit(limit);

    res.status(200).send(users);
});

//search for users
router.get("/search/:name/:id", async (req, res) => {
    const { name, id } = req.params;

    const users = await User.find({
        _id: { $ne: id },
        username: { $regex: name, $options: "$i" },
    }).select({ username: 1, fullname: 1, posts: 1, profileImg: 1 });

    res.status(200).send(users);
});

export default router;

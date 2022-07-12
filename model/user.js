import mongoose from "mongoose";
import Joi from "joi";
import config from "config";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: { type: String, maxlength: 40, required: true },
    fullname: { type: String, maxlength: 40, required: true },
    email: { type: String, maxlength: 40, required: true, unique: true },
    password: { type: String, minlength: 6, maxlength: 1025, required: true },
    bio: { type: String, maxlength: 150, default: "" },
    profileImg: {
        type: String,
        default:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Placeholder_no_text.svg/1200px-Placeholder_no_text.svg.png",
    },
    profileCover: { type: String, default: "" },
    follower: { type: Array, default: [] },
    following: { type: Array, default: [] },
    posts: { type: Array, default: [] },
    phone: { type: Number, default: null },
    birthDay: { type: String, default: "" },
    code: { type: Number, default: null },
    confirmed: { type: Boolean, default: false },
    gender: { type: String, default: "" },
    saved: [],
    website: [],
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id }, config.get("jwtPrivateKey"));
    return token;
};

export const User = mongoose.model("users", userSchema);

export const validate = (input) => {
    const schema = Joi.object({
        username: Joi.string().max(40).required().label("Username"),
        fullname: Joi.string().max(40).required().label("Fullname"),
        email: Joi.string().max(40).email().required().label("Email"),
        password: Joi.string().min(6).max(200).required().label("Password"),
    });

    return schema.validate(input);
};

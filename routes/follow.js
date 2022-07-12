import express from "express";

import { User } from "../model/user.js";

const router = express.Router();

// follow user
router.put("/follow/:id", async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;

    const follower = await User.findById(id);
    if (follower.following.includes(user)) {
        const index = follower.following.findIndex((i) => i === user);
        follower.following.splice(index, 1);
    } else {
        follower.following.push(user);
    }

    const following = await User.findById(user);
    if (following.follower.includes(id)) {
        const index = following.follower.findIndex((i) => i === id);
        following.follower.splice(index, 1);
    } else {
        following.follower.push(id);
    }

    await follower.save();
    await following.save();

    res.status(200).send(follower);
});

// fetch following
router.get("/following/:id", async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const following = user.following;
    const length = following.length;

    const followings = [];
    if (length > 0) {
        for (let i = 0; i < length; i++) {
            const user = await User.findById(following[i]);
            if (user) followings.push(user);
        }
    }

    if (length === followings.length) {
        res.status(200).send(followings);
    }
});

//fetch followers
router.get("/follower/:id", async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const follower = user.follower;
    const length = follower.length;

    const followers = [];
    if (length > 0) {
        for (let i = 0; i < length; i++) {
            const user = await User.findById(follower[i]);

            if (user) followers.push(user);
        }
    }

    if (length === followers.length) {
        res.status(200).send(followers);
    }
});

export default router;

import express from "express";

import { Comment, validate } from "../model/comment.js";
import { Post } from "../model/post.js";

const router = express.Router();

// get all comments for a specific post
router.get("/:id", async (req, res) => {
    const comment = await Comment.find({ postId: req.params.id })
        .populate("user", "username profileImg")
        .sort({ createdAt: -1 });

    res.status(200).send(comment);
});

// add a new comment
router.post("/", async (req, res) => {
    const { postId, user, comment, parentId } = req.body;

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const com = new Comment({
            comment,
            user,
            postId,
            parentId,
        });

        const post = await Post.findById({ _id: postId });
        post.comments.push(com._id);

        await com.save();
        await post.save();
        res.status(200).send(com);
    } catch (error) {
        res.status(500).send(error);
    }
});

// like comment or unlike
router.put("/:id", async (req, res) => {
    const { userId } = req.body;
    const com = await Comment.findById({ _id: req.params.id });

    if (com.likes.includes(userId)) {
        const index = com.likes.findIndex((i) => i === userId);
        com.likes.splice(index, 1);
    } else {
        com.likes.push(userId);
    }

    await com.save();
    res.status(200).send();
});

export default router;

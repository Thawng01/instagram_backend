import express from "express";

import { Post } from "../model/post.js";
import { User } from "../model/user.js";
import upload from "../middleware/multer.js";
import { uploads } from "../middleware/cloudinary.js";

const router = express.Router();

// fetch posts
router.get("/", async (req, res) => {
    const post = await Post.find()
        .sort("-createdAt")
        .populate("user", "username profileImg");

    res.status(200).send(post);
});

// fetch posts of a specific user
router.get("/:id", async (req, res) => {
    const post = await Post.find({ user: req.params.id }).select(
        "image comments"
    );
    res.status(200).send(post);
});

// fetch a single post of a specific user
router.get("/p/:id", async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id }).populate(
        "user",
        "profileImg username"
    );

    res.status(200).send(post);
});

// add new post
router.post("/", upload.array("images", 12), async (req, res) => {
    const { caption, user } = req.body;

    const images = [];

    for (let file of req.files) {
        const { path } = file;
        const url = await uploads(path, res);
        images.push(url);
    }

    const post = new Post({
        caption,
        image: images,
        user,
    });

    const u = await User.findById({ _id: user });
    u.posts.push(user);

    await u.save();
    await post.save();
    res.status(200).send();
});

// like post and unlike
router.put("/like/:id", async (req, res) => {
    const { userId } = req.body;
    const post = await Post.findById({ _id: req.params.id });

    if (post.likes.includes(userId)) {
        const index = post.likes.findIndex((item) => item === userId);
        post.likes.splice(index, 1);
    } else {
        post.likes.push(userId);
    }
    await post.save();
    res.status(200).send();
});

// save post or unsave
router.put("/save/:id", async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;

    try {
        const post = await Post.findById({ _id: id });
        const user = await User.findById({ _id: userId });

        if (user.saved.includes(id)) {
            const index = user.saved.findIndex((u) => u === userId);
            user.saved.splice(index, 1);
        } else {
            user.saved.push(id);
        }

        if (post.savedBy.includes(userId)) {
            const index = post.savedBy.findIndex((item) => item === userId);
            post.savedBy.splice(index, 1);
        } else {
            post.savedBy.push(userId);
        }
        await user.save();
        await post.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).send("Something failed!");
    }
});

//fetch saved posts
router.get("/save/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById({ _id: id });
        const saved = user.saved;
        const length = saved.length;
        const savedPosts = [];

        if (length > 0) {
            for (let i = 0; i < length; i++) {
                const posts = await Post.findById({ _id: saved[i] }).select(
                    "image comments"
                );
                savedPosts.push(posts);
            }
        }

        if (length === savedPosts.length) {
            res.status(200).send(savedPosts);
        }
    } catch (error) {
        res.status(400).send("Something failed!");
    }
});

// edit post
router.put("/:id", async (req, res) => {
    const post = await Post.findByIdAndUpdate({ _id: req.params.id });
    post.caption = req.body.caption;
    await post.save();

    res.status(200).send();
});

router.delete("/:postId/:userId", async (req, res) => {
    const { postId, userId } = req.params;

    const user = await User.findById({ _id: userId });
    const index = user.posts.findIndex((p) => p._id === postId);
    user.posts.splice(index, 1);

    const result = await Post.findByIdAndRemove(postId);
    await user.save();

    res.status(200).send();
});

export default router;

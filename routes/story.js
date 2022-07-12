import express from "express";

import Story from "../model/story.js";
import upload from "../middleware/multer.js";
import { uploads } from "../middleware/cloudinary.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
    try {
        const story = await Story.find({ userId: req.params.id })
            .populate("user", "username profileImg")
            .sort({ createdAt: 1 });
        res.status(200).send(story);
    } catch (error) {
        res.status(500).send("Something failed.");
    }
});

router.post("/", upload.single("photo"), async (req, res) => {
    const { userId } = req.body;
    const { path } = req.file;

    try {
        const url = await uploads(path, res);

        const story = new Story({
            photo: url,
            user: userId,
        });

        await story.save();
        res.status(200).send(story);
    } catch (error) {
        res.status(500).send("Something failed.");
    }
});

export default router;

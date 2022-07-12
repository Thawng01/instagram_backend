import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        caption: String,
        image: Array,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        comments: { type: Array, default: [] },
        likes: { type: Array, default: [] },
        savedBy: { type: Array, default: [] },
    },
    {
        timestamps: true,
    }
);

export const Post = mongoose.model("posts", postSchema);

import mongoose from "mongoose";
import Joi from "joi";

const commentSchema = new mongoose.Schema(
    {
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        postId: { type: mongoose.Schema.Types.ObjectId, required: true },
        likes: { type: Array, default: [] },
        parentId: { type: String },
    },
    {
        timestamps: true,
    }
);

export const validate = (input) => {
    const schema = Joi.object({
        comment: Joi.string().required(),
        postId: Joi.string().required(),
        user: Joi.string().required(),
        parentId: Joi.allow(""),
    });

    return schema.validate(input);
};

export const Comment = mongoose.model("comments", commentSchema);

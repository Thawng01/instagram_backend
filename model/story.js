import mongoose from "mongoose";

const StorySchema = new mongoose.Schema(
    {
        photo: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        likes: [],
    },
    {
        timestamps: true,
    }
);

const Story = mongoose.model("stories", StorySchema);

export default Story;

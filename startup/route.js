import user from "../routes/user.js";
import auth from "../routes/auth.js";
import story from "../routes/story.js";
import post from "../routes/post.js";
import comment from "../routes/comment.js";
import follow from "../routes/follow.js";
import error from "../middleware/error.js";

export default function (app) {
    app.use("/api/user", user);
    app.use("/api/auth", auth);
    app.use("/api/post", post);
    app.use("/api/comment", comment);
    app.use("/api", follow);
    app.use("/api/story", story);
    app.use(error);
}

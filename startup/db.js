import mongoose from "mongoose";
import logger from "./logger.js";

export default function () {
    mongoose.connect("mongodb://localhost/instagram", () =>
        logger.info("Connected to mongodb")
    );
}

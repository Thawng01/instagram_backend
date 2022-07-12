import logger from "../startup/logger.js";
export default function (err, req, res, next) {
    logger.error(err.message, err);
    res.status(500).send("Something went wrong.");
}

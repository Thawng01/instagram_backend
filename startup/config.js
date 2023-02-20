import config from "config";
import logger from "./logger.js";

export default function () {
    if (!config.get("jwtPrivateKey")) {
        logger.error("FATAL ERROR: jwtprivatekey is undefined");
        process.exit(1);
    }
}

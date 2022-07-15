import config from "config";
import logger from "./logger.js";

export default function () {
    if (!config.get("jwtPrivateKey")) {
        logger.error("FATAL ERROR: jwtprivatekey is undefined");
        console.log("failed");
        process.exit(1);
    }
}

import winston from "winston";
import "winston-mongodb";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: "error.json",
            level: "info",
        }),

        new winston.transports.MongoDB({
            db: "mongodb://localhost/instagram",
            options: { useNewUrlParser: true, useUnifiedTopology: true },
            level: "error",
        }),
    ],
});

export default logger;

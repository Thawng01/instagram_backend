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
            db: "mongodb://thawng:Na078zCGi9uae6ky@ac-nyumi05-shard-00-00.tnlpjdi.mongodb.net:27017,ac-nyumi05-shard-00-01.tnlpjdi.mongodb.net:27017,ac-nyumi05-shard-00-02.tnlpjdi.mongodb.net:27017/?ssl=true&replicaSet=atlas-gknkjn-shard-0&authSource=admin&retryWrites=true&w=majority",
            options: { useNewUrlParser: true, useUnifiedTopology: true },
            level: "error",
        }),
    ],
});

export default logger;

import "express-async-errors";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

import config from "./startup/config.js";
import route from "./startup/route.js";
import db from "./startup/db.js";
import prod from "./startup/prod.js";
import logger from "./startup/logger.js";

process.on("uncaughtException", (err) => {
    logger.error("failed during start up", err);
});

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    socket.on("add-comment", (data) => {
        socket.emit("get-comment", data);
    });
});

const corsOptions = {
    exposedHeaders: "x_auth_token",
};

app.use(express.json());
app.use(cors(corsOptions));
prod();
route(app);
db();
config();

const port = process.env.PORT || 9000;

httpServer.listen(port);

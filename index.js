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

const corsOptions = {
    exposedHeaders: "x_auth_token",
    // origin: "https://insta-clone-ui.netlify.app/",
};

app.use(express.json());
app.use(cors(corsOptions));
prod(app);
route(app);
db();
config();

const io = new Server(httpServer, {
    cors: {
        origin: "https://insta-clone-ui.netlify.app/",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    socket.on("add-comment", (data) => {
        socket.emit("get-comment", data);
    });
});

const port = process.env.PORT || 9000;

httpServer.listen(port);

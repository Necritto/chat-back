import express from "express";
import cors from "cors";
import { createServer } from "http";
import { config } from "dotenv";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { UsersController } from "./controllers/UsersController";
import { DialogsController } from "./controllers/DialogsController";
import { MessagesController } from "./controllers/MessagesController";
import socketManager from "./controllers/SocketManager";

config();

const app = express();
const PORT = process.env.PORT;
app.use(cors({ origin: process.env.ALLOW_URI }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.ALLOW_URI,
    methods: ["GET", "POST"],
  },
});

socketManager.connection(io);

new UsersController(app, io);
new DialogsController(app, io);
new MessagesController(app, io);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

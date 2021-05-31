import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import socketInit from "./sockets/index.js";

import postRoutes from "./routes/post.js";
import userRoutes from "./routes/users.js";
import notifRouter from "./routes/notification.js";
import Emitter from "events";

const app = express();
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

dotenv.config();

app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json({ limit: "30mb", extended: true }));

//Event emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

const server = createServer(app);
const io = new Server(server, { cors: true, origins: ["http://127.0.0.1:3000"] });
//socket
socketInit(io, eventEmitter);

app.use("/posts", postRoutes);
app.use("/user", userRoutes);
app.use("/notifications", notifRouter);
app.get("/", (req, res) => {
  res.send("Hello to api");
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    server.listen(PORT, () => console.log(`Server runing on port ${PORT}`));
  })
  .catch((err) => {
    console.log(err.message);
  });

// mongoose.set("useCreateIndex", true);

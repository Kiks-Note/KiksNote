const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv").config();
const app = express();
const { db, auth } = require("./firebase");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const webSocketServer = require("websocket").server;
const http = require("http");
const { parse } = require("url");
const saltRounds = parseInt(process.env.SALTY_ROUNDS);
const multer = require("multer");
const DIR = "uploads/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg, .jpeg and .pdf format allowed!"));
    }
  },
});

const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  authClient,
} = require("./firebase_auth");

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5050;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const ws = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

ws.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  const { pathname } = parse(request.httpRequest.url);
  console.log("pathname => ", pathname);
  connection ? console.log("connection ok") : console.log("connection failed");

  require("./blog_back.js")(app, pathname, db, connection);
  require("./routes/call")(app, db, connection, pathname);
  require("./dashboardWebSocket")(app, db, connection, pathname);
  require("./routes/groupscreation")(app, db);
  require("./calendar")(app, db);
  require("./calendarWebSocket")(app, db, connection, pathname);
  require("./userInfo")(app, pathname, db, connection, upload, path, fs);

  connection.on("error", (error) => {
    console.log(`WebSocket Error: ${error}`);
  });

  connection.on("close", (reasonCode, description) => {
    console.log(
      `WebSocket closed with reasonCode ${reasonCode} and description ${description}`
    );
  });
});

require("./routes/auth")(
  app,
  db,
  bcrypt,
  saltRounds,
  auth,
  authClient,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
);

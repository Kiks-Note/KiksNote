const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const app = express();
const webSocketServer = require("websocket").server;
const http = require("http");
const {db, auth} = require("./firebase");
const {parse} = require("url");
const saltRounds = 12;
const fs = require("fs");

const {signInWithEmailAndPassword, authClient} = require("./firebase_auth");

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5050;
const server = http.createServer(app);

const wsI = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

const inventoryRoutes = require("./inventoryRoutes");
const authRoutes = require("./authRoutes");
app.use("/auth", authRoutes);

wsI.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  const {pathname} = parse(request.httpRequest.url);
  console.log("pathname => ", pathname);
  connection ? console.log("connection ok") : console.log("connection failed");

  app.use("/inventory", inventoryRoutes(connection, pathname));
  // app.use("/dashboard", dashboardRoutes(connection, pathname));
  // app.use("/profil", profilRoutes(connection, pathname, upload));
  // app.use("/blog", blogRoutes(connection, pathname));

  connection.on("error", (error) => {
    console.log(`WebSocket Error: ${error}`);
  });

  connection.on("close", (reasonCode, description) => {
    console.log(
      `WebSocket closed with reasonCode ${reasonCode} and description ${description}`
    );
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

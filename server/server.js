const express = require("express");
const cors = require("cors");
const app = express();
const { db } = require("./firebase");
const webSocketServer = require("websocket").server;
const http = require("http");
const { parse } = require("url");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5050;

const server = http.createServer(app);

const ws = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

require("./dashboard")(app, db, ws, parse);
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

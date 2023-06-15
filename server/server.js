const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const app = express();
const dotenv = require("dotenv").config();
const { parse } = require("url");
const webSocketServer = require("websocket").server;
const http = require("http");
/// MULTER CONFIG FOR UPLOAD ON SERVER
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

const { retroRoutesWsNeeded } = require("./retroRoutes");

const corsOption = {
  origin: [
    "http://212.73.217.176"
  ],
  optionsSuccessStatus: 200,
  methods : ['GET', 'POST', 'PUT', 'DELETE']
};

app.use(express.json());
app.use(cors(corsOption));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5050;
const server = http.createServer(app);

const wsI = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});
const homeRoutes = require("./homeRoutes");
const authRoutes = require("./authRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const profilRoutes = require("./profilRoutes");
const blogRoutes = require("./blogRoutes");
const coursRoutes = require("./coursRoutes");
const studentsProjectsRoutes = require("./studentsProjectsRoutes");
const jpoRoutes = require("./jpoRoutes");
const technosRoutes = require("./technosRoutes");
const agileRoute = require("./agileRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const calendarRoutes = require("./calendarRoutes");

const { groupNoWsNeeded, groupWsNeeded } = require("./groupsRoutes");
const groupNoWs = groupNoWsNeeded();
app.use("/ressources", coursRoutes()); // --> Resssources Cours
app.use("/ressources", studentsProjectsRoutes()); // --> Resssources Projet Etudiants
app.use("/ressources", jpoRoutes()); // --> Resssources Jpo
app.use("/ressources", technosRoutes()); // --> Resssources Technos
app.use("/home", homeRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/auth", authRoutes);
app.use("/groupes", groupNoWs);

wsI.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  const { pathname } = parse(request.httpRequest.url);
  console.log("pathname => ", pathname);
  connection ? console.log("connection ok") : console.log("connection failed");

  //app.use("/inventory", inventoryRoutes(connection, pathname));
  app.use("/blog", blogRoutes(connection, pathname, upload));
  app.use("/dashboard", dashboardRoutes(connection, pathname));
  app.use("/profil", profilRoutes(connection, pathname, upload));
  app.use("/groupes", groupWsNeeded(connection, pathname));
  app.use("/agile", agileRoute(connection, pathname, upload));
  app.use("/retro", retroRoutesWsNeeded(connection, pathname));
  app.use("/calendar", calendarRoutes(connection, pathname));
  require("./web/inventoryWebSocket")(connection, pathname);

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

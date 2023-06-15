const { db, storageFirebase } = require("../firebase");
const moment = require("moment");
const multer = require("multer");
const mime = require("mime-types");
const bucket = storageFirebase.bucket();
const fs = require("fs");

const pastelColors = [
  "#FFA07A",
  "#FF7F50",
  "#FFEE93",
  "#A0CED9",
  "#ADF7B6",
  "#ffb3c6",
  "#a9def9",
  "#eccaff",
];
let indexColor = 0;

const path = require("path");
const { log } = require("console");

const DIR = "./uploads";

// Vérifier et créer le dossier "uploads" s'il n'existe pas
if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Le fichier doit être un PDF"));
    }
    cb(null, true);
  },
}).single("file");

const getStudents = async (req, res) => {
  const { classStudents } = req.params;
  const snapshot = await db
    .collection("users")
    .where("class.id", "==", classStudents)
    .get();
  const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.status(200).send(documents);
};

const sendGroups = async (req, res) => {
  const { courseId } = req.body;

  const courseRef = await db.collection("cours").doc(courseId).get();
  try {
    const newGroupRef = db.collection("groups").doc();
    await newGroupRef.set({
      start_date: courseRef.data().dateStartSprint,
      end_date: courseRef.data().dateEndSprint,
      students: req.body.students,
      po_id: req.body.po_id,
      courseId: courseId,
    });

    res.status(200).send("Groups successfully added!");
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

const deleteRoom = async (req, res) => {
  const { po_id } = req.params;

  try {
    const snapshot = await db
      .collection("rooms")
      .where("po_id", "==", po_id)
      .where("type", "==", "group")
      .get();
    const deletePromises = snapshot.docs.map((doc) => doc.ref.delete());
    await Promise.all(deletePromises);

    res.status(200).send("Rooms successfully deleted!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting rooms.");
  }
};

const getRoom = async (req, res) => {
  const { classStudent } = req.params;
  const snapshot = await db
    .collection("rooms")
    .where("class", "==", classStudent)
    .where("type", "==", "group")
    .get();
  const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.status(200).send(documents);
};

const getRoomPo = async (req, res) => {
  const { po_id } = req.params;
  const snapshot = await db
    .collection("rooms")
    .where("po_id", "==", po_id)
    .where("type", "==", "group")
    .get();
  const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.status(200).send(documents);
};

const getGroupsPo = async (req, res) => {
  const { po_id } = req.params;
  const currentDateTime = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
  const snapshot = await db
    .collection("groups")
    .where("po_id", "==", po_id)
    .where("end_date._seconds", ">=", currentDateTime)
    .get();

  const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  res.status(200).send(documents);
};

const getGroups = async (req, res) => {
  const { student_id } = req.params;
  const currentDateTime = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
  const snapshot = await db
    .collection("groups")
    .where("students", "array-contains", student_id)
    .where("end_date._seconds", ">=", currentDateTime)
    .get();

  const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  res.status(200).send(documents);
};

const currentRooms = new Map();

const clients = new Map();

const room = async (connection) => {
  const defaultRoom = {
    users: new Map(),
    lock: true,
    SpGrp: undefined,
    nbUsers: 0,
    columns: undefined,
    nbStudents: 0,
  };

  const sendToAllClients = (message, classStudent) => {
    const roomClients = clients.get(classStudent) || new Map();

    for (const [UserID, client] of roomClients.entries()) {
      client.sendUTF(JSON.stringify(message));
    }
  };

  connection.on("message", (message) => {
    const response = JSON.parse(message.utf8Data);

    switch (response.type) {
      case "cursorPosition":
        const { userID, position } = response.data;

        const roomUsersToUpdate =
          currentRooms.get(response.data.class) || defaultRoom;

        roomUsersToUpdate.users.set(userID, {
          position: position,
          color: roomUsersToUpdate.users.get(userID)?.color,
          name: roomUsersToUpdate.users.get(userID)?.name,
          isDragging: roomUsersToUpdate.users.get(userID)?.isDragging,
        });

        currentRooms.set(response.data.class, roomUsersToUpdate);

        const message = {
          type: "updateRoom",
          data: {
            currentRoom: {
              ...currentRooms.get(response.data.class),
              users: Object.fromEntries(
                currentRooms.get(response.data.class).users
              ),
            },
            class: response.data.class,
          },
        };

        sendToAllClients(message, response.data.class);

        break;
      case "createRoom":
        const newRoomRef = db.collection("rooms").doc();
        newRoomRef.set({
          po_id: response.data.po_id,
          class: response.data.class,
          type: "group",
        });
        currentRooms.set(response.data.class, defaultRoom);

        const roomUsersC = currentRooms.get(response.data.class) || defaultRoom;

        if (indexColor >= pastelColors.length) {
          indexColor = 0;
        }
        let colorC = pastelColors[indexColor];
        indexColor++;

        roomUsersC.users.set(response.data.userID, {
          position: null,
          color: colorC,
          name: response.data.name,
          isDragging: false,
        });

        currentRooms.set(response.data.class, roomUsersC);

        const roomClientsC = clients.get(response.data.class) || new Map();

        roomClientsC.set(response.data.po_id, connection);

        clients.set(response.data.class, roomClientsC);

        currentRooms.get(response.data.class).nbUsers = roomClientsC.size;

        const messageCreate = {
          type: "updateRoom",
          data: {
            currentRoom: {
              ...currentRooms.get(response.data.class),
              users: Object.fromEntries(
                currentRooms.get(response.data.class).users
              ),
            },
            class: response.data.class,
          },
        };

        sendToAllClients(messageCreate, response.data.class);

        break;
      case "joinRoom":
        const roomUsers = currentRooms.get(response.data.class) || defaultRoom;

        if (indexColor >= pastelColors.length) {
          indexColor = 0;
        }
        let color = pastelColors[indexColor];
        indexColor++;

        roomUsers.users.set(response.data.userID, {
          position: null,
          color: color,
          name: response.data.name,
          isDragging: false,
        });

        currentRooms.set(response.data.class, roomUsers);

        const roomClients = clients.get(response.data.class) || new Map();

        roomClients.set(response.data.userID, connection);

        clients.set(response.data.class, roomClients);

        currentRooms.get(response.data.class).nbUsers = roomClients.size;

        const messageJoin = {
          type: "updateRoom",
          data: {
            currentRoom: {
              ...currentRooms.get(response.data.class),
              users: Object.fromEntries(
                currentRooms.get(response.data.class).users
              ),
            },
            class: response.data.class,
          },
        };

        sendToAllClients(messageJoin, response.data.class);

        break;
      case "closeRoom":
        const messageClose = {
          type: "closeRoom",
        };

        sendToAllClients(messageClose, response.data.class);
        currentRooms.delete(response.data.class);
        clients.delete(response.data.class);
        break;
      case "leaveRoom":
        const userRoom = currentRooms.get(response.data.class) || defaultRoom;
        userRoom.users.delete(response.data.userID);

        currentRooms.set(response.data.class, userRoom);

        let allClientsInRoomLeave =
          clients.get(response.data.class) || new Map();
        allClientsInRoomLeave.delete(response.data.userID);
        clients.set(response.data.class, allClientsInRoomLeave);

        currentRooms.get(response.data.class).nbUsers = clients.get(
          response.data.class
        ).size;

        const messageLeave = {
          type: "updateRoom",
          data: {
            currentRoom: {
              ...currentRooms.get(response.data.class),
              users: Object.fromEntries(
                currentRooms.get(response.data.class).users
              ),
            },
            class: response.data.class,
          },
        };

        sendToAllClients(messageLeave, response.data.class);

        break;
      case "lock":
        let roomLock = currentRooms.get(response.data.class) || defaultRoom;
        roomLock.lock = response.data.lock;
        currentRooms.set(response.data.class, roomLock);

        const messageLock = {
          type: "updateRoom",
          data: {
            currentRoom: {
              ...currentRooms.get(response.data.class),
              users: Object.fromEntries(
                currentRooms.get(response.data.class).users
              ),
            },
            class: response.data.class,
          },
        };
        sendToAllClients(messageLock, response.data.class);
        break;
      case "nbSPGrp":
        if (response.data.status === "po") {
          let roomNbSPGrp =
            currentRooms.get(response.data.class) || defaultRoom;
          roomNbSPGrp.nbSPGrp = response.data.nbSPGrp;
          currentRooms.set(response.data.class, roomNbSPGrp);

          const messageNbSPGrp = {
            type: "updateRoom",
            data: {
              currentRoom: {
                ...currentRooms.get(response.data.class),
                users: Object.fromEntries(
                  currentRooms.get(response.data.class).users
                ),
              },
              class: response.data.class,
            },
          };

          sendToAllClients(messageNbSPGrp, response.data.class);
        }
        break;
      case "dragStart":
        let roomDragStart =
          currentRooms.get(response.data.class) || defaultRoom;
        roomDragStart.users.get(response.data.userID).isDragging = true;
        currentRooms.set(response.data.class, roomDragStart);

        const messageDragStart = {
          type: "updateRoom",
          data: {
            currentRoom: {
              ...currentRooms.get(response.data.class),
              users: Object.fromEntries(
                currentRooms.get(response.data.class).users
              ),
            },
            class: response.data.class,
          },
        };

        sendToAllClients(messageDragStart, response.data.class);
        break;
      case "dragEnd":
        let roomDragEnd = currentRooms.get(response.data.class) || defaultRoom;
        roomDragEnd.users.get(response.data.userID).isDragging = false;
        currentRooms.set(response.data.class, roomDragEnd);

        const messageDragEnd = {
          type: "updateRoom",
          data: {
            currentRoom: {
              ...currentRooms.get(response.data.class),
              users: Object.fromEntries(
                currentRooms.get(response.data.class).users
              ),
            },
            class: response.data.class,
          },
        };

        sendToAllClients(messageDragEnd, response.data.class);
        break;
      case "updateCol":
        let roomCol = currentRooms.get(response.data.class) || defaultRoom;
        roomCol.columns = response.data.columns;
        currentRooms.set(response.data.class, roomCol);

        const messageUpdateCol = {
          type: "updateRoom",
          data: {
            currentRoom: {
              ...currentRooms.get(response.data.class),
              users: Object.fromEntries(
                currentRooms.get(response.data.class).users
              ),
            },
            class: response.data.class,
          },
        };
        sendToAllClients(messageUpdateCol, response.data.class);
    }
  });
};

module.exports = {
  getStudents,
  sendGroups,
  room,
  deleteRoom,
  getRoom,
  getRoomPo,
  getGroups,
  getGroupsPo,
};

const { db } = require("../firebase");
const { v4: uuidv4 } = require("uuid");

console.log("in retro controller");

const getRoom = async (req, res) => {
  const { classStudent } = req.params;
  const snapshot = await db
    .collection("rooms")
    .where("class", "==", classStudent)
    .where("type", "==", "retro")
    .get();
  const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.status(200).send(documents);
};

const getAllRooms = async (req, res) => { 
  const snapshot = await db.collection("rooms").where("type","==","retro").get();
  const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.status(200).send(documents);
};


const currentRooms = new Map();

const clients = new Map();

const room = async (connection) => {
  const defaultRoom = {
    users: new Map(),
    nbUsers: 0,
    columns: undefined,
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
        console.log("createRoom");
        const newRoomRef = db.collection("rooms").doc();
        newRoomRef.set({
          po_id: response.data.po_id,
          class: response.data.class,
          settings: response.data.settings,
          type: "retro",
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
        });

        currentRooms.set(response.data.class, roomUsersC);

        const roomClientsC = clients.get(response.data.class) || new Map();

        roomClientsC.set(response.data.userID, connection);

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
        console.log("joinRoom");
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
        currentRooms.delete(response.data.class);
        clients.delete(response.data.class);

        const messageClose = {
          type: "closeRoom",
        };

        sendToAllClients(messageClose, response.data.class);

        break;
      case "leaveRoom":
        const userRoom = currentRooms.get(response.data.class) || defaultRoom;
        userRoom.users.delete(response.data.userID);

        console.log("User left room");

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
        if (response.data.status === "po") {
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
        }
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
      case "updateCol":
        let roomCol = currentRooms.get(response.data.class) || defaultRoom;
        roomCol.columns = response.data.columns;
        roomCol.nbStudents = response.data.nbStudents;
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
  getAllRooms,
  getRoom,
  room
};

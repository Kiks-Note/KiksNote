const { db } = require("../firebase");
const { v4: uuidv4 } = require("uuid");

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

console.log("in retro controller");

const getAll = async (req, res) => {
  const allRetrosQuery = await db.collection("retro").get()

  let allRetros = []
  allRetrosQuery.forEach((doc) => {
    allRetros.push({ ...doc.data() });
  });

  res.send(allRetros)
  //console.log(allRetros);

}

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
  const snapshot = await db
    .collection("rooms")
    .where("type", "==", "retro")
    .get();
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

    console.log(roomClients.entries());
    for (const [UserID, client] of roomClients.entries()) {
     // console.log(UserID);
     // console.log(message.data.currentRoom.columns);
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
          userID: response.data.userID,
          class: response.data.class,
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

        console.log(messageJoin);
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
        console.log("in update col");
        console.log(messageUpdateCol);
        console.log(response.data.class);
        
      //  console.log(messageUpdateCol);
      //  console.log(messageUpdateCol.data.currentRoom["columns"]);
        sendToAllClients(messageUpdateCol, response.data.class);
    }
  });
};

module.exports = {
  getAllRooms,
  getRoom,
  room,
  getAll
};

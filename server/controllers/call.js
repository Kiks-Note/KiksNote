const { db } = require("../firebase");

const addCall = async (req, res) => {
  try {
    const docRef = await db.collection("calls").add({
      id_lesson: req.body.params.id_lesson,
      date: req.body.params.date,
      status: req.body.params.status,
      qrcode: req.body.params.qrcode,
      students_scan: req.body.params.students_scan,
      chats: req.body.params.chats,
    });

    const docSnapshot = await docRef.get();
    const docData = docSnapshot.data();
    docData["id"] = docRef.id;
    res.send(docData);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send("Une erreur s'est produite lors de la création de l'appel.");
  }
};

const getCalls = async (req, res) => {
  await db
    .collection("calls")
    .get()
    .then((snapshot) => {
      let item = {};
      const data = [];
      snapshot.forEach((doc) => {
        item = doc.data();
        item["id"] = doc.id;
        data.push(item);
      });
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getCall = async (req, res) => {
  await db
    .collection("calls")
    .doc(req.params.id)
    .get()
    .then((data) => {
      res.send(data.data());
    });
};

const updateCall = async (req, res) => {
  await db
    .collection("calls")
    .doc(req.body.params.id)
    .update(req.body.params.object)
    .then(() => {
      console.log("c'est modifié");
      res.send("modification effectué");
    })
    .catch((err) => {
      console.log(err);
    });
};
const currentRooms = new Map();
const clients = new Map();

const room = async (connection) => {
  const defaultRoom = {
    users: new Map(),
    appel: {},
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
      case "createRoom":
        const newRoomRef = db.collection("rooms").doc();
        newRoomRef.set({
          po_id: response.data.po_id,
          class: response.data.class,
          type: "call",
        });
        currentRooms.set(response.data.class, defaultRoom);

        const roomUsersC = currentRooms.get(response.data.class) || defaultRoom;

        roomUsersC.users.set(response.data.userID, {
          name: response.data.name,
        });

        roomUsersC.appel = response.data.appel;

        currentRooms.set(response.data.class, roomUsersC);

        const roomClientsC = clients.get(response.data.class) || new Map();

        roomClientsC.set(response.data.userID, connection);

        clients.set(response.data.class, roomClientsC);

        const messageCreate = {
          type: "updateRoom",
          data: {
            currentRoom: {
              ...currentRooms.get(response.data.class),
              appel: Object.fromEntries(
                currentRooms.get(response.data.class).appel
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

        roomUsers.users.set(response.data.userID, {
          name: response.data.name,
        });

        currentRooms.set(response.data.class, roomUsers);

        const roomClients = clients.get(response.data.class) || new Map();

        roomClients.set(response.data.userID, connection);

        clients.set(response.data.class, roomClients);

        const messageJoin = {
          type: "updateRoom",
          data: {
            currentRoom: {
              ...currentRooms.get(response.data.class),
              appel: Object.fromEntries(
                currentRooms.get(response.data.class).appel
              ),
            },
            class: response.data.class,
          },
        };

        sendToAllClients(messageJoin, response.data.class);

        break;
      case "closeRoom":
        currentRooms.delete(response.data.class);

        clients.set(response.data.class).clear();

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

        const messageLeave = {
          type: "updateRoom",
          data: {
            currentRoom: {
              ...currentRooms.get(response.data.class),
              appel: Object.fromEntries(
                currentRooms.get(response.data.class).appel
              ),
            },
            class: response.data.class,
          },
        };

        sendToAllClients(messageLeave, response.data.class);

      case "updateCall":
        const messageUpdate = {
          type: "updateRoom",
          data: {
            appel: response.data.appel,
          },
        };
        sendToAllClients(messageUpdate, response.data.class);
        break;
    }
  });
};

const getCallsByLessonId = async (req, res) => {
  await db
    .collection("calls")
    .where("id_lesson", "==", req.params.id_lesson)
    .orderBy("date", "asc")
    .get()
    .then((snapshot) => {
      let item = {};
      const data = [];
      snapshot.forEach((doc) => {
        item = doc.data();
        item["id"] = doc.id;
        data.push(item);
      });
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  getCall,
  getCalls,
  addCall,
  updateCall,
  room,
  getCallsByLessonId,
};

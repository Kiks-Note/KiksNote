const { get } = require("http");
const { db } = require("../firebase");

const addCall = async (req, res) => {
  try {
    const docRef = await db.collection("calls").add({
      id_lesson: req.body.id_lesson,
      date: req.body.date,
      status: req.body.status,
      qrcode: req.body.qrcode,
      students_scan: req.body.students_scan,
      chats: req.body.chats,
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
    .doc(req.body.id)
    .update(req.body.object)
    .then(() => {
      console.log("c'est modifié");
      res.send("modification effectué");
    })
    .catch((err) => {
      console.log(err);
    });
};

const getRoom = async (req, res) => {
  const { classStudent } = req.params;
  console.log(classStudent);
  const snapshot = await db
    .collection("rooms")
    .where("class", "==", classStudent)
    .where("type", "==", "call")
    .get();
  const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.status(200).send(documents);
};

const getRoomPo = async (req, res) => {
  const { id } = req.params;
  const snapshot = await db
    .collection("rooms")
    .where("po_id", "==", id)
    .where("callId", "==", req.query.callId.callId)
    .where("type", "==", "call")
    .get();
  const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.status(200).send(documents);
};

const getClassUsers = async (req, res) => {
  const { idCours } = req.params;
  let idClass = "";
  await db
    .collection("cours")
    .doc(idCours)
    .get()
    .then((response) => {
      idClass = response.data().courseClass.id;
    });
  const snapshot = await db
    .collection("users")
    .where("class", "==", idClass)
    .get();
  const documents = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  res.status(200).send(documents);
};

// const createCurrentRooms = async () => {
//   const countRef = await db
//     .collection("currentRooms")
//     .where("type", "==", "call")
//     .get();
//   if (countRef.docs.length <= 0) {
//     await db.collection("currentRooms").add({
//       currentRooms: JSON.stringify(currentRooms),
//       type: "call",
//     });
//   } else {
//     updateCurrentRooms();
//   }
// };

// const updateCurrentRooms = async () => {
//   const docRef = await db
//     .collection("currentRooms")
//     .where("type", "==", "call")
//     .limit(1)
//     .get();
//   let dataId;
//   docRef.docs.forEach((doc) => {
//     dataId = doc.id;
//   });
//   console.log(dataId);
//   console.log(currentRooms);
//   db.collection("currentRooms")
//     .doc(dataId)
//     .update({
//       currentRooms: JSON.stringify(currentRooms),
//       type: "call",
//     });
// };

// const getCurrentRooms = async () => {
//   const docRef = await db
//     .collection("currentRooms")
//     .where("type", "==", "call")
//     .limit(1)
//     .get();

//   docRef.docs.forEach((doc) => {
//     if (docRef.docs.length > 0) {
//       console.log(doc.data());
//       //currentRooms = JSON.parse(doc.data()).currentRooms;
//     }
//   });
// };

const currentRooms = new Map();
const clients = new Map();
const appels = new Map();

const room = async (connection) => {
  console.log("connection");
  const defaultRoom = {
    users: new Map(),
    appel: {},
  };

  //getCurrentRooms();
  const sendToAllClients = (message, classStudent) => {
    const roomClients = clients.get(classStudent) || new Map();

    for (const [UserID, client] of roomClients.entries()) {
      client.sendUTF(JSON.stringify(message));
    }
  };

  connection.on("message", (message) => {
    let response = JSON.parse(message.utf8Data);
    console.log("new msg");
    switch (response.type) {
      case "createRoom":
        console.log("createRoom");
        const newRoomRef = db.collection("rooms").doc();
        newRoomRef.set({
          po_id: response.data.po_id,
          class: response.data.class,
          callId: response.data.callId,
          type: "call",
        });

        currentRooms.set(response.data.class, defaultRoom);
        const createRoom = currentRooms.get(response.data.class);

        createRoom.users.set(response.data.userID, {
          name: response.data.name,
        });

        const appelsCreate = appels.get(response.data.class) || new Map();

        appelsCreate.set(response.data.userID, {
          appel: response.data.appel,
        });

        appels.set(response.data.class, appelsCreate);
        createRoom.appel = appels.get(response.data.class);

        currentRooms.set(response.data.class, createRoom);

        const roomClientsC = clients.get(response.data.class) || new Map();

        roomClientsC.set(response.data.userID, connection);

        clients.set(response.data.class, roomClientsC);
        const messageCreate = {
          type: "updateRoom",
          data: {
            currentRoom: {
              ...currentRooms.get(response.data.class),
              users: Object.fromEntries(
                currentRooms.get(response.data.class).users
              ),
              appel: Object.fromEntries(
                currentRooms.get(response.data.class).appel
              ),
            },
            class: response.data.class,
          },
        };
        console.log(currentRooms);
        //createCurrentRooms();
        sendToAllClients(messageCreate, response.data.class);

        break;
      case "joinRoom":
        console.log("joinRoom");
        const roomUsers = currentRooms.get(response.data.class) || defaultRoom;

        roomUsers.users.set(response.data.userID, {
          name: response.data.name,
        });

        roomUsers.appel = appels.get(response.data.class);

        currentRooms.set(response.data.class, roomUsers);

        const roomClients = clients.get(response.data.class) || new Map();

        roomClients.set(response.data.userID, connection);

        const messageJoin = {
          type: "updateRoom",
          data: {
            currentRoom: {
              ...currentRooms.get(response.data.class),
              users: Object.fromEntries(
                currentRooms.get(response.data.class).users
              ),
              appel: Object.fromEntries(
                currentRooms.get(response.data.class).appel
              ),
            },
            class: response.data.class,
          },
        };
        //updateCurrentRooms();
        sendToAllClients(messageJoin, response.data.class);

        break;
      case "closeRoom":
        currentRooms.delete(response.data.class);

        clients.set(response.data.class).clear();
        //updateCurrentRooms();
        break;
      case "leaveRoom":
        console.log("User left room");
        const userRoom = currentRooms.get(response.data.class) || defaultRoom;

        userRoom.users.delete(response.data.userID);

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
              users: Object.fromEntries(
                currentRooms.get(response.data.class).users
              ),
              appel: Object.fromEntries(
                currentRooms.get(response.data.class).appel
              ),
            },
            class: response.data.class,
          },
        };
        //updateCurrentRooms();

        sendToAllClients(messageLeave, response.data.class);

      case "updateCall":
        console.log(currentRooms.get(response.data.class));
        const messageUpdate = {
          type: "updateRoom",
          data: {
            currentRoom: {
              ...currentRooms.get(response.data.class),
              users: Object.fromEntries(
                currentRooms.get(response.data.class).users
              ),
              appel: Object.fromEntries(
                currentRooms.get(response.data.class).appel
              ),
            },
            class: response.data.class,
          },
        };
        //updateCurrentRooms();
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
  getRoom,
  getRoomPo,
  getClassUsers,
};

const { db } = require("../firebase");
const moment = require("moment");

const pastelColors = ["#FFA07A", "#FF7F50", "#FFEE93", "#FCF5C7", "#A0CED9", "#ADF7B6", "#ffb3c6", "#a9def9", "#eccaff"];
let indexColor = 0;

const getStudents = async (req, res) => {
    const { classStudents } = req.params;
    const snapshot = await db.collection("users").where('class', '==', classStudents).get();
    const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(documents);
}

const sendGroups = async (req, res) => {
    try {
        const newGroupRef = db.collection("groups").doc();
        await newGroupRef.set({
            start_date: moment.unix(Math.floor(new Date(req.body.start_date).valueOf() / 1000)).toDate(),
            end_date: moment.unix(Math.floor(new Date(req.body.end_date).valueOf() / 1000)).toDate(),
            students: req.body.students,
            po_id: req.body.po_id,
        });

        res.status(200).send("Groups successfully added!");
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
}

const deleteRoom = async (req, res) => {
    const { po_id } = req.params;

    try {
        const snapshot = await db.collection("rooms").where('po_id', '==', po_id).get();
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
    const snapshot = await db.collection("rooms").where('class', '==', classStudent).get();
    const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(documents);
}

const getRoomPo = async (req, res) => {
    const { po_id } = req.params;
    const snapshot = await db.collection("rooms").where('po_id', '==', po_id).get();
    const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(documents);
}

const currentRooms = new Map();
const clients = new Map();

const room = async (connection) => {

    const defaultRoom = { users: new Map(), lock: true, SpGrp: undefined, nbUsers: 0, columns: undefined };

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

                const roomUsersToUpdate = currentRooms.get(response.data.class) || defaultRoom;

                roomUsersToUpdate.users.set(userID, { position: position, color: roomUsersToUpdate.users.get(userID)?.color });

                currentRooms.set(response.data.class, roomUsersToUpdate);

                const message = {
                    type: "updateRoom",
                    data: {
                        currentRoom: {
                            ...currentRooms.get(response.data.class),
                            users: Object.fromEntries(currentRooms.get(response.data.class).users)
                        },
                        class: response.data.class,
                    },
                }

                sendToAllClients(message, response.data.class);

                break;
            case "createRoom":
                const newRoomRef = db.collection("rooms").doc();
                newRoomRef.set({
                    po_id: response.data.po_id,
                    class: response.data.class,
                    settings: response.data.settings,
                });
                currentRooms.set(response.data.class, defaultRoom);

                break;
            case "joinRoom":
                console.log("joinRoom");
                const roomUsers = currentRooms.get(response.data.class) || defaultRoom;

                if (indexColor >= pastelColors.length) {
                    indexColor = 0;
                }
                let color = pastelColors[indexColor];
                indexColor++;

                roomUsers.users.set(response.data.userID, { position: null, color: color });

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
                            users: Object.fromEntries(currentRooms.get(response.data.class).users)
                        },
                        class: response.data.class,
                    }
                };

                sendToAllClients(messageJoin, response.data.class);

                break;
            case "closeRoom":
                currentRooms.delete(response.data.class);

                let allClientsInRoomClose = clients.get(response.data.class) || new Map();
                allClientsInRoomClose.delete(connection);
                clients.set(response.data.class, allClientsInRoomClose);

                break;
            case "leaveRoom":
                const userRoom = currentRooms.get(response.data.class) || defaultRoom;
                userRoom.users.delete(response.data.userID);

                console.log("User left room");

                currentRooms.set(response.data.class, userRoom);


                let allClientsInRoomLeave = clients.get(response.data.class) || new Map();
                allClientsInRoomLeave.delete(connection);
                clients.set(response.data.class, allClientsInRoomLeave);

                currentRooms.get(response.data.class).nbUsers = clients.get(response.data.class).size;

                const messageLeave = {
                    type: "updateRoom",
                    data: {
                        currentRoom: {
                            ...currentRooms.get(response.data.class),
                            users: Object.fromEntries(currentRooms.get(response.data.class).users)
                        },
                        class: response.data.class,
                    },
                };


                sendToAllClients(messageLeave, response.data.class);

                break;
            case "lock":

                if (response.data.status === "po") {
                    currentRooms.get(response.data.class).lock = response.data.lock;

                    const messageLock = {
                        type: "updateRoom",
                        data: {
                            currentRoom: {
                                ...currentRooms.get(response.data.class),
                                users: Object.fromEntries(currentRooms.get(response.data.class).users)
                            },
                            class: response.data.class,
                        },
                    }
                    console.log("lock: ", messageLock);

                    sendToAllClients(messageLock, response.data.class);
                }
                break;
            case "nbSPGrp":
                if (response.data.status === "po") {
                    currentRooms.get(response.data.class).SpGrp = response.data.nbSPGrp;

                    const messageNbSPGrp = {
                        type: "updateRoom",
                        data: {
                            currentRoom: {
                                ...currentRooms.get(response.data.class),
                                users: Object.fromEntries(currentRooms.get(response.data.class).users)
                            },
                            class: response.data.class,
                        },
                    }

                    sendToAllClients(messageNbSPGrp, response.data.class);
                }
                break;
            case "updateCol":
                currentRooms.get(response.data.class).columns = response.data.columns;

                const messageUpdateCol = {
                    type: "updateRoom",
                    data: {
                        currentRoom: {
                            ...currentRooms.get(response.data.class),
                            users: Object.fromEntries(currentRooms.get(response.data.class).users)
                        },
                        class: response.data.class,
                    }
                }
                sendToAllClients(messageUpdateCol, response.data.class);

        }
    });
};


module.exports = { getStudents, sendGroups, room, deleteRoom, getRoom, getRoomPo };
const { db } = require("../firebase");
const moment = require("moment");

const cursorsPositions = new Map();
const pastelColors = ["#FFA07A", "#FF7F50", "#FFEE93", "#FCF5C7", "#A0CED9", "#ADF7B6", "#ffb3c6", "#a9def9", "#eccaff"];


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

const room = async (connection) => {


    connection.on("message", (message) => {
        const response = JSON.parse(message.utf8Data);

        switch (response.type) {
            case "cursorPosition":
                const { userID, position } = response.data;

                cursorsPositions.set(userID, position);

                const roomUsersToUpdate = currentRooms.get(response.data.class) || new Map();

                roomUsersToUpdate.set(userID, { position: position, color: roomUsersToUpdate.get(userID)?.color });

                currentRooms.set(response.data.class, roomUsersToUpdate);


                const roomUsersUpdated = currentRooms.get(response.data.class);
                
                const message = {
                    type: "currentUsers",
                    data: {
                        users: roomUsersUpdated,
                    },
                }

                connection.send(JSON.stringify(message));

                break;
            case "createRoom":
                const newRoomRef = db.collection("rooms").doc();
                newRoomRef.set({
                    po_id: response.data.po_id,
                    class: response.data.class,
                });
                currentRooms.set(response.data.class, new Map());

                break;
            case "joinRoom":
                const roomUsers = currentRooms.get(response.data.class) || new Map();

                if (roomUsers.size >= pastelColors.length) {
                    roomUsers.forEach((userData, userID) => {
                        const colorIndex = userID % pastelColors.length;
                        const color = pastelColors[colorIndex];
                        userData.color = color;
                    });
                } else {
                    const colorIndex = roomUsers.size % pastelColors.length;
                    const color = pastelColors[colorIndex];
                    roomUsers.set(response.data.userID, { position: null, color: color });
                }

                currentRooms.set(response.data.class, roomUsers);

                const messageJoin = {
                    type: "currentUsers",
                    data: {
                        users: currentRooms.get(response.data.class),
                    }
                }
                
                connection.send(JSON.stringify(messageJoin));
                break;
            case "closeRoom":
                break;
            case "leaveRoom":
                const userRoom = Array.from(currentRooms.entries()).find(([room, users]) =>
                    users.has(response.data.userID)
                );
                if (userRoom) {
                    const [room, users] = userRoom;
                    users.delete(response.data.userID);
                    currentRooms.set(room, users);
                }
                break;
        }
    });
};


module.exports = { getStudents, sendGroups, room, deleteRoom, getRoom, getRoomPo };
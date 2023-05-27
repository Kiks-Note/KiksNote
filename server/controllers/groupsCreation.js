const { db } = require("../firebase");
const moment = require("moment");

const cursorsPositions = new Map();


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

const getCursorsUsersConnect = async (req, res) => { 
    const { room } = req.params;
    const cursorsToDisplay = cursorsPositions.get(room);
    res.status(200).send(cursorsToDisplay);
};

const room = async (connection) => {
    const currentRooms = new Map();

    connection.on("message", (message) => {
        const response = JSON.parse(message.utf8Data);
        switch (response.type) {
            case "cursorPosition":
                const { userID, position } = response.data;
                cursorsPositions.set(userID, position);
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
                roomUsers.set(response.data.userID, { position: null });
                currentRooms.set(response.data.class, roomUsers);
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


module.exports = { getStudents, sendGroups, room, deleteRoom, getRoom, getRoomPo,getCursorsUsersConnect };
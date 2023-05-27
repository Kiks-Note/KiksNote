const { db } = require("../firebase");
const moment = require("moment");

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
            start_date: moment.unix(Math.floor(new Date(req.body.start_date).valueOf() /1000)).toDate(),
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
    await db.collection("rooms").where('po_id', '==', po_id).detete();
    res.status(200).send("Room successfully deleted!");
 }

const getRoom = async (connection) => {

    connection.on("message", (message) => {
        const response = JSON.parse(message.utf8Data);
        
                switch (response.type) { 
            case "cursorPosition":
                //work
                break;
            case "createRoom":
                        console.log(response.data);
                        const newRoomRef = db.collection("rooms").doc();
                        newRoomRef.set({
                            po_id: response.data.po_id,
                            room_id: response.data.room_id,
                            class: response.data.class,
                        });
                break;
            case "joinRoom":
                console.log(response.data);
                break;
        }   
    }); 
}


module.exports = { getStudents,sendGroups,getRoom,deleteRoom }
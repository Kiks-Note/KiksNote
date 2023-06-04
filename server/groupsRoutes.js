const express = require("express");
const router = express.Router();

const {
    getStudents,
    sendGroups,
    room,
    deleteRoom,
    getRoom,
    getRoomPo,
} = require("./controllers/groupsCreation")

module.exports = function (connection, pathname) { 

    router.get("/:classStudents", getStudents);
    router.post("/exportGroups", sendGroups);
    router.delete("/deleteRoom/:po_id", deleteRoom);
    router.get("/getRoom/:classStudent", getRoom);
    router.get("/getRoomPo/:po_id", getRoomPo);

    switch (pathname) {
        case "/groupes":
            room(connection);
            break;
        default:
            break;
    }

    return router;
}



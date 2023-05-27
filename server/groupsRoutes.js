const express = require("express");
const { get } = require("http");
const router = express.Router();

const {
    getStudents,
    sendGroups,
    room,
    deleteRoom,
    getRoom,
    getRoomPo,
    getCursorsUsersConnect
} = require("./controllers/groupsCreation")

module.exports = function (connection, pathname) { 

    router.get("/:classStudents", getStudents);
    router.post("/exportGroups", sendGroups);
    router.delete("/deleteRoom/:po_id", deleteRoom);
    router.get("/getRoom/:classStudent", getRoom);
    router.get("/getRoomPo/:po_id", getRoomPo);
    router.get("/getCursorsUsersConnect/:room", getCursorsUsersConnect);

    switch (pathname) {
        case "/groupes":
            room(connection);
            break;
        default:
            break;
    }

    return router;
}



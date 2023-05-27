const express = require("express");
const router = express.Router();

const {
    getStudents,
    sendGroups,
    getRoom,
    deleteRoom
} = require("./controllers/groupsCreation")

module.exports = function (connection, pathname) { 

    router.get("/:classStudents", getStudents);
    router.post("/exportGroups", sendGroups);
    router.delete("/deleteRoom/:po_id",deleteRoom );

    switch (pathname) {
        case "/groupes":
            getRoom(connection);
            break;
        default:
            break;
    }

    return router;
}



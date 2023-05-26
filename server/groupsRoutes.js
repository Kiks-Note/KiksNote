const express = require("express");
const router = express.Router();

const {
    getStudents,
    sendGroups,
    setRoom,
    getRoom
} = require("./controllers/groupsCreation")

module.exports = function (connection, pathname,io) { 

    router.get("/:classStudents", getStudents);
    router.post("/exportGroups", sendGroups);

    switch (pathname) {
        case "/groupes":
            getRoom(io);
            break;
        case "/groupes/setRoom":
            setRoom(io);
        default:
            break;
    }

    return router;
}



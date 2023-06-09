const express = require("express");
const router = express.Router();

const {
    getStudents,
    sendGroups,
    room,
    deleteRoom,
    getRoom,
    getRoomPo,
    getGroups,
    getGroupsPo
} = require("./controllers/groupsCreation");

const groupNoWsNeeded = () => {
    router.get("/getGroups/:student_id", getGroups);
    router.get("/getGroupsPo/:po_id", getGroupsPo);
    router.post("/exportGroups", sendGroups);
    return router;
}

const groupWsNeeded = (connection, pathname) => {

    router.get("/:classStudents", getStudents);
    router.delete("/deleteRoom/:po_id", deleteRoom);
    router.get("/getRoom/:classStudent", getRoom);
    router.get("/getRoomPo/:po_id", getRoomPo);

    switch (pathname) {
        case "/groupes/creation":
            room(connection);
            break;
        default:
            break;
    }

    return router;
}

module.exports = { groupNoWsNeeded, groupWsNeeded };

  return router;
};

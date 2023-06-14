const express = require("express");

const {
  getRoom,
  getRoomPo,
  getAllRooms,
  room,
  getAll,
  getAllRoomsForPO,
  deleteRoom,
} = require("./controllers/retro");

const retroRoutesWsNotNeeded = () => {
  const router = express.Router(); // Create a new router instance

  console.log("in route");
  return router;
};

const retroRoutesWsNeeded = (connection, pathname) => {
  const router = express.Router(); // Create a new router instance

  router.get("/getAllRooms", getAllRooms);
  router.get("/getRoom/:classStudents", getRoom);
  router.get("/getRoomPo/:po_id", getRoomPo);
  router.get("/getAll", getAll);
  router.get("/getPORoom/:poID", getAllRoomsForPO);
  router.delete("/deleteRoom/:po_id", deleteRoom);

  switch (pathname) {
    case "/retro":
      room(connection);
      break;
    default:
      break;
  }

  return router;
};

module.exports = { retroRoutesWsNotNeeded, retroRoutesWsNeeded };

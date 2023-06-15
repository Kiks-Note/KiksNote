const express = require("express");

const {
  getRoom,
  getRoomPo,
  getAllRooms,
  room,
  getAll,
  deleteRoom,
  saveRetro,
} = require("./controllers/retro");

const retroRoutesWsNeeded = (connection, pathname) => {
  const router = express.Router(); // Create a new router instance

  router.get("/getAllRooms", getAllRooms);
  router.get("/getRoom/:classStudent", getRoom);
  router.get("/getRoomPo/:po_id", getRoomPo);
  router.get("/getAll", getAll);
  router.delete("/deleteRoom/:po_id", deleteRoom);
  router.post("/saveRetro", saveRetro);

  switch (pathname) {
    case "/retro":
      room(connection);
      break;
    default:
      break;
  }

  return router;
};

module.exports = { retroRoutesWsNeeded };

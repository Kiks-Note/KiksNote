const express = require("express");

const {
  getRoom,
  getAllRooms,
  room,
  getAll,
  getAllRoomsForPO,
  getAllRoomsForStudent,
} = require("./controllers/retro");

const retroRoutesWsNotNeeded = () => {
  const router = express.Router(); // Create a new router instance

  console.log("in route");
  return router;
};

const retroRoutesWsNeeded = (connection, pathname) => {
  const router = express.Router(); // Create a new router instance

  router.get("/getAllRooms", getAllRooms);
  router.get("/getRoom/:class", getRoom);
  router.get("/getAll", getAll);
  router.get("/getPORoom/:poID", getAllRoomsForPO);
  router.get("/getStudentRoom/:studentClass", getAllRoomsForStudent);

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

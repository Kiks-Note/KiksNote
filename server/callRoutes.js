const express = require("express");

const {
  getCall,
  getCalls,
  updateCall,
  addCall,
  getCallsByLessonId,
  room,
  getRoom,
  getRoomPo,
  getClassUsers,
} = require("./controllers/call");

function callRoutesWsNotNeeded() {
  const router = express.Router();

  router.get("/calls", getCalls);
  router.get("/getcall/:id", getCall);
  router.get("/getCallsByLessonId/:id_lesson", getCallsByLessonId);
  router.get("/getRoom/:class", getRoom);
  router.get("/getRoomPo/:id", getRoomPo);
  router.post("/callAdd", addCall);
  router.get("/getUsersFromClassiId/:idCours", getClassUsers);
  return router;
}

function callRoutesWsNeeded(connection, pathname) {
  const router = express.Router();

  router.put("/updatecall", updateCall);

  switch (pathname) {
    case "/call":
      room(connection);
      console.log("call");
      break;
    default:
      break;
  }

  return router;
}

module.exports = { callRoutesWsNeeded, callRoutesWsNotNeeded };

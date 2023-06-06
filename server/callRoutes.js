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
} = require("./controllers/call");

function callRoutesWsNotNeeded() {
  const router = express.Router();

  router.get("/calls", getCalls);
  router.get("/getcall/:id", getCall);
  router.get("/getCallsByLessonId/:id_lesson", getCallsByLessonId);
  router.get("/getRoom/:class", getRoom);
  router.get("/getRoom/:id", getRoomPo);

  return router;
}

function callRoutesWsNeeded(connection, pathname) {
  const router = express.Router();

  router.post("/callAdd", addCall);
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

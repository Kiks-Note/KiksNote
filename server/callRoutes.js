const express = require("express");
const router = express.Router();

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
  router.post("/callAdd", addCall);
  router.put("/updatecall", updateCall);
  router.get("/calls", getCalls);
  router.get("/getcall/:id", getCall);
  router.get("/getCallsByLessonId/:id_lesson", getCallsByLessonId);
  router.get("/getRoom/:class", getRoom);
  router.get("/getRoom/:id", getRoomPo);

  return router;
}

function callRoutesWsNeeded(connection, pathname) {
  switch (pathname) {
    case "/callws":
      room(connection);
      console.log("call");
      break;
    default:
      break;
  }

  return router;
}

module.exports = { callRoutesWsNeeded, callRoutesWsNotNeeded };

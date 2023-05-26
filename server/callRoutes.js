const express = require("express");
const router = express.Router();

const {
  getCall,
  getCalls,
  updateCall,
  addCall,
  callRequests,
  getCallsByLessonId,
} = require("./controllers/call");

module.exports = function (connection, pathname) {
  // Route Call
  router.post("/callAdd", addCall);
  router.put("/updatecall", updateCall);
  router.get("/calls", getCalls);
  router.post("/getcall", getCall);
  router.get("/getCallByLessonId", getCallsByLessonId);

  switch (pathname) {
    case "/call":
      callRequests(connection);
      console.log("call");
      break;
    default:
      break;
  }

  return router;
};

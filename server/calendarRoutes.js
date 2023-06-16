const express = require("express");
const router = express.Router();

const {
  calendarRequest,
  calendarPedago,
} = require("./controllers/calendar");

module.exports = function (connection, pathname) {
  switch (pathname) {
    case "/calendar":
      calendarRequest(connection);
      console.log("/calendar");
      break;
    case "/calendar/pedago":
      calendarPedago(connection);
      console.log("/calendar/pedago");
      break;
    default:
      break;
  }
  return router;
};

const express = require("express");
const router = express.Router();
const {db} = require("./firebase");

const {
  inventory,
  inventoryDeviceId,
  addDevice,
  updateDevice,
  deleteDevice,
  makeRequest,
  deviceRequests,
  acceptRequest,
  rejectRequest,
  getRequests,
  updateRequest,
  getCategories,
  todayRequests,
} = require("./controllers/inventory");

module.exports = function (wsI) {
  // Accept wsI as an argument
  router.get("/", inventory);
  router.get("/device/:deviceId", inventoryDeviceId);
  router.post("/", addDevice);
  router.put("/device/:deviceId", updateDevice);
  router.delete("/device/:deviceId", deleteDevice);
  router.post("/request/:category/:deviceId", makeRequest);
  router.get("/requests/:deviceId", deviceRequests);
  router.put("/accept/:deviceId/:requestId", acceptRequest);
  router.put("/reject/:deviceId/:requestId", rejectRequest);
  router.get("/request/:requestId", getRequests);
  router.put("/request/:requestId", updateRequest);
  router.get("/categories", getCategories);

  wsI.on("request", async function (request) {
    const connection = request.accept(null, request.origin);
    connection ? console.log("connected") : console.log("not connected");

    todayRequests(request, connection);
  });

  return router;
};

const express = require("express");
const router = express.Router();
const {db} = require("./firebase");
const {parse} = require("url");

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
  addCategory,
  deleteCategory,
  updateCategory,
  todayRequests,
  liveCategories,
  liveInventory,
  borrowedList,
} = require("./controllers/inventory");

module.exports = function (wsI) {
  // Accept wsI as an argument
  router.get("/", inventory);
  router.get("/device/:deviceId", inventoryDeviceId);
  router.post("/", addDevice);
  router.put("/device/:deviceId", updateDevice);
  router.delete("/device/:deviceId", deleteDevice);
  router.post("/request/:deviceId", makeRequest);
  router.get("/requests/:deviceId", deviceRequests);
  router.put("/accept/:deviceId/:requestId", acceptRequest);
  router.put("/reject/:deviceId/:requestId", rejectRequest);
  router.get("/request/:requestId", getRequests);
  router.put("/request/:requestId", updateRequest);
  router.get("/categories", getCategories);
  router.put("/category", addCategory);
  router.delete("/category/:category", deleteCategory);
  router.put("/category/:oldCategory", updateCategory);

  wsI.on("request", async function (request) {
    const connection = request.accept(null, request.origin);
    const {pathname} = parse(request.httpRequest.url);
    connection ? console.log("connected") : console.log("not connected");
    console.log(pathname);

    switch (pathname) {
      case "/todayRequests":
        todayRequests(request, connection);
        console.log("todayRequests");
        break;
      case "/liveCategories":
        liveCategories(request, connection);
        console.log("liveCategories");
        break;
      case "/liveInventory":
        liveInventory(request, connection);
        console.log("liveInventory");
        break;
      case "/adminBorrowedList":
        borrowedList(request, connection);
        console.log("adminBorrowedList");
        break;
      default:
        break;
    }
  });

  return router;
};

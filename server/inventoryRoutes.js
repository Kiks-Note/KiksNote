const express = require("express");
const router = express.Router();


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

module.exports = function (connection, pathname) {
  // Route Inventory
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

  switch (pathname) {
    case "/todayRequests":
      todayRequests(connection);
      console.log("todayRequests");
      break;
    case "/liveCategories":
      liveCategories(connection);
      console.log("liveCategories");
      break;
    case "/liveInventory":
      liveInventory(connection);
      console.log("liveInventory");
      break;
    case "/adminBorrowedList":
      borrowedList(connection);
      console.log("adminBorrowedList");
      break;
    default:
      break;
  }

  return router;
};

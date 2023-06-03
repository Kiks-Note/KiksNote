const express = require("express");
const router = express.Router();

const {
  inventory,
  inventoryLength,
  inventoryDeviceId,
  addDevice,
  updateDevice,
  deleteDevice,
  makeRequest,
  makePreRequest,
  makeIdeaComment,
  deviceRequests,
  acceptRequest,
  rejectRequest,
  getRequests,
  updateRequest,
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  getDeviceRequests,
  createIdea,
  getNotTreatedIdeas,
  getIdeas,
  acceptIdea,
  refuseIdea,
  deleteIdea,
  getIdeaByUser,
} = require("./controllers/inventory");

router.get("/", inventory);
router.get("/length", inventoryLength);
router.get("/device/:deviceId", inventoryDeviceId);
router.post("/", addDevice);
router.put("/device/:deviceId", updateDevice);
router.delete("/device/:deviceId", deleteDevice);
router.post("/request/:deviceId", makeRequest);
router.post("/preRequest/:deviceId", makePreRequest);
router.get("/requests/:deviceId", deviceRequests);
router.put("/acceptRequest/:deviceId/:requestId", acceptRequest);
router.put("/refuseRequest/:deviceId/:requestId", rejectRequest);
router.get("/request/:requestId", getRequests);
router.put("/request/:requestId", updateRequest);
router.get("/categories", getCategories);
router.put("/category", addCategory);
router.delete("/category/:category", deleteCategory);
router.put("/category/:oldCategory", updateCategory);
router.get("/deviceRequests/:deviceId", getDeviceRequests);
router.post("/createIdea", createIdea);
router.get("/ideas/pending", getNotTreatedIdeas);
router.get("/ideas", getIdeas);
router.put("/ideas/:id/accept", acceptIdea);
router.put("/ideas/:id/refuse", refuseIdea);
router.delete("/idea/:ideaId", deleteIdea);
router.get("/ideaByUser/:userId", getIdeaByUser);
router.post("/ideas/comment/:ideaId", makeIdeaComment);

module.exports = router;

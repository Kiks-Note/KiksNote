const express = require("express");
const router = express.Router();
const { parse } = require("url");

const {
  changeIndex,
  favorite,
  createCard,
  moveStories,
  createDashboards,
  deleteDashboard,
  createStory,
  editCard,
  deleteCard,
  addUsersToStory,
  boardRequests,
  dashboardRequests,
  dashboardRequestsPo,
  dashboardRequestsPedago,
  overviewRequests,
} = require("./controllers/dashboard");

module.exports = function (connection, pathname) {
  // Route Dashboard
  router.put("/favorite/:dashboardId", favorite);
  router.put("/:dashboardId/board/:boardId/setCards", changeIndex);
  router.put(
    "/:dashboardId/board/:boardId/column/:columnId/addCard",
    createCard
  );
  router.post("/:dashboardId/moveStories", moveStories);
  router.post("/creation", createDashboards);
  router.delete("/:dashboardId", deleteDashboard);
  router.post("/creation/:dashboardId/stories", createStory);
  router.put(
    "/:dashboardId/board/:boardId/column/:columnId/editCard",
    editCard
  );
  router.delete(
    "/:dashboardId/board/:boardId/column/:columnId/card/:cardId",
    deleteCard
  );
  router.post(
    "/:dashboardId/board/:boardId/column/:columnId/story/:storyId/add-users",
    addUsersToStory
  );

  switch (pathname) {
    case "/dashboard":
      dashboardRequests(connection);
      console.log("dashboard");
      break;
    case "/board":
      boardRequests(connection);
      console.log("board");
      break;
    case "/overview":
      overviewRequests(connection);
      console.log("overview");
      break;
    default:
      break;
  }

  return router;
};

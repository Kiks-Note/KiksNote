const {parse} = require("url");

const {
  pendingRequests,
  liveCategories,
  liveInventory,
  borrowedList,
  getIdeaComments,
} = require("../controllers/inventory");

module.exports = function (connection, pathname) {
  // wsI.on("request", function (request) {
  //   const connection = request.accept(null, request.origin);
  //   const {pathname} = parse(request.httpRequest.url);

  //   connection.on("error", function (error) {
  //     console.log("WebSocket Error: " + error);
  //   });

  switch (pathname) {
    case "/pendingRequests":
      pendingRequests(connection);
      console.log("pendingRequests");
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
    case "/getIdeaComments":
      getIdeaComments(connection);
      console.log("getIdeasComments");
      break;
    default:
      break;
  }
  // });
};

const {parse} = require("url");
const {
  todayRequests,
  liveCategories,
  liveInventory,
  borrowedList,
} = require("../controllers/inventory");

module.exports = function (wsI) {
  wsI.on("request", function (request) {
    const connection = request.accept(null, request.origin);
    const {pathname} = parse(request.httpRequest.url);

    connection.on("error", function (error) {
      console.log("WebSocket Error: " + error);
    });

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
  });
};

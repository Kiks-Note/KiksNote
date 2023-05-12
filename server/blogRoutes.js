const express = require("express");
const router = express.Router();

const {
  addBlogComment,
  addBlogLike,
  updateBlogVisibility,
  addNewBlog,
  blogRequests,
} = require("./controllers/blog");

module.exports = function (connection, pathname) {
  // Route Dashboard
  router.post("/newblog", addNewBlog);
  router.put("/:id/visibility", updateBlogVisibility);
  router.put("/:id/likes", addBlogLike);
  router.post("/:id/comments", addBlogComment);

  switch (pathname) {
    case "/blog":
      blogRequests(connection);
      console.log("dashboard");
      break;
    default:
      break;
  }

  return router;
};

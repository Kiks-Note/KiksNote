const express = require("express");
const router = express.Router();

const {
  deleteBlog,
  addBlogComment,
  addBlogLike,
  updateBlogVisibility,
  addNewBlog,
  blogRequests,
  getDescriptions,
} = require("./controllers/blog");

module.exports = function (connection, pathname) {
  // Route Dashboard
  router.post("/newblog", addNewBlog);
  router.put("/:id/visibility", updateBlogVisibility);
  router.put("/:id/likes", addBlogLike);
  router.post("/:id/comments", addBlogComment);
  router.delete("/:id", deleteBlog);
  router.get("/:id", getDescriptions);

  

  switch (pathname) {
    case "/blog":
      blogRequests(connection);
      console.log("blog");
      break;
    default:
      break;
  }

  return router;
};

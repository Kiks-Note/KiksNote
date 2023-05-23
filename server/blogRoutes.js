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
  addParticipant,
  getParticipant,
  addLike,
  addDislike,
  getTags,
} = require("./controllers/blog");

module.exports = function (connection, pathname) {
  // Route Dashboard
  router.post("", addNewBlog);
  router.get("/tag", getTags);
  router.put("/:id/visibility", updateBlogVisibility);
  router.post("/:id/comments", addBlogComment);
  router.delete("/:id", deleteBlog);
  router.get("/:id", getDescriptions);
  router.put("/:id/participant", addParticipant);
  router.post("/participant", getParticipant);
  router.put("/:id/like", addLike);
  router.put("/:id/dislike", addDislike);

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

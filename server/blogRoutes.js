const express = require("express");
const router = express.Router();

const {
  deleteBlog,
  addBlogComment,
  updateBlogVisibility,
  addNewBlog,
  blogRequests,
  getDescriptions,
  addParticipant,
  getParticipant,
  addLike,
  addDislike,
  getTags,
  getTopCreators,
  getBlogParticipants,



} = require("./controllers/blog");

module.exports = function (connection, pathname, upload) {
  // Route Dashboard
  router.post("", upload.single("thumbnail"), addNewBlog);
  router.get("/tag", getTags);
  router.put("/:id/visibility", updateBlogVisibility);
  router.post("/:id/comments", addBlogComment);
  router.delete("/:id", deleteBlog);
  router.get("/:id", getDescriptions);
  router.put("/:id/participant", addParticipant);
  router.post("/participant", getParticipant);
  router.put("/:id/like", addLike);
  router.put("/:id/dislike", addDislike);
  router.get("/stats/created_by", getTopCreators);
  router.get("/stats/:id/participant", getBlogParticipants);



  switch (pathname) {
    case "/blog":
      blogRequests(connection);
      console.log(" je suis dans blog");
      break;
    default:
      break;
  }

  return router;
};

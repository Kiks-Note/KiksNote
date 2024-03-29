const express = require("express");
const router = express.Router();

const {
  deleteBlog,
  addBlogComment,
  updateBlogVisibility,
  addNewBlog,
  addNewTuto,
  addNewTuto2,
  blogRequests,
  getDescriptions,
  addParticipant,
  getParticipant,
  addLike,
  addDislike,
  getTags,
  getTopCreators,
  getBlogParticipants,
  getBlogParticipant,
  blogDetailRequests,
  deleteBlogComment,
  getRepartition,
  getUserBlog,
} = require("./controllers/blog");

module.exports = function (connection, pathname, upload) {
  // Route Dashboard
  router.post("", upload.single("thumbnail"), addNewBlog);
  // router.post("/tuto", upload.single("thumbnail"), addNewTuto);
  router.post("/tuto", upload.single("thumbnail"), addNewTuto2);
  router.get("/tag", getTags);
  router.put("/:id/visibility", updateBlogVisibility);
  router.put("/comments", addBlogComment);
  router.delete("/:id", deleteBlog);
  router.delete("/:blogId/comments/:commentId", deleteBlogComment);
  router.get("/:id", getDescriptions);
  router.get("/user/:userId", getUserBlog);
  router.put("/:id/participant", addParticipant);
  router.post("/participant", getParticipant);
  router.get("/:id/participant", getBlogParticipant);
  router.put("/:id/like", addLike);
  router.put("/:id/dislike", addDislike);
  router.get("/stats/created_by", getTopCreators);
  router.get("/stats/participant2", getBlogParticipants);
  router.get("/stats/distribution", getRepartition);

  switch (pathname) {
    case "/blog":
      blogRequests(connection);
      console.log(" je suis dans blog");
      break;
    case "/blogDetail":
      blogDetailRequests(connection);
      console.log(" je suis dans blog Detail");
      break;
    default:
      break;
  }

  return router;
};

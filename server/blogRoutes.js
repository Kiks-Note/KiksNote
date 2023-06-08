const express = require("express");
const router = express.Router();

const {
  deleteBlog,
  addBlogComment,
  updateBlogVisibility,
  addNewBlog,
  addNewTuto,
  blogRequests,
  getDescriptions,
  addParticipant,
  getParticipant,
  addLike,
  addDislike,
  getTags,
  getTopCreators,
  getBlogParticipants,
  blogDetailRequests,
  deleteBlogComment,
  getRepartition,

} = require("./controllers/blog");

module.exports = function (connection, pathname, upload) {
  // Route Dashboard
  router.post("", upload.single("thumbnail"), addNewBlog);
  router.post("/tuto", upload.single("thumbnail"), addNewTuto);
  router.get("/tag", getTags);
  router.put("/:id/visibility", updateBlogVisibility);
  router.put("/comments", addBlogComment);
  router.delete("/:id", deleteBlog);
  router.delete("/:blogId/comments/:commentId", deleteBlogComment);
  router.get("/:id", getDescriptions);
  router.put("/:id/participant", addParticipant);
  router.post("/participant", getParticipant);
  router.put("/:id/like", addLike);
  router.put("/:id/dislike", addDislike);
  router.get("/stats/created_by", getTopCreators);
  router.get("/stats/participant", getBlogParticipants);
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

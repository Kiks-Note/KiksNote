const { db } = require("../firebase");

//add new Blog
const addNewBlog = async (req, res) => {
   const { title, description, photo } = req.body;

   if (title == null || title == "") {
     return res.status(400).send("Title is required");
   }
   if (description == null || description == "") {
     return res.status(400).send("Description is required");
   }
   if (photo == null || photo == "") {
     return res.status(400).send("Photo is required");
   }

   try {
     await db.collection("blog_evenements").doc().set({
       title: title,
       description: description,
       photo: photo,
     });
     res.send("Document successfully written!");
   } catch (err) {
     res.status(500).send(err);
   }
};

//update tutorial visibility 
const updateBlogVisibility = async (req, res) => {
    await db.collection("blog_tutos").doc(req.params.id).update({
      visibility: req.body.visibility,
    });
};

// Add Blog Like
const addBlogLike = async (req, res) => {
   await db.collection("blog_tutos").doc(req.params.id).update({
     like: req.body.like,
     dislike: req.body.dislike,
   });
};
// Add Blog Comment 
const addBlogComment = async (req, res) => {
  await db
    .collection("blog_tutos")
    .doc(req.params.id)
    .collection("comment")
    .add({
      content: req.body.message,
      date: new Date(),
      user_id: 12,
      user_status: "etudiant",
    });
};



const blogRequests = async (connection) => {
  db.collection("blog_evenements").onSnapshot(
    (snapshot) => {
      const documents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      connection.sendUTF(JSON.stringify(documents));
    },
    (err) => {
      console.log(err);
    }
  );
};

module.exports = {
  addBlogComment,
  addBlogLike,
  updateBlogVisibility,
  addNewBlog,
  blogRequests,

};

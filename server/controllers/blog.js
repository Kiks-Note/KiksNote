const { db } = require("../firebase");

//add new Blog
const addNewBlog = async (req, res) => {
  const { title, description, photo, editorState, inputEditorState, event } =
    req.body;

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
      editorState: editorState,
      inputEditorState: inputEditorState,
      event: event,
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

const deleteBlog = async (req, res) => {
  await db.collection("blog_evenements").doc(req.params.id).delete();
  res.send("Document successfully deleted!");
};

const getDescriptions = async (req, res) => {
  const snapshot = await db
    .collection("blog_evenements")
    .doc(req.params.id)
    .get();
  res.send(snapshot.data());
};

const addParticipant = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.body.userId;

  const participantsRef = db
    .collection("blog_evenements")
    .doc(blogId)
    .collection("participants");

  // Retrieve all participants in the collection
  const participantsSnapshot = await participantsRef.get();

  // Check if the user is already a participant
  let isParticipant = false;
  participantsSnapshot.forEach((participantDoc) => {
    if (participantDoc.id === userId) {
      isParticipant = true;
      return; // Exit the loop early if a match is found
    }
  });

  if (isParticipant) {
    // The user is already a participant, remove them
    await participantsRef.doc(userId).delete();
    res.status(200).send("Utilisateur supprimé des participants.");
  } else {
    // The user is not a participant, add them
    await participantsRef.doc(userId).set({});
    res.status(200).send("Utilisateur ajouté aux participants.");
  }
};
const getParticipant = async (req, res) => {
  try {
    const userIds = req.body.userIds; // Utilisez directement req.body.userIds

    const usersRef = db.collection("users");
    const userDetails = [];

    for (const userId of userIds) {
      const userSnapshot = await usersRef.doc(userId).get();
      if (userSnapshot.exists) {
        console.log("je suis dedans");
        const userData = userSnapshot.data();
        const { firstname, lastname, image } = userData;
        userDetails.push({ id: userId, firstname, lastname, image });
      }
    }

    res.send(userDetails);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const blogRequests = async (connection) => {
  db.collection("blog_evenements").onSnapshot(
    async (snapshot) => {
      const documents = [];
      for (const doc of snapshot.docs) {
        const event = doc.data();
        const participantsSnapshot = await doc.ref
          .collection("participants")
          .get();
        const participants = participantsSnapshot.docs.map((doc) => doc.ref.id); // Utilise doc.ref.id au lieu de doc.id
        event.participants = participants;
        documents.push({ id: doc.id, ...event });
      }
      connection.sendUTF(JSON.stringify(documents));
    },
    (err) => {
      console.log(err);
    }
  );
};

// const addLike = async (req, res) => {
//   const blogId = req.params.id;
//   const { like } = req.body;

//   try {
//     await db.collection("blog_evenements").doc(blogId).update({
//       like: like,
//     });
//     res.status(200).send("Like ajouté avec succès.");
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };

// const addDislike = async (req, res) => {
//   const blogId = req.params.id;
//   const { dislike } = req.body;

//   try {
//     await db.collection("blog_evenements").doc(blogId).update({
//       dislike: dislike,
//     });
//     res.status(200).send("Dislike ajouté avec succès.");
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };


const addLike = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.body.userId;

  const likesRef = db
    .collection("blog_evenements")
    .doc(blogId)
    .collection("like");

  // Check if the user already liked the blog
  const likeDoc = await likesRef.doc(userId).get();

  if (likeDoc.exists) {
    // The user already liked the blog, remove their like
    await likesRef.doc(userId).delete();
    res.status(200).send({ likeCount: 0, dislikeCount: 0 });
  } else {
    // The user didn't like the blog, add their like
    await likesRef.doc(userId).set({});
    const snapshot = await likesRef.get();
    const likeCount = snapshot.size;
    const dislikesRef = db
      .collection("blog_evenements")
      .doc(blogId)
      .collection("dislike");
    const dislikesSnapshot = await dislikesRef.get();
    const dislikeCount = dislikesSnapshot.size;
    res.status(200).send({ likeCount, dislikeCount });
  }
};

const addDislike = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.body.userId;

  const dislikesRef = db
    .collection("blog_evenements")
    .doc(blogId)
    .collection("dislike");

  // Check if the user already disliked the blog
  const dislikeDoc = await dislikesRef.doc(userId).get();

  if (dislikeDoc.exists) {
    // The user already disliked the blog, remove their dislike
    await dislikesRef.doc(userId).delete();
    res.status(200).send({ likeCount: 0, dislikeCount: 0 });
  } else {
    // The user didn't dislike the blog, add their dislike
    await dislikesRef.doc(userId).set({});
    const snapshot = await dislikesRef.get();
    const dislikeCount = snapshot.size;
    const likesRef = db
      .collection("blog_evenements")
      .doc(blogId)
      .collection("like");
    const likesSnapshot = await likesRef.get();
    const likeCount = likesSnapshot.size;
    res.status(200).send({ likeCount, dislikeCount });
  }
};




module.exports = {
  addBlogComment,
  updateBlogVisibility,
  addNewBlog,
  blogRequests,
  deleteBlog,
  getDescriptions,
  addParticipant,
  getParticipant,
  addLike,
  addDislike,
};

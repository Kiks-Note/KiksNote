const { db } = require("../firebase");

//add new Blog
const addNewBlog = async (req, res) => {
  const { title, thumbnail, editorState, inputEditorState, created_by } =
    req.body;

  if (title == null || title == "") {
    return res.status(400).send("Title is required");
  }
  if (editorState == null || editorState == "") {
    return res.status(400).send("Description is required");
  }
  if (thumbnail == null || thumbnail == "") {
    return res.status(400).send("Photo is required");
  }

  try {
    await db.collection("blog_evenements").doc().set({
      title: title,
      thumbnail: thumbnail,
      editorState: editorState,
      inputEditorState: inputEditorState,
      created_at: new Date(),
      statut: "online",
      created_by: created_by,
      updated_at: "",
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
  try {
    const participantsRef = db
      .collection("blog_evenements")
      .doc(blogId)
      .collection("participant"); // Correction : Utilisation de "participants" au lieu de "participant"

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
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const getParticipant = async (req, res) => {
  try {
    const userIds = req.body.userIds; // Utilisez directement req.body.userIds

    const usersRef = db.collection("users");
    const userDetails = [];

    for (const user of userIds) {
      const userSnapshot = await usersRef.doc(user).get();
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
        const eventId = doc.id;

        // Récupérer les participants
        const participantsSnapshot = await doc.ref
          .collection("participant")
          .get();
        const participant = participantsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        event.participant = participant;

        // Récupérer les likes
        const likesSnapshot = await doc.ref.collection("like").get();
        const like = likesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        event.like = like;

        // Récupérer les dislikes
        const dislikesSnapshot = await doc.ref.collection("dislike").get();
        const dislike = dislikesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        event.dislike = dislike;

        documents.push({ id: eventId, ...event });
      }
      connection.sendUTF(JSON.stringify(documents));
    },
    (err) => {
      console.log(err);
    }
  );
};

const addLike = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.body.userId;
  const blogRef = db.collection("blog_evenements").doc(blogId);
  const likesRef = blogRef.collection("like");
  const dislikesRef = blogRef.collection("dislike");

  try {
    // Check if the user already liked the blog
    const likeDocRef = likesRef.doc(userId);
    const likeSnapshot = await likeDocRef.get();

    if (likeSnapshot.exists) {
      // The user already liked the blog, remove their like
      await likeDocRef.delete();
    } else {
      // The user didn't like the blog, add their like with created_at field
      await likeDocRef.set({ created_at: new Date() });

      // Check if the user disliked the blog, if so, remove their dislike
      const dislikeDocRef = dislikesRef.doc(userId);
      const dislikeSnapshot = await dislikeDocRef.get();

      if (dislikeSnapshot.exists) {
        // The user disliked the blog, remove their dislike
        await dislikeDocRef.delete();
      }
    }

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const addDislike = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.body.userId;

  const blogRef = db.collection("blog_evenements").doc(blogId);
  const dislikesRef = blogRef.collection("dislike");
  const likesRef = blogRef.collection("like");

  try {
    // Check if the user already disliked the blog
    const dislikeDocRef = dislikesRef.doc(userId);
    const dislikeSnapshot = await dislikeDocRef.get();

    if (dislikeSnapshot.exists) {
      // The user already disliked the blog, remove their dislike
      await dislikeDocRef.delete();
    } else {
      // The user didn't dislike the blog, add their dislike with created_at field
      await dislikeDocRef.set({ created_at: new Date() });

      // Check if the user liked the blog, if so, remove their like
      const likeDocRef = likesRef.doc(userId);
      const likeSnapshot = await likeDocRef.get();

      if (likeSnapshot.exists) {
        // The user liked the blog, remove their like
        await likeDocRef.delete();
      }
    }

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
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

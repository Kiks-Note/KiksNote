const { db, FieldValue } = require("../firebase");

//add new Blog
const addNewBlog = async (req, res) => {
  const {
    title,
    editorState,
    inputEditorState,
    created_by,
    tag,
    statut,
    type,
    visibility,
  } = req.body;
  try {
    const url = req.protocol + "://" + req.get("host") + "/";
    let imagebackgroundTmp = req.file ? url + req.file.path : "";

    await db.collection("blog").doc().set({
      title: title,
      thumbnail: imagebackgroundTmp,
      editorState: editorState,
      inputEditorState: inputEditorState,
      statut: statut,
      created_by: created_by,
      participant: [],
      like: [],
      dislike: [],
      tag: tag,
      type: type,
      updated_at: "",
      visibility: visibility,
      created_at: new Date(),
    });
    res.send("Document successfully written!");
  } catch (err) {
    res.status(500).send(err);
  }
};
//add new Tuto
const addNewTuto = async (req, res) => {
const {
  title,
  editorState,
  inputEditorState,
  created_by,
  tag,
  statut,
  type,
  visibility,
  inputEditorStateTitle,
} = JSON.parse(req.body.tutoData);

  console.log(req.body.tutoData);
  console.log(title);
  try {
    const url = req.protocol + "://" + req.get("host") + "/";
    let imagebackgroundTmp = req.file ? url + req.file.path : "";

    await db
      .collection("blog")
      .doc()
      .set({
        title: title,
        thumbnail: imagebackgroundTmp,
        editorState: editorState,
        inputEditorState: inputEditorState,
        inputEditorStateTitle: inputEditorStateTitle
          ? inputEditorStateTitle
          : [],
        statut: statut,
        created_by: created_by,
        participant: [],
        like: [],
        dislike: [],
        tag: tag,
        type: type,
        updated_at: "",
        visibility: visibility,
        created_at: new Date(),
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
//delete  Blog
const deleteBlog = async (req, res) => {
  await db.collection("blog").doc(req.params.id).delete();
  res.send("Document successfully deleted!");
};

const getDescriptions = async (req, res) => {
  const snapshot = await db.collection("blog").doc(req.params.id).get();
  res.send(snapshot.data());
};
// add Participant
const addParticipant = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.body.userId;
  try {
    const blogRef = db.collection("blog").doc(blogId);

    // Retrieve the blog document
    const blogSnapshot = await blogRef.get();

    if (blogSnapshot.exists) {
      const blogData = blogSnapshot.data();

      // Check if the user is already a participant
      if (blogData.participant && blogData.participant.includes(userId)) {
        // The user is already a participant, remove them
        await blogRef.update({
          participant: FieldValue.arrayRemove(userId),
        });
        res.status(200).send("Utilisateur supprimé des participants.");
      } else {
        // The user is not a participant, add them
        await blogRef.update({
          participant: FieldValue.arrayUnion(userId),
        });
        res.status(200).send("Utilisateur ajouté aux participants.");
      }
    } else {
      res.status(404).send("Blog not found.");
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
        userDetails.push({ id: user, firstname, lastname, image });
      }
    }

    res.send(userDetails);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const addLike = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.body.userId;
  const blogRef = db.collection("blog").doc(blogId);

  try {
    await db.runTransaction(async (transaction) => {
      const blogSnapshot = await transaction.get(blogRef);
      if (!blogSnapshot.exists) {
        res.status(404).send("Blog not found.");
        return;
      }

      const blogData = blogSnapshot.data();

      if (blogData.like && blogData.like.includes(userId)) {
        // The user already liked the blog, remove their like
        transaction.update(blogRef, {
          like: FieldValue.arrayRemove(userId),
        });
        if (blogData.dislike && blogData.dislike.includes(userId)) {
          // The user disliked the blog, remove their dislike
          transaction.update(blogRef, {
            dislike: FieldValue.arrayRemove(userId),
          });
        }
      } else {
        // The user didn't like the blog, add their like
        transaction.update(blogRef, {
          like: FieldValue.arrayUnion(userId),
        });

        if (blogData.dislike && blogData.dislike.includes(userId)) {
          // The user disliked the blog, remove their dislike
          transaction.update(blogRef, {
            dislike: FieldValue.arrayRemove(userId),
          });
        }
      }
    });

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const addDislike = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.body.userId;
  const blogRef = db.collection("blog").doc(blogId);

  try {
    await db.runTransaction(async (transaction) => {
      const blogSnapshot = await transaction.get(blogRef);
      if (!blogSnapshot.exists) {
        res.status(404).send("Blog not found.");
        return;
      }

      const blogData = blogSnapshot.data();

      if (blogData.dislike && blogData.dislike.includes(userId)) {
        // The user already disliked the blog, remove their dislike
        transaction.update(blogRef, {
          dislike: FieldValue.arrayRemove(userId),
        });
        if (blogData.like && blogData.like.includes(userId)) {
          // The user liked the blog, remove their like
          transaction.update(blogRef, {
            like: FieldValue.arrayRemove(userId),
          });
        }
      } else {
        // The user didn't dislike the blog, add their dislike
        transaction.update(blogRef, {
          dislike: FieldValue.arrayUnion(userId),
        });

        if (blogData.like && blogData.like.includes(userId)) {
          // The user liked the blog, remove their like
          transaction.update(blogRef, {
            like: FieldValue.arrayRemove(userId),
          });
        }
      }
    });

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const getTopCreators = async (req, res) => {
  try {
    console.log("Je récupère les top créateurs");
    const creatorsSnapshot = await db
      .collection("blog")
      .orderBy("created_by")
      .get();

    const creatorsMap = new Map();
    creatorsSnapshot.docs.forEach((doc) => {
      const creator = doc.data().created_by;
      if (creatorsMap.has(creator)) {
        creatorsMap.set(creator, creatorsMap.get(creator) + 1);
      } else {
        creatorsMap.set(creator, 1);
      }
    });

    const topCreators = Array.from(creatorsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, articleCount]) => ({ name, articleCount }));

    res.status(200).send(topCreators);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données des créateurs :",
      error
    );
    res.status(500).send({
      error:
        "Une erreur est survenue lors de la récupération des données des créateurs.",
    });
  }
};

const getBlogParticipants = async (req, res) => {
  console.log("Je récupère les top particiapnts");
  try {
    const snapshot = await db.collection("blog").get();
    const participantsCount = new Map();

    snapshot.forEach((doc) => {
      const blogData = doc.data();
      const participants = blogData.participant;

      participants.forEach((participant) => {
        if (participantsCount.has(participant)) {
          participantsCount.set(
            participant,
            participantsCount.get(participant) + 1
          );
        } else {
          participantsCount.set(participant, 1);
        }
      });
    });

    const sortedParticipants = Array.from(participantsCount.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    const topParticipants = sortedParticipants.slice(0, 10).map((entry) => {
      return { participant: entry[0], count: entry[1] };
    });

    res.send(topParticipants);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getTags = async (req, res) => {
  try {
    const snapshot = await db.collection("blog_tag").get();
    const tags = [];

    snapshot.forEach((doc) => {
      tags.push({ id: doc.id, ...doc.data() });
    });

    res.send(tags);
  } catch (error) {
    console.error("Erreur lors de la récupération des tags :", error);
    res
      .status(500)
      .send("Une erreur s'est produite lors de la récupération des tags.");
  }
};

const blogRequests = async (connection) => {
  const blogRef = db.collection("blog");
  blogRef.orderBy("created_at", "desc").onSnapshot(
    (snapshot) => {
      const documents = [];
      snapshot.forEach((doc) => {
        const blogData = doc.data();
        const blogId = doc.id;
        documents.push({ id: blogId, ...blogData });
      });
      connection.sendUTF(JSON.stringify(documents));
    },
    (err) => {
      console.log(err);
    }
  );
};
module.exports = {
  addBlogComment,
  updateBlogVisibility,
  addNewBlog,
  addNewTuto,
  blogRequests,
  deleteBlog,
  getDescriptions,
  getTags,
  addParticipant,
  getParticipant,
  addLike,
  addDislike,
  getTopCreators,
  getBlogParticipants,
};

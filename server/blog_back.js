const { app } = require("firebase-admin");

module.exports = (app, db) => {
  // get all tutos
  app.get("/tutos", async (req, res) => {
    const snapshot = await db.collection("blog_tutos").get();
    res.send(snapshot.docs.map((doc) => doc.data()));
    // return snapshot.docs.map(doc => doc.data());
  });

  //get all tutos id
  app.get("/tutos/id", async (req, res) => {
    const snapshot = await db.collection("blog_tutos").get();
    res.send(snapshot.docs.map((doc) => doc.id));
    // return snapshot.docs.map(doc => doc.data());
  });

  // get tutos by id
  app.get("/tuto/:id", async (req, res) => {
    const snapshot = await db.collection("blog_tutos").doc(req.params.id).get();
    res.send(snapshot.data());
  });
  // get tutos by id
  app.get("/tuto/:id", async (req, res) => {
    const snapshot = await db.collection("blog_tutos").doc(req.params.id).get();
    res.send(snapshot.data());
  });

  // get all comments by tutos id
  app.get("/tuto/:id/comments", async (req, res) => {
    const snapshot = await db
      .collection("blog_tutos")
      .doc(req.params.id)
      .collection("comment")
      .get();
    res.send(snapshot.docs.map((doc) => doc.data()));
  });

  // app.get("/blog", async (req, res) => {
  //   const snapshot = await db.collection("blog_evenements").get();

  //   res.send(snapshot.docs.map((doc) => doc.data()));
  // });

  app.get("/blog", async (req, res) => {
    const snapshot = await db.collection("blog_evenements").get();
    const data = [];

    for (const doc of snapshot.docs) {
      const event = doc.data();
      const participantsSnapshot = await doc.ref.collection("participants").get();
      const participants = participantsSnapshot.docs.map((doc) => doc.data());
      console.log(participants + "participants");
      event.participants = participants;
      data.push(event);
    }

    res.send(data);
  });

  //post a new comment on a tutorial
  app.post("/blog/:id/comments", async (req) => {
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
  });

  //update tutorial likes and dislikes
  app.put("/blog/:id/likes", async (req) => {
    await db.collection("blog_tutos").doc(req.params.id).update({
      like: req.body.like,
      dislike: req.body.dislike,
    });
  });

  //update tutorial visibility
  app.put("/blog/:id/visibility", async (req) => {
    await db.collection("blog_tutos").doc(req.params.id).update({
      visibility: req.body.visibility,
    });
  });

  app.post("/tutos/newtutos", async (req, res) => {
    const { title, description, photo } = req.body;
  app.post("/tutos/newtutos", async (req, res) => {
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
      await db.collection("blog_tutos").doc().set({
        title: title,
        description: description,
        photo: photo,
      });
      res.send("Document successfully written!");
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.post("/blog/newblog", async (req, res) => {
    const { title, description, photo, inputEditorState } = req.body;

    if (title == null || title == "") {
      return res.status(400).send("Title is required");
    }
    if (description == null || description == "") {
      return res.status(400).send("Description is required");
    }
    if (photo == null || photo == "") {
      return res.status(400).send("Photo is required");
    }
    if (inputEditorState == null || inputEditorState == "") {
      return res.status(400).send("Editor is required");
    }


    try {
      await db.collection("blog_evenements").doc().set({
        title: title,
        description: description,
        photo: photo,
        inputEditorState: inputEditorState,
      });
      res.send("Document successfully written!");
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.delete("/blog_event/:id", async (req, res) => {
    await db.collection("blog_evenements").doc(req.params.id).delete();
    res.send("Document successfully deleted!");
  });


  app.get("/blog_event/:id", async (req, res) => {
    const snapshot = await db.collection("blog_evenements").doc(req.params.id).get();
    res.send(snapshot.data());
  })

  app.post("/blog_event/:id/participants", async (req, res) => {
    const dbRef = firebase.database().ref("blog_evenements/" + id + "/participants/" + userId);

    await db
      .collection("blog_evenements")
      .doc(req.params.id)
      .collection("participants")

  }
  );


};


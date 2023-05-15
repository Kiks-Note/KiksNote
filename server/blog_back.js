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



};


module.exports = (app, pathname, db, connection) => {
  if (pathname === "/tuto") {
    console.log("je suis dans tuto");
    db.collection("blog_tutos").onSnapshot(
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
  }
  if (pathname === "/tutos/comments") {
    console.log("je suis dans /tutos/comments");

    connection.on("message", (message) => {
      console.log("message => ", message);
      console.log("message.utf8Data => ", message.utf8Data);
      const docId = JSON.parse(message.utf8Data);
      db.collection("blog_tutos")
        .doc(docId)
        .collection("comment")
        .onSnapshot((snapshot) => {
          const documents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          connection.sendUTF(JSON.stringify(documents));
        });
    });
  }
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

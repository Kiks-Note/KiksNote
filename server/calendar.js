module.exports = (app, db) => {
  // Route to get all users with status "Po"
  app.get("/calendar/instructor", async (req, res) => {
    try {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("status", "==", "po").get();
      const poUsers = snapshot.docs.map((doc) => {
        return {
          uid: doc.id,
          firstname: doc.data().firstname,
          lastname: doc.data().lastname,
          image: doc.data().image,
        };
      });
      res.status(200).json(poUsers);
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la récupération des utilisateurs.");
    }
  });
  app.get("/calendar/course", async (req, res) => {
    try {
      const usersRef = db.collection("course");
      const snapshot = await usersRef.get();
      const course = snapshot.docs.map((doc) => {
        return {
          uid: doc.id,
          name: doc.data().name,
        };
      });
      res.status(200).json(course);
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la récupération des utilisateurs.");
    }
  });
  app.post("/calendar", async (req, res) => {
    const data = req.body;
    console.log(data);

    try {
      const eventRefs = [];
      for (const event of data) {
        const docRef = await db.collection("calendar").add(event);
        eventRefs.push(docRef.id);
      }
      res.status(200).json({ eventRefs });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de l'ajout des événements à Firestore");
    }
  });
};

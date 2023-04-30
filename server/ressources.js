module.exports = (app, db) => {
  // Route to create a new courses
  app.post("/ressources/cours", async (req, res) => {
    try {
      const { title, description, date } = req.body;
      console.log(req.body);
      const resourcesRef = db.collection("ressources");
      const newResource = await resourcesRef.add({
        title,
        description,
        date,
      });
      res.status(201).json({ id: newResource.id });
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la création de la ressource.");
    }
  });

  // Route to get all resources
  app.get("/ressources", async (req, res) => {
    try {
      const resourcesRef = db.collection("ressources");
      const snapshot = await resourcesRef.get();
      const resources = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.status(200).json(resources);
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la récupération des ressources.");
    }
  });
  app.get("/ressources/:id", async (req, res) => {
    try {
      const resourceRef = db.collection("resources").doc(req.params.id);
      const doc = await resourceRef.get();

      if (!doc.exists) {
        res.status(404).send("Ressource introuvable.");
      } else {
        const resource = {
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          imageUrl: doc.data().imageUrl,
        };
        res.status(200).json(resource);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la récupération de la ressource.");
    }
  });

  app.get("/ressources/instructor", async (req, res) => {
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

  app.get("/course", async (req, res) => {
    try {
      const coursesRef = db.collection("course");
      const snapshot = await coursesRef.get();
      console.log(snapshot.docs);
      const courses = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          name: doc.data().name,
        };
      });
      res.status(200).json(courses);
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la récupération des cours.");
    }
  });

  app.get("/jpo", async (req, res) => {
    try {
      const jpoRef = db.collection("blog_evenements");
      const snapshot = await jpoRef.get();
      console.log(snapshot.docs);
      const jpo = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          date: doc.data().creation_date,
        };
      });
      res.status(200).json(jpo);
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la récupération des évenements.");
    }
  });
};

module.exports = (app, db) => {
  // Route to create a new resource
  app.post("/ressources", async (req, res) => {
    try {
      const { title, description,date } = req.body;
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
      const resourcesRef = db.collection("resources");
      const snapshot = await resourcesRef.get();
      const resources = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
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
};

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
};

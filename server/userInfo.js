module.exports = (app, db) => {
  //API for getting users' info from db
  app.get("/profile/getUser/:userId", async (req, res) => {
    const { userId } = req.params;

    const docRef = db.collection("users").doc(userId);
    const doc = await docRef.get();
    console.log(doc.data());
    res.status(200).send(doc.data());
  });

  app.put("/profile/user", (req, res) => {
    const userId = req.body.userId;
    const userDataToUpdate = req.body.userDataToUpdate;

    db.collection("users")
      .doc(userId)
      .update(userDataToUpdate)
      .then(() => {
        res.send("User data updated successfully.");
      })
      .catch((err) => {
        console.log(err);
        res.send("Error updating user data.");
      });
  });
};

module.exports = (app, db) => {
  //API for getting users' info from db
  app.get(`/profile/getUser/:userId`, async (req, res) => {
    const { userId } = req.params;

    const docRef = db.collection("users").doc(userId);
    const doc = await docRef.get();
    console.log(doc.data());
    res.status(200).send(doc.data());
  });

  // app.get('/profile/users', async (req, res) => {
  //   const docRef = db.collection("users");
  //   const snapshot = await docRef.get();
  //   const users = [];
  //   snapshot.forEach(doc => {
  //     users.push(doc.data());
  //   });
  //   res.status(200).send(users);
  // });

  app.put("/profile/:userId/editUser", (req, res) => {
    const userId = req.params;
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

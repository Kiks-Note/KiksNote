module.exports = (app, pathname, db, connection,upload) => {
  //API for getting users' info from db

  if (pathname === "/profil") {
    console.log("je suis dans /profile");

    connection.on("message", (message) => {
      console.log("message => ", message);
      console.log("message.utf8Data => ", message.utf8Data);
      const studentId = JSON.parse(message.utf8Data);
      console.log(studentId);
      db.collection("users")
        .doc(studentId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            connection.sendUTF(JSON.stringify(doc.data()));
          } else {
            connection.sendUTF(JSON.stringify({ error: "User not found" }));
          }
        })
        .catch((err) => {
          console.log(`Encountered error: ${err}`);
          connection.sendUTF(
            JSON.stringify({ error: "Error getting user data" })
          );
        });
    });
  }

  app.put("/profil/:userId/editUser", upload.single("image"), (req, res) => {
    const userId = req.params;
    const userDataToUpdate = req.body.userDataToUpdate;
    const imageUrl = req.file ? req.file.path : "";

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

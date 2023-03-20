module.exports = (app, db) => {


//API for getting users' info from db
  app.get("/profile/getUser", (req, res) => {
    db.collection("users")
      .get()
      .then((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

// API for updating user information
  app.post(`/profile/:userId/updateUser`, (req, res) => {
    const {userId} = req.params;
    const data = req.body;
    db.collection("users").add(data);
    res.status(200).send({ message: "User updated successfully" });
  }
  );
  
};

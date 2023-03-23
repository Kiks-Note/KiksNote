module.exports = (app, db) => {
  // app.post("/addUser", (req, res) => {
  //   const data = req.body;
  //   db.collection("users").add(data);
  //   res.send({ message: "User created successfully" });
  // });

  app.get("/dashboard/:studentId", (req, res) => {
    db.collection("dashboard")
      .get()
      .then((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          doc.data().students.forEach((student) => {
            if (student == req.params.studentId) {
              data.push({ ...doc.data(), id: doc.id });
            }
          });
        });
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.post("/dashboard/:dashboardId/:favorite", async (req, res) => {
    await db.collection("dashboard").doc(req.params.dashboardId).update({ favorite: req.params.favorite });
  });
};

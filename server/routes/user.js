module.exports = (app, db) => {
  app.get("/users", (req, res) => {
    db.collection("users")
      .get()
      .then((snapshot) => {
        let item = {};
        const data = [];
        snapshot.forEach((doc) => {
          item = doc.data();
          item["id"] = doc.id;
          data.push(item);
        });
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.get("/user", (req, res) => {
    db.collection("users")
      .doc(req.query.id)
      .get()
      .then((data) => {
        let item = {};
        item = data.data();
        item["id"] = data.id;
        res.send(item);
      });
  });
};

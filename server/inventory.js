module.exports = (app, db) => {
  app.get("/inventory", (req, res) => {
    db.collection("inventory")
      .find()
      .toArray((err, result) => {
        if (err) {
          res.send({ error: "An error has occurred" });
        } else {
          res.send(result);
        }
      });
  });
};

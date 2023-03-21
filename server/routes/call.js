module.exports = (app, wss, db) => {
  app.post("/callAdd", (req, res) => {
    db.collection("calls")
      .add({
        id_lesson: req.body.id_lesson,
        qrcode: req.body.qrcode,
        student_scan: req.body.student_scan,
        chats: req.body.chats,
      })
      .then((doc) => {
        res.send(doc.id);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.get("/calls", (req, res) => {
    db.collection("calls")
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

  app.get("/getcall", (req, res) => {
    db.collection("calls")
      .doc(req.query.id)
      .get()
      .then((data) => {
        res.send(data.data());
      });
  });

  app.post("/updatecall", (req, res) => {
    db.collection("calls")
      .doc(req.body.id)
      .update(req.body.object)
      .then(() => {
        res.send("modification effectué");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

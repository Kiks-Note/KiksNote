module.exports = (app, wss, db) => {
  app.post("/callAdd", (req, res) => {
    db.collection("calls")
      .add({
        id_lesson: req.body.id_lesson,
        qrcode: req.body.qrcode,
        student_scan: req.body.student_scan,
        chats: req.body.chats,
      })
      .then(() => {
        res.send("Item added to inventory");
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


  app.get("/chats", (req, res) => {
    db.collection("calls")
       // .doc(req.query.id)
      .get()
      .then((snapshot) => {
      const data1 = [];
      snapshot.forEach((doc) => {
          item = doc.data();
          item["id"] = doc.id;
          data1.push(item);
      });
      res.send(data1[data1.length - 1]);

        //res.send(data1.data);
      });
  });


  app.post("/addChat", (req, res) => {
      console.log("*********")
      console.log(req.body)
      console.log("*********")
      db.collection("calls")
          .doc("yk7atyTe9HNKNICvfHwo")
          .update({chats: req.body.object})
          .then( () => {
              res.send("add chat ");
          })
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

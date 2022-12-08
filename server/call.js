const express = require("express");
const cors = require("cors");
const app = express();
const { db } = require("./firebase");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

app.post("/callAdd", (req, res) => {
  const itemRef = req.body.name;
  const space = " ";
  const newItemRef = itemRef.replace(space, "_");

  db.doc("/calls/" + newItemRef)
    .set({
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
      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

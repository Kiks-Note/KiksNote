const express = require("express");
const cors = require("cors");
const app = express();
const { db } = require("./firebase");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5050;

app.post("/inventoryAdd", (req, res) => {
  const itemRef = req.body.name;
  const space = " ";
  const newItemRef = itemRef.replace(space, "_");

  db.doc("/inventory/" + newItemRef)
    .set({
      name: req.body.name,
      quantity: req.body.quantity,
    })
    .then(() => {
      res.send("Item added to inventory");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/inventory", (req, res) => {
  db.collection("inventory")
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

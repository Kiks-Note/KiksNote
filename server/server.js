const express = require("express");
const cors = require("cors");
const app = express();
const { db } = require("./firebase");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5050;

// app.post("/addUser", (req, res) => {
//   const data = req.body;
//   db.collection("users").add(data);
//   res.send({ message: "User created successfully" });
// });
//
// app.get("/users", (req, res) => {
//   db.collection("users")
//     .get()
//     .then((snapshot) => {
//       const data = [];
//       snapshot.forEach((doc) => {
//         data.push(doc.data());
//       });
//       res.send(data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
require("./userInfo")(app, db)
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

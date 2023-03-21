const express = require("express");
const cors = require("cors");
const app = express();
const { db, auth } = require("./firebase");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5050;

app.post('/register', (req, res) => {
    const {userEmail, userPassword, userFirstName, userLastName, userBirthDate, userStatus} = req.body;
    auth.createUser({
        email: userEmail,
        password: userPassword,
    }).then((user) => {
        db.collection("users").doc(userEmail).set({
            firstname: userFirstName,
            lastname: userLastName,
            password: userPassword,
            dateofbirth : new Date(userBirthDate),
            status: userStatus,
            email: userEmail
        })
        res.send({ message: "User created successfully" })
    }).catch((err)=>{
        console.log(err);
    })
})

app.post("/addUser", (req, res) => {
  const data = req.body;
  db.collection("users").add(data);
  res.send({ message: "User created successfully" });
});

app.get("/users", (req, res) => {
  db.collection("users")
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

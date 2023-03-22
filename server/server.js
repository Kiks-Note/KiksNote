const express = require("express");
const cors = require("cors");
const app = express();
const { db, auth } = require("./firebase");
const bcrypt = require('bcrypt');
const saltRounds = 12;

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5050;

app.post('/register', (req, res) => {
    const {userEmail, userPassword, userFirstName, userLastName, userBirthDate, userStatus, userClass} = req.body;
    auth.createUser({
        email: userEmail,
        password: userPassword,
    }).then((user) => {
        if (userClass === "") {
            db.collection("users").doc(user.uid).set({
                firstname: userFirstName,
                lastname: userLastName,
                password: bcrypt.hashSync(userPassword, saltRounds),
                dateofbirth: new Date(userBirthDate),
                status: userStatus,
                email: userEmail
            })
        } else {
            db.collection("users").doc(user.uid).set({
                firstname: userFirstName,
                lastname: userLastName,
                password: bcrypt.hashSync(userPassword, saltRounds),
                dateofbirth: new Date(userBirthDate),
                status: userStatus,
                email: userEmail,
                class: userClass
            })
        }
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

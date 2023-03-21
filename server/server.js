const express = require("express");
const cors = require("cors");
const app = express();
const { db } = require("./firebase");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5050;

app.post('/register', async(req, res) => {
    try {
        const {email, password} = req.body.user;
        db.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                var user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(error);
            });
        res.send({ message: "User created successfully" })
    } catch(e) {

    }
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

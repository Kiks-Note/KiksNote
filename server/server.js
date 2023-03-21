const jwt = require("JsonWebToken");
const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const { db } = require("./firebase");
var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { JsonWebTokenError } = require("jsonwebtoken");
const saltRounds = 12;

dotenv.config({ path: './.env.resetpass' })
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5050;

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


app.post("/resetpass", (req, res) => {
  const newPassword = req.body.newPassword;
  const confirmedPassword = req.body.confirmedPassword;
  const tokenResetPass = req.body.token
  newPasswordHash = bcrypt.hashSync(newPassword, saltRounds);

})

app.post("/sendemail", (req, res) => {

  const email = req.body.email;
  var nodemailer = require('nodemailer');
  let isValidEmail = false;

  db.collection("users")
    .get()
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data()["email"]);
        const str = doc.data()["email"];
        if (doc.data()["email"].replace(/\s+/g, '') == email.replace(/\s+/g, '')) {
          console.log("is valid mail condtion " + isValidEmail);
          isValidEmail = true
        }
      });
    }).then(
      () => {
        if (isValidEmail == true) {
          res.send("mail there");
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'services.kiksnote.noreply@gmail.com',
              pass: "njujpddhfbazaifo"
            }
          });

          // Generate a token to be send by email
          const token = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "15m" });

          var mailOptions = {
            from: 'services.kiksnote.noreply@gmail.com',
            to: email,
            subject: 'Récupération du mot de passe',
            text: `http://localhost:3000/resetpass?token=${token}`
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        } else {
          res.send("mail not there");
        }
      }
    )
    .catch((err) => {
      console.error(err);
    });


});

function makeid() {
  const length = 64;
  const linktoresetpage = `http://localhost:5050/askresetpass`;
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  var result = [];
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() *
      charactersLength)));
  }
  var token = result.join('');
  return token;
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

require('./tokenResetpass')(app, db, jwt, bcrypt);

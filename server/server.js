const express = require("express");
const cors = require("cors");
const app = express();
const { db } = require("./firebase");
var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const saltRounds = 12;


app.use(express.json());
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
    console.log(newPassword, confirmedPassword);
    newPasswordHash = bcrypt.hashSync(newPassword, saltRounds);
    console.log(newPasswordHash);
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
        
        var mailOptions = {
          from: 'services.kiksnote.noreply@gmail.com',
          to: email,
          subject: 'Récupération du mot de passe',
          text: "http://localhost:3000/resetpass?" + makeid()
        };
    
        transporter.sendMail(mailOptions, function(error, info){
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
  const linktoresetpage = `http://localhost:3000/askresetpass`;
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

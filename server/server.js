const express = require("express");
const cors = require("cors");
const app = express();
const { db } = require("./firebase");
var nodemailer = require('nodemailer');

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

app.get("/resetpass", (req, res) => {
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

  app.post("/resetpass?idresetpass=id", (req, res) => {
    const itemRef = req.body.name;
    req.query.idresetpass == "ddddd";
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


app.post("/sendemail", (req, res) => {

  const email = req.body.email;
  var nodemailer = require('nodemailer');
  let isValidEmail = false;
  var BreakException = {};


  db.collection("users")
  .get()
  .then((snapshot) => {
    const data = [];
    snapshot.forEach((doc) => {
      data.push(doc.data()["mail"]);
      const str = doc.data()["mail"];
      console.log(str.replace(/\s+/g, '') == email.replace(/\s+/g, ''), str.replace(/\s+/g, '')+ ":" +email);
      if (doc.data()["mail"].replace(/\s+/g, '') == email.replace(/\s+/g, '')) {
        isValidEmail = true;
        throw BreakException;
      }
    });

    console.log("**************");
    console.log(data);
    res.send(data);
  })
  .catch((err) => {
    console.log("last catch");
   // throw 'Error message';
  });

  if (isValidEmail == false) {
    console.log("condition");
    res.send("mail not there");
    //return;
  }

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
    text: "http://localhost:3000/resetpass?" + makeid("test")
  };

  // transporter.sendMail(mailOptions, function(error, info){
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //   }
  // });
});

function makeid(nickname) {
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
  console.log(`${linktoresetpage}/?token=${token}&nickname=${nickname}`);
  return token;    
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

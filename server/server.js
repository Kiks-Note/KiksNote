const express = require("express");
const cors = require("cors");
//const mod = require("./module.mjs");
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

  app.get("/!uu", (req, res) => {
    
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

  console.log("log");
  // mod.sendAnEmail(); 
  const email = req.body.email;
  console.log("email: " + email);
  console.log(req);

  

  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'services.kiksnote.noreply@gmail.com', 
      pass: "njujpddhfbazaifo" 
    }
  });
  

  var mailOptions = {
    from: 'services.kiksnote.noreply@gmail.com',
    to: 'mohameddrame907@gmail.com',
    subject: 'Sending Email using Node.js',
    text: "http://localhost:3000/resetpass"
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

//  const email = req.body.email;

  // const itemRef = req.body.name;
  // req.query.idresetpass == "ddddd";
  // const space = " ";
  // const newItemRef = itemRef.replace(space, "_");

  // db.doc("/calls/" + newItemRef)
  //   .set({
  //     id_lesson: req.body.id_lesson,
  //     qrcode: req.body.qrcode,
  //     student_scan: req.body.student_scan,
  //     chats: req.body.chats,
  //   })
  //   .then(() => {
  //     res.send("Item added to inventory");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});




app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

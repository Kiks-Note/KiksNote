const { db } = require("../firebase");
var nodemailer = require('nodemailer');

const exportMailCall = async (req, res) => {

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'services.kiksnote.noreply@gmail.com',
      pass: "njujpddhfbazaifo"
    }
  });

  var mailOptions = {
    from: 'services.kiksnote.noreply@gmail.com',
    to: "mohamed.niaissa@edu.esiee-it.fr",
    subject: 'Récupération du mot de passe',
    text: `Test text`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

};

const callRequests = async (connection) => {
    db.collection("calls").onSnapshot(
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        connection.sendUTF(JSON.stringify(documents));
      },
      (err) => {
        console.log(err);
      }
    );
  };
module.exports = {
    exportMailCall,
    callRequests
}
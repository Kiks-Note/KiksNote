const { db } = require("../firebase");
var nodemailer = require('nodemailer');

const exportMailCall = async (req, res) => {

  const attachment = {
    filename: 'presence.pdf',
    path: __dirname + "/../pdf/file.pdf",
    contentType: 'application/pdf'
  };

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'services.kiksnote.noreply@gmail.com',
      pass: "njujpddhfbazaifo"
    }
  });

  console.log("$$$$$$");
  console.log(req.body.pdf);
  
  var mailOptions = {
    from: 'services.kiksnote.noreply@gmail.com',
    to: "mohamed.niaissa@edu.esiee-it.fr",
    subject: 'Récupération du mot de passe',
    text: `Test text`,
    //attachments: [attachment]
    attachments: [
      {
        filename: 'myDocument.pdf',
        content: req.body.pdfBuffer
      }
    ]
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
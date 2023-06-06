const { auth, db } = require("../firebase");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

const saltRounds = 12;
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'services.kiksnote.noreply@gmail.com',
    pass: "njujpddhfbazaifo"
  }
});


const login = async (req, res) => {
  const { token } = req.body;
  try {
    await auth.verifyIdToken(token);
    res.status(200).json({ message: "Success" });
    console.log("Success");
  } catch (error) {
    res.status(401).json({ message: "Connexion non autorisée" });
  }
};

const register = async (req, res) => {
  const {
    userEmail,
    userPassword,
    userFirstName,
    userLastName,
    userBirthDate,
    userStatus,
    userClass,
  } = req.body;
  auth
    .createUser({
      email: userEmail,
      password: userPassword,
    })
    .then(() => {
      if (userClass === "") {
        db.collection("users")
          .doc(userEmail)
          .set({
            firstname: userFirstName,
            lastname: userLastName,
            // password: bcrypt.hashSync(userPassword, saltRounds),
            dateofbirth: new Date(userBirthDate),
            status: userStatus,
            email: userEmail,
            create_at: new Date(),
          });
      } else {
        db.collection("users")
          .doc(userEmail)
          .set({
            firstname: userFirstName,
            lastname: userLastName,
            // password: bcrypt.hashSync(userPassword, saltRounds),
            dateofbirth: new Date(userBirthDate),
            status: userStatus,
            email: userEmail,
            class: userClass,
            create_at: new Date(),
          });
      }
      res.send({ message: "User created successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
};

// email for reset password
const sendemail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email)
    auth.generatePasswordResetLink(email).then((link) => {
      console.log(link)
      var mailOptions = {
        from: 'services.kiksnote.noreply@gmail.com',
        to: email,
        subject: 'Récupération du mot de passe',
        text: `Bonjour,\n\n
                    \t Vous avez demandé la réinitialisation de votre mot de passe pour le compte ${email}.\n
                    \t Voici le lien pour réinitialiser votre mot de passe :\n
                    ${link}\n`
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.send({ message: 'Le lien à été généré avec succès et l\'email envoyé.' });
    })
  } catch (error) {
    res.status(401).json({ message: "Connexion non autorisée" });
  }
};



module.exports = { login, register, sendemail };

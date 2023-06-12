const { auth, db } = require("../firebase");
const nodemailer = require("nodemailer");
var hbs = require("nodemailer-express-handlebars");
const path = require("path");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "services.kiksnote.noreply@gmail.com",
    pass: "njujpddhfbazaifo",
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: ".html",
    partialsDir: path.resolve(__dirname, "email_templates"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "email_templates"),
  extName: ".html",
};

transporter.use("compile", hbs(handlebarOptions));

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

  try {
    const userSnapshot = await db.collection("users").doc(userEmail).get();
    if (userSnapshot.exists) {
      return res
        .status(400)
        .send({ message: "L'adresse e-mail est déjà utilisée." });
    }

    await auth.createUser({
      email: userEmail,
      password: userPassword,
    });

    const userData = {
      firstname: userFirstName,
      lastname: userLastName,
      dateofbirth: new Date(userBirthDate),
      status: userStatus,
      email: userEmail,
      create_at: new Date(),
    };

    if (userClass !== "") {
      const userClassRef = await db.collection("class").doc(userClass).get();

      if (!userClassRef.exists) {
        return res.status(404).send("Classe non trouvée");
      }

      const userClassData = userClassRef.data();
      userClassData.id = userClassRef.id;
      userData.class = userClassData;
    }

    await db.collection("users").doc(userEmail).set(userData);

    const verificationLink = await auth.generateEmailVerificationLink(
      userEmail
    );

    const logoFilePath = path.resolve(__dirname, "../assets/logo.png");
    const confirmEmailFilePath = path.resolve(
      __dirname,
      "../assets/confirm_email.png"
    );

    const mailOptions = {
      from: "services.kiksnote.noreply@gmail.com",
      to: userEmail,
      subject: "Vérification de l'email du compte",
      template: "confirmation_email",
      context: {
        userFirstName: userFirstName,
        verificationLink: verificationLink,
      },
      attachments: [
        {
          filename: "logo.png",
          path: logoFilePath,
          cid: "logo",
        },
        {
          filename: "confirm_email.png",
          path: confirmEmailFilePath,
          cid: "confirmEmailArt",
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Une erreur s'est produite lors de l'envoi de l'e-mail.",
        });
      } else {
        console.log("E-mail envoyé : " + info.response);
        return res
          .status(200)
          .send({ message: "Utilisateur créé avec succès." });
      }
    });
  } catch (error) {
    console.log(error);

    if (error.code === "auth/email-already-exists") {
      res.status(400).send({
        message: "L'adresse e-mail est déjà utilisée.",
      });
    } else {
      res.status(500).send({
        message:
          "Une erreur s'est produite lors de la création de l'utilisateur.",
      });
    }
  }
};

const login = async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await auth.verifyIdToken(token);
    const { email } = decodedToken;

    const user = await auth.getUserByEmail(email);
    if (!user.emailVerified) {
      return res
        .status(401)
        .json({ message: "Veuillez vérifier votre adresse e-mail" });
    }

    res.status(200).json({ message: "Success" });
    console.log("Success");
  } catch (error) {
    res.status(401).json({ message: "Connexion non autorisée" });
  }
};

// email for reset password
const sendemail = async (req, res) => {
  try {
    const { email } = req.body;

    try {
      await auth.getUserByEmail(email);
    } catch (error) {
      return res
        .status(404)
        .json({ message: "L'adresse email rentré n'existe pas." });
    }

    console.log(email);
    auth.generatePasswordResetLink(email).then((link) => {
      console.log(link);
      var mailOptions = {
        from: "services.kiksnote.noreply@gmail.com",
        to: email,
        subject: "Récupération du mot de passe",
        text: `Bonjour,\n\n
                    \t Vous avez demandé la réinitialisation de votre mot de passe pour le compte ${email}.\n
                    \t Voici le lien pour réinitialiser votre mot de passe :\n
                    ${link}\n`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.send({
        message: "Le lien à été généré avec succès et l'email envoyé.",
      });
    });
  } catch (error) {
    res.status(401).json({ message: "Connexion non autorisée" });
  }
};

module.exports = { login, register, sendemail };

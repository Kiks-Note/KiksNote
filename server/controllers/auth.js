const { auth, db } = require("../firebase");
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "services.kiksnote.noreply@gmail.com",
    pass: "njujpddhfbazaifo",
  },
});

const login = async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await auth.verifyIdToken(token);
    const { email } = decodedToken;

    // const user = await auth.getUserByEmail(email);
    // if (!user.emailVerified) {
    //   return res
    //     .status(401)
    //     .json({ message: "Veuillez vérifier votre adresse e-mail" });
    // }

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

  try {
    const userSnapshot = await db.collection("users").doc(userEmail).get();
    if (userSnapshot.exists) {
      return res
        .status(400)
        .send({ message: "L'adresse e-mail est déjà utilisée." });
    }

    const userClassRef = await db.collection("class").doc(userClass).get();

    if (!userClassRef.exists) {
      return res.status(404).send("Classe non trouvée");
    }

    const userClassData = userClassRef.data();
    userClassData.id = userClassRef.id;

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
      userData.class = userClassData;
    }

    await db.collection("users").doc(userEmail).set(userData);

    await auth
      .generateEmailVerificationLink(userEmail)
      .then((link) => {
        const mailOptions = {
          from: "services.kiksnote.noreply@gmail.com",
          to: userEmail,
          subject: "Vérification de l'email du compte",
          text: `Bonjour ${userFirstName},\n
          \t Veuillez cliquer sur le lien suivant pour vérifier votre compte :\n : ${link}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("E-mail envoyé : " + info.response);
          }
        });
        res.status(200).send({ message: "Utilisateur créé avec succès." });
      })
      .catch((error) => {
        console.log(error);
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

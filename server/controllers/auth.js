const { auth,db } = require("../firebase");
const bcrypt = require("bcrypt");

const saltRounds = 12;

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
const register = async (req,res) => {
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
            password: bcrypt.hashSync(userPassword, saltRounds),
            dateofbirth: new Date(userBirthDate),
            status: userStatus,
            email: userEmail,
            create_at: new Date()
          });
      } else {
        db.collection("users")
          .doc(userEmail)
          .set({
            firstname: userFirstName,
            lastname: userLastName,
            password: bcrypt.hashSync(userPassword, saltRounds),
            dateofbirth: new Date(userBirthDate),
            status: userStatus,
            email: userEmail,
            class: userClass,
            create_at: new Date()
          });
      }
      res.send({ message: "User created successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { login,register };

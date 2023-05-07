const {auth} = require("../firebase");

const login = async (req, res) => {
  const {token} = req.body;
  try {
    await auth.verifyIdToken(token);  
    res.status(200).json({message: "Success"});
    console.log("Success");
  } catch (error) {
    res.status(401).json({message: "Connexion non autorisée"});
  }
};

module.exports = {login};

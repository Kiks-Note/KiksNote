const { db } = require("../firebase");

console.log("in retro controller");

const addRetro = async (req, res) => {
  // Implementation of adding retro logic
  res.json({ message: "addRetro works!" });
};

const retroRequests = async (connection) => {
  console.log("in retroRequests");
  db.collection("retro").onSnapshot(
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


const getRetro = async (req, res) => {
  console.log("in getRetro");
  console.log("in get Retro");
  res.json({ message: "getRetro works!" });
};

module.exports = {
  addRetro,
  retroRequests,
  getRetro
};

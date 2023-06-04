const { db } = require("../firebase");

console.log("in retro controller");

const addRetro = async (req, res) => {
  // Implementation of adding retro logic
  res.json({ message: "addRetro works!" });

  const tabRetro = {
    dataRetro: req.body.dataRetro,
    idUser: req.body.idUser
  };

  //const tabRetro = [req.body.dataRetro]
  console.log(tabRetro);

  //tabRetro.push(req.body.idUser)

  db.collection("retro").doc().set(tabRetro);

};

const getAll = async (req, res) => {
  const allRetrosQuery = await db.collection("retro").get()

  let allRetros = []
  allRetrosQuery.forEach((doc) => {
    allRetros.push({ ...doc.data() });
  });

  res.send(allRetros)
  console.log(allRetros);

}

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
  getRetro,
  getAll
};

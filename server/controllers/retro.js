const { db } = require("../firebase");

console.log("in controller");

const addRetro = async (req, res) => {
  await db
    .collection("retro")
    //.doc(req.params.id)
    //.collection("comment")
    .add({
        object: req.object
    });
};

const retroRequests = async (connection) => {
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
  

const getRetro = async (connection) => {
  console.log("in get Retro");
  res.send("getRetro works !")
  return "getRetro works !"
}
  

module.exports = {
    addRetro,
    retroRequests,
    getRetro
};

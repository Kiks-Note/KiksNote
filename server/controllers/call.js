const { db } = require("../firebase");

const exportMailCall = async (req, res) => {
  console.log("222");
  res.status(200)
  res.send('AAAA')
 //   console.log("send: ", req.body.callfile)
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
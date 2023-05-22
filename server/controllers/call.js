const { db } = require("../firebase");

const addCall = async (req, res) => {
  await db
    .collection("calls")
    .add({
      id_lesson: req.body.id_lesson,
      qrcode: req.body.qrcode,
      student_scan: req.body.student_scan,
      chats: req.body.chats,
    })
    .then((doc) => {
      res.send(doc.id);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getCalls = async (req, res) => {
  await db
    .collection("calls")
    .get()
    .then((snapshot) => {
      let item = {};
      const data = [];
      snapshot.forEach((doc) => {
        item = doc.data();
        item["id"] = doc.id;
        data.push(item);
      });
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getCall = async (req, res) => {
  await db
    .collection("calls")
    .doc(req.query.id)
    .get()
    .then((data) => {
      res.send(data.data());
    });
};

const updateCall = async (req, res) => {
  await db
    .collection("calls")
    .doc(req.body.id)
    .update(req.body.object)
    .then(() => {
      console.log("c'est modifié");
      res.send("modification effectué");
    })
    .catch((err) => {
      console.log(err);
    });
};

const callRequests = async (connection) => {
  connection.on("message", (message) => {
    const callId = JSON.parse(message.utf8Data);
    db.collection("calls").onSnapshot(
      (snapshot) => {
        let data;
        snapshot.forEach((doc) => {
          if (doc.id == callId.CallId) {
            data = doc.data();
          }
        });
        connection.sendUTF(JSON.stringify(data));
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );
  });
};

module.exports = {
  getCall,
  getCalls,
  addCall,
  updateCall,
  callRequests,
};

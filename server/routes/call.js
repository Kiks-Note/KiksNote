const WebSocket = require("ws");

module.exports = (app, wss, db, parse) => {
  app.post("/callAdd", (req, res) => {
    db.collection("calls")
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
  });

  app.get("/calls", (req, res) => {
    db.collection("calls")
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
  });

  app.get("/getcall", (req, res) => {
    db.collection("calls")
      .doc(req.query.id)
      .get()
      .then((data) => {
        res.send(data.data());
      });
  });

  app.post("/updatecall", (req, res) => {
    db.collection("calls")
      .doc(req.body.id)
      .update(req.body.object)
      .then(() => {
        res.send("modification effectué");
      })
      .catch((err) => {
        console.log(err);
      });
  });

  let currentData;

  const broadcastData = (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };
  // Handle incoming connections from clients
  wss.on("connection", (ws, req) => {
    // Send the current data to the new client
    ws.send(currentData);
    ws.onmessage = (event) => {
      currentData = event.data;
      broadcastData(event.data);
    };
  });
};

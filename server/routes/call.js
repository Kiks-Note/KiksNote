const WebSocket = require("ws");

module.exports = (app, ws, db, parse) => {
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

  // let currentData;

  // const broadcastData = (data) => {
  //   wss.clients.forEach((client) => {
  //     if (client.readyState === WebSocket.OPEN) {
  //       client.send(data);
  //     }
  //   });
  // };
  // // Handle incoming connections from clients
  // wss.on("connection", (ws, req) => {
  //   // Send the current data to the new client
  //   ws.send(currentData);
  //   ws.onmessage = (event) => {
  //     currentData = event.data;
  //     broadcastData(event.data);
  //   };
  // });

  ws.on("request", (request) => {
    const connection = request.accept(null, request.origin);
    const { pathname } = parse(request.httpRequest.url);
    connection
      ? console.log("connection ok")
      : console.log("connection failed");

    if (pathname === "/Call") {
      console.log("je suis dans /Call");

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
    }
  });
};

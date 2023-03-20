const express = require("express");
const cors = require("cors");
const app = express();
const { db } = require("./firebase");
const WebSocket = require("ws");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

const wss = new WebSocket.Server({ port: 4050 });

let currentData;

const broadcastData = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// Handle incoming connections from clients
wss.on("connection", (ws) => {
  // Send the current data to the new client
  ws.send(currentData);

  console.log(ws.eventNames());

  ws.onmessage = (event) => {
    console.log("test");
    currentData = event.data;
    broadcastData(event.data);
  };
});

// app.post("/addUser", (req, res) => {
//   const data = req.body;
//   db.collection("users").add(data);
//   res.send({ message: "User created successfully" });
// });
//
// app.get("/users", (req, res) => {
//   db.collection("users")
//     .get()
//     .then((snapshot) => {
//       const data = [];
//       snapshot.forEach((doc) => {
//         data.push(doc.data());
//       });
//       res.send(data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
app.post("/callAdd", (req, res) => {
  db.collection("calls")
    .add({
      id_lesson: req.body.id_lesson,
      qrcode: req.body.qrcode,
      student_scan: req.body.student_scan,
      chats: req.body.chats,
    })
    .then(() => {
      res.send("Item added to inventory");
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

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

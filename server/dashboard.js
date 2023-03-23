module.exports = (app, db, ws, parse) => {
  // app.post("/addUser", (req, res) => {
  //   const data = req.body;
  //   db.collection("users").add(data);
  //   res.send({ message: "User created successfully" });
  // });

  app.get("/dashboard/:studentId", (req, res) => {
    db.collection("dashboard")
      .get()
      .then((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          doc.data().students.forEach((student) => {
            if (student == req.params.studentId) {
              data.push({ ...doc.data(), id: doc.id });
            }
          });
        });
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.put("/dashboard/:dashboardId/:favorite", async (req, res) => {
    console.log(req.params.favorite);
    await db.collection("dashboard").doc(req.params.dashboardId).update({ favorite: req.params.favorite });
  });

  ws.on("request", (request) => {
    const connection = request.accept(null, request.origin);
    const { pathname } = parse(request.httpRequest.url);
    connection ? console.log("connection ok") : console.log("connection failed");

    if (pathname === "/dashboard") {
      console.log("je suis dans /dashboard");

      connection.on("message", (message) => {
        console.log("message => ", message);
        console.log("message.utf8Data => ", message.utf8Data);
        const studentId = JSON.parse(message.utf8Data);
        db.collection("dashboard").onSnapshot(
          (snapshot) => {
            const data = [];
            snapshot.forEach((doc) => {
              doc.data().students.forEach((student) => {
                if (student == studentId) {
                  data.push({ ...doc.data(), id: doc.id });
                }
              });
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

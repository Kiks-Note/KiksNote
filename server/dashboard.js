module.exports = (app, db, ws, parse) => {
  // app.post("/addUser", (req, res) => {
  //   const data = req.body;
  //   db.collection("users").add(data);
  //   res.send({ message: "User created successfully" });
  // });

  app.put("/dashboard/:dashboardId/:favorite", async (req, res) => {
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
    if (pathname === "/board") {
      console.log("je suis dans /board");

      connection.on("message", (message) => {
        console.log("message => ", message);
        console.log("message.utf8Data => ", message.utf8Data);
        var json = JSON.parse(message.utf8Data);
        var dashboardId = json.dashboardId;
        var boardId = json.boardId;
        console.log("boardId => ", boardId);
        console.log("dashboardId => ", dashboardId);
        db.collection("dashboard")
          .doc(dashboardId)
          .collection("board")
          .doc(boardId)
          .onSnapshot(
            (snapshot) => {
              const data = snapshot.data();
              connection.sendUTF(
                JSON.stringify([data.requested, data.acceptance, data.toDo, data.inProgress, data.done])
              );
            },
            (err) => {
              console.log(`Encountered error: ${err}`);
            }
          );
      });
    }
  });

  app.put("/board/:dashboardId/:boardId/:column/:id/:index", async (req, res) => {
    await db.collection("dashboard").doc(req.params.dashboardId).update({ favorite: req.params.favorite });
  });

  app.put("/board/:dashboardId/:boardId", async (req, res) => {
    var data = req.body;
    await db
      .collection("dashboard")
      .doc(req.params.dashboardId)
      .collection("board")
      .doc(req.params.boardId)
      .update({ requested: data[0], acceptance: data[1], toDo: data[2], inProgress: data[3], done: data[4] });

    console.log("updated .. i guess..");
  });

  app.post("/board/:dashboardId", async (req, res) => {
    await db
      .collection("dashboard")
      .doc(req.params.dashboardId)
      .collection("board")
      .add({
        requested: {
          name: "Stories",
          items: [
            {
              id: "14",
              index: 0,
              name: "Tset",
              desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
              assignedTo: [],
              labels: [],
            },
            {
              id: "15",
              index: 1,
              name: "Do all",
              desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
              assignedTo: [],
              labels: [],
            },
          ],
        },
        acceptance: {
          name: "Critère d'acceptation",
          items: [
            {
              id: "7",
              index: 0,
              name: "Sprint retro",
              desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
              assignedTo: [],
              labels: [],
            },
            {
              id: "8",
              index: 1,
              name: "Sprint retro",
              desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
              assignedTo: [],
              labels: [],
            },
            {
              id: "9",
              index: 2,
              name: "Sprint retro",
              desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
              assignedTo: [],
              labels: [],
            },
            {
              id: "10",
              index: 3,
              name: "Sprint retro",
              desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
              assignedTo: [],
              labels: [],
            },
          ],
        },

        toDo: {
          name: "To Do",
          items: [
            {
              id: "1",
              index: 0,
              name: "Board EduScrum",
              desc: "",
              assignedTo: [
                {
                  id: "1",
                  name: "John Doe",
                  photo: "https://picsum.photos/500/300?random=45",
                },
                {
                  id: "2",
                  name: "Jane Smith",
                  photo: "https://picsum.photos/500/300?random=67",
                },
                { id: "3", name: "Bob Johnson", photo: "https://picsum.photos/500/300?random=89" },
              ],
              labels: ["Urgent", "Fix", "Feature"],
            },
            {
              id: "2",
              index: 1,
              name: "Création de sprint agile très très long",
              desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
              assignedTo: [
                {
                  id: "3",
                  name: "Bob Johnson",
                  photo: "https://picsum.photos/500/300?random=3",
                },
              ],
              labels: ["Urgent"],
            },
            {
              id: "3",
              index: 2,
              name: "BurnDown chart",
              desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
              assignedTo: [],
              labels: ["Documentation", "Fix"],
            },
            {
              id: "4",
              index: 3,
              name: "Ajout du backlog",
              desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
              assignedTo: [
                {
                  id: "2",
                  name: "Jane Smith",
                  photo: "https://picsum.photos/500/300?random=1",
                },
                {
                  id: "3",
                  name: "Bob Johnson",
                  photo: "https://picsum.photos/500/300?random=2",
                },
              ],
              labels: ["Feature", "Urgent"],
            },
          ],
        },
        inProgress: {
          name: "In progress",
          items: [],
        },
        done: {
          name: "Done",
          items: [],
        },
      });
  });

  app.get("/board/:dashboardId", (req, res) => {
    const data = [];

    var document = db
      .collection("dashboard")
      .doc(req.params.dashboardId)
      .collection("board")
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });
      });
    res.send(data);
  });
};

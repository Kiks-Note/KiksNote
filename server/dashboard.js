module.exports = (app, db, ws, parse) => {
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
        var json = JSON.parse(message.utf8Data);
        var dashboardId = json.dashboardId;
        var boardId = json.boardId;
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

  app.put("/dashboard/:dashboardId/board/:boardId/setCards", async (req, res) => {
    var data = req.body;
    await db
      .collection("dashboard")
      .doc(req.params.dashboardId)
      .collection("board")
      .doc(req.params.boardId)
      .update({ requested: data[0], acceptance: data[1], toDo: data[2], inProgress: data[3], done: data[4] });
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

  app.put("/dashboard/:dashboardId/board/:boardId/column/:columnId/addCard", async (req, res) => {
    const data = req.body;
    await db
      .collection("dashboard")
      .doc(req.params.dashboardId)
      .collection("board")
      .doc(req.params.boardId)
      .onSnapshot((snapshot) => {
        var column = [];
        var columnId = req.params.columnId;
        var higherId = 0;
        for (var col in snapshot.data()) {
          for (var items of snapshot.data()[col].items) {
            if (higherId < items.id) {
              higherId = items.id;
            }
          }
        }
        if (columnId == 0) {
          snapshot.data().requested.items.push({
            id: higherId + 1,
            name: data.title,
            desc: "",
            assignedTo: [],
            labels: [],
          });
        }
        if (columnId == 1) {
          snapshot.data().acceptance.items.push({
            id: higherId + 1,
            name: data.title,
            desc: "",
            assignedTo: [],
            labels: [],
          });
        }
        if (columnId == 2) {
          snapshot.data().toDo.items.push({
            id: higherId + 1,
            name: data.title,
            desc: "",
            assignedTo: [],
            labels: [],
          });
        }
        if (columnId == 3) {
          snapshot.data().inProgress.items.push({
            id: higherId + 1,
            name: data.title,
            desc: "",
            assignedTo: [],
            labels: [],
          });
        }
        if (columnId == 4) {
          snapshot.data().done.items.push({
            id: higherId + 1,
            name: data.title,
            desc: "",
            assignedTo: [],
            labels: [],
          });
        }

        var columns = snapshot.data();
        db.collection("dashboard").doc(req.params.dashboardId).collection("board").doc(req.params.boardId).update({
          requested: columns.requested,
          acceptance: columns.acceptance,
          toDo: columns.toDo,
          inProgress: columns.inProgress,
          done: columns.done,
        });
      });
    res.send({ message: "card created succesfully" });
  });

  app.put("/dashboard/:dashboardId/board/:boardId/column/:columnId/editCard", async (req, res) => {
    const data = req.body;
    const columnId = req.params.columnId;
    console.log("columnId:", columnId);
    try {
      const boardRef = db
        .collection("dashboard")
        .doc(req.params.dashboardId)
        .collection("board")
        .doc(req.params.boardId);
      const boardSnapshot = await boardRef.get();

      const columns = boardSnapshot.data();

      let updatedItems;

      switch (columnId.toString()) {
        case "0":
          updatedItems = updateColumnItems(columns.requested.items, data);
          break;
        case "1":
          updatedItems = updateColumnItems(columns.acceptance.items, data);
          break;
        case "2":
          updatedItems = updateColumnItems(columns.toDo.items, data);
          break;
        case "3":
          updatedItems = updateColumnItems(columns.inProgress.items, data);
          break;
        case "4":
          updatedItems = updateColumnItems(columns.done.items, data);
          break;
        default:
          throw new Error("Invalid column ID");
      }

      await boardRef.update({
        [getColumnField(columnId)]: {
          items: updatedItems,
        },
      });

      console.log("card edited");
      res.send({ message: "Card edited successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "An error occurred while editing the card" });
    }
  });

  function getColumnField(columnId) {
    console.log(columnId);
    switch (columnId.toString()) {
      case "0":
        return "requested";
      case "1":
        return "acceptance";
      case "2":
        return "toDo";
      case "3":
        return "inProgress";
      case "4":
        return "done";
      default:
        throw new Error("Invalid column ID");
    }
  }

  function updateColumnItems(columnItems, updatedItem) {
    return columnItems.map((item) => {
      if (item.id === updatedItem.id) {
        return {
          id: updatedItem.id,
          name: updatedItem.title,
          desc: updatedItem.desc,
          assignedTo: item.assignedTo,
          labels: item.labels,
        };
      } else {
        return item;
      }
    });
  }
};

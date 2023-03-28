module.exports = (app, db, ws, parse) => {
  app.put("/dashboard/:dashboardId/:favorite", async (req, res) => {
    await db.collection("dashboard").doc(req.params.dashboardId).update({ favorite: req.params.favorite });
  });

  app.put("/dashboard/:dashboardId/board/:boardId/setCards", async (req, res) => {
    var data = req.body;
    await db.collection("dashboard").doc(req.params.dashboardId).collection("board").doc(req.params.boardId).update({
      requested: data[0],
      acceptance: data[1],
      toDo: data[2],
      inProgress: data[3],
      done: data[4],
    });
  });

  app.post("/boarde/:dashboardId", async (req, res) => {
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
                {
                  id: "3",
                  name: "Bob Johnson",
                  photo: "https://picsum.photos/500/300?random=89",
                },
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
  /// PATH to add a info card
  app.put("/dashboard/:dashboardId/board/:boardId/column/:columnId/addCard", async (req, res) => {
    try {
      const data = req.body;
      const dashboardRef = db.collection("dashboard").doc(req.params.dashboardId);
      const boardRef = dashboardRef.collection("board").doc(req.params.boardId);
      const snapshot = await boardRef.get();
      const columns = snapshot.data();

      let column;
      let columnName;
      switch (req.params.columnId) {
        case "0":
          column = columns.requested;
          columnName = "requested";
          break;
        case "1":
          column = columns.acceptance;
          columnName = "acceptance";
          break;
        case "2":
          column = columns.toDo;
          columnName = "toDo";
          break;
        case "3":
          column = columns.inProgress;
          columnName = "inProgress";
          break;
        case "4":
          column = columns.done;
          columnName = "done";
          break;
        default:
          res.status(400).send({ message: "Invalid column id" });
          return;
      }

      const cards = column.items || [];
      const highestId = Math.max(...cards.map((card) => card.id), 0);
      const newCard = {
        id: (highestId + 1).toString(),
        name: data.title,
        desc: "",
        assignedTo: [],
        labels: [],
      };
      column.items = [...cards, newCard];

      await boardRef.update({ [columnName]: column });
      res.send({ message: "Card created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  });
  /// PATH to update a info card
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
      var name = "";

      switch (columnId.toString()) {
        case "0":
          updatedItems = setColumnItems(columns.requested.items, data);
          name = "Stories";
          break;
        case "1":
          updatedItems = setColumnItems(columns.acceptance.items, data);
          name = "Critère d'acceptation";
          break;
        case "2":
          updatedItems = setColumnItems(columns.toDo.items, data);
          name = "ToDo";
          break;
        case "3":
          updatedItems = setColumnItems(columns.inProgress.items, data);
          name = "InProgress";
          break;
        case "4":
          updatedItems = setColumnItems(columns.done.items, data);
          name = "Done";
          break;
        default:
          throw new Error("Invalid column ID");
      }

      await boardRef.update({
        [getColumnField(parseInt(columnId))]: {
          items: updatedItems,
          name: name,
        },
      });

      console.log("card edited");
      res.send({ message: "Card edited successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "An error occurred while editing the card" });
    }
  });
  /// PATH to delete a card
  app.delete("/dashboard/:dashboardId/board/:boardId/column/:columnId/card/:cardId", async (req, res) => {
    try {
      const dashboardRef = db.collection("dashboard").doc(req.params.dashboardId);
      const boardRef = dashboardRef.collection("board").doc(req.params.boardId);
      const snapshot = await boardRef.get();
      const columns = snapshot.data();
      let column;
      let columnName;
      switch (req.params.columnId) {
        case "0":
          column = columns.requested;
          columnName = "requested";
          break;
        case "1":
          column = columns.acceptance;
          columnName = "acceptance";
          break;
        case "2":
          column = columns.toDo;
          columnName = "toDo";
          break;
        case "3":
          column = columns.inProgress;
          columnName = "inProgress";
          break;
        case "4":
          column = columns.done;
          columnName = "done";
          break;
        default:
          // Invalid column id
          res.status(400).send({ message: "Invalid column id" });
          return;
      }

      const cards = column.items || [];
      const cardIndex = cards.findIndex((card) => {
        if (card.id == req.params.cardId) {
          return card.id;
        }
      });
      if (cardIndex == -1) {
        // Card not found
        res.status(404).send({ message: "Card not found" });
        return;
      }

      column.items = cards.filter((card) => card.id != parseInt(req.params.cardId));
      await boardRef.update({ [columnName]: column });

      // Card deleted successfully
      res.status(204).send({ message: "Card deleted successfully" });
      console.log("Card deleted successfully");
    } catch (error) {
      console.error(error);
      // Server error
      res.status(500).send({ message: "An error occurred while deleting the card" });
    }
  });

  // Getter to Column Field
  function getColumnField(columnId) {
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
  //Setter ColumnItems
  function setColumnItems(columnItems, updatedItem) {
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

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

  app.put("/dashboard/:dashboardId/board/:boardId/linkStory", async (req, res) => {
    var data = req.body;
    console.log(data);
    // await db.collection("dashboard").doc(req.params.dashboardId).collection("board").doc(req.params.boardId).update({
    //   requested: data[0],
    //   acceptance: data[1],
    //   toDo: data[2],
    //   inProgress: data[3],
    //   done: data[4],
    // });
  });

  /// PATH to add a info card
  app.put("/dashboard/:dashboardId/board/:boardId/column/:columnId/addCard", async (req, res) => {
    try {
      const data = req.body;
      const dashboardRef = db.collection("dashboard").doc(req.params.dashboardId);
      const boardRef = dashboardRef.collection("board").doc(req.params.boardId);
      const snapshot = await boardRef.get();
      const columns = snapshot.data();
      const allBoardRef = dashboardRef.collection("board");
      const snapshotAllBoardRef = await allBoardRef.get();
      var highestId = 0;
      var color = getRandomColor();
      snapshotAllBoardRef.forEach((doc) => {
        for (var column in doc.data()) {
          doc.data()[column].items.forEach((card) => {
            if (column == "requested") {
              while (card.color == color) {
                color = getRandomColor();
              }
            }
            if (parseInt(highestId) < parseInt(card.id)) {
              highestId = card.id;
            }
          });
        }
      });

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

      console.log(highestId);
      const id = (parseInt(highestId) + 2).toString();
      const cards = column.items || [];
      var newCard = {};
      if (columnName == "requested") {
        newCard = {
          id: id,
          name: data.title,
          desc: "",
          assignedTo: [],
          labels: [],
          color: color,
          storyId: id,
        };
      } else {
        newCard = {
          id: id,
          name: data.title,
          desc: "",
          assignedTo: [],
          labels: [],
          color: "#fff",
          storyId: -1,
        };
      }
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
          assignedTo: updatedItem.assignedTo,
          labels: updatedItem.labels,
          color: updatedItem.color,
          storyId: updatedItem.storyId,
        };
      } else {
        return item;
      }
    });
  }

  app.post("/dashboard/:dashboardId/moveStories", async (req, res) => {
    console.log("Stories moving");
    try {
      const dashboardRef = db.collection("dashboard").doc(req.params.dashboardId);
      var storiesToMove = { name: "Stories", items: [] };
      const boards = dashboardRef.collection("board");
      const snapshotSource = await boards.get();
      await snapshotSource.forEach(async (board) => {
        var storiesToKeep = { name: "Stories", items: [] };
        board.data().requested.items.forEach((story) => {
          if (req.body.storiesId.includes(story.id)) {
            storiesToMove.items.push(story);
          } else {
            storiesToKeep.items.push(story);
          }
        });
        for (var column in board.data()) {
          if (column != "requested") {
            cardToMove = { name: column, items: [] };
            cardToKeep = { name: column, items: [] };
            await board.data()[column].items.forEach((card) => {
              if (req.body.storiesId.includes(card.storyId)) {
                cardToMove.items.push(card);
              } else {
                cardToKeep.items.push(card);
              }
            });
            await boards.doc(board.id).update({ [column]: cardToKeep });
            await boards.doc(req.body.boardId).update({ [column]: cardToMove });
          }
        }
        await boards.doc(board.id).update({ ["requested"]: storiesToKeep });
      });
      await boards.doc(req.body.boardId).update({ ["requested"]: storiesToMove });

      console.log("Stories moved");
    } catch (error) {
      console.error("Fuck" + error);
      // Server error
      res.status(500).send({ message: "An error occurred while moving the stories" });
    }
  });
};

const getRandomColor = () => {
  const hexLetters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += hexLetters[Math.floor(Math.random() * 16)];
  }
  return color;
};

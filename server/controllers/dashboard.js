const { db, FieldValue } = require("../firebase");
const moment = require("moment");

// FAVORITE
const favorite = async (req, res) => {
  await db
    .collection("dashboard")
    .doc(req.params.dashboardId)
    .update({ favorite: req.params.favorite });
};

// CHANGE  PUT Index -
const changeIndex = async (req, res) => {
  var data = req.body;
  await db
    .collection("dashboard")
    .doc(req.params.dashboardId)
    .collection("board")
    .doc(req.params.boardId)
    .update({
      requested: data[0],
      acceptance: data[1],
      toDo: data[2],
      inProgress: data[3],
      done: data[4],
    });
};
/// PATH to add a info card
const createCard = async (req, res) => {
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
      case "5":
        column = columns.definitionOfDone;
        columnName = "definitionOfDone";
        break;
      case "6":
        column = columns.definitionOfFun;
        columnName = "definitionOfFun";
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
};
// Move stories
const moveStories = async (req, res) => {
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
    res
      .status(500)
      .send({ message: "An error occurred while moving the stories" });
  }
};
//
const createDashboards = async (req, res) => {
  console.log("Creating dashboard...");
  try {
    const dashboardRef = await createDashboard(req.body);

    const releases = await createReleases(
      req.body.starting_date,
      req.body.ending_date,
      dashboardRef
    );
    console.log(releases);
    dashboardRef.update({ release: JSON.parse(JSON.stringify(releases)) });

    const batch = db.batch();
    const labels = [
      { name: "Urgent", color: "#FF4136" },
      { name: "Correction", color: "#9FE2BF" },
      { name: "Important", color: "#AA4A44" },
      { name: "Refactorisation", color: " #2ECC40" },
      { name: "Optimisation", color: "#FF851B" },
      { name: "Refonte", color: "#39CCCC" },
      { name: "Incomplet", color: "#FFDC00" },
      { name: "Nouveau", color: "#B10DC9" },
      { name: "Tâche technique", color: "#0074D9" },
      { name: "Recherche ", color: " #008080" },
    ];
    const labelsRef = dashboardRef.collection("labels");
    labels.forEach((label) => {
      batch.set(labelsRef.doc(), label);
    });
    await batch.commit();

    res.status(200).send({
      message: "Dashboard created successfully",
      id: dashboardRef.id,
    });
    console.log("Dashboard created successfully");
  } catch (error) {
    console.error("Error creating dashboard", error);
    res
      .status(500)
      .send({ message: "An error occurred while creating the dashboard" });
  }
};
//PATH to create stories
const createStory = async (req, res) => {
  try {
    const { dashboardId } = req.params;

    const dashboardRef = db.collection("dashboard").doc(dashboardId);
    // Vérifier que le document existe
    const dashboard = await dashboardRef.get();
    if (!dashboard.exists) {
      return res.status(404).send("Le dashboard spécifié n'existe pas.");
    }

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
    console.log(highestId);
    const id = (parseInt(highestId) + 2).toString();
    newCard = {
      id: id,
      name: req.body.name,
      desc: req.body.desc,
      assignedTo: [],
      labels: [],
      color: color,
      storyId: id,
    };
    // Ajouter la nouvelle histoire à la collection "stories" du document "dashboard"
    const storiesRef = dashboardRef.collection("stories");
    const result = await storiesRef.add(newCard);

    // Retourner la réponse avec l'ID de la nouvelle histoire créée
    res.status(201).send({ id: result.id });
  } catch (error) {
    console.error("Erreur lors de la création d'une histoire:", error);
    res.status(500).send("Erreur lors de la création d'une histoire.");
  }
};
/// PATH to update a info card
const editCard = async (req, res) => {
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
};
/// PATH to delete a card
const deleteCard = async (req, res) => {
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
    console.log(cardIndex);
    if (cardIndex == -1) {
      // Card not found
      res.status(404).send({ message: "Card not found" });
      return;
    }

    column.items = cards.filter(
      (card) => card.id != parseInt(req.params.cardId)
    );
    await boardRef.update({ [columnName]: column });

    // Card deleted successfully
    res.status(204).send({ message: "Card deleted successfully" });
    console.log("Card deleted successfully");
  } catch (error) {
    console.error(error);
    // Server error
    res
      .status(500)
      .send({ message: "An error occurred while deleting the card" });
  }
};

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

async function createReleases(startingDate, endingDate, dashboardRef) {
  const releaseDuration = 28; // 4 weeks
  const sprintDuration = 7; // 1 week
  const releaseCount = Math.ceil(
    moment(endingDate).diff(moment(startingDate), "days") / releaseDuration
  );

  const releases = {};
  for (let i = 0; i < releaseCount; i++) {
    const releaseStart = moment(startingDate)
      .add(i * releaseDuration, "days")
      .toDate();
    const releaseEnd = moment(releaseStart)
      .add(releaseDuration, "days")
      .toDate();
    const sprints = await createSprints(
      releaseStart,
      releaseEnd,
      sprintDuration,
      dashboardRef
    );
    releases[`Release ${i + 1}`] = sprints;
  }
  await Promise.all(Object.values(releases));
  return releases;
}

async function createSprints(
  releaseStart,
  releaseEnd,
  sprintDuration,
  dashboardRef
) {
  const sprintCount = Math.ceil(
    moment(releaseEnd).diff(moment(releaseStart), "days") / sprintDuration
  );
  const sprints = [];
  for (let i = 0; i < sprintCount; i++) {
    const boardRef = await dashboardRef.collection("board").add({
      requested: { name: "Stories", items: [] },
      acceptance: { name: "Critère d'acceptation", items: [] },
      toDo: { name: "To Do", items: [] },
      inProgress: { name: "In progress", items: [] },
      done: { name: "Done", items: [] },
      definitionOfDone: { name: "DoD", items: [] },
      definitionOfFun: { name: "DoF", items: [] },
    });

    const boardId = boardRef.id;
    const sprintStart = moment(releaseStart)
      .add(i * sprintDuration, "days")
      .toDate();
    const sprintEnd = moment(sprintStart).add(sprintDuration, "days").toDate();
    sprints.push({
      name: `Sprint ${i + 1}`,
      starting_date: moment(sprintStart),
      ending_date: moment(sprintEnd),
      boardId: boardId,
    });
  }
  return sprints;
}

async function createDashboard(body) {
  const dashboardRef = await db.collection("dashboard").add({
    students: body.students,
    starting_date: moment(body.starting_date),
    ending_date: moment(body.ending_date),
    favorite: false,
    group_name: body.group_name,
    sprint_name: body.sprint_name,
    image: "https://picsum.photos/600",
    pdf_link: "",
  });
  return dashboardRef;
}

const getRandomColor = () => {
  const hexLetters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += hexLetters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const dashboardRequests = async ( connection) => {
     connection.on("message", async (message) => {
       const studentId = JSON.parse(message.utf8Data);
       groups = [];

       await db
         .collection("groups")
         .where("students", "array-contains", studentId)
         .onSnapshot((snapshot) => {
           snapshot.forEach((doc) => {
             groups.push({ id: doc.id, data: doc.data() });
           });
         });
       db.collection("dashboard").onSnapshot(
         (snapshot) => {
           const data = [];
           addDashboard(groups, studentId, db);
           snapshot.forEach((doc) => {
             doc.data().students?.forEach((student) => {
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
};

const boardRequests = async ( connection) => {
   connection.on("message", (message) => {
     var json = JSON.parse(message.utf8Data);
     var dashboardId = json.dashboardId;
     var boardId = json.boardId;

     // Variables pour stocker les informations récupérées
     var labelsData = [];
     var boardData = [];
     var nameBoard = "";

     // Récupérer les données des labels
     db.collection("dashboard")
       .doc(dashboardId)
       .collection("labels")
       .get()
       .then((querySnapshot) => {
         querySnapshot.forEach((doc) => {
           labelsData.push({
             id: doc.id,
             name: doc.data().name,
             color: doc.data().color,
           });
         });
         db.collection("dashboard")
           .doc(dashboardId)
           .get()
           .then((querySnapshot) => {
             const dashboardData = querySnapshot.data();
             Object.keys(dashboardData.release).forEach((releaseKey) => {
               const releaseSprints = dashboardData.release[releaseKey];
               releaseSprints.forEach((sprint) => {
                 if (sprint.boardId === boardId) {
                   nameBoard = sprint.name;
                 }
               });
             });
           })
           .catch((error) => {
             console.error("Error getting dashboard data:", error);
           });
         // Récupérer les données du board
         db.collection("dashboard")
           .doc(dashboardId)
           .collection("board")
           .doc(boardId)
           .onSnapshot(
             (snapshot) => {
               const data = snapshot.data();
               boardData = [
                 data.requested,
                 data.acceptance,
                 data.toDo,
                 data.inProgress,
                 data.done,
                 data.definitionOfDone,
                 data.definitionOfFun,
               ];

               // Envoyer les données récupérées
               const responseData = {
                 labels: labelsData,
                 board: boardData,
                 name: nameBoard,
               };
               connection.sendUTF(JSON.stringify(responseData));
             },
             (err) => {
               console.log(`Encountered error: ${err}`);
             }
           );
       })
       .catch((error) => {
         console.error(
           "Erreur lors de la récupération de la sous-collection:",
           error
         );
       });
   });
};

const overviewRequests = async ( connection) => {
  connection.on("message", async (message) => {
    var dashboardId = JSON.parse(message.utf8Data);
    var dataReturn = [];

    const dashboardRef = db.collection("dashboard").doc(dashboardId);
    const boardRef = dashboardRef.collection("board");
    const storieRef = dashboardRef.collection("stories");
    const snapshotDashboard = await dashboardRef.get();
    const snapshotBoard = await boardRef.get();
    const snapshotStorie = await storieRef.get();
    const data = snapshotDashboard.data();
    dataReturn.push(data.release);

    var stories = [];
    var boards = [];
    snapshotBoard.forEach((doc) => {
      dataReturn.map((release) => {
        for (var r in release) {
          release[r].map((x) => {
            if (doc.id == x.boardId) {
              boards.push({
                id: doc.id,
                name: r + " / " + x.name,
                data: {
                  toDo: doc.data().toDo.items.length,
                  inProgress: doc.data().inProgress.items.length,
                  done: doc.data().done.items.length,
                },
              });
              stories = stories.concat(doc.data().requested.items);
            }
          });
        }
      });
    });
    snapshotStorie.forEach((doc) => {
      stories.push(doc.data());
    });
    connection.sendUTF(
      JSON.stringify({
        stories: stories,
        release: dataReturn[0],
        boards: boards,
        pdf_link: data.pdf_link,
      })
    );
  });
};

async function addDashboard(groups, studentId, db) {
  const dashboardSnapshot = await db.collection("dashboard").get();

  for (var group of groups) {
    const haveGroupId = dashboardSnapshot.docs.some(
      (doc) => doc.data().groupId === group.id
    );
    if (!haveGroupId) {
      var newDashboard = await db.collection("dashboard").add({
        students: group.data.students,
        groupId: group.id,
        starting_date: group.data.starting_date,
        ending_date: group.data.ending_date,
        favorite: "false",
        group_name: "new dashboard",
        sprint_name: "new sprint",
        image:
          "https://fastly.picsum.photos/id/991/500/300.jpg?hmac=1p97FU0H7zdBmUCEezOKZxNtpCCjzQSQqwvE38ivx40",
        pdf_link: "",
        release: group.data.release,
      });
      release = group.data.release;
      for (var i in release) {
        for (var y in release[i]) {
          var res = await db
            .collection("dashboard")
            .doc(newDashboard.id)
            .collection("board")
            .add({
              requested: {
                name: "Stories",
                items: [],
              },
              acceptance: {
                name: "Critère d'acceptation",
                items: [],
              },
              toDo: {
                name: "To Do",
                items: [],
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
          release[i][y].boardId = res.id;
        }
      }
      db.collection("dashboard")
        .doc(newDashboard.id)
        .update({ release: release });
    }
  }
}
module.exports = {
  changeIndex,
  favorite,
  createCard,
  moveStories,
  createDashboards,
  createStory,
  editCard,
  deleteCard,
  boardRequests,
  dashboardRequests,
  overviewRequests,
};
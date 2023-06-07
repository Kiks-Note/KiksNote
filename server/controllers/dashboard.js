const { db, Timestamp } = require("../firebase");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
// FAVORITE
const favorite = async (req, res) => {
  const { dashboardId } = req.params;

  try {
    // const userId = req.user.uid; // Obtenez l'ID de l'utilisateur connecté à partir de l'objet de requête (après l'authentification)

    // Récupérer le tableau de bord spécifique
    const dashboardRef = db.collection("dashboard").doc(dashboardId);
    const dashboardDoc = await dashboardRef.get();

    const dashboardData = dashboardDoc.data();

    // Inverser la valeur de favori
    const newFavoriteValue = !dashboardData.favorite;

    // Mettre à jour le tableau de bord avec la nouvelle valeur de favori
    await dashboardRef.update({ favorite: newFavoriteValue });

    res.status(200).json({ success: true, favorite: newFavoriteValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Une erreur s'est produite lors de la mise à jour du favori.",
    });
  }
};

// CHANGE  PUT Index -
const changeIndex = async (req, res) => {
  var data = req.body;
  console.log(data);
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
      definitionOfDone: data[5],
      definitionOfFun: data[6],
    });
};
/// PATH to add a info card
const createCard = async (req, res) => {
  try {
    const data = req.body;
    const dashboardRef = db.collection("dashboard").doc(req.params.dashboardId);
    const boardRef = dashboardRef.collection("board").doc(req.params.boardId);
    const boardSnapshot = await dashboardRef.get();
    const { starting_date, ending_date } = boardSnapshot.data();

    const startingDate = new Date(starting_date._seconds * 1000);
    const endingDate = new Date(ending_date._seconds * 1000);
    const totalDays =
      Math.ceil((endingDate - startingDate) / (1000 * 60 * 60 * 24)) + 1;

    const snapshot = await boardRef.get();
    const columns = snapshot.data();
    const allBoardRef = dashboardRef.collection("board");
    const snapshotAllBoardRef = await allBoardRef.get();
    var color = getRandomColor();
    snapshotAllBoardRef.forEach((doc) => {
      for (var column in doc.data()) {
        doc.data()[column].items.forEach((card) => {
          if (column == "requested") {
            while (card.color == color) {
              color = getRandomColor();
            }
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

    const id = uuidv4();
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
    } else if (
      columnName == "toDo" ||
      columnName == "inProgress" ||
      columnName == "done"
    ) {
      newCard = {
        id: id,
        name: data.title,
        desc: "",
        assignedTo: [],
        labels: [],
        color: "#fff",
        storyId: "",
        estimation: data.estimation,
        advancement: Array.from({ length: totalDays }, (_, i) => ({
          day: `Jour ${i}`,
          advance: 0,
          dayNow: new Date(startingDate.getTime() + i * 24 * 60 * 60 * 1000),
        })),
      };
    } else {
      newCard = {
        id: id,
        name: data.title,
        desc: "",
        assignedTo: [],
        labels: [],
        color: "#fff",
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
  try {
    const dashboardRef = db.collection("dashboard").doc(req.params.dashboardId);
    const sourceBoardId = req.params.boardId;
    const destinationBoardId = req.body.boardId;
    const storiesToMove = [];
    const cardsToMove = {};

    // Récupérer les histoires et tâches à déplacer
    const sourceBoardSnapshot = await dashboardRef
      .collection("board")
      .doc(sourceBoardId)
      .get();
    const sourceBoardData = sourceBoardSnapshot.data();
    const requestedItems = sourceBoardData.requested.items;
    const otherColumns = Object.keys(sourceBoardData).filter(
      (column) => column !== "requested"
    );

    requestedItems.forEach((story) => {
      if (req.body.storiesId.includes(story.id)) {
        storiesToMove.push(story);
      }
    });

    otherColumns.forEach((column) => {
      cardsToMove[column] = [];
      sourceBoardData[column].items.forEach((card) => {
        if (req.body.storiesId.includes(card.storyId)) {
          cardsToMove[column].push(card);
        }
      });
    });

    // Mettre à jour les tableaux source et destination
    const batch = db.batch();

    // Supprimer les histoires et tâches du tableau source
    const sourceBoardRef = dashboardRef.collection("board").doc(sourceBoardId);
    batch.update(sourceBoardRef, {
      "requested.items": requestedItems.filter(
        (story) => !req.body.storiesId.includes(story.id)
      ),
    });
    otherColumns.forEach((column) => {
      const sourceColumnRef = sourceBoardRef.collection("column").doc(column);
      batch.update(sourceColumnRef, {
        items: sourceBoardData[column].items.filter(
          (card) => !req.body.storiesId.includes(card.storyId)
        ),
      });
    });

    // Ajouter les histoires et tâches dans le tableau de destination
    const destinationBoardRef = dashboardRef
      .collection("board")
      .doc(destinationBoardId);
    const destinationBoardSnapshot = await destinationBoardRef.get();
    const destinationBoardData = destinationBoardSnapshot.data();
    batch.update(destinationBoardRef, {
      "requested.items": [
        ...destinationBoardData.requested.items,
        ...storiesToMove,
      ],
    });
    otherColumns.forEach((column) => {
      const destinationColumnRef = destinationBoardRef
        .collection("column")
        .doc(column);
      batch.update(destinationColumnRef, {
        items: [...destinationBoardData[column].items, ...cardsToMove[column]],
      });
    });

    await batch.commit();

    res.send({ message: "Stories moved successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while moving the stories" });
  }
};

//Path to create Dashboard
const createDashboards = async (req, res) => {
  try {
    const dashboardRef = await createDashboard(req.body, true);
    const releases = await createReleases(
      req.body.starting_date,
      req.body.ending_date,
      dashboardRef
    );

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

    const agileRef = dashboardRef.collection("agile");
    await agileRef.doc("impact_mapping").set({
      goals: [],
      actors: [],
      impacts: [],
      deliverables: [],
    });
    await agileRef.doc("agile_folder").set({
      impact_mapping: "",
      empathy_map: "",
      personas: [],
      three: "",
      elevator_pitch: "",
    });
    await batch.commit();

    res.status(200).send({
      message: "Dashboard created successfully",
      id: dashboardRef.id,
    });
  } catch (error) {
    console.error("Error creating dashboard", error);
    res
      .status(500)
      .send({ message: "An error occurred while creating the dashboard" });
  }
};
//Path to delete a dashboard
const deleteDashboard = async (req, res) => {
  const { dashboardId } = req.params;

  try {
    // Vérifier si le tableau de bord existe
    const dashboardRef = db.collection("dashboard").doc(dashboardId);
    const dashboardDoc = await dashboardRef.get();
    if (!dashboardDoc.exists) {
      res.status(404).json({
        success: false,
        error: "Le tableau de bord spécifié n'existe pas.",
      });
      return;
    }

    // Supprimer le tableau de bord
    await dashboardRef.delete();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error:
        "Une erreur s'est produite lors de la suppression du tableau de bord.",
    });
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
    var color = getRandomColor();
    snapshotAllBoardRef.forEach((doc) => {
      for (var column in doc.data()) {
        doc.data()[column].items.forEach((card) => {
          if (column == "requested") {
            while (card.color == color) {
              color = getRandomColor();
            }
          }
        });
      }
    });
    const id = uuidv4();
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
        updatedItems = setColumnItems(columns.requested.items, data, false);
        name = "Stories";
        break;
      case "1":
        updatedItems = setColumnItems(columns.acceptance.items, data, false);
        name = "Critère d'acceptation";
        break;
      case "2":
        updatedItems = setColumnItems(columns.toDo.items, data, true);
        name = "ToDo";
        break;
      case "3":
        updatedItems = setColumnItems(columns.inProgress.items, data, true);
        name = "InProgress";
        break;
      case "4":
        updatedItems = setColumnItems(columns.done.items, data, true);
        name = "Done";
        break;
      case "5":
        updatedItems = setColumnItems(columns.done.items, data, false);
        name = "DoD";
        break;
      case "6":
        updatedItems = setColumnItems(columns.done.items, data, false);
        name = "DoF";
        break;
      default:
        throw new Error("Invalid column ID");
    }

    const updateData = {
      [getColumnField(parseInt(columnId))]: {
        items: updatedItems,
        name: name,
      },
    };

    // Check if estimation is defined before adding it to the update data
    if (data.estimation !== undefined) {
      updateData[getColumnField(parseInt(columnId))].items[0].estimation =
        data.estimation;
    }

    await boardRef.update(updateData);

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
      case "5":
        column = columns.definitionOfDone;
        columnName = "definitionOfDone";
        break;
      case "6":
        column = columns.definitionOfFun;
        columnName = "definitionOfFun";
        break;
      default:
        // Invalid column id
        res.status(400).send({ message: "Invalid column id" });
        return;
    }

    const cards = column.items || [];
    const cardIndex = cards.findIndex((card) => {
      if (card.id == req.params.cardId) {
        console.log(card.id);
        return card.id;
      }
    });
    console.log(cardIndex);
    if (cardIndex == -1) {
      // Card not found
      res.status(404).send({ message: "Card not found" });
      return;
    }

    column.items = cards.filter((card) => card.id != req.params.cardId);
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
/// Path to addUserToStory
const addUsersToStory = async (req, res) => {
  try {
    const dashboardId = req.params.dashboardId;
    const boardId = req.params.boardId;
    const storyId = req.params.storyId;
    const userIds = req.body.userIds;
    const columnId = req.params.columnId;
    const dashboardRef = db.collection("dashboard").doc(dashboardId);
    const boardRef = dashboardRef.collection("board").doc(boardId);

    // Récupérer le tableau et l'histoire
    const boardSnapshot = await boardRef.get();
    const boardData = boardSnapshot.data();

    // Trouver la colonne en fonction de columnId
    const columnField = getColumnField(parseInt(columnId));

    // Trouver l'histoire dans la colonne
    const storyIndex = boardData[columnField].items.findIndex(
      (story) => story.id === storyId
    );

    if (storyIndex === -1) {
      res.status(404).send({ message: "Story not found" });
      return;
    }

    const story = boardData[columnField].items[storyIndex];

    // Ajouter les utilisateurs à la liste assignedTo
    userIds.forEach((userId) => {
      if (!story.assignedTo.includes(userId)) {
        story.assignedTo.push(userId);
      }
    });

    // Mettre à jour l'histoire dans la colonne
    boardData[columnField].items[storyIndex] = story;
    await boardRef.update({
      [`${columnField}.items`]: boardData[columnField].items,
    });

    res.send({ message: "Users added to the story successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "An error occurred while adding the users to the story",
    });
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
    case "5":
      return "definitionOfDone";
    case "6":
      return "definitionOfFun";
    default:
      throw new Error("Invalid column ID");
  }
}
//Setter ColumnItems
function setColumnItems(
  columnItems,
  updatedItem,
  includeEstimationAndAdvancement
) {
  return columnItems.map((item) => {
    if (item.id === updatedItem.id) {
      const newItem = {
        id: updatedItem.id,
        name: updatedItem.title,
        desc: updatedItem.desc,
        assignedTo: updatedItem.assignedTo,
        labels: updatedItem.labels,
        color: updatedItem.color,
        storyId: updatedItem.storyId,
      };

      if (includeEstimationAndAdvancement) {
        console.log(updatedItem.estimation);
        console.log(updatedItem.advancement);

        newItem.estimation = updatedItem.estimation;
        newItem.advancement = updatedItem.advancement;
      }

      return newItem;
    } else {
      return item;
    }
  });
}
///Path to create Releases
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
    const releaseEnd = moment(endingDate).toDate();

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
///Path to create Sprints
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
    let sprintEnd = moment(sprintStart).add(sprintDuration, "days").toDate();

    // Vérification pour s'assurer que sprintEnd n'est pas plus grand que releaseEnd
    if (sprintEnd > releaseEnd) {
      sprintEnd = releaseEnd;
    }

    sprints.push({
      name: `Sprint ${i + 1}`,
      starting_date: sprintStart,
      ending_date: sprintEnd,
      boardId: boardId,
    });
  }

  return sprints;
}
///Path to create Dashboard
async function createDashboard(body, bool) {
  var dashboardRef;
  if (bool) {
    dashboardRef = await db.collection("dashboard").add({
      students: body.students,
      starting_date: moment(body.starting_date),
      ending_date: moment(body.ending_date),
      favorite: false,
      group_name: body.group_name,
      sprint_name: body.sprint_name,
      image: "https://picsum.photos/600",
      pdf_link: "",
      groupId: body.groupId,
      created_by: body.created_by,
    });
  } else {
    dashboardRef = await db.collection("dashboard").add({
      students: body.students,
      starting_date: body.starting_date,
      ending_date: body.ending_date,
      favorite: false,
      group_name: body.group_name,
      sprint_name: body.sprint_name,
      image: "https://picsum.photos/600",
      pdf_link: "",
      groupId: body.groupId,
      created_by: body.po_id,
    });
  }

  return dashboardRef;
}
/// Function to have randomColor
const getRandomColor = () => {
  const hexLetters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += hexLetters[Math.floor(Math.random() * 16)];
  }
  return color;
};
/// Path to Websocket 
const dashboardRequests = async (connection) => {
  connection.on("message", async (message) => {
    console.log(message);
    const user = JSON.parse(message.utf8Data);
    groups = [];

    if (user.status === "etudiant") {
      db
        .collection("groups")
        .where("students", "array-contains", user.id)
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            groups.push({ id: doc.id, data: doc.data() });
          });
        });
    } else if (user.status === "po") {
      db
        .collection("groups")
        .where("po_id", "==", user.id)
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            groups.push({ id: doc.id, data: doc.data() });
          });
        });
    }

    db.collection("dashboard").onSnapshot(
      (snapshot) => {
        const data = [];
        addDashboard(groups, db);
        snapshot.forEach((doc) => {
          if (user.status === "etudiant") {
            doc.data().students?.forEach((student) => {
              if (student == user.id) {
                data.push({ ...doc.data(), id: doc.id });
              }
            });
          } else if (user.status === "po") {
            if (doc.data().created_by == user.id) {
              data.push({ ...doc.data(), id: doc.id });
            }
          } else {
            data.push({ ...doc.data(), id: doc.id });
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

const boardRequests = async (connection) => {
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

const overviewRequests = async (connection) => {
  connection.on("message", async (message) => {
    var dashboardId = JSON.parse(message.utf8Data);
    var dataReturn = [];

    const dashboardRef = db.collection("dashboard").doc(dashboardId);
    const boardRef = dashboardRef.collection("board");
    const storieRef = dashboardRef.collection("stories");
    const agileRef = dashboardRef.collection("agile");
    const snapshotDashboard = await dashboardRef.get();
    const snapshotBoard = await boardRef.get();
    const snapshotStorie = await storieRef.get();
    const snapshotAgile = await agileRef.get();

    const data = snapshotDashboard.data();
    dataReturn.push(data.release);

    var stories = [];
    var boards = [];
    var agile = [];
    snapshotBoard.forEach((doc) => {
      dataReturn.map((release) => {
        for (var r in release) {
          release[r].map((x) => {
            if (doc.id === x.boardId) {
              const toDoItems = doc.data().toDo.items;
              const inProgressItems = doc.data().inProgress.items;
              const doneItems = doc.data().done.items;
              const end = new Date(x.ending_date);
              const start = new Date(x.starting_date);

              const board = {
                id: doc.id,
                name: r + " / " + x.name,
                ending_date: end,
                starting_date: start,
                data: {
                  toDo: {
                    count: toDoItems.length,
                    items: toDoItems,
                  },
                  inProgress: {
                    count: inProgressItems.length,
                    items: inProgressItems,
                  },
                  done: {
                    count: doneItems.length,
                    items: doneItems,
                  },
                },
              };

              boards.push(board);
              stories = stories.concat(doc.data().requested.items);
            }
          });
        }
      });
    });
    snapshotStorie.forEach((doc) => {
      stories.push(doc.data());
    });
    snapshotAgile.forEach((doc) => {
      agile.push({ id: doc.id, ...doc.data() });
    });
    connection.sendUTF(
      JSON.stringify({
        stories: stories,
        release: dataReturn[0],
        boards: boards,
        pdf_link: data.pdf_link,
        agile: agile,
      })
    );
  });
};
/// Function to addDashboard
async function addDashboard(groups, db) {
  const dashboardSnapshot = await db.collection("dashboard").get();

  for (const group of groups) {
    const haveGroupId = dashboardSnapshot.docs.some(
      (doc) => doc.data().groupId === group.id
    );
    if (!haveGroupId) {
      var body = {
        students: group.data.students,
        groupId: group.id,
        group_name: "Groupe de Travail",
        sprint_name: "Cours",
        starting_date: group.data.start_date,
        ending_date: group.data.end_date,
        po_id: group.data.po_id,
      };
      console.log(body);
      const dashboardRef = await createDashboard(body, false);

      const startingDate = new Date(
        body.starting_date._seconds * 1000 +
          body.starting_date._nanoseconds / 1000000
      )
        .toLocaleDateString("fr")
        .split("/")
        .reverse()
        .join("-");

      const endingDate = new Date(
        body.ending_date._seconds * 1000 +
          body.ending_date._nanoseconds / 1000000
      )
        .toLocaleDateString("fr")
        .split("/")
        .reverse()
        .join("-");
      const releases = await createReleases(
        startingDate,
        endingDate,
        dashboardRef
      );

      dashboardRef.update({ release: JSON.parse(JSON.stringify(releases)) });
      // Add labels collection creation
      const labelsRef = dashboardRef.collection("labels");
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
      for (const label of labels) {
        await labelsRef.add(label);
      }

      const agileRef = dashboardRef.collection("agile");
      await agileRef.doc("impact_mapping").set({
        goals: [],
        actors: [],
        impacts: [],
        deliverables: [],
      });
      await agileRef.doc("elevator_pitch").set({
        name: "",
        description:""
      });
      await agileRef.doc("agile_folder").set({
        impact_mapping: "",
        empathy_map: "",
        personas: [],
        three: "",
        elevator_pitch: "",
      });
    }
  }
}

module.exports = {
  changeIndex,
  favorite,
  createCard,
  moveStories,
  createDashboards,
  deleteDashboard,
  createStory,
  editCard,
  deleteCard,
  addUsersToStory,
  boardRequests,
  dashboardRequests,
  overviewRequests,
};

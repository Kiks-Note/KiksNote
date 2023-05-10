module.exports = (app, db, connection, pathname) => {
  if (pathname === "/dashboard") {
    console.log("je suis dans /dashboard");

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
  }
  if (pathname === "/board") {
    console.log("je suis dans /board");
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
  }
  if (pathname === "/overview") {
    console.log("je suis dans /overview");
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
  }
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

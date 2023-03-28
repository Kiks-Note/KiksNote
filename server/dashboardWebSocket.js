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
          var add = true;
          addDashboard(groups, studentId, db);
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
  if (pathname === "/overview") {
    console.log("je suis dans /overview");
    connection.on("message", async (message) => {
      var dashboardId = JSON.parse(message.utf8Data);
      var dataReturn = [];
      var res = await db
        .collection("dashboard")
        .doc(dashboardId)
        .onSnapshot(
          (snapshot) => {
            const data = snapshot.data();
            dataReturn.push(data.release);
          },
          (err) => {
            console.log(`Encountered error: ${err}`);
          }
        );
      var wait = await db
        .collection("dashboard")
        .doc(dashboardId)
        .collection("board")
        .onSnapshot(
          (snapshot) => {
            var boards = [];
            snapshot.forEach((doc) => {
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
                    }
                  });
                }
              });
            });
            connection.sendUTF(JSON.stringify({ release: dataReturn[0], boards: boards }));
          },
          (err) => {
            console.log(`Encountered error: ${err}`);
          }
        );
    });
  }
};

async function addDashboard(groups, studentId, db) {
  const dashboardSnapshot = await db.collection("dashboard").get();

  for (var group of groups) {
    const haveGroupId = dashboardSnapshot.docs.some((doc) => doc.data().groupId === group.id);
    if (!haveGroupId) {
      var newDashboard = await db.collection("dashboard").add({
        students: group.data.students,
        groupId: group.id,
        starting_date: group.data.starting_date,
        ending_date: group.data.ending_date,
        favorite: "false",
        group_name: "new dashboard",
        sprint_name: "new sprint",
        image: "https://fastly.picsum.photos/id/991/500/300.jpg?hmac=1p97FU0H7zdBmUCEezOKZxNtpCCjzQSQqwvE38ivx40",
        pdf_link: "link",
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
      db.collection("dashboard").doc(newDashboard.id).update({ release: release });
    }
  }
}

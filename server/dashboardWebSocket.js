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
          addDashboard(groups, db);
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
};

async function addDashboard(groups, db) {
  const dashboardSnapshot = await db.collection("dashboard").get();

  for (var group of groups) {
    const haveGroupId = dashboardSnapshot.docs.some((doc) => doc.data().groupId === group.id);
    if (!haveGroupId) {
      db.collection("dashboard").add({
        students: group.data.students,
        groupId: group.id,
        starting_date: group.data.starting_date,
        ending_date: group.data.ending_date,
        favorite: "false",
        group_name: "new dashboard",
        sprint_name: "new sprint",
        image: "https://fastly.picsum.photos/id/991/500/300.jpg?hmac=1p97FU0H7zdBmUCEezOKZxNtpCCjzQSQqwvE38ivx40",
        pdf_link: "link",
      });
    }
  }
}

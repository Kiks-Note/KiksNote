module.exports = (app, db, connection, pathname) => {
  if (pathname === "/calendar/student") {
    console.log("je suis dans /calendar/student");

    connection.on("message", async (message) => {
      console.log(message.utf8Data);
      const className = JSON.parse(message.utf8Data);
      db.collection("calendar")
        .where("class", "==", className)
        .get()
        .then((querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            data.push({ ...doc.data(), id: doc.id });
          });
          connection.sendUTF(JSON.stringify(data));
        })
        .catch((error) => {
          console.log(`Encountered error: ${error}`);
        });
    });
  }
  if (pathname === "/calendar/instructor") {
    console.log("je suis dans /calendar/instructor");

    connection.on("message", async (message) => {
      console.log(message.utf8Data);
      const instructorUid = JSON.parse(message.utf8Data);

      db.collection("calendar")
        .get()
        .then((querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            const calendarData = doc.data();
            if (
              calendarData.instructor.some(
                (instructor) => instructor.uid === instructorUid
              )
            ) {
              data.push({ ...calendarData, id: doc.id });
            }
          });
          connection.sendUTF(JSON.stringify(data));
        })
        .catch((error) => {
          console.log(`Encountered error: ${error}`);
        });
    });
  }
  if (pathname === "/calendar/pedago") {
    console.log("je suis dans /calendar/pedago");
    db.collection("class")
      .get()
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        connection.sendUTF(JSON.stringify(data));
      })
      .catch((error) => {
        console.log(`Encountered error: ${error}`);
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
      db.collection("dashboard")
        .doc(newDashboard.id)
        .update({ release: release });
    }
  }
}

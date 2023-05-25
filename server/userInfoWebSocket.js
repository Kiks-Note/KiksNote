module.exports = (app, db, connection, pathname) => {
  //API for getting users' info from db
  if (pathname === "/profil") {
    console.log("je suis dans /profil");

    connection.on("message", (message) => {
      console.log("message => ", message);
      console.log("message.utf8Data => ", message.utf8Data);
      const studentId = JSON.parse(message.utf8Data);
      console.log(studentId + "c'est moi ");
      db.collection("users")
        .doc(studentId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            connection.sendUTF(JSON.stringify(doc.data()));
          } else {
            connection.sendUTF(JSON.stringify({ error: "User not found" }));
          }
        })
        .catch((err) => {
          console.log(`Encountered error: ${err}`);
          connection.sendUTF(
            JSON.stringify({ error: "Error getting user data" })
          );
        });
    });
  }
};

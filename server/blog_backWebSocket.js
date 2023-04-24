module.exports = (app, pathname, db, connection) => {
  if (pathname === "/blog") {
    console.log("je suis dans blog");
    db.collection("blog_evenements").onSnapshot(
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        connection.sendUTF(JSON.stringify(documents));
      },
      (err) => {
        console.log(err);
      }
    );
  }
  if (pathname === "/tuto") {
    console.log("je suis dans tuto");
    db.collection("blog_tutos").onSnapshot(
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        connection.sendUTF(JSON.stringify(documents));
      },
      (err) => {
        console.log(err);
      }
    );
  }
  if (pathname === "/tutos/comments") {
    console.log("je suis dans /tutos/comments");

    connection.on("message", (message) => {
      console.log("message => ", message);
      console.log("message.utf8Data => ", message.utf8Data);
      const docId = JSON.parse(message.utf8Data);
      db.collection("blog_tutos")
        .doc(docId)
        .collection("comment")
        .onSnapshot((snapshot) => {
          const documents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          connection.sendUTF(JSON.stringify(documents));
        });
    });
  }
};

module.exports = (app, pathname, db, connection, upload, path, fs) => {
  //API for getting users' info from db

  if (pathname === "/profil") {
    console.log("je suis dans /profile");

    connection.on("message", (message) => {
      console.log("message => ", message);
      console.log("message.utf8Data => ", message.utf8Data);
      const studentId = JSON.parse(message.utf8Data);
      console.log(studentId);
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

  app.put("/profil/:userId", upload.single("image"), async (req, res) => {
    const userId = req.params.userId;
    const url = req.protocol + "://" + req.get("host") + "/";
    let imageUrlToDelete = "";
    let image = req.file ? req.file.path : "";
    let imageTmp = req.file ? url + req.file.path : "";
    // Check if the user already has an image
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();
    if (userData.image && imageTmp !== userData.image) {
      imageUrlToDelete = userData.image.replace(
        req.protocol + "://" + req.get("host") + "/uploads",
        ""
      );
    }

    // Add the new image URL to userDataToUpdate
    const userDataToUpdate = {
      ...req.body,
      dateofbirth: new Date(req.body.dateofbirth),
      image: image ? url + image : userData.image,
      programmationLanguage: createProgrammingLanguageArray(
        req.body.programmationLanguage
      ),
    };

    // Update user data in Firestore
    db.collection("users")
      .doc(userId)
      .update(userDataToUpdate)
      .then(() => {
        // If the user had an image and the image was changed, delete the old image from the "uploads" folder
        if (imageUrlToDelete && imageTmp && imageTmp !== userData.image) {
          const imagePath = path.join(__dirname, "uploads", imageUrlToDelete);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }

        res.send("User data updated successfully.");
      })
      .catch((err) => {
        console.log(err);
        res.send("Error updating user data.");
      });
  });
  app.put(
    "/profil/background/:userId",
    upload.single("image"),
    async (req, res) => {
      const userId = req.params.userId;
      const url = req.protocol + "://" + req.get("host") + "/";
      let imageUrlToDelete = "";
      let imagebackground = req.file ? req.file.path : "";
      let imagebackgroundTmp = req.file ? url + req.file.path : "";
      // Check if the user already has an image
      const userDoc = await db.collection("users").doc(userId).get();
      const userData = userDoc.data();
      if (
        userData.imagebackground &&
        imagebackgroundTmp !== userData.imagebackground
      ) {
        imageUrlToDelete = userData.imagebackground.replace(
          req.protocol + "://" + req.get("host") + "/uploads",
          ""
        );
      }

      // Add the new image URL to userDataToUpdate
      const userDataToUpdate = {
        imagebackground: imagebackground
          ? url + imagebackground
          : userData.imagebackground,
      };

      // Update user data in Firestore
      db.collection("users")
        .doc(userId)
        .update(userDataToUpdate)
        .then(() => {
          // If the user had an image and the image was changed, delete the old image from the "uploads" folder
          if (
            imageUrlToDelete &&
            imagebackgroundTmp &&
            imagebackgroundTmp !== userData.imagebackground
          ) {
            const imagePath = path.join(__dirname, "uploads", imageUrlToDelete);
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.log(err);
              }
            });
          }

          res.send("User data updated successfully.");
        })
        .catch((err) => {
          console.log(err);
          res.send("Error updating user data.");
        });
    }
  );
  app.get("/members", (req, res) => {
    db.collection("users")
      .where("status", "==", "étudiant")
      .get()
      .then((snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
          console.log(doc);
          const data = doc.data();
          const user = {
            uid: doc.id,
            firstname: data.firstname,
            lastname: data.lastname,
            image: data.image,
          };
          users.push(user);
        });
        res.send(users);
      })
      .catch((err) => {
        console.log(err);
        res.send("Error fetching users.");
      });
  });

  function createProgrammingLanguageArray(programmingLanguageString) {
    return programmingLanguageString.split(",");
  }
};

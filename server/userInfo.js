module.exports = (app, db, upload, path, fs) => {
  //API for getting users' info from db
  app.put("/profil/:userId", upload.single("image"), async (req, res) => {
    const userId = req.params.userId;
    console.log("userId" + userId);
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
    console.log("userDataToUpdate:", userDataToUpdate);

    // Update user data in Firestore
    db.collection("users")
      .doc(userId)
      .update(userDataToUpdate)
      .then(() => {
        console.log("User data updated successfully.");
        // If the user had an image and the image was changed, delete the old image from the "uploads" folder
        if (imageUrlToDelete && imageTmp && imageTmp !== userData.image) {
          const imagePath = path.join(__dirname, "uploads", imageUrlToDelete);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.log("Error deleting image:", err);
            } else {
              console.log("Image deleted successfully:", imagePath);
            }
          });
        }

        res.send("User data updated successfully.");
      })
      .catch((err) => {
        console.log("Error updating user data:", err);
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

  function createProgrammingLanguageArray(programmingLanguageString) {
    return programmingLanguageString.split(",");
  }
};

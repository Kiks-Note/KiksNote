const {db, FieldValue} = require("../firebase");
const fs = require("fs");
const path = require("path");

const updateProfil = async (req, res) => {
  const {userId} = req.params;
  // Vérifier que `userId` est une chaîne non vide
  if (!userId) {
    throw new Error("Invalid userId" + userId);
  }
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

  // Update user data in Firestore
  db.collection("users")
    .doc(userId)
    .update({
      description: req.body.description,
      phone: req.body.phone,
      programmationLanguage: createProgrammingLanguageArray(
        req.body.programmationLanguage
      ),
      git: req.body.git,
      discord: req.body.discord,
      linkedin: req.body.linkedin,
      company: req.body.company,
      job: req.body.job,
      image: image ? url + image : userData.image,
    })
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
};
const updateBackgroundImage = async (req, res) => {
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
};
const getStudent = async (req, res) => {
  const {userId} = req.params;
  if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }

  db.collection("users")
    .where("status", "==", "etudiant")
    .get()
    .then((snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (doc.id !== userId && doc.data().id !== userId) {
          const student = {
            uid: doc.id,
            firstname: data.firstname,
            lastname: data.lastname,
            image: data.image,
          };
          users.push(student);
        }
      });
      res.send(users);
    })
    .catch((err) => {
      console.log(err);
      res.send("Error fetching users.");
    });
};

const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = userDoc.data();
    res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

function createProgrammingLanguageArray(programmingLanguageString) {
  return programmingLanguageString.split(",");
}
const profilRequests = async (connection) => {
  connection.on("message", (message) => {
    const studentId = JSON.parse(message.utf8Data);

    const docRef = db.collection("users").doc(studentId);

    docRef.onSnapshot(
      (snapshot) => {
        if (snapshot.exists) {
          connection.sendUTF(JSON.stringify(snapshot.data()));
        } else {
          console.log("User not found");
        }
      },
      (error) => {
        console.log(`Encountered error: ${error}`);
      }
    );
  });
};

module.exports = {
  updateProfil,
  updateBackgroundImage,
  getStudent,
  profilRequests,
};

const { db, FieldValue, storageFirebase } = require("../firebase");
const { parse } = require("url");
const moment = require("moment");
const multer = require("multer");
const fs = require("fs");
const mime = require("mime-types");
const bucket = storageFirebase.bucket();
const path = require("path");

const DIR = "./uploads";

// Vérifier et créer le dossier "uploads" s'il n'existe pas
if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Le fichier doit être un PDF"));
    }
    cb(null, true);
  },
}).single("file");

function isBase64Image(string) {
  const regex = /^data:image\/(png|jpg|jpeg|gif);base64,/i;
  return regex.test(string);
}

const getAllCours = async (req, res) => {
  try {
    const resourcesRef = db.collection("cours");
    const snapshot = await resourcesRef.get();
    const resources = [];
    snapshot.forEach((doc) => {
      resources.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    res.status(200).json({
      cours: resources,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération des cours.");
  }
};

const getCoursesByOwnerId = async (req, res) => {
  try {
    const snapshot = await db.collection("cours").get();
    const courses = [];
    snapshot.forEach((doc) => {
      if (doc.data().owner.id == req.params.ownerid) {
        courses.push({
          id: doc.id,
          ...doc.data()
        });
      }
     
    });
    res.status(200).send(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const getAllClasses = async (req, res) => {
  try {
    const snapshot = await db.collection("class").get();
    const classes = [];
    snapshot.forEach((doc) => {
      classes.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).send(classes);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const getCoursById = async (req, res) => {
  try {
    const resourceRef = await db.collection("cours").doc(req.params.id).get();
    if (!resourceRef.exists) {
      return res.status(404).send("Cours non trouvé");
    } else {
      return res.status(200).send({
        id: resourceRef.id,
        data: resourceRef.data(),
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération du cours.");
  }
};

const getClassById = async (req, res) => {
  try {
    const classRef = await db.collection("class").doc(req.params.id).get();
    if (!classRef.exists) {
      return res.status(404).send("Classe non trouvée");
    } else {
      return res.status(200).send({
        id: classRef.id,
        data: classRef.data(),
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération de la classe.");
  }
};

const createClass = async (req, res) => {
  const { name, promo, site, cursus } = req.body;

  try {
    const classRef = await db.collection("class").add({
      name: name,
      promo: promo,
      site: site,
      cursus: cursus,
    });
    return res.status(200).send({
      id: classRef.id,
      message: "Classe créée avec succès.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Erreur lors de la création de la classe.");
  }
};

const getInstructors = async (req, res) => {
  try {
    const snapshot = await db
      .collection("users")
      .where("status", "in", ["po", "pedago"])
      .get();
    const users = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération des utilisateurs.");
  }
};

const getInstructorById = async (req, res) => {
  try {
    const instructorRef = await db.collection("users").doc(req.params.id).get();
    if (!instructorRef.exists) {
      return res.status(404).send("Instructeur non trouvé");
    } else {
      return res.status(200).send({
        id: instructorRef.id,
        data: instructorRef.data(),
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération de l'instructeur.");
  }
};

const createCours = async (req, res) => {
  try {
    const {
      title,
      description,
      dateStartSprint,
      dateEndSprint,
      campus_numerique,
      courseClass,
      owner,
      private,
      imageBase64,
    } = req.body;

    const courseClassRef = await db.collection("class").doc(courseClass).get();

    if (!courseClassRef.exists) {
      return res.status(404).send("Classe non trouvée");
    }

    const courseClassData = courseClassRef.data();
    courseClassData.id = courseClassRef.id;

    const ownerRef = await db.collection("users").doc(owner).get();

    if (!ownerRef.exists) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    const ownerData = {
      id: ownerRef.id,
      firstname: ownerRef.data().firstname,
      lastname: ownerRef.data().lastname,
    };

    if (ownerRef.data().image) {
      ownerData.image = ownerRef.data().image;
    }

    let imageCourseUrl;

    if (isBase64Image(imageBase64)) {
      const mimeType = "image/png";
      const fileExtension = mime.extension(mimeType);
      const fileName = `${title}.${fileExtension}`;

      const buffer = Buffer.from(
        imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const file = bucket.file(`${courseClass}/${title}/${fileName}`);

      const options = {
        metadata: {
          contentType: mimeType || "image/jpeg",
          cacheControl: "public, max-age=31536000",
        },
      };

      await file.save(buffer, options);

      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-17-2025",
      });

      imageCourseUrl = url;
    } else {
      imageCourseUrl = imageBase64;
    }

    const resourcesRef = db.collection("cours");
    const newResource = await resourcesRef.add({
      title: title,
      description: description,
      dateStartSprint: new Date(dateStartSprint),
      dateEndSprint: new Date(dateEndSprint),
      campus_numerique: campus_numerique,
      courseClass: courseClassData,
      owner: ownerData,
      private: private,
      imageCourseUrl: imageCourseUrl,
    });

    const newResourceData = await newResource.get();

    const coursId = newResource.id;
    const coursData = newResourceData.data();

    const response = {};
    response[coursId] = coursData;

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la création du cours.");
  }
};

const createLinkedCours = async (req, res) => {
  const courseId = req.params.courseId;
  const { id } = req.body;

  try {
    const courseRef = db.collection("cours").doc(courseId);

    const linkedCourseRef = db.collection("cours").doc(id);

    const courseDoc = await linkedCourseRef.get();
    if (!courseDoc.exists) {
      return res.status(404).send("Le cours spécifié n'a pas été trouvé.");
    }

    const linkedCourseDoc = await linkedCourseRef.get();
    if (!linkedCourseDoc.exists) {
      return res.status(404).send("Le cours lié spécifié n'a pas été trouvé.");
    }

    const linkedCourseData = {
      id: id,
      title: courseDoc.data().title,
      imageCourseUrl: courseDoc.data().imageCourseUrl,
    };

    await courseRef.update({
      linkedCourse: linkedCourseData,
    });

    return res.status(200).send("Le cours lié a été ajouté avec succès.");
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la création du lien entre les cours.");
  }
};

const updateCours = async (req, res) => {
  try {
    const {
      title,
      description,
      dateStartSprint,
      dateEndSprint,
      campus_numerique,
      courseClass,
      owner,
      private,
      imageBase64,
    } = req.body;

    const courseId = req.params.id;

    const resourcesRef = db.collection("cours");
    const course = await resourcesRef.doc(courseId).get();

    if (!course.exists) {
      return res
        .status(404)
        .send("Le cours que vous essayez de modifier n'existe pas.");
    }

    let updatedData = {};

    if (title) {
      updatedData.title = title;
    }

    if (description) {
      updatedData.description = description;
    }

    if (dateStartSprint) {
      updatedData.dateStartSprint = new Date(dateStartSprint);
    }

    if (dateEndSprint) {
      updatedData.dateEndSprint = new Date(dateEndSprint);
    }

    if (campus_numerique) {
      updatedData.campus_numerique = campus_numerique;
    }

    if (courseClass) {
      const courseClassRef = await db
        .collection("class")
        .doc(courseClass)
        .get();

      if (!courseClassRef.exists) {
        return res.status(404).send("Classe non trouvée");
      }

      updatedData.courseClass = {
        id: courseClassRef.id,
        ...courseClassRef.data(),
      };
    }

    if (owner) {
      const ownerRef = await db.collection("users").doc(owner).get();

      if (!ownerRef.exists) {
        return res.status(404).send("Utilisateur non trouvé");
      }

      updatedData.owner = {
        id: ownerRef.id,
        firstname: ownerRef.data().firstname,
        lastname: ownerRef.data().lastname,
      };
    }

    if (private) {
      updatedData.private = private;
    }

    if (imageBase64) {
      const mimeType = "image/png";
      const fileExtension = mime.extension(mimeType);
      const fileName = `${title}.${fileExtension}`;

      const buffer = Buffer.from(
        imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const file = bucket.file(`${courseClass}/${title}/${fileName}`);

      const options = {
        metadata: {
          contentType: mimeType || "image/jpeg",
          cacheControl: "public, max-age=31536000",
        },
      };

      await file.save(buffer, options);

      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-17-2025",
      });

      updatedData.imageCourseUrl = url;
    }

    await resourcesRef.doc(courseId).update(updatedData);

    const updatedCourseData = await resourcesRef.doc(courseId).get();

    res.status(200).json({
      cours_id: courseId,
      cours_updated_datas: updatedCourseData.data(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la modification du cours.");
  }
};

const uploadCoursPdf = async (req, res) => {
  try {
    await upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        res.status(400).json({ error: "Error uploading file." });
      } else if (err) {
        res.status(400).json({ error: err.message });
      } else {
        if (!req.file) {
          res.status(400).json({ error: "No file uploaded." });
          return;
        }

        const filePath = req.file.path;
        const fileType = mime.lookup(filePath);
        const fileSize = req.file.size;

        const folderPath = `${req.body.courseClass}/${req.body.title}/Cours`;
        const fileName = req.file.originalname;

        const fileRef = bucket.file(`${folderPath}/${fileName}`);

        let pdfLinkCours;

        fileRef
          .createWriteStream({
            metadata: {
              contentType: fileType || "application/pdf",
              cacheControl: "public, max-age=31536000",
            },
          })
          .on("error", (error) => {
            console.error(error);
            res.status(400).json({ error: error.message });
          })
          .on("finish", async () => {
            try {
              const url = await fileRef.getSignedUrl({
                action: "read",
                expires: "03-17-2025",
              });

              const courseId = req.body.courseId;
              pdfLinkCours = url.toString();

              await db
                .collection("cours")
                .doc(courseId)
                .update({
                  pdfLinkCours: FieldValue.arrayUnion({
                    url: pdfLinkCours,
                    name: fileName,
                    type: fileType,
                    size: fileSize,
                  }),
                });

              res.json({
                success: true,
                file: {
                  name: fileName,
                  type: fileType,
                  size: fileSize,
                  url: pdfLinkCours,
                },
              });
            } catch (error) {
              console.error(error);
              res.status(400).json({ error: error.message });
            }
          })
          .end(fs.readFileSync(filePath));
      }
    });
  } catch (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: "Error uploading file." });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

const uploadBackLogPdf = async (req, res) => {
  try {
    await upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        res.status(400).json({ error: "Error uploading file." });
      } else if (err) {
        res.status(400).json({ error: err.message });
      } else {
        if (!req.file) {
          // Check if file was uploaded
          res.status(400).json({ error: "No file uploaded." });
          return;
        }
        const filePath = req.file.path;
        const fileType = mime.lookup(filePath);
        const fileSize = req.file.size;

        const folderPath = `${req.body.courseClass}/${req.body.title}/Backlogs`;
        const fileName = req.file.originalname;

        const fileRef = bucket.file(`${folderPath}/${fileName}`);

        let pdfLinkBackLog;

        const stream = fileRef.createWriteStream({
          metadata: {
            contentType: fileType || "application/pdf",
            cacheControl: "public, max-age=31536000",
          },
        });

        stream.on("error", (error) => {
          console.error(error);
          res.status(400).json({ error: error.message });
        });

        stream
          .on("finish", async () => {
            try {
              const url = await fileRef.getSignedUrl({
                action: "read",
                expires: "03-17-2025",
              });

              const courseId = req.body.courseId;

              pdfLinkBackLog = url.toString();

              await db
                .collection("cours")
                .doc(courseId)
                .update({
                  pdfLinkBackLog: FieldValue.arrayUnion({
                    url: pdfLinkBackLog,
                    name: fileName,
                    type: fileType,
                    size: fileSize,
                  }),
                });

              res.status(200).send({
                success: true,
                file: {
                  name: fileName,
                  type: fileType,
                  size: fileSize,
                  url: pdfLinkBackLog,
                },
              });
            } catch (error) {
              console.error(error);
              res.status(400).json({ error: error.message });
            }
          })
          .end(fs.readFileSync(filePath));
      }
    });
  } catch (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: "Error uploading file." });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

const deleteCoursPdf = async (req, res) => {
  try {
    const { courseClass, title, fileName, pdfLinkCours, courseId } = req.body;

    const fileRef = bucket.file(`${courseClass}/${title}/Cours/${fileName}`);

    await fileRef.delete();

    const doc = await db.collection("cours").doc(courseId).get();
    const pdfLinks = doc.data().pdfLinkCours;
    const updatedPdfLinks = pdfLinks.filter(
      (pdfLink) => pdfLink.name !== fileName && pdfLink.url !== pdfLinkCours
    );

    await db
      .collection("cours")
      .doc(courseId)
      .update({ pdfLinkCours: updatedPdfLinks });

    res.json({
      success: true,
      message: `File ${fileName} successfully deleted.`,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const deleteBackLogPdf = async (req, res) => {
  try {
    const { courseClass, title, fileName, pdfLinkBackLog, courseId } = req.body;

    const fileRef = bucket.file(`${courseClass}/${title}/Backlogs/${fileName}`);

    await fileRef.delete();

    const doc = await db.collection("cours").doc(courseId).get();
    const pdfLinks = doc.data().pdfLinkBackLog;
    const updatedPdfLinks = pdfLinks.filter(
      (pdfLink) => pdfLink.name !== fileName && pdfLink.url !== pdfLinkBackLog
    );

    await db
      .collection("cours")
      .doc(courseId)
      .update({ pdfLinkBackLog: updatedPdfLinks });

    res.json({
      success: true,
      message: `File ${fileName} successfully deleted.`,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const deleteCours = async (req, res) => {
  try {
    const { courseClass, title } = req.body;

    const resourceRef = db.collection("cours").doc(req.params.id);
    const resource = await resourceRef.get();

    if (!resource.exists) {
      return res.status(404).send("Cours non trouvé");
    }

    await resourceRef.delete();

    const folderPath = `${courseClass}/${title}`;

    const [files] = await bucket.getFiles({
      prefix: `${folderPath}/`,
    });

    for (const file of files) {
      await file.delete();
    }

    return res.status(200).send("Cours supprimé avec succès");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Erreur lors de la suppression du cours.");
  }
};

module.exports = {
  getAllCours,
  getCoursesByOwnerId,
  getAllClasses,
  getCoursById,
  getClassById,
  createClass,
  getInstructors,
  getInstructorById,
  createCours,
  createLinkedCours,
  updateCours,
  uploadCoursPdf,
  uploadBackLogPdf,
  deleteCoursPdf,
  deleteBackLogPdf,
  deleteCours,
};

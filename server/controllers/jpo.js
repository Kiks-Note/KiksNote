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
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
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

const getAllJpo = async (req, res) => {
  try {
    const currentDate = new Date();
    const snapshot = await db.collection("jpo").where("jpoDayEnd", ">=", currentDate).get();

    const jpoList = [];
    snapshot.forEach((doc) => {
      jpoList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).json(jpoList);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération des JPO.");
  }
};

const getPastJpo = async (req, res) => {
  try {
    const currentDate = new Date();
    const snapshot = await db.collection("jpo").where("jpoDayEnd", "<", currentDate).get();

    const jpoList = [];
    snapshot.forEach((doc) => {
      jpoList.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json(jpoList);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération des anciennes JPO.");
  }
};

const getJpoById = async (req, res) => {
  try {
    const jpoId = req.params.id;
    const jpoDoc = await db.collection("jpo").doc(jpoId).get();

    if (!jpoDoc.exists) {
      return res.status(404).send("JPO non trouvée");
    }

    const jpoData = {
      id: jpoDoc.id,
      ...jpoDoc.data(),
    };

    res.status(200).json(jpoData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération de la JPO par ID.");
  }
};

const getAllJpoParticipants = async (req, res) => {
  try {
    const snapshot = await db.collection("users").where("status", "in", ["etudiant", "pedago"]).get();
    const users = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération des utilisateurs.");
  }
};

const getAllJpoByParticipant = async (req, res) => {
  try {
    const participantId = req.params.id;
    console.log(participantId);
    const currentDate = new Date();

    const snapshot = await db.collection("jpo").where("jpoDayEnd", ">=", currentDate).get();

    const jpoList = [];
    snapshot.forEach((doc) => {
      if (
        doc.data().jpoParticipants.some((participant) => {
          if (participant.id === participantId) {
            return true;
          } else return false;
        })
      ) {
        jpoList.push({
          id: doc.id,
          ...doc.data(),
        });
      }
    });

    res.status(200).json(jpoList);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération des JPO par participant.");
  }
};

const createJpo = async (req, res) => {
  try {
    await upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        res.status(400).json({ error: "Error uploading file." });
        return;
      } else if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      const { jpoTitle, jpoDescription, jpoThumbnail, jpoDayStart, jpoDayEnd, jpoParticipants = [] } = req.body;

      const mimeType = "image/png";
      const fileExtension = mime.extension(mimeType);
      const fileName = `${jpoTitle}.${fileExtension}`;

      const buffer = Buffer.from((jpoThumbnail || "").replace(/^data:image\/\w+;base64,/, ""), "base64");
      const file = bucket.file(`jpo/${jpoTitle}/${fileName}`);

      const options = {
        metadata: {
          contentType: mimeType || "image/png",
          cacheControl: "public, max-age=31536000",
        },
      };

      await file.save(buffer, options);

      const [urlImageJpo] = await file.getSignedUrl({
        action: "read",
        expires: "03-17-2025",
      });

      const jpoData = {
        jpoTitle: jpoTitle,
        jpoDescription: jpoDescription,
        jpoThumbnail: urlImageJpo,
        jpoDayStart: new Date(jpoDayStart),
        jpoDayEnd: new Date(jpoDayEnd),
      };

      const jpoParticipantsData = [];
      for (const participantId of jpoParticipants) {
        const jpoParticipantRef = await db.collection("users").doc(participantId).get();
        if (jpoParticipantRef.exists) {
          const participantsData = {
            id: jpoParticipantRef.id,
            firstname: jpoParticipantRef.data().firstname,
            lastname: jpoParticipantRef.data().lastname,
            status: jpoParticipantRef.data().status,
          };

          if (jpoParticipantRef.data().image) {
            memberData.image = memberRef.data().image;
          }

          jpoParticipantsData.push(participantsData);
        }
      }
      jpoData.jpoParticipants = jpoParticipantsData;

      const jpoRef = await db.collection("jpo").add(jpoData);
      const newJPO = await jpoRef.get();

      res.status(200).json({
        message: "JPO créée avec succès.",
        jpoData: {
          id: newJPO.id,
          ...newJPO.data(),
        },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la création de la JPO.");
  }
};

const linkProjectStudents = async (req, res) => {
  const jpoId = req.params.jpoId;
  const studentProjectId = req.body.studentProjectId;

  try {
    const jpoRef = db.collection("jpo").doc(jpoId);
    const studentProjectRef = db.collection("students_projects").doc(studentProjectId);

    const jpoDoc = await jpoRef.get();
    const studentProjectDoc = await studentProjectRef.get();

    if (!jpoDoc.exists || !studentProjectDoc.exists) {
      return res.status(404).send("La jpo ou le projet étudiant n'a pas été trouvé.");
    }

    const linkedStudentProject = {
      id: studentProjectId,
      nameProject: studentProjectDoc.data().nameProject,
      imgProject: studentProjectDoc.data().imgProject,
    };

    const existingLinkedStudentProjects = jpoDoc.data().linkedStudentProjects || [];

    existingLinkedStudentProjects.push(linkedStudentProject);

    await jpoRef.update({
      linkedStudentProjects: existingLinkedStudentProjects,
    });

    return res.status(200).json({
      message: `Le projet étudiant ${studentProjectDoc.data().nameProject} a bien été lié à la jpo`,
      linkedStudentProjects: existingLinkedStudentProjects,
    });
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la création du lien entre le blog tutoriel et le projet.");
  }
};

const updateJpoById = async (req, res) => {
  try {
    const jpoId = req.params.jpoId;
    const { jpoTitle, jpoDescription, jpoThumbnail, jpoDayStart, jpoDayEnd, jpoParticipants } = req.body;

    const jpoRef = db.collection("jpo").doc(jpoId);

    const jpoDoc = await jpoRef.get();

    if (!jpoDoc.exists) {
      return res.status(404).send("JPO non trouvée");
    }

    const jpoData = {};

    if (jpoTitle) {
      jpoData.jpoTitle = jpoTitle;
    }
    if (jpoDescription) {
      jpoData.jpoDescription = jpoDescription;
    }
    if (jpoThumbnail) {
      jpoData.jpoThumbnail = jpoThumbnail;
    }
    if (jpoDayStart) {
      jpoData.jpoDayStart = new Date(jpoDayStart);
    }
    if (jpoDayEnd) {
      jpoData.jpoDayEnd = new Date(jpoDayEnd);
    }
    if (jpoParticipants) {
      const jpoParticipantsData = [];
      for (const participantId of jpoParticipants) {
        const jpoParticipantRef = await db.collection("users").doc(participantId).get();
        if (jpoParticipantRef.exists) {
          const participantsData = {
            id: jpoParticipantRef.id,
            firstname: jpoParticipantRef.data().firstname,
            lastname: jpoParticipantRef.data().lastname,
            status: jpoParticipantRef.data().status,
          };

          if (jpoParticipantRef.data().image) {
            participantsData.image = jpoParticipantRef.data().image;
          }

          jpoParticipantsData.push(participantsData);
        }
      }
      jpoData.jpoParticipants = jpoParticipantsData;
    }

    await jpoRef.update(jpoData);

    const updatedJpo = await jpoRef.get();

    return res.status(200).json({
      message: "JPO modifiée avec succès.",
      jpoData: {
        id: updatedJpo.id,
        ...updatedJpo.data(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la modification de la JPO.");
  }
};

const updateJpoPDF = async (req, res) => {
  try {
    const jpoId = req.params.jpoId;

    const jpoRef = db.collection("jpo").doc(jpoId);

    const jpoDoc = await jpoRef.get();

    if (!jpoDoc.exists) {
      return res.status(404).send("JPO non trouvée");
    }

    await upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        res.status(400).json({ error: "Erreur lors du téléchargement du fichier." });
        return;
      } else if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      if (req.file) {
        const pdfFilePath = req.file.path;
        const pdfFileType = mime.lookup(pdfFilePath);
        const pdfFileSize = req.file.size;

        const pdfFileName = req.file.originalname;
        const pdfFileRef = bucket.file(`jpo/${jpoDoc.data().jpoTitle}/${pdfFileName}`);

        await pdfFileRef
          .createWriteStream({
            metadata: {
              contentType: pdfFileType || "application/pdf",
              cacheControl: "public, max-age=31536000",
            },
          })
          .on("error", (error) => {
            console.error(error);
            res.status(400).json({ error: error.message });
          })
          .on("finish", async () => {
            try {
              const pdfUrl = await pdfFileRef.getSignedUrl({
                action: "read",
                expires: "03-17-2025",
              });

              const pdfBuffer = fs.readFileSync(pdfFilePath);
              const pdfBase64 = pdfBuffer.toString("base64");

              const updatedData = {
                linkCommercialBrochure: {
                  url: pdfUrl.toString(),
                  name: pdfFileName,
                  type: pdfFileType,
                  size: pdfFileSize,
                  pdfBase64: pdfBase64,
                },
              };

              await jpoRef.update(updatedData);

              const updatedJpo = await jpoRef.get();

              return res.status(200).json({
                message: "Votre plaquette commercial a été ajouté avec succès.",
                jpoData: {
                  id: updatedJpo.id,
                  ...updatedJpo.data(),
                },
              });
            } catch (error) {
              console.error(error);
              res.status(500).send("Erreur lors de la modification de la JPO.");
            }
          })
          .end(fs.readFileSync(pdfFilePath));
      } else {
        return res.status(400).json({ error: "Aucun fichier PDF fourni." });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la modification de la JPO.");
  }
};

const deleteJpoById = async (req, res) => {
  try {
    const jpoId = req.params.jpoId;
    const { jpoTitle } = req.body;

    const jpoRef = db.collection("jpo").doc(jpoId);

    const jpoDoc = await jpoRef.get();

    if (!jpoDoc.exists) {
      return res.status(404).send("JPO non trouvée");
    }

    await jpoRef.delete();

    const folderPath = `jpo/${jpoTitle}`;

    const [files] = await bucket.getFiles({
      prefix: `${folderPath}/`,
    });

    for (const file of files) {
      await file.delete();
    }

    return res.status(200).send("JPO supprimée avec succès");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la suppression de la JPO.");
  }
};

module.exports = {
  getAllJpo,
  getPastJpo,
  getJpoById,
  getAllJpoParticipants,
  getAllJpoByParticipant,
  createJpo,
  linkProjectStudents,
  updateJpoById,
  updateJpoPDF,
  deleteJpoById,
};

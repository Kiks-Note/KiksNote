const admin = require("firebase-admin");

module.exports = (app, db, bucket, mime, upload, multer, fs) => {
  app.get("/ressources/classes", async (req, res) => {
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
  });

  // Route pour récupérer tous les cours
  app.get("/ressources/cours", async (req, res) => {
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
  });

  // Route pour récupérer un cours par son id
  app.get("/ressources/cours/:id", async (req, res) => {
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
  });

  // Route pour récuperer dans la collection users, tous les users qui ont le status de po
  app.get("/ressources/instructors", async (req, res) => {
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
  });

  // Route pour créer un nouveau cours
  app.post("/ressources/cours", async (req, res) => {
    try {
      const {
        title,
        description,
        date,
        campus_numerique,
        courseClass,
        owner,
        private,
        imageBase64,
      } = req.body;

      if (
        !title ||
        !description ||
        !date ||
        !courseClass ||
        !owner ||
        !imageBase64
      ) {
        return res
          .status(400)
          .send("Veuillez remplir tous les champs obligatoires.");
      }

      const mimeType = "image/png";
      const fileExtension = mime.extension(mimeType);
      const fileName = `${title}.${fileExtension}`;

      // upload l'image sur Firebase Storage
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

      const resourcesRef = db.collection("cours");
      const newResource = await resourcesRef.add({
        title,
        description,
        date,
        campus_numerique,
        courseClass,
        owner,
        private,
        imageCourseUrl: url,
      });

      const newResourceData = await db
        .collection("cours")
        .doc(newResource.id)
        .get();

      res.status(200).json({
        cours_id: newResource.id,
        cours_created_datas: newResourceData._fieldsProto,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la création du cours.");
    }
  });

  // Route pour update les datas d'un cours par son id
  app.post("/update/ressources/cours/:id", async (req, res) => {
    try {
      const {
        title,
        description,
        date,
        campus_numerique,
        courseClass,
        owner,
        private,
        imageBase64,
      } = req.body;

      if (
        !title ||
        !description ||
        !date ||
        !courseClass ||
        !owner ||
        !imageBase64
      ) {
        return res
          .status(400)
          .send("Veuillez remplir tous les champs obligatoires.");
      }

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

      const resourcesRef = db.collection("cours");
      const resourceId = req.params.id;

      await resourcesRef.doc(resourceId).update({
        title,
        description,
        date,
        campus_numerique,
        courseClass,
        owner,
        private,
        imageCourseUrl: url,
      });

      const updatedResourceData = await resourcesRef.doc(resourceId).get();

      res.status(200).json({
        cours_id: resourceId,
        cours_updated_datas: updatedResourceData._fieldsProto,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la modification du cours.");
    }
  });

  // Route pour uploader le fichier cours pdf dans Firebase Storage en fonction du nom de la classe et du nom du cours
  app.post("/ressources/cours/upload-pdf", (req, res) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        res.status(400).json({ error: "Error uploading file." });
      } else if (err) {
        res.status(400).json({ error: err.message });
      } else {
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
          .on("finish", () => {
            fileRef
              .getSignedUrl({
                action: "read",
                expires: "03-17-2025",
              })
              .then((url) => {
                const courseId = req.body.courseId;

                pdfLinkCours = url.toString();

                db.collection("cours")
                  .doc(courseId)
                  .update({
                    pdfLinkCours: admin.firestore.FieldValue.arrayUnion({
                      url: pdfLinkCours,
                      name: fileName,
                      type: fileType,
                      size: fileSize,
                    }),
                  });
              })
              .then(() => {
                res.json({
                  success: true,
                  file: {
                    name: fileName,
                    type: fileType,
                    size: fileSize,
                    url: pdfLinkCours,
                  },
                });
              })
              .catch((error) => {
                console.error(error);
                res.status(400).json({ error: error.message });
              });
          })
          .end(fs.readFileSync(filePath));
      }
    });
  });

  // Route pour uploader le fichier backlog pdf dans Firebase Storage en fonction du nom de la classe et du nom du cours
  app.post("/ressources/cours/backlog/upload-pdf", (req, res) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        res.status(400).json({ error: "Error uploading file." });
      } else if (err) {
        res.status(400).json({ error: err.message });
      } else {
        const filePath = req.file.path;
        const fileType = mime.lookup(filePath);
        const fileSize = req.file.size;

        const folderPath = `${req.body.courseClass}/${req.body.title}/Backlogs`;
        const fileName = req.file.originalname;

        const fileRef = bucket.file(`${folderPath}/${fileName}`);

        let pdfLinkBackLog;

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
          .on("finish", () => {
            fileRef
              .getSignedUrl({
                action: "read",
                expires: "03-17-2025",
              })
              .then((url) => {
                const courseId = req.body.courseId;

                pdfLinkBackLog = url.toString();

                db.collection("cours")
                  .doc(courseId)
                  .update({
                    pdfLinkBackLog: admin.firestore.FieldValue.arrayUnion({
                      url: pdfLinkBackLog,
                      name: fileName,
                      type: fileType,
                      size: fileSize,
                    }),
                  });
              })
              .then(() => {
                res.status(200).send({
                  success: true,
                  file: {
                    name: fileName,
                    type: fileType,
                    size: fileSize,
                    url: pdfLinkBackLog,
                  },
                });
              })
              .catch((error) => {
                console.error(error);
                res.status(400).send({ error: error.message });
              });
          })
          .end(fs.readFileSync(filePath));
      }
    });
  });

  // Route pour supprimer un fichier cours pdf de Firebase Storage et dans l'array pdfLinksCours dans le document de la collection cours
  app.delete("/ressources/cours/delete-pdf", (req, res) => {
    const { courseClass, title, fileName, pdfLinkCours, courseId } = req.body;

    const fileRef = bucket.file(`${courseClass}/${title}/Cours/${fileName}`);

    fileRef
      .delete()
      .then(() => {
        db.collection("cours")
          .doc(courseId)
          .get()
          .then((doc) => {
            const pdfLinks = doc.data().pdfLinkCours;
            const updatedPdfLinks = pdfLinks.filter(
              (pdfLink) =>
                pdfLink.name !== fileName && pdfLink.url !== pdfLinkCours
            );

            db.collection("cours")
              .doc(courseId)
              .update({ pdfLinkCours: updatedPdfLinks })
              .then(() => {
                res.json({
                  success: true,
                  message: `File ${fileName} successfully deleted.`,
                });
              })
              .catch((error) => {
                console.error(error);
                res.status(400).json({ error: error.message });
              });
          })
          .catch((error) => {
            console.error(error);
            res.status(400).json({ error: error.message });
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).json({ error: error.message });
      });
  });

  // Route pour supprimer un fichier backlog pdf dans Firebase Storage et dans l'array pdfLinksBacklog dans le document de la collection cours
  app.delete("/ressources/backlog/delete-pdf", (req, res) => {
    const { courseClass, title, fileName, pdfLinkBackLog, courseId } = req.body;
    const fileRef = bucket.file(`${courseClass}/${title}/Backlogs/${fileName}`);

    fileRef
      .delete()
      .then(() => {
        db.collection("cours")
          .doc(courseId)
          .get()
          .then((doc) => {
            const pdfLinks = doc.data().pdfLinkBackLog;
            const updatedPdfLinks = pdfLinks.filter(
              (pdfLink) =>
                pdfLink.name !== fileName && pdfLink.url !== pdfLinkBackLog
            );

            db.collection("cours")
              .doc(courseId)
              .update({ pdfLinkBackLog: updatedPdfLinks })
              .then(() => {
                res.json({
                  success: true,
                  message: `File ${fileName} successfully deleted.`,
                });
              })
              .catch((error) => {
                console.error(error);
                res.status(400).json({ error: error.message });
              });
          })
          .catch((error) => {
            console.error(error);
            res.status(400).json({ error: error.message });
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).json({ error: error.message });
      });
  });

  // Route pour supprimer un cours complet
  app.delete("delete/ressources/cours/:id", async (req, res) => {
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
  });
};

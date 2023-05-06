module.exports = (app, db, bucket, mime, upload, multer, fs) => {
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

        const folderPath = `${req.body.courseClass}/${req.body.title}`;
        const fileName = req.file.originalname;

        const fileRef = bucket.file(`${folderPath}/${fileName}`);

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

                const pdfLinkCours = url.toString();

                db.collection("cours").doc(courseId).update({
                  pdfLinkCours: pdfLinkCours,
                });

                res.json({
                  success: true,
                  file: {
                    name: fileName,
                    type: fileType,
                    size: fileSize,
                    url: url,
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

        const folderPath = `${req.body.courseClass}/${req.body.title}`;
        const fileName = req.file.originalname;

        const fileRef = bucket.file(`${folderPath}/${fileName}`);

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

                const pdfLinkBackLog = url.toString();

                db.collection("cours").doc(courseId).update({
                  pdfLinkBackLog: pdfLinkBackLog,
                });

                res.status(200).send({
                  success: true,
                  file: {
                    name: fileName,
                    type: fileType,
                    size: fileSize,
                    url: url,
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
        res.status(404).send("Cours non trouvé");
      } else {
        res.status(200).json({
          id: resourceRef.id,
          data: resourceRef.data(),
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la récupération du cours.");
    }
  });

  // Route pour supprimer un cours par son id de document et l'image du cours stocké dans Firebase Storage
  app.delete("/ressources/cours/:id", async (req, res) => {
    try {
      const resourceRef = db.collection("cours").doc(req.params.id);
      const resource = await resourceRef.get();

      if (!resource.exists) {
        return res.status(404).send("Cours non trouvé");
      }

      await resourceRef.delete();

      const fileName = resource.data().title;
      console.log(fileName);
      const file = bucket.file(`cours/${fileName}.png`);

      await file.delete();

      res.status(200).send("Cours supprimé avec succès");
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la suppression du cours.");
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

  app.get("/jpo", async (req, res) => {
    try {
      const jpoRef = db.collection("blog_evenements");
      const snapshot = await jpoRef.get();
      console.log(snapshot.docs);
      const jpo = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          date: doc.data().creation_date,
        };
      });
      res.status(200).json(jpo);
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la récupération des évenements.");
    }
  });
};

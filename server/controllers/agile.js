const { auth, db } = require("../firebase");
const archiver = require("archiver");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const addImpactMapping = async (req, res) => {
  if (
    !req.body ||
    !req.body.actors ||
    !req.body.deliverables ||
    !req.body.goals ||
    !req.body.impacts
  ) {
    res.status(400).send({ message: "Missing required fields" });
    return;
  }
  try {
    await db
      .collection("dashboard")
      .doc(req.params.dashboardId)
      .collection("agile")
      .doc("impact_mapping")
      .update({
        actors: req.body.actors,
        deliverables: req.body.deliverables,
        goals: req.body.goals,
        impacts: req.body.impacts,
      });
    res.status(200).send({ message: "Impact mapping added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const getImpactMapping = async (req, res) => {
  try {
    const docRef = db
      .collection("dashboard")
      .doc(req.params.dashboardId)
      .collection("agile")
      .doc("impact_mapping");
    const doc = await docRef.get();
    if (!doc.exists) {
      return null;
    }
    const data = doc.data();
    // console.log('data',req.params.dashboardId, data);
    return res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error for impact mapping" });
  }
};
const getFoldersAgile = async (req, res) => {
  try {
    const userQuerySnapshot = await db
      .collection("dashboard")
      .where("students", "array-contains", req.params.userId)
      .get();
    const foldersPromises = userQuerySnapshot.docs.map(async (userDoc) => {
      const agileCollectionRef = userDoc.ref.collection("agile");
      const foldersQuerySnapshot = await agileCollectionRef.get();

      const foldersData = foldersQuerySnapshot.docs
        .filter((folderDoc) => folderDoc.id === "agile_folder") // Filtre pour garder uniquement les documents avec l'ID "agile_folder"
        .map((folderDoc) => {
          const folderData = folderDoc.data();
          return {
            id: folderDoc.id,
            dashboardId: userDoc.id,
            groupName: userDoc.data().group_name,
            ...folderData,
          };
        });

      return foldersData;
    });

    const foldersResults = await Promise.all(foldersPromises);
    const allFolders = [].concat(...foldersResults);

    res.status(200).send(allFolders);
  } catch (e) {
    console.error(e);
    res.status(500).send(err);
  }
};

const getZipFolderAgile = async (req, res) => {
  try {
    const { files } = req.query;
    console.log("files: ", files);
    const fileLinks = files.split(",");
    console.log("fileLinks: ", fileLinks);

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    // Spécifier les en-têtes de la réponse
    res.attachment("DossierAgile.zip");

    // Passe la réponse du flux d'archivage à la réponse HTTP
    archive.pipe(res);

    const downloadPromises = fileLinks.map(async (fileLink) => {
      console.log("fileLink: ", fileLink);
      // Télécharger le fichier à partir de l'URL
      const response = await axios.get(fileLink, {
        responseType: "arraybuffer",
      });

      // Extraire le nom de fichier à partir de l'URL
      const filename = path.basename(fileLink);

      // Ajouter une entrée au flux d'archivage avec les données téléchargées
      archive.append(response.data, { name: `Dossier Agile/${filename}` });
    });

    // Attendre la fin du téléchargement de tous les fichiers
    await Promise.all(downloadPromises);

    // Finaliser le flux d'archivage
    archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

/// PATH to create a postit
const createPostit = async (req, res) => {
  try {
    const data = req.body;
    const dashboardRef = db.collection("dashboard").doc(req.params.dashboardId);
    const agileRef = dashboardRef.collection("agile").doc(req.params.actorId);
    const snapshot = await agileRef.get();
    const columns = snapshot.data().empathy_map;
    let column;
    let columnName;
    switch (req.params.columnId) {
      case "think":
        column = columns.think;
        columnName = "think";
        break;
      case "see":
        column = columns.see;
        columnName = "see";
        break;
      case "do":
        column = columns.do;
        columnName = "do";
        break;
      case "hear":
        column = columns.hear;
        columnName = "hear";
        break;
      default:
        res.status(400).send({ message: "Invalid column id" });
        return;
    }

    const id = uuidv4();
    const cards = column.items || [];
    const newCard = {
      id: id,
      content: data.content,
    };

    column.items = [...cards, newCard];

    // Créer un nouvel objet pour mettre à jour uniquement la colonne spécifiée
    const updateData = {
      empathy_map: { ...columns, [columnName]: column },
    };

    await agileRef.update(updateData);
    res.send({ message: "Card created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};
/// PATH to delete a postit
const deletePostit = async (req, res) => {
  try {
    const dashboardRef = db.collection("dashboard").doc(req.params.dashboardId);
    const agileRef = dashboardRef.collection("agile").doc(req.params.actorId);
    const snapshot = await agileRef.get();
    const columns = snapshot.data().empathy_map;
    let column;
    let columnName;
    switch (req.params.columnId) {
      case "think":
        column = columns.think;
        columnName = "think";
        break;
      case "see":
        column = columns.see;
        columnName = "see";
        break;
      case "do":
        column = columns.do;
        columnName = "do";
        break;
      case "hear":
        column = columns.hear;
        columnName = "hear";
        break;
      default:
        res.status(400).send({ message: "Invalid column id" });
        return;
    }

    const cards = column.items || [];
    const cardIndex = cards.findIndex((card) => {
      if (card.id == req.params.postitId) {
        return card.id;
      }
    });
    if (cardIndex == -1) {
      res.status(404).send({ message: "Card not found" });
      return;
    }

    column.items = cards.filter((card) => card.id != req.params.postitId);
    // Créer un nouvel objet pour mettre à jour uniquement la colonne spécifiée
    const updateData = {
      empathy_map: { ...columns, [columnName]: column },
    };
    await agileRef.update(updateData);

    // Card deleted successfully
    res.status(204).send({ message: "Card deleted successfully" });
  } catch (error) {
    console.error(error);
    // Server error
    res
      .status(500)
      .send({ message: "An error occurred while deleting the card" });
  }
};
/// PATH to change a postit index
const changeIndex = async (req, res) => {
  var data = req.body;
  await db
    .collection("dashboard")
    .doc(req.params.dashboardId)
    .collection("agile")
    .doc(req.params.actorId)
    .update({
      empathy_map: {
        think: data.think,
        see: data.see,
        do: data.do,
        hear: data.hear,
      },
    });
};

const updatePdfInAgileFolder = async (req, res) => {
  try {
    const pdfFile = req.file;
    if (!pdfFile) {
      return res
        .status(400)
        .json({ error: "Aucun fichier PDF n'a été envoyé." });
    }

    const fieldName = req.body.fieldName;
    if (!fieldName) {
      return res.status(400).json({ error: "Le nom du champ est requis." });
    }

    const fieldValue = req.protocol + "://" + req.get("host") + pdfFile.path;

    const agileDocumentRef = db
      .collection("dashboard")
      .doc(req.params.dashboardId)
      .collection("agile")
      .doc("agile_folder");

    const snapshot = await agileDocumentRef.get();
    const previousFieldValue = snapshot.exists
      ? snapshot.data()[fieldName]
      : null;

    if (previousFieldValue) {
      // Supprimer le fichier précédent s'il existe
      const previousFileName = previousFieldValue.split("/").pop();
      const previousFilePathOnDisk = __dirname + "/uploads/" + previousFileName;
      if (fs.existsSync(previousFilePathOnDisk)) {
        fs.unlinkSync(previousFilePathOnDisk);
      }
    }

    const updateData = {};
    updateData[fieldName] = fieldValue;

    await agileDocumentRef.update(updateData);

    console.log("Nom du fichier :", pdfFile.originalname);
    console.log("Chemin du fichier temporaire :", pdfFile.path);
    res.status(200).send("Fichier PDF traité avec succès.");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

/// Path to add Persona
const addPersona = async (req, res) => {
  try {
    const data = req.body;
    const dashboardRef = db.collection("dashboard").doc(req.params.dashboardId);
    const agileRef = dashboardRef.collection("agile").doc(req.params.actorId);
    const snapshot = await agileRef.get();
    const persona = snapshot.data().persona;

    // Vérifier si l'objet persona existe et le mettre à jour
    if (Object.keys(persona).length === 0) {
      // Si l'objet persona est vide, le créer avec les nouvelles données
      await agileRef.set({
        persona: data,
      });
    } else {
      // Si l'objet persona existe, fusionner les nouvelles données avec les données existantes
      const updatedPersona = { ...persona, ...data };
      await agileRef.update({
        persona: updatedPersona,
      });
    }

    res.send({ message: "Persona added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const empathyRequest = async (connection) => {
  connection.on("message", async (message) => {
    const empathy = JSON.parse(message.utf8Data);

    var agileDocumentRef = db
      .collection("dashboard")
      .doc(empathy.dashboardId)
      .collection("agile")
      .doc(empathy.actorId);

    // Check if the document exists
    const documentSnapshot = await agileDocumentRef.get();

    if (
      !documentSnapshot.exists ||
      !documentSnapshot.data().hasOwnProperty("empathy_map")
    ) {
      await agileDocumentRef.set({
        empathy_map: {
          think: {
            name: "Penser",
            color: "#BF2020",
            items: [],
          },
          see: {
            name: "Voir",
            color: "#3295AC",
            items: [],
          },
          do: {
            name: "Dire",
            color: "#9ACD32",
            items: [],
          },
          hear: {
            name: "Entendre",
            color: "#ed7ee2",
            items: [],
          },
        },
      });
    }

    // Listen to changes in the document
    agileDocumentRef.onSnapshot(
      (snapshot) => {
        const data = snapshot.data();
        const empathyMap = new Map([
          ["think", data.empathy_map.think],
          ["see", data.empathy_map.see],
          ["do", data.empathy_map.do],
          ["hear", data.empathy_map.hear],
        ]);
        const orderedData = {
          empathy_map: Object.fromEntries(empathyMap),
        };
        connection.sendUTF(JSON.stringify(orderedData));
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );
  });
};

const personaRequest = async (connection) => {
  connection.on("message", async (message) => {
    const persona = JSON.parse(message.utf8Data);
    var agileDocumentRef = db
      .collection("dashboard")
      .doc(persona.dashboardId)
      .collection("agile")
      .doc(persona.actorId);

    // Check if the document exists
    const documentSnapshot = await agileDocumentRef.get();

    if (!documentSnapshot.exists || !documentSnapshot.data().hasOwnProperty("persona")) {
      await agileDocumentRef.set({
        persona: {},
      });
    }

    // Listen to changes in the document
    agileDocumentRef.onSnapshot(
      (snapshot) => {
        const data = snapshot.data();
        connection.sendUTF(JSON.stringify(data));
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );
  });
};

module.exports = {
  addImpactMapping,
  getImpactMapping,
  getFoldersAgile,
  getZipFolderAgile,
  updatePdfInAgileFolder,
  addPersona,
  empathyRequest,
  personaRequest,
  changeIndex,
  createPostit,
  deletePostit,
};

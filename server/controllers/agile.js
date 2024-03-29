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
    // Créer les documents individuels pour les acteurs (si nécessaire)
    const actors = req.body.actors;

    for (let i = 0; i < actors.length; i++) {
      const actor = actors[i];
      const actorId = actor.id;

      const agileDocumentRef = db
        .collection("dashboard")
        .doc(req.params.dashboardId)
        .collection("agile")
        .doc(actorId);

      const documentSnapshot = await agileDocumentRef.get();
      if (!documentSnapshot.exists) {
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
          persona: {},
        });
      }
    }
    res.status(200).send({ message: "Impact mapping added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};
/// Path to recup all foldersAgile
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
/// Path to Upload zip foldersAgile
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
/// Path to upload pdf on agile Folder
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

    const fieldValue =
      req.protocol + "://" + req.get("host") + "/" + pdfFile.path;

    const agileDocumentRef = db
      .collection("dashboard")
      .doc(req.params.dashboardId)
      .collection("agile")
      .doc("agile_folder");

    const snapshot = await agileDocumentRef.get();
    const previousData = snapshot.exists ? snapshot.data() : null;
    if (fieldName === "personas" || fieldName === "empathy_map") {
      if (Object.keys(previousData[fieldName]).length === 0) {
        // Le champ personas est vide
        // Ajouter un nouvel objet avec l'id égal à req.params.actorId
        const newPersonas = [{ id: req.body.actorId, url: fieldValue }];
        await agileDocumentRef.update({
          [fieldName]: newPersonas,
        });
      } else {
        // Le champ personas contient des données
        // Vérifier si l'id existe déjà dans le champ personas
        const personas = previousData[fieldName];
        const existingPersona = personas.find(
          (persona) => persona.id === req.body.actorId
        );

        if (existingPersona) {
          // Supprimer le fichier précédent s'il existe
          const previousFilePath = existingPersona.url.split("/").pop();
          const previousFilePathOnDisk =
            __dirname + "/uploads/" + previousFilePath;
          if (fs.existsSync(previousFilePathOnDisk)) {
            fs.unlinkSync(previousFilePathOnDisk);
          }

          // Mettre à jour avec le nouveau fichier
          existingPersona.url = fieldValue;
        } else {
          // Ajouter un nouvel objet avec l'id égal à req.body.actorId
          personas.push({ id: req.body.actorId, url: fieldValue });
        }

        await agileDocumentRef.update({
          [fieldName]: personas,
        });
      }
    } else {
      // Vérifier si le champ existe déjà dans la base de données
      if (previousData && previousData.hasOwnProperty(fieldName)) {
        // Supprimer le fichier précédent s'il existe
        const previousFilePath = previousData[fieldName].split("/").pop();
        const previousFilePathOnDisk =
          __dirname + "/uploads/" + previousFilePath;
        if (fs.existsSync(previousFilePathOnDisk)) {
          fs.unlinkSync(previousFilePathOnDisk);
        }
      }
      // Mettre à jour le champ avec la nouvelle valeur
      const updateData = {};
      updateData[fieldName] = fieldValue;

      await agileDocumentRef.update(updateData);
    }

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
/// Path to delete actor
const deleteActor = async (req, res) => {
  try {
    const dashboardRef = db.collection("dashboard").doc(req.params.dashboardId);
    const agileRef = dashboardRef.collection("agile").doc(req.params.actorId);
    const agileFolderRef = agileRef.collection("agile").doc("agile_folder");
    const snapshot = await agileRef.get();

    if (snapshot.exists) {
      // Le document existe, on peut le supprimer
      await agileRef.delete();

      // Mettre à jour les champs empathy_map et personas dans agile_folder
      const agileFolderSnapshot = await agileFolderRef.get();
      if (agileFolderSnapshot.exists) {
        const agileFolderData = agileFolderSnapshot.data();
        if (agileFolderData.hasOwnProperty("empathy_map")) {
          // Filtrer les objets ayant un ID différent de actorId dans empathy_map
          const updatedEmpathyMap = agileFolderData.empathy_map.filter(
            (item) => {
              if (item.id === req.params.actorId) {
                // Supprimer le fichier précédent s'il existe
                const previousFilePath = item.url.split("/").pop();
                const previousFilePathOnDisk =
                  __dirname + "/uploads/" + previousFilePath;
                if (fs.existsSync(previousFilePathOnDisk)) {
                  fs.unlinkSync(previousFilePathOnDisk);
                }
                return false; // Ne pas inclure l'objet dans le tableau mis à jour
              }
              return true; // Inclure les autres objets dans le tableau mis à jour
            }
          );
          await agileFolderRef.update({ empathy_map: updatedEmpathyMap });
        }
        if (agileFolderData.hasOwnProperty("personas")) {
          // Filtrer les objets ayant un ID différent de actorId dans personas
          const updatedPersonas = agileFolderData.personas.filter((item) => {
            if (item.id === req.params.actorId) {
              // Supprimer le fichier précédent s'il existe
              const previousFilePath = item.url.split("/").pop();
              const previousFilePathOnDisk =
                __dirname + "/uploads/" + previousFilePath;
              if (fs.existsSync(previousFilePathOnDisk)) {
                fs.unlinkSync(previousFilePathOnDisk);
              }
              return false; // Ne pas inclure l'objet dans le tableau mis à jour
            }
            return true; // Inclure les autres objets dans le tableau mis à jour
          });
          await agileFolderRef.update({ personas: updatedPersonas });
        }
      }

      res.status(204).send({ message: "Actor deleted successfully" });
    } else {
      // Le document n'existe pas
      res.status(404).send({ message: "Actor not found" });
    }
  } catch (error) {
    console.error(error);
    // Erreur côté serveur
    res
      .status(500)
      .send({ message: "An error occurred while deleting the actor" });
  }
};
const updateElevatorPitch = async (req, res) => {
  if (
    !req.body ||
    !req.body.name ||
    !req.body.forWho ||
    !req.body.needed ||
    !req.body.type ||
    !req.body.who ||
    !req.body.difference ||
    !req.body.alternative
  ) {
    res.status(400).send({ message: "Missing required fields" });
    return;
  }
  try {
    await db
      .collection("dashboard")
      .doc(req.params.dashboardId)
      .collection("agile")
      .doc("elevator_pitch")
      .update({
        name: req.body.name,
        forWho: req.body.forWho,
        needed: req.body.needed,
        type: req.body.type,
        who: req.body.who,
        difference: req.body.difference,
        alternative: req.body.alternative,
      });

    res.send({ message: "Elevator Pitch added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};
const resetElevatorPitch = async (req, res) => {
  try {
    await db
      .collection("dashboard")
      .doc(req.params.dashboardId)
      .collection("agile")
      .doc("elevator_pitch")
      .put({
        name: "",
        forWho: "",
        needed: "",
        type: "",
        who: "",
        difference: "",
      });

    res.status(204).send({ message: "Elevator Pitch deleted successfully" });
  } catch (e) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};
/// Path to update tree
const putTree = async (req, res) => {
  try {
    await db
      .collection("dashboard")
      .doc(req.params.dashboardId)
      .collection("agile")
      .doc("functional-tree")
      .update({ content: req.body });

    res.status(200).send({ message: "Update functional tree" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

/// Path to websocket
const agileRequest = async (connection) => {
  connection.on("message", async (message) => {
    const dashboardId = JSON.parse(message.utf8Data);
    const agileCollectionRef = db
      .collection("dashboard")
      .doc(dashboardId)
      .collection("agile");

    try {
      const querySnapshot = await agileCollectionRef.get();
      const data = {
        elevator: {},
        impactMapping: {},
        functionalTree: {},
        others: [],
      };

      for (const doc of querySnapshot.docs) {
        const obj = doc.data();
        if (doc.id === "elevator_pitch") {
          data.elevator = { ...obj, id: doc.id };
        } else if (doc.id === "impact_mapping") {
          data.impactMapping = { ...obj, id: doc.id };
        } else if (doc.id === "functional-tree") {
          data.functionalTree = { ...obj, id: doc.id };
        } else {
          const impactMappingRef = agileCollectionRef.doc("impact_mapping");
          const impactMappingSnapshot = await impactMappingRef.get();
          if (!impactMappingSnapshot.empty) {
            const impactMappingData = impactMappingSnapshot.data();
            const actors = impactMappingData.actors || [];
            obj.id = doc.id;
            actors.forEach((actor) => {
              if (actor.id === obj.id) {
                const otherObj = { ...obj, id: doc.id, text: actor.text };
                data.others.push(otherObj);
              }
            });
          }
        }
      }

      connection.sendUTF(JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  });
};
const impactMappingRequest = async (connection) => {
  connection.on("message", async (message) => {
    const impactMapping = JSON.parse(message.utf8Data);

    let impactMappingRef = db
      .collection("dashboard")
      .doc(impactMapping.dashboardId)
      .collection("agile")
      .doc("impact_mapping");

    const documentSnapshot = await impactMappingRef.get();

    if (!documentSnapshot.exists) {
      return null;
    }

    impactMappingRef.onSnapshot(
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
const elevatorPitchRequest = async (connection) => {
  connection.on("message", async (message) => {
    const elevatorPitch = JSON.parse(message.utf8Data);

    let elevatorPitchRef = db
      .collection("dashboard")
      .doc(elevatorPitch.dashboardId)
      .collection("agile")
      .doc("elevator_pitch");

    const documentSnapshot = await elevatorPitchRef.get();

    if (!documentSnapshot.exists) {
      return null;
    }

    elevatorPitchRef.onSnapshot(
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
const empathyRequest = async (connection) => {
  connection.on("message", async (message) => {
    const empathy = JSON.parse(message.utf8Data);

    const agileCollectionRef = db
      .collection("dashboard")
      .doc(empathy.dashboardId)
      .collection("agile");

    const agileDocumentRef = agileCollectionRef.doc(empathy.actorId);

    // Vérifier l'existence du document
    const documentSnapshot = await agileDocumentRef.get();
    if (documentSnapshot.exists) {
      // Le document existe, mettre à jour les données
      if (!documentSnapshot.data().hasOwnProperty("empathy_map")) {
        await agileDocumentRef.update({
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

      // Écouter les modifications du document
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
    } else {
      // Le document n'existe pas, créer un nouveau document
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

      // Écouter les modifications du document
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
    }
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

    if (!documentSnapshot.data().hasOwnProperty("persona")) {
      await agileDocumentRef.update({
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
const treeRequest = async (connection) => {
  connection.on("message", async (message) => {
    const dashboardId = JSON.parse(message.utf8Data);
    console.log(dashboardId);

    let impactMappingRef = db
      .collection("dashboard")
      .doc(dashboardId)
      .collection("agile")
      .doc("functional-tree");

    const documentSnapshot = await impactMappingRef.get();

    if (!documentSnapshot.exists) {
      return null;
    }

    impactMappingRef.onSnapshot(
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
  getFoldersAgile,
  getZipFolderAgile,
  changeIndex,
  createPostit,
  deletePostit,
  updatePdfInAgileFolder,
  addPersona,
  deleteActor,
  updateElevatorPitch,
  resetElevatorPitch,
  putTree,
  agileRequest,
  impactMappingRequest,
  empathyRequest,
  personaRequest,
  treeRequest,
  elevatorPitchRequest,
};

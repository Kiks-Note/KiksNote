const { auth, db } = require("../firebase");
const archiver = require("archiver");
const axios = require("axios");
const path = require("path");

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
  console.log(req.params.dashboardId);
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
        impacts: req.body.goals,
      });
    res.status(200).send({ message: "Impact mapping added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const getImpactMapping = async () => {
  try {
    const data = await db
      .collection("dashboard")
      .doc(req.params.dashboardId)
      .collection("agile")
      .doc("impact_mapping")
      .get();
    if (data.exists) {
      return data.data();
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
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
const changeIndex = async (req, res) => {
  var data = req.body;
  console.log(data);
  await db
    .collection("dashboard")
    .doc(req.params.dashboardId)
    .collection("board")
    .doc(req.params.boardId)
    .update({
      think: data[0],
      see: data[1],
      do: data[2],
      hear: data[3],
    });
};

module.exports = {
  addImpactMapping,
  getImpactMapping,
  getFoldersAgile,
  getZipFolderAgile,
  changeIndex,
};

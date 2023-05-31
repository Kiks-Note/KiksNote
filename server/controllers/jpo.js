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

const getAllJpo = async (req, res) => {
  try {
    const snapshot = await db.collection("jpo").get();
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

const createJpo = async (req, res) => {
  try {
    const { jpoTitle, jpoDescription, jpoThumbnail, jpoDayStart, jpoDayEnd } =
      req.body;

    const mimeType = "image/png";
    const fileExtension = mime.extension(mimeType);
    const fileName = `${jpoTitle}.${fileExtension}`;

    const buffer = Buffer.from(
      jpoThumbnail.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
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
      jpoDayStart: jpoDayStart,
      jpoDayEnd: jpoDayEnd,
    };

    const jpoRef = await db.collection("jpo").add(jpoData);
    const newJPO = await jpoRef.get();

    res.status(200).json({
      message: "JPO créée avec succès.",
      jpoData: {
        id: newJPO.id,
        ...newJPO.data(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la création de la JPO.");
  }
};

module.exports = {
  getAllJpo,
  getJpoById,
  createJpo,
};

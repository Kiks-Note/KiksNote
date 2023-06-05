const { db, storageFirebase } = require("../firebase");
const bucket = storageFirebase.bucket();
const mime = require("mime-types");

const getAllTechnos = async (req, res) => {
  try {
    const snapshot = await db.collection("technos").get();
    const technos = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    res.status(200).json(technos);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération des technos.");
  }
};

const getTechnoById = async (req, res) => {
  try {
    const technoRef = await db.collection("technos").doc(req.params.id).get();
    if (!technoRef.exists) {
      return res.status(404).send("Techno non trouvée");
    } else {
      return res.status(200).send({
        id: technoRef.id,
        data: technoRef.data(),
      });
    }
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la récupération de la techno par ID.");
  }
};

const createTechno = async (req, res) => {
  try {
    const { name, image } = req.body;

    const mimeType = "image/png";
    const fileExtension = mime.extension(mimeType);
    const fileName = `${name}.${fileExtension}`;

    const buffer = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const file = bucket.file(`technos/${fileName}`);

    const options = {
      metadata: {
        contentType: mimeType || "image/jpeg",
        cacheControl: "public, max-age=31536000",
      },
    };

    await file.save(buffer, options);

    const [urlImage] = await file.getSignedUrl({
      action: "read",
      expires: "03-17-2025",
    });

    const technoData = {
      name: name,
      image: urlImage,
    };

    const technoRef = await db.collection("technos").add(technoData);
    const newTechnoData = await technoRef.get();

    res.status(200).json({
      message: "Techno créée avec succès.",
      technoData: technoData,
      technoId: newTechnoData.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la création de la techno.");
  }
};

const deleteTechnoById = async (req, res) => {
  try {
    const technoRef = db.collection("technos").doc(req.params.id);
    const technoDoc = await technoRef.get();

    if (!technoDoc.exists) {
      return res.status(404).send("Techno non trouvée");
    }

    await technoRef.delete();

    return res.status(200).send("Techno supprimée avec succès.");
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la suppression de la techno.");
  }
};

module.exports = {
  getAllTechnos,
  getTechnoById,
  createTechno,
  deleteTechnoById,
};

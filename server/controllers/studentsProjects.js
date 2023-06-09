const { db, FieldValue, storageFirebase } = require("../firebase");
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
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/pdf" && file.mimetype !== "video/mp4") {
      return cb(new Error("Le fichier doit être un PDF ou un MP4."));
    }
    cb(null, true);
  },
}).single("media");

const getAllStudents = async (req, res) => {
  try {
    const snapshot = await db
      .collection("users")
      .where("status", "in", ["etudiant"])
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

const getStudentById = async (req, res) => {
  try {
    const studentRef = await db.collection("users").doc(req.params.id).get();
    if (!studentRef.exists) {
      return res.status(404).send("Etudiant non trouvé");
    } else {
      return res.status(200).send({
        id: studentRef.id,
        data: studentRef.data(),
      });
    }
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la récupération de l'étudiant par ID.");
  }
};

const getBlogTutorials = async (req, res) => {
  try {
    const tutorialsRef = await db
      .collection("blog")
      .where("type", "==", "tuto")
      .get();

    const tutorials = [];
    tutorialsRef.forEach((doc) => {
      tutorials.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    return res.status(200).send(tutorials);
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la récupération des tutoriels.");
  }
};

const getBlogById = async (req, res) => {
  const blogId = req.params.id;

  try {
    const blogDoc = await db.collection("blog").doc(blogId).get();

    if (!blogDoc.exists) {
      return res.status(404).send("Le blog demandé n'a pas été trouvé.");
    }

    const blog = {
      id: blogDoc.id,
      data: blogDoc.data(),
    };

    return res.status(200).send(blog);
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la récupération du blog.");
  }
};

const getStudentProjectById = async (req, res) => {
  const projectId = req.params.id;

  try {
    const projectSnapshot = await db
      .collection("students_projects")
      .doc(projectId)
      .get();

    if (!projectSnapshot.exists) {
      res.status(404).send("Le projet spécifié n'a pas été trouvé.");
      return;
    }

    const project = projectSnapshot.data();

    res.status(200).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération du projet étudiant.");
  }
};

const getAllStudentsProjects = async (req, res) => {
  try {
    const snapshot = await db.collection("students_projects").get();
    const projects_students = [];
    snapshot.forEach((doc) => {
      projects_students.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).send(projects_students);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la création du projet étudiant.");
  }
};

const createStudentProject = async (req, res) => {
  try {
    const {
      StudentId,
      nameProject,
      RepoProjectLink,
      promoProject = [],
      membersProject = [],
      technosProject = [],
      typeProject,
      descriptionProject,
      imgProject,
      counterRef,
    } = req.body;

    const creatorProjectRef = await db.collection("users").doc(StudentId).get();

    if (!creatorProjectRef.exists) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    const creatorProjectData = {
      id: creatorProjectRef.id,
      firstname: creatorProjectRef.data().firstname,
      lastname: creatorProjectRef.data().lastname,
    };

    if (creatorProjectRef.data().image) {
      creatorProjectData.image = creatorProjectRef.data().image;
    }

    const mimeType = "image/png";
    const fileExtension = mime.extension(mimeType);
    const fileName = `${nameProject}.${fileExtension}`;

    const buffer = Buffer.from(
      imgProject.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const file = bucket.file(`students_projects/${nameProject}/${fileName}`);

    const options = {
      metadata: {
        contentType: mimeType || "image/jpeg",
        cacheControl: "public, max-age=31536000",
      },
    };

    await file.save(buffer, options);

    const [urlImageProject] = await file.getSignedUrl({
      action: "read",
      expires: "03-17-2025",
    });

    const projectData = {
      creatorProject: creatorProjectData,
      nameProject: nameProject,
      RepoProjectLink: RepoProjectLink,
      typeProject: typeProject,
      descriptionProject: descriptionProject,
      imgProject: urlImageProject,
      counterRef: counterRef,
      createdProjectAt: new Date(),
    };

    const promoProjectData = [];
    for (const promosId of promoProject) {
      const promoProjectRef = await db.collection("class").doc(promosId).get();
      if (promoProjectRef.exists) {
        const promoData = {
          id: promoProjectRef.id,
          cursus: promoProjectRef.data().cursus,
          name: promoProjectRef.data().name,
          promo: promoProjectRef.data().promo,
          site: promoProjectRef.data().site,
        };

        promoProjectData.push(promoData);
      }
    }
    projectData.promoProject = promoProjectData;

    const membersData = [];
    for (const memberId of membersProject) {
      const memberRef = await db.collection("users").doc(memberId).get();
      if (memberRef.exists) {
        const memberData = {
          id: memberRef.id,
          firstname: memberRef.data().firstname,
          lastname: memberRef.data().lastname,
        };

        if (memberRef.data().image) {
          memberData.image = memberRef.data().image;
        }

        membersData.push(memberData);
      }
    }
    projectData.membersProject = membersData;

    const technosData = [];

    for (const technosId of technosProject) {
      const technosRef = await db.collection("technos").doc(technosId).get();
      if (technosRef.exists) {
        const technoData = {
          id: technosRef.id,
          name: technosRef.data().name,
          image: technosRef.data().image,
        };
        technosData.push(technoData);
      }
    }
    projectData.technosProject = technosData;

    const projectsRef = db.collection("students_projects");
    const newProject = await projectsRef.add(projectData);

    const newProjectData = await newProject.get();

    res.status(200).json({
      message: "Projet étudiant créé avec succès.",
      projectData: projectData,
      projectId: newProjectData.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la création du projet étudiant.");
  }
};

const uploadMediaProject = async (req, res) => {
  try {
    await upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        res.status(400).json({ error: "Error uploading file." });
      } else if (err) {
        res.status(400).json({ error: err.message });
      } else {
        if (!req.file) {
          res.status(400).json({ error: "No file uploaded." });
          return;
        }

        const { projectId, nameProject } = req.body;
        const file = req.file;
        const filePath = req.file.path;

        const fileName = req.file.originalname;
        const fileSize = req.file.size;
        const fileType = mime.lookup(filePath);

        if (!file) {
          return res.status(400).send("Aucun fichier n'a été téléchargé.");
        }

        const projectRef = db.collection("students_projects").doc(projectId);
        const projectSnapshot = await projectRef.get();

        if (!projectSnapshot.exists) {
          return res.status(404).send("Projet étudiant non trouvé.");
        }

        const fileRef = bucket.file(
          `students_projects/${nameProject}/${fileName}`
        );

        const options = {
          metadata: {
            contentType: file.mimetype || "video/mp4",
            cacheControl: "public, max-age=31536000",
          },
        };

        await fileRef.save(file.buffer, options);

        const [url] = await fileRef.getSignedUrl({
          action: "read",
          expires: "03-17-2025",
        });

        const mediaData = {
          url: url,
          name: fileName,
          type: fileType,
          size: fileSize,
        };

        await projectRef.update({
          mediaProject: mediaData,
        });

        res.status(200).json({
          message: "Fichier vidéo uploadé avec succès.",
          mediaData: mediaData,
        });
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

const refStudentProject = async (req, res) => {
  try {
    const { projectId, counterRefToAdd, userId } = req.body;

    const projectRef = db.collection("students_projects").doc(projectId);

    const projectSnapshot = await projectRef.get();

    if (!projectSnapshot.exists) {
      res.status(404).json({ message: "Projet étudiant non trouvé." });
      return;
    }

    const currentCounterRef = projectSnapshot.data().counterRef;
    const updatedCounterRef = currentCounterRef + counterRefToAdd;

    const projectData = projectSnapshot.data();
    const voters = projectData.voters || [];
    const hasVoted = voters.some((voter) => voter.id === userId);

    if (hasVoted) {
      res
        .status(403)
        .json({ message: "Vous avez déjà mise en avant ce projet." });
      return;
    }

    await projectRef.update({ counterRef: updatedCounterRef });

    const userRef = await db.collection("users").doc(userId).get();
    if (userRef.exists) {
      const userData = {
        id: userRef.id,
        firstname: userRef.data().firstname,
        lastname: userRef.data().lastname,
        status: userRef.data().status,
      };

      if (userRef.data().image) {
        userData.image = userRef.data().image;
      }

      voters.push(userData);

      await projectRef.update({ voters: voters });
    }

    res.status(200).json({
      message: "Projet étudiant mis à jour avec succès.",
      projectId: projectId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la mise à jour du projet étudiant.");
  }
};

const createLinkedBlogTuto = async (req, res) => {
  const projectId = req.params.projectId;
  const blogTutoId = req.body.blogTutoId;

  try {
    const projectRef = db.collection("students_projects").doc(projectId);

    const projectDoc = await projectRef.get();
    if (!projectDoc.exists) {
      return res.status(404).send("Le projet spécifié n'a pas été trouvé.");
    }

    await projectRef.update({
      linkedBlogTuto: blogTutoId,
    });

    return res
      .status(200)
      .send("Le blog tutoriel a été lié au projet avec succès.");
  } catch (err) {
    console.error(err);
    throw new Error(
      "Erreur lors de la création du lien entre le blog tutoriel et le projet."
    );
  }
};

const removeLinkedBlogTuto = async (req, res) => {
  const projectId = req.params.projectId;

  try {
    const projectRef = db.collection("students_projects").doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return res.status(404).send("Le projet spécifié n'a pas été trouvé.");
    }

    if (!projectDoc.data().linkedBlogTuto) {
      return res
        .status(404)
        .send("Aucun blog tutoriel n'est associé à ce projet.");
    }

    await projectRef.update({
      linkedBlogTuto: FieldValue.delete(),
    });

    return res
      .status(200)
      .send("Le lien avec le blog tutoriel a été supprimé avec succès.");
  } catch (err) {
    console.error(err);
    throw new Error(
      "Erreur lors de la suppression du lien entre le blog tutoriel et le projet."
    );
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getBlogTutorials,
  getBlogById,
  getStudentProjectById,
  getAllStudentsProjects,
  createStudentProject,
  uploadMediaProject,
  refStudentProject,
  createLinkedBlogTuto,
  removeLinkedBlogTuto,
};

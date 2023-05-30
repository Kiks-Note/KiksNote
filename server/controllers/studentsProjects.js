const { db, storageFirebase } = require("../firebase");
const bucket = storageFirebase.bucket();
const mime = require("mime-types");

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
      promoProject,
      membersProject = [],
      typeProject,
      descriptionProject,
      imgProject,
      counterRef,
    } = req.body;

    const promoProjectRef = await db
      .collection("class")
      .doc(promoProject)
      .get();

    if (!promoProjectRef.exists) {
      return res.status(404).send("Classe non trouvée");
    }

    const projectPromoData = promoProjectRef.data();
    projectPromoData.id = promoProjectRef.id;

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
    const file = bucket.file(
      `students_projects/${projectPromoData.name}/${nameProject}/${fileName}`
    );

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
      promoProject: projectPromoData,
      typeProject: typeProject,
      descriptionProject: descriptionProject,
      imgProject: urlImageProject,
      counterRef: counterRef,
      createdProjectAt: new Date(),
    };

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

module.exports = {
  getAllStudents,
  getStudentById,
  getBlogTutorials,
  getStudentProjectById,
  getAllStudentsProjects,
  createStudentProject,
  refStudentProject,
};

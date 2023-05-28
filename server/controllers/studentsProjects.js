const { db } = require("../firebase");

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
      image: creatorProjectRef.data().image,
    };

    const projectData = {
      StudentId: creatorProjectData,
      nameProject: nameProject,
      RepoProjectLink: RepoProjectLink,
      promoProject: projectPromoData,
      typeProject: typeProject,
      descriptionProject: descriptionProject,
      imgProject: imgProject,
      counterRef: counterRef,
      createdProjectAt: new Date(),
    };

    const groupMembers = membersProject.map((member, index) => ({
      [`member${index + 1}`]: member,
    }));

    projectData.membersProject = Object.assign({}, ...groupMembers);

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
    const { projectId, counterRefToAdd } = req.body;

    const projectRef = db.collection("students_projects").doc(projectId);

    const projectSnapshot = await projectRef.get();

    if (!projectSnapshot.exists) {
      res.status(404).json({ message: "Projet étudiant non trouvé." });
      return;
    }

    const currentCounterRef = projectSnapshot.data().counterRef;
    const updatedCounterRef = currentCounterRef + counterRefToAdd;

    await projectRef.update({ counterRef: updatedCounterRef });

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
  getStudentProjectById,
  getAllStudentsProjects,
  createStudentProject,
  refStudentProject,
};

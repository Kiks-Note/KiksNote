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
      membersProject = [],
      typeProject,
      descriptionProject,
      imgProject,
      counterRef,
    } = req.body;

    const projectData = {
      StudentId: StudentId,
      nameProject: nameProject,
      RepoProjectLink: RepoProjectLink,
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

module.exports = {
  getAllStudents,
  getAllStudentsProjects,
  createStudentProject,
};

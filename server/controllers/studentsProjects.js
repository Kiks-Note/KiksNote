const { db } = require("../firebase");

const createStudentProject = async (req, res) => {
  try {
    const {
      StudentId,
      nameProject,
      RepoProjectLink,
      membersProject = [],
      typeProject,
      counterRef,
    } = req.body;

    const projectData = {
      StudentId: StudentId,
      nameProject: nameProject,
      RepoProjectLink: RepoProjectLink,
      typeProject: typeProject,
      counterRef: counterRef,
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
  createStudentProject,
};

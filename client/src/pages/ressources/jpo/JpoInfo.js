import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import moment from "moment";

import { Typography, Button, ListItem } from "@mui/material";

import StudentProjectLinkDialog from "./StudentProjectLinkDialog";

import "./JpoInfo.scss";

const JpoInfo = () => {
  const { id } = useParams();

  const [jpoData, setJpoData] = useState();
  const [projects, setProjects] = useState([]);

  const [openStudentsProject, setOpenStudentsProject] = useState(false);

  const getJpoById = async () => {
    try {
      await axios
        .get(`http://localhost:5050/ressources/jpo/${id}`)
        .then((res) => {
          setJpoData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getAllProjects = async () => {
    try {
      await axios
        .get("http://localhost:5050/ressources/students-projects")
        .then((res) => {
          setProjects(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenStudentsProject = () => {
    setOpenStudentsProject(true);
    getAllProjects();
  };

  const handleCloseStudentsProject = () => {
    setOpenStudentsProject(false);
  };

  useEffect(() => {
    getJpoById();
  }, []);

  return (
    <>
      <div className="jpo-details-container">
        <Typography variant="h3">Titre : {jpoData?.jpoTitle}</Typography>
        <Typography variant="body1">
          Description : {jpoData?.jpoDescription}
        </Typography>
        {/* <img src={jpoData?.jpoThumbnail} alt="jpo" /> */}
        <Typography>
          {moment
            .unix(jpoData?.jpoDayStart?._seconds)
            .format("DD.MM.YYYY HH:mm")}
          {" - "} 
          {moment.unix(jpoData?.jpoDayEnd?._seconds).format("DD.MM.YYYY HH:mm")}
        </Typography>
        <Button onClick={handleOpenStudentsProject}>
          Lier à un projet étudiant
        </Button>
        <div className="list-students-project-linked">
          <Typography
            sx={{
              fontWeight: "bold",
              padding: "10px",
            }}
          >
            Liste des projets étudiants présentés lors de cette jpo :
          </Typography>
          {jpoData?.linkedStudentProjects.map((project) => (
            <ListItem
              key={project.id}
              sx={{
                padding: "10px 0px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                borderTop: "1px solid grey",
              }}
            >
              <Typography>{project.nameProject}</Typography>
            </ListItem>
          ))}
        </div>
      </div>
      <StudentProjectLinkDialog
        open={openStudentsProject}
        close={handleCloseStudentsProject}
        allprojects={projects}
      />
    </>
  );
};

export default JpoInfo;
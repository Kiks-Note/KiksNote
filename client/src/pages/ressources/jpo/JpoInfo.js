import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import moment from "moment";

import { Typography, Button, Card } from "@mui/material";

import StudentProjectLinkDialog from "./StudentProjectLinkDialog";

import VisibilityIcon from "@mui/icons-material/Visibility";

import notify from "../../../assets/img/notify.svg";
import "./JpoInfo.scss";

import { makeStyles } from "@mui/styles";

import PdfCommercialBrochureViewer from "./PdfCommercialBrochureViewer";

const useStyles = makeStyles({
  btnProject: {
    backgroundColor: "#7a52e1",
    color: "white",
    "&:hover": {
      backgroundColor: "#7a52e1",
      fontWeight: "bold",
    },
  },
  btnLinkProject: {
    backgroundColor: "#7a52e1",
    color: "white",
    "&:hover": {
      backgroundColor: "#7a52e1",
      fontWeight: "bold",
    },
  },
});

const JpoInfo = () => {
  const classes = useStyles();
  let navigate = useNavigate();

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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            padding: "30px",
          }}
        >
          <img
            className="jpo-info-image"
            src={jpoData?.jpoThumbnail}
            alt="jpo"
          />
        </div>
        <div className="head-jpo-container">
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", paddingLeft: "5%" }}
          >
            {jpoData?.jpoTitle}
          </Typography>
          <Typography sx={{ paddingRight: "5%" }}>
            {moment
              .unix(jpoData?.jpoDayStart?._seconds)
              .format("DD.MM.YYYY HH:mm")}
            {" - "} 
            {moment
              .unix(jpoData?.jpoDayEnd?._seconds)
              .format("DD.MM.YYYY HH:mm")}
          </Typography>
        </div>
        <div className="jpoinfo-sections">
          <section className="jpo-left-side-section">
            <Typography variant="body1" sx={{ color: "lightgray" }}>
              {jpoData?.jpoDescription}
            </Typography>
            <div className="list-students-project-linked">
              <Typography
                sx={{
                  fontWeight: "bold",
                  padding: "10px",
                }}
              >
                Liste des projets étudiants présentés lors de cette jpo :
              </Typography>

              {jpoData?.linkedStudentProjects ||
              jpoData?.linkedStudentProjects?.length > 0 ? (
                <>
                  {jpoData?.linkedStudentProjects?.map((project) => (
                    <Card
                      key={project.id}
                      sx={{
                        padding: "10px 0px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "80%",
                        marginBottom: "10px",
                      }}
                    >
                      <div className="img-name-project-link-jpo-page">
                        <img
                          src={project.imgProject}
                          className="project-img"
                          alt="projet truc"
                        />
                        <Typography fontWeight={"bold"} paddingLeft={"10px"}>
                          {project.nameProject}
                        </Typography>
                      </div>
                      <div className="button-project">
                        <Button
                          onClick={() => {
                            navigate(`/studentprojects/${project.id}`);
                          }}
                          className={classes.btnProject}
                        >
                          Voir le projet &nbsp;
                          <VisibilityIcon />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </>
              ) : (
                <>
                  <div className="no-project-linked">
                    <p className="text-center p-5 font-bold">
                      Aucun projet étudiant lié à cette JPO pour le moment.
                    </p>
                    <img
                      className="no-class-img"
                      src={notify}
                      alt="no-jpo-uploaded"
                    />
                  </div>
                </>
              )}
            </div>
          </section>
          <section className="jpo-right-side-section">
            <Typography sx={{ fontWeight: "bold", padding: "10px" }}>
              Plaquette Commerciale JPO
            </Typography>
            <PdfCommercialBrochureViewer
              base64={jpoData?.linkCommercialBrochure?.pdfBase64}
            />
            <Button
              sx={{ marginTop: "30px", marginBottom: "30px" }}
              onClick={handleOpenStudentsProject}
              className={classes.btnLinkProject}
            >
              Lier à un projet étudiant
            </Button>
          </section>
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

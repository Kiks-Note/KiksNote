import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useFirebase from "../../../hooks/useFirebase";

import { toast, ToastContainer } from "react-toastify";

import moment from "moment";

import { Typography, Button, Card, Skeleton } from "@mui/material";

import StudentProjectLinkDialog from "./StudentProjectLinkDialog";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddLinkIcon from "@mui/icons-material/AddLink";

import notify from "../../../assets/img/notify.svg";
import "./JpoInfo.scss";

import { makeStyles } from "@mui/styles";

import PdfCommercialBrochureViewer from "./PdfCommercialBrochureViewer";

const options = {
  autoClose: 2000,
  className: "",
  position: toast.POSITION.TOP_RIGHT,
  theme: "colored",
};

export const toastSuccess = (message) => {
  toast.success(message, options);
};

export const toastWarning = (message) => {
  toast.warning(message, options);
};

export const toastFail = (message) => {
  toast.error(message, options);
};

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
  btnDeleteJop: {
    backgroundColor: "red",
    color: "white",
    "&:hover": {
      backgroundColor: "darkred",
      fontWeight: "bold",
    },
  },
});

const JpoInfo = () => {
  const classes = useStyles();
  let navigate = useNavigate();

  const { user } = useFirebase();
  const userStatus = user?.status;

  const { id } = useParams();

  const [jpoData, setJpoData] = useState();
  const [projects, setProjects] = useState([]);

  const [openStudentsProject, setOpenStudentsProject] = useState(false);

  const [loading, setLoading] = useState(true);

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

  const DeleteJpoById = async (jpoTitle) => {
    const data = { jpoTitle };

    try {
      await axios
        .delete(`http://localhost:5050/ressources/jpo/${id}`, { data })
        .then((res) => {
          console.log(res.data);
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

  const deleteJpo = async () => {
    DeleteJpoById(jpoData?.jpoTitle);
    toastSuccess(`Votre jpo ${jpoData?.jpoTitle} a bien été supprimé !`);
    setTimeout(() => {
      navigate("/jpo");
    }, 4000);
  };

  useEffect(() => {
    getJpoById()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ? (
        <>
          <div className="jpo-details-container">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Skeleton width={800} height={500} variant="rectangular" />
            </div>
            <div className="head-jpo-container">
              <Typography
                variant="h3"
                sx={{ fontWeight: "bold", paddingLeft: "5%" }}
              >
                <Skeleton width={200} />
              </Typography>
              <Typography sx={{ paddingRight: "5%" }}>
                <Skeleton width={150} />
              </Typography>
            </div>
            <div className="jpoinfo-sections">
              <section className="jpo-left-side-section">
                <Typography variant="body1" sx={{ color: "lightgray" }}>
                  <Skeleton count={4} />
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

                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card
                      key={index}
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
                        <Skeleton
                          width={70}
                          height={30}
                          variant="rectangular"
                        />
                        <Typography fontWeight={"bold"} paddingLeft={"10px"}>
                          <Skeleton width={150} />
                        </Typography>
                      </div>
                      <div className="button-project">
                        <Button className={classes.btnProject}>
                          <Skeleton width={150} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
              <section className="jpo-right-side-section">
                <Typography sx={{ fontWeight: "bold", padding: "10px" }}>
                  Plaquette Commerciale JPO
                </Typography>
                <Skeleton width={500} height={800} variant="rectangular" />
                <Button
                  sx={{ marginTop: "30px", marginBottom: "30px" }}
                  className={classes.btnLinkProject}
                >
                  <Skeleton width={100} />
                </Button>
              </section>
            </div>
          </div>
        </>
      ) : (
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
                            <Typography
                              fontWeight={"bold"}
                              paddingLeft={"10px"}
                            >
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
                              <Typography>Voir le projet</Typography>
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
                {userStatus === "pedago" ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-around",
                      }}
                    >
                      <Button
                        sx={{ marginTop: "30px", marginBottom: "30px" }}
                        onClick={handleOpenStudentsProject}
                        className={classes.btnLinkProject}
                      >
                        Lier à un projet étudiant <AddLinkIcon />
                      </Button>
                      <Button
                        sx={{ marginTop: "30px", marginBottom: "30px" }}
                        onClick={deleteJpo}
                        className={classes.btnDeleteJop}
                      >
                        Supprimer la Jpo <DeleteIcon />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div></div>
                )}
              </section>
            </div>
          </div>
          <StudentProjectLinkDialog
            open={openStudentsProject}
            close={handleCloseStudentsProject}
            allprojects={projects}
            jpoData={jpoData}
            getJpoById={getJpoById}
          />
        </>
      )}
      <ToastContainer></ToastContainer>
    </>
  );
};

export default JpoInfo;

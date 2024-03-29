import React, {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import axios from "axios";
import useFirebase from "../../../hooks/useFirebase";

import {toast, ToastContainer} from "react-toastify";

import moment from "moment";

import {
  Typography,
  Button,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Container,
} from "@mui/material";

import StudentProjectLinkDialog from "./../../../components/ressources/jpo/StudentProjectLinkDialog";
import UpdateJpoPdf from "./../../../components/ressources/jpo/UpdateJpoPdf";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddLinkIcon from "@mui/icons-material/AddLink";
import EditIcon from "@mui/icons-material/Edit";

import notify from "../../../assets/img/notify.svg";
import "./JpoInfo.scss";

import {makeStyles} from "@mui/styles";

import UpdateJpoDialog from "./../../../components/ressources/jpo/UpdateJpoDialog";
import PdfCommercialBrochureViewer from "./../../../components/ressources/jpo/PdfCommercialBrochureViewer";
import SkeletonJpoInfo from "../../../components/ressources/jpo/SkeletonJpoInfo";

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
  avatar: {
    marginRight: "20px",
  },
  btnProject: {
    backgroundColor: "#7a52e1",
    color: "white",
    fontWeight: "bold",
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
  btnEditJpo: {
    backgroundColor: "#df005a",
    color: "white",
    "&:hover": {
      backgroundColor: "#df005a",
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

  const {user} = useFirebase();
  const userStatus = user?.status;

  const {id} = useParams();

  const [jpoData, setJpoData] = useState();
  const [projects, setProjects] = useState([]);

  const [openStudentsProject, setOpenStudentsProject] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openUpdatePdf, setOpenUpdatePdf] = useState(false);

  const [nameJPO, setNameJPO] = useState("");
  const [JPODateStart, setJPODateStart] = useState("");
  const [JPODateEnd, setJPODateEnd] = useState("");
  const [descriptionJPO, setDescriptionJPO] = useState("");
  const [files, setFiles] = useState([]);
  const [jpoThumbnail, setJpoThumbnail] = useState("");
  const rejectedFiles = files.filter((file) => file.errors);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles((files) => [...files, ...acceptedFiles]);
  }, []);

  const handleRemove = (file) => () => {
    setFiles((files) => files.filter((f) => f !== file));
  };

  const handleFileChange = (fileData) => {
    setJpoThumbnail(fileData);
  };

  const [loading, setLoading] = useState(true);
  console.log(jpoData?.jpoDescription);

  /*
    get an Object of all jpo data using the jpo id then put it in jpoData
  */

  const getJpoById = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_SERVER_API}/ressources/jpo/${id}`)
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

  /*
    update the curent jpo using
    jpoTitle (String),
    jpoDescription (String),
    jpoThumbnail (String),
    jpoDayStart (Date),
    jpoDayEnd (Date)
  */

  const editJpo = async (
    jpoTitle,
    jpoDescription,
    jpoThumbnail,
    jpoDayStart,
    jpoDayEnd
  ) => {
    try {
      await axios
        .put(`${process.env.REACT_APP_SERVER_API}/ressources/jpo/${id}`, {
          jpoTitle: jpoTitle,
          jpoDescription: jpoDescription,
          jpoThumbnail: jpoThumbnail,
          jpoDayStart: jpoDayStart,
          jpoDayEnd: jpoDayEnd,
        })
        .then((res) => {
          if (
            res.status === 200 &&
            res.data.message === "JPO modifiée avec succès."
          ) {
            toastSuccess(
              `Votre Jpo ${jpoTitle} a bien été modifié avec succès`
            );
            getJpoById(id);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  /*
    update the jpo pdf using
    pdfUrl (String)
    and jpo id
  */

  const editJpoPdf = async () => {
    try {
      const formData = new FormData();
      formData.append("file", pdfUrl);
      await axios
        .put(
          `${process.env.REACT_APP_SERVER_API}/ressources/jpopdf/${id}`,
          formData
        )
        .then((res) => {
          if (
            res.status === 200 &&
            res.data.message ===
              "Votre plaquette commercial a été ajouté avec succès."
          ) {
            toastSuccess(
              `La nouvelle plaquette commerciale a été bien mise à jour !`
            );
            handleCloseUpdatePdfDialog();
            getJpoById(id);
          }
        })
        .catch((err) => {
          toastFail(
            "Erreur lors de la modification de votre plaquette commercial de votre JPO"
          );
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  /*
    delete the jpo using the jpo id and title
  */

  const DeleteJpoById = async (jpoTitle, jpoId) => {
    const data = {jpoTitle, jpoId};

    try {
      await axios
        .delete(`${process.env.REACT_APP_SERVER_API}/ressources/jpo`, {data})
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

  /*
    get an Array of all projects then set it in projects
  */

  const getAllProjects = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_SERVER_API}/ressources/students-projects`)
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

  const handleClickOpenUpdateDialog = () => {
    setOpenUpdate(true);
    setJPODateStart(
      moment.unix(jpoData?.jpoDayStart._seconds).format("yyyy-MM-DD")
    );
    setDescriptionJPO(jpoData?.jpoDescription);
    setJPODateEnd(
      moment.unix(jpoData?.jpoDayEnd._seconds).format("yyyy-MM-DD")
    );
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdate(false);
  };

  const handleClickOpenUpdatePdfDialog = () => {
    setOpenUpdatePdf(true);
  };

  const handleCloseUpdatePdfDialog = () => {
    setOpenUpdatePdf(false);
  };

  const onSubmitEditJpo = async () => {
    try {
      await editJpo(
        nameJPO,
        descriptionJPO,
        jpoThumbnail,
        JPODateStart,
        JPODateEnd
      );
      handleCloseUpdateDialog();
    } catch (error) {
      console.error(error);
      toastFail("Erreur lors de la modification de votre cours.");
    }
  };

  const onSubmitEditJpoPdf = async () => {
    try {
      await editJpoPdf();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteJpo = async () => {
    DeleteJpoById(jpoData?.jpoTitle, id);
    toastSuccess(`Votre jpo ${jpoData?.jpoTitle} a bien été supprimé !`);
    setTimeout(() => {
      navigate("/jpo");
    }, 4000);
  };

  const deleteLinkedStudentProject = async (studentProjectId) => {
    try {
      await axios
        .delete(`${process.env.REACT_APP_SERVER_API}/ressources/jpo/${id}`, {
          data: {studentProjectId},
        })
        .then((res) => {
          if (
            res.status === 200 &&
            res.data.message ===
              "Le lien avec le projet étudiant Project Test a été supprimé avec succès."
          ) {
            toastSuccess(res.data.message);
          }
          getJpoById(id);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getJpoById(id)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  // const descriptionJpoConvert = jpoData
  //   ? convertToRaw(jpoData.jpoDescription)
  //   : null;
  // const htmlDescriptionJpo = descriptionJpoConvert
  //   ? stateToHTML(descriptionJpoConvert)
  //   : "";

  return (
    <>
      {loading ? (
        <>
          <SkeletonJpoInfo classes={classes} />
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
                sx={{fontWeight: "bold", paddingLeft: "5%"}}
              >
                {jpoData?.jpoTitle}
              </Typography>
              <Typography sx={{paddingRight: "5%"}}>
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
                <Container sx={{paddingBottom: "24px"}}>
                  <Typography variant="h5">Description JPO</Typography>
                  <Divider />
                  <Typography sx={{fontWeight: "bold"}}>
                    {jpoData?.jpoDescription}
                  </Typography>
                </Container>
                <Typography sx={{fontWeight: "bold"}}>
                  Liste des participants lors de cette JPO
                </Typography>
                <List>
                  {jpoData?.jpoParticipants.map((participant, index) => (
                    <React.Fragment key={participant.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar className={classes.avatar}>
                            {participant.firstname.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${participant.firstname} ${participant.lastname}`}
                          secondary={participant.status}
                        />
                        <Button
                          component={Link}
                          to={`/profil/${participant.id}`}
                          sx={{
                            backgroundColor: "#7a52e1",
                            color: "white",
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: "#d40074",
                            },
                          }}
                        >
                          Profil <VisibilityIcon />
                        </Button>
                      </ListItem>
                      {index < jpoData?.jpoParticipants.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
                <div className="list-students-project-linked">
                  <Typography
                    sx={{
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
                            padding: "10px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "85%",
                            margin: "10px",
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
                              <Typography>Projet</Typography>
                              <VisibilityIcon />
                            </Button>
                            {userStatus === "pedago" ? (
                              <Button
                                onClick={() => {
                                  deleteLinkedStudentProject(project.id);
                                }}
                                className={classes.btnDeleteJop}
                              >
                                <Typography>Supprimer</Typography>
                                <DeleteIcon />
                              </Button>
                            ) : (
                              <></>
                            )}
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
                <Typography sx={{fontWeight: "bold", padding: "10px"}}>
                  Plaquette Commerciale JPO
                </Typography>
                {jpoData?.linkCommercialBrochure?.pdfBase64 === undefined ? (
                  <div>
                    Aucune plaquette Commerciale d'ajouter pour le moment
                  </div>
                ) : (
                  <PdfCommercialBrochureViewer
                    base64={jpoData?.linkCommercialBrochure?.pdfBase64}
                  />
                )}

                {userStatus === "pedago" ? (
                  <>
                    <Button
                      sx={{margin: "20px"}}
                      onClick={handleOpenStudentsProject}
                      className={classes.btnLinkProject}
                    >
                      Lier à un projet étudiant <AddLinkIcon />
                    </Button>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-around",
                      }}
                    >
                      <Button
                        sx={{margin: "20px"}}
                        onClick={() => handleClickOpenUpdateDialog()}
                        className={classes.btnEditJpo}
                      >
                        Modifier <EditIcon />
                      </Button>
                      <UpdateJpoDialog
                        open={openUpdate}
                        handleClose={handleCloseUpdateDialog}
                        handleSubmit={onSubmitEditJpo}
                        nameJPO={jpoData?.jpoTitle}
                        setNameJPO={setNameJPO}
                        JPODateStart={JPODateStart}
                        setJPODateStart={setJPODateStart}
                        JPODateEnd={JPODateEnd}
                        setJPODateEnd={setJPODateEnd}
                        descriptionJPO={descriptionJPO}
                        setDescriptionJPO={setDescriptionJPO}
                        handleDrop={handleDrop}
                        handleFileChange={handleFileChange}
                        rejectedFiles={rejectedFiles}
                        handleRemove={handleRemove}
                        btnCreateJpo={classes.btnCreateJpo}
                      />
                      <Button
                        sx={{margin: "20px"}}
                        onClick={() => handleClickOpenUpdatePdfDialog()}
                        className={classes.btnEditJpo}
                      >
                        Plaquette Commerciale <EditIcon />
                      </Button>
                      <UpdateJpoPdf
                        open={openUpdatePdf}
                        handleClose={handleCloseUpdatePdfDialog}
                        pdfUrl={jpoData?.linkCommercialBrochure}
                        setPdfUrl={setPdfUrl}
                        handleSubmit={onSubmitEditJpoPdf}
                        btnCreateJpo={classes.btnCreateJpo}
                      />
                    </div>

                    <Button
                      sx={{margin: "20px"}}
                      onClick={deleteJpo}
                      className={classes.btnDeleteJop}
                    >
                      Supprimer
                      <DeleteIcon />
                    </Button>
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

import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";

import useFirebase from "../../../hooks/useFirebase";

import axios from "axios";

import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Typography,
  Divider,
  Card,
  CardContent,
} from "@mui/material";

import UpdateCoursDialog from "./UpdateCoursDialog";

import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import CallRoundedIcon from "@mui/icons-material/CallRounded";

import PDFCourseView from "./PdfCourseView";
import CourseBacklogPdf from "./PdfCoursBacklog";
import "./CoursInfo.scss";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles({
  updateButton: {
    "&:hover": {
      backgroundColor: "#731d6d",
    },
  },
  deleteButton: {
    "&:hover": {
      backgroundColor: "#a60000",
    },
  },
  callButton: {
    "&:hover": {
      backgroundColor: "#005500",
    },
  },
});

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

const CoursInfo = () => {
  const { user } = useFirebase();
  const userStatus = user?.status;

  const { id } = useParams();
  const navigate = useNavigate();

  const [coursData, setCoursData] = useState([]);
  const [coursTitle, setCoursTitle] = useState("");
  const [courseDateStart, setCourseDateStart] = useState("");
  const [courseDateEnd, setCourseDateEnd] = useState("");
  const [coursDescription, setCoursDescription] = useState("");
  const [coursCampusNumerique, setCoursCampusNumerique] = useState(false);
  const [courseIdClass, setCourseIdClass] = useState("");
  const [coursPrivate, setCoursPrivate] = useState(false);
  const [allpo, setAllPo] = useState([]);
  const [allclass, setAllclass] = useState([]);
  const [courseClass, setCourseClass] = useState([]);
  const [coursOwnerId, setCoursOwnerId] = useState("");
  const [courseOwerData, setCourseOwerData] = useState([]);

  const [isCoursDataLoaded, setIsCoursDataLoaded] = useState(false);

  const [openCours, setOpenCours] = useState(false);
  const [openBacklog, setOpenBacklog] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [fileCours, setFileCours] = useState(null);
  const [fileBacklog, setFileBacklog] = useState(null);
  const [coursImageBase64, setCoursImageBase64] = useState("");

  const [files, setFiles] = useState([]);
  const rejectedFiles = files.filter((file) => file.errors);

  const [pdfLinksCours, setPdfLinksCours] = useState([]);
  const [pdfLinksBacklog, setPdfLinksBacklog] = useState([]);

  const { control } = useForm({
    mode: "onTouched",
  });

  const classes = useStyles();

  const getAllInstructors = async () => {
    try {
      await axios
        .get("http://localhost:5050/ressources/instructors")
        .then((res) => {
          setAllPo(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getInstructorById = async (instructorId) => {
    try {
      await axios
        .get(`http://localhost:5050/ressources/instructor/${instructorId}`)
        .then((res) => {
          setCourseOwerData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getAllClass = async () => {
    try {
      await axios
        .get("http://localhost:5050/ressources/classes")
        .then((res) => {
          setAllclass(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getCoursId = async () => {
    try {
      await axios
        .get(`http://localhost:5050/ressources/cours/${id}`)
        .then((res) => {
          setCoursData(res.data.data);
          setPdfLinksCours(res.data.data.pdfLinkCours);
          setPdfLinksBacklog(res.data.data.pdfLinkBackLog);
          setIsCoursDataLoaded(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getClassId = async (classId) => {
    try {
      await axios
        .get(`http://localhost:5050/ressources/class/${classId}`)
        .then((res) => {
          setCourseClass(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const uploadCoursPdf = async () => {
    try {
      const formData = new FormData();
      formData.append("file", fileCours);
      formData.append("courseClass", coursData.courseClass);
      formData.append("title", coursData.title);
      formData.append("courseId", id);
      await axios
        .post(`http://localhost:5050/ressources/cours/upload-pdf`, formData)
        .then((res) => {
          if (res.status === 200) {
            toastSuccess(`Votre pdf cours a bien été uploadé`);
            handleCloseCoursDialog();
            window.location.reload();
          }
        })
        .catch((err) => {
          toastFail(
            `Le pdf que vous essayez d'uploader rencontre un problème.`
          );
          console.log(err);
        });
    } catch (error) {
      console.error(error);
      toastFail(`Le pdf que vous essayez d'uploader rencontre un problème.`);
    }
  };

  const uploadBacklogPdf = async () => {
    try {
      const formData = new FormData();
      formData.append("file", fileBacklog);
      formData.append("courseClass", coursData.courseClass);
      formData.append("title", coursData.title);
      formData.append("courseId", id);

      await axios
        .post(
          `http://localhost:5050/ressources/cours/backlog/upload-pdf`,
          formData
        )
        .then((res) => {
          if (res.status === 200) {
            toastSuccess(`Votre pdf backlog a bien été uploadé`);
            handleCloseBacklogDialog();
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
          toastFail(
            `Le pdf que vous essayez d'uploader rencontre un problème.`
          );
        });
    } catch (error) {
      console.error(error);
      toastFail(`Le pdf que vous essayez d'uploader rencontre un problème.`);
    }
  };

  const deleteCoursPdf = (
    courseClass,
    title,
    fileName,
    pdfLinkCours,
    courseId
  ) => {
    const data = { courseClass, title, fileName, pdfLinkCours, courseId };

    return axios
      .delete("http://localhost:5050/ressources/cours/delete-pdf", { data })
      .then((res) => {
        if (res.status === 200) {
          toastSuccess(`Votre fichier cours ${fileName} a bien été supprimé`);
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
        toastFail(
          `Le fichier backlog ${fileName} que vous essayez de supprimer rencontre un problème.`
        );
      });
  };

  const deleteBackLogPdf = (
    courseClass,
    title,
    fileName,
    pdfLinkBackLog,
    courseId
  ) => {
    const data = { courseClass, title, fileName, pdfLinkBackLog, courseId };

    return axios
      .delete("http://localhost:5050/ressources/backlog/delete-pdf", { data })
      .then((res) => {
        if (res.status === 200) {
          toastSuccess(`Votre fichier ${fileName} a bien été supprimé`);
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
        toastFail(
          `Le fichier ${fileName} que vous essayez de supprimer rencontre un problème.`
        );
      });
  };

  const updateCours = async (
    title,
    description,
    dateStartSprint,
    dateEndSprint,
    distanciel,
    coursClass,
    owner,
    coursPrivate,
    imageBase64
  ) => {
    try {
      axios
        .put(`http://localhost:5050/ressources/cours/${id}`, {
          title: title,
          description: description,
          dateStartSprint: dateStartSprint,
          dateEndSprint: dateEndSprint,
          campus_numerique: distanciel,
          courseClass: coursClass,
          owner: owner,
          private: coursPrivate,
          imageBase64: imageBase64,
        })
        .then((res) => {
          if (res.status === 200) {
            toastSuccess(`Votre cours ${coursTitle} a bien été modifié`);
            window.location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      if (error.response.status === 400) {
        toastWarning("Veuillez remplir tous les champs.");
      }
      throw error;
    }
  };

  const deleteCours = async (cours_id, courseClass, title) => {
    try {
      await axios
        .delete(`http://localhost:5050/ressources/cours/${cours_id}`, {
          data: { courseClass, title },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpenCoursDialog = () => {
    setOpenCours(true);
  };

  const handleCloseCoursDialog = () => {
    setOpenCours(false);
  };

  const handleClickOpenBacklogDialog = () => {
    setOpenBacklog(true);
  };

  const handleCloseBacklogDialog = () => {
    setOpenBacklog(false);
  };

  const handleClickOpenUpdateDialog = () => {
    setOpenUpdate(true);
    getAllInstructors();
    getAllClass();
    setCourseDateStart(
      moment.unix(coursData.dateStartSprint._seconds).format("yyyy-MM-DD")
    );
    setCourseDateEnd(
      moment.unix(coursData.dateEndSprint._seconds).format("yyyy-MM-DD")
    );
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdate(false);
  };

  const handleClickOpenDeleteDialog = () => {
    setOpenDelete(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDelete(false);
  };

  const handleUploadCoursPdf = () => {
    uploadCoursPdf();
  };

  const handleUploadBackLogPdf = () => {
    uploadBacklogPdf();
  };

  const handleFileChangeCours = (e) => {
    setFileCours(e.target.files[0]);
  };

  const handleFileChangeBacklog = (event) => {
    setFileBacklog(event.target.files[0]);
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.setAttribute("download", "file.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (fileData) => {
    setCoursImageBase64(fileData);
  };

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles((files) => [...files, ...acceptedFiles]);
  }, []);

  const coursePdfUploaded = coursData.hasOwnProperty("pdfLinkCours")
    ? true
    : false;

  const backlogCoursePdfUploaded = coursData.hasOwnProperty("pdfLinkBackLog")
    ? true
    : false;

  const pdfCoursNavigate = (urlFilePdf) =>
    navigate("/pdfsupport", { state: { urlFilePdf } });

  const pdfBacklogNavigate = (urlBacklogPdf) =>
    navigate("/pdfbacklog", { state: { urlBacklogPdf } });

  const deleteCompleteCours = () => {
    deleteCours(id, coursData.courseClass, coursData.title);
    navigate("/cours");
    window.location.reload();
  };

  const onSubmit = async () => {
    try {
      await updateCours(
        coursTitle,
        coursDescription,
        courseDateStart,
        courseDateEnd,
        coursCampusNumerique,
        courseIdClass,
        coursOwnerId,
        coursPrivate,
        coursImageBase64
      );
      handleCloseUpdateDialog();
    } catch (error) {
      console.error(error);
      toastFail("Erreur lors de la modification de votre cours.");
    }
  };

  useEffect(() => {
    getCoursId();
  }, []);

  useEffect(() => {
    if (isCoursDataLoaded) {
      getClassId(coursData.courseClass);
      getInstructorById(coursData.owner);
    }
  }, [isCoursDataLoaded]);

  return (
    <>
      <div className="cours-info-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "0px",
            width: "100%",
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
              padding: "50px",
            }}
          >
            <h1>{coursData.title}</h1>
            <Divider variant="middle" />
            <div className="main-cours-container">
              <div className="cours-left-side-container">
                <div className="list-po-pedago-container">
                  <p className="p-description-coursinfo">
                    {coursData.description}
                  </p>
                </div>
                <h2>Contenu du Cours</h2>
                <Divider />
                <div className="list-course-pdf">
                  {coursePdfUploaded === true ? (
                    pdfLinksCours.length === 0 ? (
                      <p className="text-center p-5 font-bold">
                        Aucun cours uploader pour le moment par le PO
                      </p>
                    ) : (
                      pdfLinksCours.map((pdfLink, index) => (
                        <Card
                          key={index}
                          sx={{
                            width: "100%",
                            marginBottom: "20px",
                          }}
                          // onClick={() => pdfCoursNavigate(pdfLink.url)}
                        >
                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "space-around",
                              width: "100%",
                              alignItems: "center",
                            }}
                          >
                            <h4 style={{ flexGrow: 1 }}>{pdfLink.name}</h4>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              sx={{
                                color: "white",
                                fontWeight: "bold",
                                backgroundColor: "#45b3e0",
                                marginRight: "20px",
                                "&:hover": {
                                  backgroundColor: "#1f8dba",
                                },
                              }}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDownload(pdfLink.url);
                              }}
                            >
                              <DownloadIcon />
                            </Button>
                            {userStatus === "etudiant" ? (
                              ""
                            ) : (
                              <>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  sx={{
                                    color: "white",
                                    fontWeight: "bold",
                                    backgroundColor: "#ff0000",
                                    "&:hover": {
                                      backgroundColor: "#a60000",
                                    },
                                  }}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    deleteCoursPdf(
                                      coursData.courseClass,
                                      coursData.title,
                                      pdfLink.name,
                                      pdfLink.url,
                                      id
                                    );
                                  }}
                                >
                                  <DeleteIcon />
                                </Button>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )
                  ) : (
                    <p className="text-center p-5 font-bold">
                      Aucun backlog uploader pour le moment par le PO
                    </p>
                  )}
                  {userStatus === "etudiant" ? (
                    ""
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        <Button
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            backgroundColor: "#df005a",
                            "&:hover": {
                              backgroundColor: "#c81776",
                            },
                          }}
                          onClick={handleClickOpenCoursDialog}
                          startIcon={<UploadIcon />}
                        >
                          Upload Cours
                        </Button>
                        <Dialog
                          open={openCours}
                          onClose={handleCloseCoursDialog}
                        >
                          <DialogTitle>Upload Cours PDF</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Choissisez votre fichier PDF à upload
                            </DialogContentText>
                            <input
                              type="file"
                              onChange={handleFileChangeCours}
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleCloseCoursDialog}>
                              Cancel
                            </Button>
                            <Button
                              onClick={handleUploadCoursPdf}
                              disabled={!fileCours}
                            >
                              Upload
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                    </>
                  )}
                </div>
                <div className="list-course-pdf">
                  <h2>Contenu du BackLog</h2>
                  <Divider />
                  {backlogCoursePdfUploaded === true ? (
                    pdfLinksBacklog.length === 0 ? (
                      <p className="text-center p-5 font-bold">
                        Aucun backlog uploader pour le moment par le PO
                      </p>
                    ) : (
                      pdfLinksBacklog.map((pdfLink, index) => (
                        <Card
                          key={index}
                          sx={{
                            width: "100%",
                            marginBottom: "20px",
                          }}
                          // onClick={() => pdfBacklogNavigate(pdfLink.url)}
                        >
                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "space-around",
                              width: "100%",
                              alignItems: "center",
                            }}
                          >
                            <h4 style={{ flexGrow: 1 }}>{pdfLink.name}</h4>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              sx={{
                                color: "white",
                                fontWeight: "bold",
                                backgroundColor: "#45b3e0",
                                marginRight: "20px",
                                "&:hover": {
                                  backgroundColor: "#1f8dba",
                                },
                              }}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDownload(pdfLink.url);
                              }}
                            >
                              <DownloadIcon />
                            </Button>
                            {userStatus === "etudiant" ? (
                              ""
                            ) : (
                              <>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  sx={{
                                    color: "white",
                                    fontWeight: "bold",
                                    backgroundColor: "#ff0000",
                                    "&:hover": {
                                      backgroundColor: "#a60000",
                                    },
                                  }}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    deleteBackLogPdf(
                                      coursData.courseClass,
                                      coursData.title,
                                      pdfLink.name,
                                      pdfLink.url,
                                      id
                                    );
                                  }}
                                >
                                  <DeleteIcon />
                                </Button>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )
                  ) : (
                    <p className="text-center p-5 font-bold">
                      Aucun backlog uploader pour le moment par le PO
                    </p>
                  )}
                  {userStatus === "etudiant" ? (
                    ""
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        <Button
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            backgroundColor: "#df005a",
                            "&:hover": {
                              backgroundColor: "#c81776",
                            },
                          }}
                          onClick={handleClickOpenBacklogDialog}
                          startIcon={<UploadIcon />}
                        >
                          Upload BackLog
                        </Button>
                        <Dialog
                          open={openBacklog}
                          onClose={handleCloseBacklogDialog}
                        >
                          <DialogTitle>Upload Backlog PDF</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Veuillez upload votre fichier pdf que vous
                              souhaitez.
                            </DialogContentText>
                            <input
                              type="file"
                              onChange={handleFileChangeBacklog}
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleCloseBacklogDialog}>
                              Annuler
                            </Button>
                            <Button
                              onClick={handleUploadBackLogPdf}
                              disabled={!fileBacklog}
                            >
                              Uploader
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="cours-right-side-container">
                <img
                  style={{
                    borderTopRightRadius: "10px",
                  }}
                  src={coursData.imageCourseUrl}
                  alt="course-img"
                />
                <div className="display-date">
                  <h4 className="font-bold">Date début de Sprint : </h4>
                  <p className="pl-2">
                    {coursData?.dateStartSprint &&
                      coursData.dateStartSprint._seconds &&
                      moment
                        .unix(coursData.dateStartSprint._seconds)
                        .format("DD.MM.YYYY")}
                  </p>
                </div>
                <div className="display-date">
                  <h4 className="font-bold">Date fin de Sprint : </h4>
                  <p className="pl-2">
                    {coursData?.dateEndSprint &&
                      coursData.dateEndSprint._seconds &&
                      moment
                        .unix(coursData.dateEndSprint._seconds)
                        .format("DD.MM.YYYY")}
                  </p>
                </div>
                <h2
                  style={{
                    marginTop: "10px",
                  }}
                  variant="h6"
                >
                  Classe concernée
                </h2>
                <Divider />
                {courseClass && courseClass.data && courseClass.data.name && (
                  <p className="pl-2">{courseClass.data.name}</p>
                )}
                <h2
                  style={{
                    marginTop: "10px",
                  }}
                  variant="h6"
                >
                  Products Owner / Pedago
                </h2>
                <Divider />
                <div className="list-po-pedago-container">
                  {courseOwerData &&
                    courseOwerData.data &&
                    courseOwerData.data.lastname &&
                    courseOwerData.data.firstname && (
                      <p className="po-p">
                        {courseOwerData.data.lastname.toUpperCase()}{" "}
                        {courseOwerData.data.firstname}
                      </p>
                    )}
                </div>
                <h2
                  style={{
                    marginTop: "10px",
                  }}
                  variant="h6"
                >
                  Détails / Actions
                </h2>
                <Divider />
                <div>
                  <div
                    className="flex"
                    style={{
                      margin: "5px 0px",
                    }}
                  >
                    <h4 className="font-bold">Campus Numérique : </h4>
                    <p className="pl-2">
                      {coursData.campus_numerique === false ? "Non" : "Oui"}
                    </p>
                  </div>
                  <div
                    className="flex"
                    style={{
                      margin: "5px 0px",
                    }}
                  >
                    <h4 className="font-bold">Statut du cours : </h4>
                    <p className="pl-2">
                      {coursData.private === false ? "Public" : "Privé"}
                    </p>
                  </div>
                  {userStatus === "po" ? (
                    <>
                      <Button
                        startIcon={<CallRoundedIcon />}
                        sx={{
                          backgroundColor: "#009800",
                          color: "#ffffff",
                        }}
                        className={classes.callButton}
                      >
                        Lancer l'appel
                      </Button>
                    </>
                  ) : userStatus === "etudiant" ? (
                    <>
                      <Button
                        startIcon={<CallRoundedIcon />}
                        sx={{
                          backgroundColor: "#009800",
                          color: "#ffffff",
                        }}
                        className={classes.joinCallButton}
                      >
                        Rejoindre l'appel
                      </Button>
                    </>
                  ) : (
                    <div></div>
                  )}
                </div>

                {userStatus === "etudiant" ? (
                  ""
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        padding: "16px",
                        width: "100%",
                      }}
                    >
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => handleClickOpenUpdateDialog()}
                        sx={{
                          bgcolor: "#94258c",
                          fontWeight: "bold",
                          color: "white",
                          mr: 1,
                        }}
                        className={classes.updateButton}
                      >
                        Modifier
                      </Button>
                      {courseClass &&
                        courseClass.data &&
                        courseClass.data.name &&
                        courseOwerData &&
                        courseOwerData.data &&
                        courseOwerData.data.lastname &&
                        courseOwerData.data.firstname && (
                          <UpdateCoursDialog
                            openUpdate={openUpdate}
                            handleClose={handleCloseUpdateDialog}
                            handleFileChange={handleFileChange}
                            handleDrop={handleDrop}
                            coursTitle={coursData.title}
                            coursDate={
                              coursData?.date &&
                              coursData.date._seconds &&
                              moment
                                .unix(coursData.date._seconds)
                                .format("YYYY-MM-DD")
                            }
                            coursDescription={coursData.description}
                            setCoursTitle={setCoursTitle}
                            courseDateStart={courseDateStart}
                            setCourseDateStart={setCourseDateStart}
                            courseDateEnd={courseDateEnd}
                            setCourseDateEnd={setCourseDateEnd}
                            setCoursDescription={setCoursDescription}
                            setCoursCampusNumerique={setCoursCampusNumerique}
                            coursCampusNumerique={coursData.campus_numerique}
                            coursPrivate={coursData.private}
                            setCoursPrivate={setCoursPrivate}
                            courseIdClass={courseIdClass}
                            setCourseIdClass={setCourseIdClass}
                            rejectedFiles={rejectedFiles}
                            currentClass={courseClass.data.name}
                            onSubmit={onSubmit}
                            allpo={allpo}
                            allclass={allclass}
                            currentPO={
                              courseOwerData.data.lastname.toUpperCase() +
                              " " +
                              courseOwerData.data.firstname
                            }
                            setCoursOwnerId={setCoursOwnerId}
                            control={control}
                          />
                        )}
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => handleClickOpenDeleteDialog()}
                        sx={{
                          bgcolor: "#FF0000",
                          fontWeight: "bold",
                          color: "white",
                        }}
                        className={classes.deleteButton}
                      >
                        Supprimer
                      </Button>
                      <Dialog
                        open={openDelete}
                        onClose={handleCloseDeleteDialog}
                      >
                        <DialogTitle>
                          Etes-vous sur de vouloir supprimer ce cours ?
                        </DialogTitle>
                        <DialogActions>
                          <Button onClick={handleCloseDeleteDialog}>Non</Button>
                          <Button onClick={deleteCompleteCours}>Oui</Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <ToastContainer></ToastContainer>
      </div>
    </>
  );
};

export default CoursInfo;

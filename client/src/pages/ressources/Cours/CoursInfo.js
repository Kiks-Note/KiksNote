import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  Chip,
  Avatar,
  Skeleton,
  CardMedia,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

import UpdateCoursDialog from "./../../../components/ressources/cours/UpdateCoursDialog";
import CoursLinkDialog from "./../../../components/ressources/cours/CoursLinkDialog";

import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import LaptopChromebookIcon from "@mui/icons-material/LaptopChromebook";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import AddLinkIcon from "@mui/icons-material/AddLink";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import uploadFile from "../../../assets/img/upload-file.svg";
import "./CoursInfo.scss";
import "react-toastify/dist/ReactToastify.css";
import SkeletonCoursInfoLeft from "../../../components/ressources/cours/SkeletonCoursInfoLeft";
import SkeletonCoursInfoRight from "../../../components/ressources/cours/SkeletonCoursInfoRight";

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

  const [allcourses, setCourses] = useState([]);

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
  const [courseClassName, setCourseClassName] = useState([]);
  const [coursOwnerId, setCoursOwnerId] = useState("");

  const [openCours, setOpenCours] = useState(false);
  const [openBacklog, setOpenBacklog] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openLink, setOpenLink] = useState(false);

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

  const [loading, setLoading] = useState(true);

  const classes = useStyles();

  /*
    get an Array of all PO then put it in allPo
 */

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

  /*
    get an Array of all classes then put it in allclass
 */

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

  /*
    get an Array of the cours data, an Arry of cours pdf and an Array of backlog pdf using the cours id then put them in coursData, pdfLinkCours and pdfLinkBacklog
 */

  const getCoursId = async () => {
    try {
      await axios
        .get(`http://localhost:5050/ressources/cours/${id}`)
        .then((res) => {
          setCoursData(res.data.data);
          setPdfLinksCours(res.data.data.pdfLinkCours);
          setPdfLinksBacklog(res.data.data.pdfLinkBackLog);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  /*
    get an Array of all cours then put it in courses
 */

  const getAllCours = async () => {
    try {
      await axios
        .get("http://localhost:5050/ressources/cours")
        .then((res) => {
          setCourses(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  /*
    set a formData with the pdf cours file, 
    the class of the cours, 
    the title of the cours,
    and the id of the cours 
    then post it to the database
 */

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
            getCoursId(id);
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

  /*
    set a formData with the pdf backlog file, 
    the class of the cours, 
    the title of the cours,
    and the id of the cours 
    then post it to the database
 */

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
            getCoursId(id);
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

  /*
    delete the cours pdf using courseClass, title, fileName, pdfLinkCours and courseId
 */

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
          getCoursId(id);
        }
      })
      .catch((err) => {
        console.log(err);
        toastFail(
          `Le fichier backlog ${fileName} que vous essayez de supprimer rencontre un problème.`
        );
      });
  };

  /*
    delete the backlog pdf using courseClass, title, fileName, pdfLinkBackLog and courseId
 */

  const deleteBackLogPdf = async (
    courseClass,
    title,
    fileName,
    pdfLinkBackLog,
    courseId
  ) => {
    const data = { courseClass, title, fileName, pdfLinkBackLog, courseId };

    try {
      const res = await axios.delete(
        "http://localhost:5050/ressources/backlog/delete-pdf",
        { data }
      );
      if (res.status === 200) {
        toastSuccess(`Votre fichier ${fileName} a bien été supprimé`);
        getCoursId(id);
      }
    } catch (err) {
      console.log(err);
      toastFail(
        `Le fichier ${fileName} que vous essayez de supprimer rencontre un problème.`
      );
    }
  };

  /*
    update the cours data using 
    title (String),
    description (String),
    dateStartSprint (Date),
    dateEndSprint (Date),
    distanciel (String),
    coursClass (String),
    owner (String),
    coursPrivate (String),
    imageBase64 (String)
 */

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
            getCoursId(id);
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

  /*
    delete the cours using 
    cours_id (String),
    courseClass (String),
    title (String)
 */

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

  const deleteLinkedCours = async (cours_id, linkedCourseName, courseName) => {
    try {
      await axios
        .delete(`http://localhost:5050/ressources/linkcours/${cours_id}`)
        .then((res) => {
          if (
            res.status === 200 &&
            res.data === "Le cours lié a été supprimé avec succès."
          ) {
            toastSuccess(
              `Le cours lié ${linkedCourseName} n'est plus lié avec le cours ${courseName}`
            );
          }
          getCoursId(id);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpenLinkCoursDialog = () => {
    setOpenLink(true);
    getAllCours();
  };

  const handleCloseCoursLinkDialog = () => {
    setOpenLink(false);
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

  const deleteCompleteCours = () => {
    deleteCours(id, coursData.courseClass, coursData.title);
    navigate("/cours");
    getAllCours();
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
    getCoursId(id)
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
              width: "95%",
              padding: "50px",
            }}
          >
            <h1>
              {coursData.title || (
                <>
                  <Skeleton width={100} />
                </>
              )}
            </h1>
            <Divider variant="middle" />
            <div className="main-cours-container">
              {loading ? (
                <>
                  <SkeletonCoursInfoLeft />
                </>
              ) : (
                <>
                  <div className="cours-left-side-container">
                    <h2>Description</h2>
                    <Divider />
                    <p className="p-description-coursinfo">
                      {coursData.description}
                    </p>
                    {coursData?.linkedCourse !== undefined ? (
                      <>
                        <h2>Cours Liée</h2>
                        <Divider />
                        <div style={{ display: "flex", margin: "20px" }}>
                          <Card
                            sx={{
                              width: "100%",
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <CardMedia
                              component="img"
                              src={coursData?.linkedCourse.imageCourseUrl}
                              alt="course image"
                              style={{
                                objectFit: "contain",
                                objectPosition: "center",
                                width: "30%",
                                minHeight: "10%",
                                padding: "20px",
                              }}
                            />
                            <CardContent
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                alignItems: "center",
                              }}
                            >
                              <h4
                                style={{
                                  width: "60%",
                                  wordBreak: "break-all",
                                  whiteSpace: "normal",
                                }}
                              >
                                {coursData?.linkedCourse.title}
                              </h4>
                              <Button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  navigate(
                                    `/coursinfo/${coursData?.linkedCourse.id}`
                                  );
                                }}
                                sx={{
                                  bgcolor: "#94258c",
                                  fontWeight: "bold",
                                  color: "white",
                                  mr: 1,
                                }}
                                className={classes.updateButton}
                              >
                                Voir le cours relié <OpenInNewIcon />
                              </Button>
                              {userStatus === "po" ? (
                                <>
                                  <Button
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      deleteLinkedCours(
                                        coursData?.linkedCourse?.id,
                                        coursData?.linkedCourse?.title,
                                        coursData?.title
                                      );
                                    }}
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
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </>
                              ) : (
                                <></>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    ) : (
                      <div></div>
                    )}
                    <h2>Contenu du Cours</h2>
                    <Divider />
                    <div className="list-course-pdf">
                      {coursePdfUploaded === true ? (
                        pdfLinksCours.length === 0 ? (
                          <>
                            <p className="text-center p-5 font-bold">
                              Aucun cours uploader pour le moment par le PO
                            </p>
                            <img
                              className="no-class-img"
                              src={uploadFile}
                              alt="no-cours-uploaded"
                            />
                          </>
                        ) : (
                          pdfLinksCours.map((pdfLink, index) => (
                            <Card
                              key={index}
                              sx={{
                                width: "100%",
                                marginBottom: "20px",
                              }}
                            >
                              <CardContent
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                  width: "100%",
                                  alignItems: "center",
                                }}
                              >
                                <h4
                                  style={{
                                    width: "70%",
                                    wordBreak: "break-all",
                                    whiteSpace: "normal",
                                  }}
                                >
                                  {pdfLink.name}
                                </h4>
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
                        <>
                          <p className="text-center p-5 font-bold">
                            Aucun backlog uploader pour le moment par le PO
                          </p>
                          <img
                            className="no-class-img"
                            src={uploadFile}
                            alt="no-backlog-uploaded"
                          />
                        </>
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
                    <h2>Contenu du BackLog</h2>
                    <Divider />
                    <div className="list-course-pdf">
                      {backlogCoursePdfUploaded === true ? (
                        pdfLinksBacklog.length === 0 ? (
                          <>
                            <p className="text-center p-5 font-bold">
                              Aucun backlog uploader pour le moment par le PO
                            </p>
                            <img
                              className="no-class-img"
                              src={uploadFile}
                              alt="no-backlog-uploaded"
                            />
                          </>
                        ) : (
                          pdfLinksBacklog.map((pdfLink, index) => (
                            <Card
                              key={index}
                              sx={{
                                width: "100%",
                                marginBottom: "20px",
                              }}
                            >
                              <CardContent
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                  width: "100%",
                                  alignItems: "center",
                                }}
                              >
                                <h4
                                  style={{
                                    width: "70%",
                                    wordBreak: "break-all",
                                    whiteSpace: "normal",
                                  }}
                                >
                                  {pdfLink.name}
                                </h4>
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
                        <>
                          <p className="text-center p-5 font-bold">
                            Aucun backlog uploader pour le moment par le PO
                          </p>
                          <img
                            className="no-class-img"
                            src={uploadFile}
                            alt="no-backlog-uploaded"
                          />
                        </>
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
                </>
              )}
              {loading ? (
                <>
                  <SkeletonCoursInfoRight />
                </>
              ) : (
                <>
                  <div className="cours-right-side-container">
                    <div className="cours-img">
                      <img
                        style={{
                          borderTopRightRadius: "10px",
                          maxWidth: "80%",
                        }}
                        src={coursData.imageCourseUrl}
                        alt="course-img"
                      />
                    </div>
                    <div className="display-date">
                      <h4 className="h4-data-cours-info">
                        <CalendarTodayIcon />
                        Date début de Sprint :{" "}
                      </h4>
                      <p className="pl-2">
                        {coursData?.dateStartSprint?._seconds &&
                          moment
                            .unix(coursData.dateStartSprint._seconds)
                            .format("DD.MM.YYYY")}
                      </p>
                    </div>
                    <div className="display-date">
                      <h4 className="h4-data-cours-info">
                        <EventBusyIcon />
                        Date fin de Sprint :{" "}
                      </h4>
                      <p className="pl-2">
                        {coursData?.dateEndSprint?._seconds &&
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
                    <div
                      style={{
                        display: "flex",
                        height: "7%",
                        alignItems: "center",
                      }}
                    >
                      <Chip
                        sx={{
                          display: "flex",
                          padding: "10px",
                          width: "40%",
                          alignItems: "center",
                        }}
                        label={
                          <>
                            <div style={{ display: "flex" }}>
                              {coursData?.courseClass?.name && (
                                <>
                                  <Typography>
                                    {coursData.courseClass.name}
                                  </Typography>
                                  <SchoolIcon />
                                </>
                              )}
                            </div>
                          </>
                        }
                      ></Chip>
                    </div>
                    <h2
                      style={{
                        marginTop: "0px",
                      }}
                      variant="h6"
                    >
                      Products Owner / Pedago
                    </h2>
                    <Divider />
                    <div
                      style={{
                        display: "flex",
                        height: "7%",
                        alignItems: "center",
                      }}
                    >
                      <ListItem sx={{ display: "flex", alignItems: "center" }}>
                        <ListItemAvatar>
                          <Avatar
                            alt={
                              coursData?.owner?.lastname.toUpperCase() +
                              " " +
                              coursData?.owner?.firstname +
                              " photo-profile"
                            }
                            src={coursData?.data?.owner?.image}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography>
                              {coursData?.owner?.lastname.toUpperCase()}{" "}
                              {coursData?.owner?.firstname}
                            </Typography>
                          }
                        />
                        <Button
                          component={Link}
                          to={`/profil/${coursData?.owner?.id}`}
                          sx={{
                            backgroundColor: "#7a52e1",
                            color: "white",
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: "#d40074",
                            },
                          }}
                        >
                          Voir Profil <VisibilityIcon />
                        </Button>
                      </ListItem>
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
                    <div className="details-actions-container">
                      <div className="display-campus-num">
                        <h4 className="h4-data-cours-info">
                          <LaptopChromebookIcon />
                          Campus Numérique :{" "}
                        </h4>
                        <p className="is-campus-num">
                          {coursData.campus_numerique === false ? "Non" : "Oui"}
                        </p>
                      </div>
                      <div className="display-cours-status">
                        <h4 className="h4-data-cours-info">
                          Statut du cours :{" "}
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          {coursData.private === false ? (
                            <>
                              <PublicIcon />
                              <Typography>Public</Typography>
                            </>
                          ) : (
                            <>
                              <LockIcon />
                              <Typography>Privée</Typography>
                            </>
                          )}
                        </div>
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
                        <Button
                          startIcon={<AddLinkIcon />}
                          onClick={() => handleClickOpenLinkCoursDialog()}
                          sx={{
                            bgcolor: "#94258c",
                            fontWeight: "bold",
                            color: "white",
                            mr: 1,
                          }}
                          className={classes.updateButton}
                        >
                          Lier à un autre cours
                        </Button>
                        <CoursLinkDialog
                          open={openLink}
                          close={handleCloseCoursLinkDialog}
                          allcours={allcourses}
                          coursData={coursData}
                          getCoursId={getCoursId}
                        />
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
                          {coursData?.courseClass?.name &&
                            coursData?.owner &&
                            coursData.owner.lastname &&
                            coursData.owner.firstname && (
                              <UpdateCoursDialog
                                openUpdate={openUpdate}
                                handleClose={handleCloseUpdateDialog}
                                handleFileChange={handleFileChange}
                                handleDrop={handleDrop}
                                coursTitle={coursData.title}
                                coursDate={
                                  coursData?.date?._seconds &&
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
                                setCoursCampusNumerique={
                                  setCoursCampusNumerique
                                }
                                coursCampusNumerique={
                                  coursData.campus_numerique
                                }
                                coursPrivate={coursData.private}
                                setCoursPrivate={setCoursPrivate}
                                currentClass={coursData.courseClass.name}
                                courseClassName={courseClassName}
                                setCourseClassName={setCourseClassName}
                                courseIdClass={courseIdClass}
                                setCourseIdClass={setCourseIdClass}
                                rejectedFiles={rejectedFiles}
                                onSubmit={onSubmit}
                                allpo={allpo}
                                allclass={allclass}
                                currentPO={
                                  coursData.owner.lastname.toUpperCase() +
                                  " " +
                                  coursData.owner.firstname
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
                              <Button onClick={handleCloseDeleteDialog}>
                                Non
                              </Button>
                              <Button onClick={deleteCompleteCours}>Oui</Button>
                            </DialogActions>
                          </Dialog>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <ToastContainer></ToastContainer>
      </div>
    </>
  );
};

export default CoursInfo;

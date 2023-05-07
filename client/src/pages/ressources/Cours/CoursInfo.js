import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { toast, ToastContainer } from "react-toastify";

import download from "downloadjs";

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

export const toastFail = (message) => {
  toast.error(message, options);
};

const CoursInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coursData, setCoursData] = useState([]);
  const [coursTitle, setCoursTitle] = useState("");
  const [coursDate, setCoursDate] = useState("");
  const [coursDescription, setCoursDescription] = useState("");
  const [coursCampusNumerique, setCoursCampusNumerique] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [coursPrivate, setCoursPrivate] = useState(false);
  const [allpo, setAllPo] = useState([]);
  const [allclass, setAllclass] = useState([]);
  const [coursOwner, setCoursOwner] = useState("");

  const [openCours, setOpenCours] = useState(false);
  const [openBacklog, setOpenBacklog] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [fileCours, setFileCours] = useState(null);
  const [fileBacklog, setFileBacklog] = useState(null);
  const [fileImg, setFileImg] = useState(null);

  const { control } = useForm({
    mode: "onTouched",
  });

  const getAllPo = async () => {
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
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
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
            toastSuccess(
              `Votre pdf cours ${fileNameCourse} a bien été uploadé`
            );
            handleCloseCoursDialog();
            window.location.reload();
          }
          console.log(res.status);
          console.log(res.data);
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
            toastSuccess(
              `Votre pdf cours ${fileNameBacklog} a bien été uploadé`
            );
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
    getAllPo();
    getAllClass();
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

  const getPdfFileName = (pdfUrl) => {
    const parts = pdfUrl.split("/");
    const fileName = parts[parts.length - 1];
    const fileNameParts = fileName.split("?");
    return fileNameParts[0];
  };

  const handleDownload = (url, filename) => {
    download(url, filename);
  };

  const fileNameCourse = coursData.pdfLinkCours
    ? getPdfFileName(coursData.pdfLinkCours)
    : "";

  const fileNameBacklog = coursData.pdfLinkBackLog
    ? getPdfFileName(coursData.pdfLinkBackLog)
    : "";

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
    console.log("Cours modifié (PS: C'est faux)");
  };

  useEffect(() => {
    getCoursId();
  }, []);

  return (
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
                  <Card
                    sx={{
                      width: "100%",
                    }}
                    onClick={() => pdfCoursNavigate(coursData.pdfLinkCours)}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <h4 style={{ flexGrow: 1 }}>{fileNameCourse}</h4>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          backgroundColor: "#df005a",
                          "&:hover": {
                            backgroundColor: "#c81776",
                          },
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDownload(
                            coursData.pdfLinkCours,
                            fileNameCourse
                          );
                        }}
                        startIcon={<DownloadIcon />}
                      >
                        Cours
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <p className="text-center p-5 font-bold">
                      Aucun cours uploader pour le moment par le PO
                    </p>
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
                      <Dialog open={openCours} onClose={handleCloseCoursDialog}>
                        <DialogTitle>Upload Cours PDF</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Choissisez votre fichier PDF à upload
                          </DialogContentText>
                          <input type="file" onChange={handleFileChangeCours} />
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
                  <Card
                    sx={{
                      width: "100%",
                    }}
                    onClick={() => pdfBacklogNavigate(coursData.pdfLinkBackLog)}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <h4 style={{ flexGrow: 1 }}>{fileNameBacklog}</h4>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          backgroundColor: "#df005a",
                          "&:hover": {
                            backgroundColor: "#c81776",
                          },
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDownload(
                            coursData.pdfLinkBackLog,
                            fileNameBacklog
                          );
                        }}
                        startIcon={<DownloadIcon />}
                      >
                        BackLog
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <p className="text-center p-5 font-bold">
                      Aucun backlog uploader pour le moment par le PO
                    </p>
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
              <div className="flex">
                <h4 className="font-bold">Date de Sprint : </h4>
                <p className="pl-2">{coursData.date}</p>
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
              <p className="pl-2">{coursData.courseClass}</p>
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
                <p className="po-p">{coursData.owner}</p>
              </div>
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
                  className={useStyles().updateButton}
                >
                  Modifier
                </Button>
                <UpdateCoursDialog
                  openUpdate={openUpdate}
                  handleClose={handleCloseUpdateDialog}
                  imgCours={coursData.imageCourseUrl}
                  setCoursTitle={setCoursTitle}
                  setCoursDate={setCoursDate}
                  setCoursDescription={setCoursDescription}
                  setCoursCampusNumerique={setCoursCampusNumerique}
                  coursCampusNumerique={coursCampusNumerique}
                  coursPrivate={coursPrivate}
                  setCoursPrivate={setCoursPrivate}
                  selectedClass={selectedClass}
                  setSelectedClass={setSelectedClass}
                  onSubmit={onSubmit}
                  allpo={allpo}
                  allclass={allclass}
                  setCoursOwner={setCoursOwner}
                  control={control}
                />
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => handleClickOpenDeleteDialog()}
                  sx={{
                    bgcolor: "#FF0000",
                    fontWeight: "bold",
                    color: "white",
                  }}
                  className={useStyles().deleteButton}
                >
                  Supprimer
                </Button>
                <Dialog open={openDelete} onClose={handleCloseDeleteDialog}>
                  <DialogTitle>
                    Etes-vous sur de vouloir supprimer ce cours ?
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Non</Button>
                    <Button onClick={deleteCompleteCours}>Oui</Button>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default CoursInfo;

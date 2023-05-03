import React, { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Container,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  CardContent,
  Card,
  Typography,
  Button,
  CardMedia,
  Tooltip,
  TablePagination,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";

import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModule from "@mui/icons-material/ViewModule";
import AddIcon from "@mui/icons-material/Add";
import BackpackIcon from "@mui/icons-material/Backpack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SearchIcon from "@mui/icons-material/SearchRounded";

import CreateCoursModal from "./CreateCoursModal";

import "./Cours.scss";
import "react-toastify/dist/ReactToastify.css";

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

const Ressources = () => {
  let navigate = useNavigate();

  const loggedUser = localStorage.getItem("user");
  const loggedUserParsed = JSON.parse(loggedUser);
  var userStatus = loggedUserParsed.status;
  // var studentClass = loggedUserParsed.class;

  const [view, setView] = useState("module");

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const currentYear = new Date().getFullYear();

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseDate, setCourseDate] = useState("");
  const [courseCampusNumerique, setCourseCampusNumerique] = useState(false);
  const [courseOwner, setCourseOwner] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [coursePrivate, setCoursePrivate] = useState(false);
  const [courseImageBase64, setCourseImageBase64] = useState("");

  const [files, setFiles] = useState([]);
  const rejectedFiles = files.filter((file) => file.errors);

  const [open, setOpen] = useState(false);

  const [allpo, setAllPo] = useState([]);
  const [allclass, setAllclass] = useState([]);

  const { control } = useForm({
    mode: "onTouched",
  });

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles((files) => [...files, ...acceptedFiles]);
  }, []);

  const handleRemove = (file) => () => {
    setFiles((files) => files.filter((f) => f !== file));
  };

  const handleFileChange = (fileData) => {
    console.log("File data:", fileData);
    setCourseImageBase64(fileData);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const viewChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  const getAllCours = async () => {
    try {
      await axios
        .get("http://localhost:5050/ressources/cours")
        .then((res) => {
          setCourses(res.data.cours);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

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

  const createNewCours = async () => {
    try {
      await axios
        .post("http://localhost:5050/ressources/cours", {
          title: courseTitle,
          description: courseDescription,
          date: courseDate,
          campus_numerique: courseCampusNumerique,
          courseClass: selectedClass,
          owner: courseOwner,
          private: coursePrivate,
          imageBase64: courseImageBase64,
        })
        .then((res) => {
          if (res.status === 200) {
            toastSuccess(`Votre cours ${courseTitle}  a bien été ajoutés`);
          }
          console.log(res.status);
          console.log(res.data);
        })
        .catch((err) => {
          if (err.response.status === 400) {
            toastWarning("Veuillez remplir tous les champs.");
          }
          if (err.response.status === 500) {
            toastFail("Erreur lors de la création de votre cours.");
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCours();
    getAllPo();
    getAllClass();
  }, []);

  const createCourse = () => {
    setOpen(true);
  };

  const pdfBacklogRoute = () => navigate("/pdfBacklog");
  const pdfSupportRoute = () => navigate("/pdfSupport");

  const onSubmit = async () => {
    createNewCours();
  };

  const filteredCoursesCurrentYear = courses.filter(
    (course) =>
      course.data.date.startsWith((currentYear - 1).toString()) ||
      course.data.date.startsWith(currentYear.toString())
  );

  const filteredCoursesLastYear = courses.filter(
    (course) =>
      course.data.date.startsWith((currentYear - 2).toString()) ||
      course.data.date.startsWith((currentYear - 1).toString())
  );

  return (
    <>
      <div className="cours-container">
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "0px",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ flexGrow: 1 }}>
            Mes Cours
          </Typography>
          <div className="header-cours">
            <Box
              sx={{
                width: "20%",
                display: "flex",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={viewChange}
                  sx={{ margin: 1 }}
                >
                  <ToggleButton value="module" aria-label="module">
                    <ViewModule />
                  </ToggleButton>
                  <ToggleButton value="list" aria-label="list">
                    <ViewListIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </Box>
            <div className="search-bar-container">
              <form noValidate autoComplete="off">
                <TextField
                  id="outlined-basic"
                  label="Search"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
            </div>
            {userStatus === "po" ? (
              <>
                <div className="btn-add-cours">
                  <Button
                    variant="contained"
                    color="primary"
                    aria-label="add"
                    onClick={createCourse}
                  >
                    Ajouter un cours <AddIcon />
                  </Button>
                </div>
              </>
            ) : (
              <div></div>
            )}
          </div>

          <CreateCoursModal
            open={open}
            handleClose={handleClose}
            handleDrop={handleDrop}
            handleFileChange={handleFileChange}
            handleRemove={handleRemove}
            onSubmit={onSubmit}
            courseTitle={courseTitle}
            setCourseTitle={setCourseTitle}
            courseDate={courseDate}
            setCourseDate={setCourseDate}
            rejectedFiles={rejectedFiles}
            courseCampusNumerique={courseCampusNumerique}
            setCourseCampusNumerique={setCourseCampusNumerique}
            coursePrivate={coursePrivate}
            setCoursePrivate={setCoursePrivate}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            allclass={allclass}
            control={control}
            allpo={allpo}
            setCourseOwner={setCourseOwner}
            courseDescription={courseDescription}
            setCourseDescription={setCourseDescription}
          />
        </Container>

        {view === "module" ? (
          <>
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
                margin: 0,
                paddingTop: "20px",
              }}
            >
              <h1>Année {`${currentYear - 1}  - ${currentYear} `}</h1>
              <Grid container spacing={2}>
                {(searchTerm.length > 0
                  ? [...filteredCoursesCurrentYear].filter(
                      (course) =>
                        course.data.title &&
                        course.data.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    )
                  : [...filteredCoursesCurrentYear]
                ).map((course) => (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: "45vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                      onClick={() => navigate(`/cours/${course.id}`)}
                    >
                      <CardMedia
                        style={{ resizeMode: "contain" }}
                        src={course.data.imageCourseUrl}
                        width="100%"
                        title="Contemplative Reptile"
                        component="img"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {course.data.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {course.data.description}
                        </Typography>
                        <Tooltip title="BackLog">
                          <IconButton onClick={pdfBacklogRoute}>
                            <BackpackIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Support">
                          <IconButton onClick={pdfSupportRoute}>
                            <PictureAsPdfIcon />
                          </IconButton>
                        </Tooltip>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
                margin: 0,
                paddingTop: "20px",
              }}
            >
              <h1>Année {`${currentYear - 2}  - ${currentYear - 1} `}</h1>
              <Grid container spacing={2}>
                {(searchTerm.length > 0
                  ? [...filteredCoursesLastYear].filter(
                      (course) =>
                        course.data.title &&
                        course.data.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    )
                  : [...filteredCoursesLastYear]
                ).map((course) => (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: "45vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                      onClick={() => navigate(`/cours/${course.id}`)}
                    >
                      <CardMedia
                        style={{ resizeMode: "contain" }}
                        src={course.data.imageCourseUrl}
                        width="100%"
                        title="Contemplative Reptile"
                        component="img"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {course.data.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {course.data.description}
                        </Typography>
                        <Tooltip title="BackLog">
                          <IconButton onClick={pdfBacklogRoute}>
                            <BackpackIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Support">
                          <IconButton onClick={pdfSupportRoute}>
                            <PictureAsPdfIcon />
                          </IconButton>
                        </Tooltip>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </>
        ) : (
          <>
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                margin: 0,
                paddingTop: "20px",
              }}
            >
              <h1>Année {`${currentYear - 1}  - ${currentYear} `}</h1>
              {(searchTerm.length > 0
                ? [...filteredCoursesCurrentYear].filter(
                    (course) =>
                      course.data.title &&
                      course.data.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                : [...filteredCoursesCurrentYear]
              ).map(
                (course) => (
                  console.log(course),
                  (
                    <Card className="list-card">
                      <div className="list-card-content">
                        <CardMedia
                          className="list-card-image"
                          src={course.data.imageCourseUrl}
                          title={course.data.title}
                        />
                        <div className="list-card-details">
                          <CardContent>
                            <Typography variant="h5" component="h2">
                              {course.data.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {course.data.description}
                            </Typography>
                          </CardContent>
                          <div className="list-card-actions">
                            <Tooltip title="Ouvrir le cours">
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => navigate(`/cours/${course.id}`)}
                              >
                                Ouvrir
                              </Button>
                            </Tooltip>
                            <Tooltip title="Télécharger en PDF">
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                startIcon={<PictureAsPdfIcon />}
                              >
                                PDF
                              </Button>
                            </Tooltip>
                            <Tooltip title="BackLog">
                              <IconButton onClick={pdfBacklogRoute}>
                                <BackpackIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Support">
                              <IconButton onClick={pdfSupportRoute}>
                                <PictureAsPdfIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                )
              )}
            </Container>
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                margin: 0,
                paddingTop: "20px",
              }}
            >
              <h1>Année {`${currentYear - 2}  - ${currentYear - 1} `}</h1>
              {(searchTerm.length > 0
                ? [...filteredCoursesLastYear].filter(
                    (course) =>
                      course.data.title &&
                      course.data.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                : [...filteredCoursesLastYear]
              ).map(
                (course) => (
                  console.log(course),
                  (
                    <Card className="list-card">
                      <div className="list-card-content">
                        <CardMedia
                          className="list-card-image"
                          src={course.data.imageCourseUrl}
                          title={course.data.title}
                        />
                        <div className="list-card-details">
                          <CardContent>
                            <Typography variant="h5" component="h2">
                              {course.data.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {course.data.description}
                            </Typography>
                          </CardContent>
                          <div className="list-card-actions">
                            <Tooltip title="Ouvrir le cours">
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => navigate(`/cours/${course.id}`)}
                              >
                                Ouvrir
                              </Button>
                            </Tooltip>
                            <Tooltip title="Télécharger en PDF">
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                startIcon={<PictureAsPdfIcon />}
                              >
                                PDF
                              </Button>
                            </Tooltip>
                            <Tooltip title="BackLog">
                              <IconButton onClick={pdfBacklogRoute}>
                                <BackpackIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Support">
                              <IconButton onClick={pdfSupportRoute}>
                                <PictureAsPdfIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                )
              )}
            </Container>
          </>
        )}
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default Ressources;

import React, { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import useFirebase from "../../../hooks/useFirebase";
import timeConverter from "../../../functions/TimeConverter";

import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  CardContent,
  Card,
  Typography,
  Button,
  CardMedia,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";

import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModule from "@mui/icons-material/ViewModule";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/SearchRounded";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

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

  const { user } = useFirebase();
  const userStatus = user?.status;
  const userClassConnected = user?.class;

  const [view, setView] = useState("module");

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseDateStart, setCourseDateStart] = useState("");
  const [courseDateEnd, setCourseDateEnd] = useState("");
  const [courseCampusNumerique, setCourseCampusNumerique] = useState(false);
  const [courseOwner, setCourseOwner] = useState("");
  const [idSelectedOwner, setIdSelectedOwner] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [idSelectedClass, setIdSelectedClass] = useState("");
  const [coursePrivate, setCoursePrivate] = useState(false);
  const [courseImageBase64, setCourseImageBase64] = useState("");

  const [selectedFilterClass, setSelectedFilterClass] = useState("");
  const [selectedIdFilterClass, setSelectedIdFilterClass] = useState("");

  // Variable useState Cards
  const [courseOwnerData, setCourseOwnerData] = useState([]);
  const [courseClassData, setCourseClassData] = useState([]);

  const [userClass, setUserClass] = useState([]);

  const [isAllCoursesDataLoaded, setIsAllCoursesDataLoaded] = useState(false);

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
          setIsAllCoursesDataLoaded(true);
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

  const getClassId = async (classId) => {
    try {
      await axios
        .get(`http://localhost:5050/ressources/class/${classId}`)
        .then((res) => {
          setUserClass(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getCourseClassId = async (classId) => {
    try {
      await axios
        .get(`http://localhost:5050/ressources/class/${classId}`)
        .then((res) => {
          setCourseClassData(res.data);
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
          setCourseOwnerData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const loadCourseData = async (classId, instructorId) => {
    try {
      const courseClassPromise = axios.get(
        `http://localhost:5050/ressources/class/${classId}`
      );
      const instructorPromise = axios.get(
        `http://localhost:5050/ressources/instructor/${instructorId}`
      );

      const [courseClassResponse, instructorResponse] = await Promise.all([
        courseClassPromise,
        instructorPromise,
      ]);

      setCourseClassData(courseClassResponse.data);
      setCourseOwnerData(instructorResponse.data);
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
      const response = await axios.post(
        "http://localhost:5050/ressources/cours",
        {
          title: courseTitle,
          description: courseDescription,
          dateStartSprint: courseDateStart,
          dateEndSprint: courseDateEnd,
          campus_numerique: courseCampusNumerique,
          courseClass: idSelectedClass,
          owner: idSelectedOwner,
          private: coursePrivate,
          imageBase64: courseImageBase64,
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (error.response.status === 400) {
        toastWarning("Veuillez remplir tous les champs.");
      }
      throw error;
    }
  };

  useEffect(() => {
    getAllCours();
    getAllPo();
    getAllClass();
  }, []);

  useEffect(() => {
    if (isAllCoursesDataLoaded) {
      if (userClassConnected !== undefined) {
        getClassId(userClassConnected);
      }
    }
  }, [isAllCoursesDataLoaded]);

  useEffect(() => {
    filteredCoursesCurrentYear.forEach((course) => {
      loadCourseData(course.data.courseClass, course.data.owner);
    });
  }, []);

  const createCourse = () => {
    setOpen(true);
  };

  const onSubmit = async () => {
    try {
      await createNewCours();
      handleClose();
      toastSuccess(`Votre cours ${courseTitle} a bien été ajouté`);
      await getAllCours();
    } catch (error) {
      console.error(error);
      toastFail("Erreur lors de la création de votre cours.");
    }
  };

  const today = new Date();
  const currentYear =
    today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1;
  const lastYear = currentYear - 1;
  const startCurrentYear = new Date(currentYear, 8, 1);
  const endCurrentYear = new Date(currentYear + 1, 7, 31);
  const startLastYear = new Date(lastYear, 8, 1);
  const endLastYear = new Date(lastYear + 1, 7, 31);

  const filteredCoursesCurrentYear = courses.filter((course) => {
    const courseDate = timeConverter(course.data.dateStartSprint);
    return courseDate >= startCurrentYear && courseDate <= endCurrentYear;
  });

  const filteredCoursesLastYear = courses.filter((course) => {
    const courseDate = timeConverter(course.data.dateStartSprint);
    return courseDate >= startLastYear && courseDate <= endLastYear;
  });

  return (
    <>
      <div className="cours-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "0px",
            width: "100%",
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
          <div className="header-cours">
            <Box
              sx={{
                width: "20%",
                display: "flex",
                padding: "20px",
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
              <form noValidate autoComplete="off" style={{ width: "100%" }}>
                <TextField
                  id="outlined-basic"
                  label="Rechercher votre Cours"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ width: "80%" }}
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
            <FormControl>
              <Select
                value={selectedFilterClass}
                onChange={(event) => {
                  setSelectedFilterClass(event.target.value);
                  const selectedClass = allclass.find(
                    (coursClass) => coursClass.name === event.target.value
                  );
                  setSelectedIdFilterClass(
                    selectedClass ? selectedClass.id : ""
                  );
                }}
                displayEmpty
                renderValue={(value) => value || "Promo"}
              >
                <MenuItem value="">Filtrer sur la promo</MenuItem>
                {allclass.map((promo) => (
                  <MenuItem value={promo.name}>{promo.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {userStatus === "po" ? (
              <>
                <div className="btn-add-cours">
                  <Button
                    sx={{
                      margin: "30px",
                      padding: "10px",
                      backgroundColor: "#7a52e1",
                      color: "white",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#5c38b8",
                      },
                    }}
                    startIcon={<AddIcon />}
                    onClick={createCourse}
                  >
                    Ajouter un cours
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
            courseDateStart={courseDateStart}
            setCourseDateStart={setCourseDateStart}
            courseDateEnd={courseDateEnd}
            setCourseDateEnd={setCourseDateEnd}
            rejectedFiles={rejectedFiles}
            courseCampusNumerique={courseCampusNumerique}
            setCourseCampusNumerique={setCourseCampusNumerique}
            coursePrivate={coursePrivate}
            setCoursePrivate={setCoursePrivate}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            setIdSelectedClass={setIdSelectedClass}
            allclass={allclass}
            control={control}
            allpo={allpo}
            setCourseOwner={setCourseOwner}
            setIdSelectedOwner={setIdSelectedOwner}
            courseDescription={courseDescription}
            setCourseDescription={setCourseDescription}
          />
        </div>

        {view === "module" ? (
          <>
            <div className="grid-view-cours ">
              <h1>Année {`${currentYear}  - ${currentYear + 1} `}</h1>
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
                )
                  .filter((course) =>
                    userStatus === "etudiant"
                      ? userClass.id === course.data.courseClass
                      : true
                  )
                  .map((course) => {
                    return (
                      <Grid item xs={12} sm={6} md={3}>
                        <Card
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-evenly",
                            height: "450px",
                          }}
                          /* eslint-disable no-unused-expressions */
                          onClick={() => {
                            userStatus !== "etudiant" &&
                            course.data.private === true
                              ? navigate(`/coursinfo/${course.id}`)
                              : course.data.private === false
                              ? navigate(`/coursinfo/${course.id}`)
                              : "";
                          }}
                        >
                          <CardMedia
                            sx={{
                              display: "flex",
                              width: "100%",
                              maxHeight: "200px",
                              minHeight: "200px",
                              justifyContent: "center",
                              margin: "0",
                            }}
                            component="img"
                            src={course.data.imageCourseUrl}
                            alt="course image"
                          />

                          <CardContent
                            sx={{ padding: "10px", height: "120px" }}
                          >
                            <h2 variant="h3" component="div">
                              {course.data.title}
                            </h2>
                            <Typography variant="body2" color="text.secondary">
                              {course.data.description}
                            </Typography>

                            <Typography>
                              {courseOwnerData &&
                                courseOwnerData.data &&
                                courseOwnerData.data.lastname.toUpperCase()}{" "}
                              {courseOwnerData &&
                                courseOwnerData.data &&
                                courseOwnerData.data.firstname}
                            </Typography>
                            {/* <Typography>{courseClass}</Typography> */}
                            <Typography>
                              {"Début : "}
                              {course &&
                                course.data &&
                                course.data.dateStartSprint &&
                                moment
                                  .unix(course.data.dateStartSprint._seconds)
                                  .format("DD.MM.YYYY")}{" "}
                              - {"Fin : "}
                              {course &&
                                course.data &&
                                course.data.dateEndSprint &&
                                moment
                                  .unix(course.data.dateEndSprint._seconds)
                                  .format("DD.MM.YYYY")}
                            </Typography>
                            {userStatus === "etudiant" &&
                            course.data.private === true ? (
                              <>
                                <Tooltip title="Private">
                                  <LockRoundedIcon />
                                </Tooltip>
                              </>
                            ) : (
                              <>
                                <Tooltip title="Open">
                                  <IconButton
                                    onClick={() =>
                                      navigate(`/coursinfo/${course.id}`)
                                    }
                                  >
                                    <OpenInNewIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
              </Grid>
            </div>
            <div className="grid-view-cours ">
              <h1>Année {`${currentYear - 1}  - ${currentYear} `}</h1>
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
                )
                  .filter((course) =>
                    userStatus === "etudiant"
                      ? userClass.id === course.data.courseClass
                      : true
                  )
                  .map((course) => (
                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-evenly",
                          height: "450px",
                        }}
                        onClick={() =>
                          userStatus !== "etudiant" &&
                          course.data.private === true
                            ? navigate(`/coursinfo/${course.id}`)
                            : course.data.private === false
                            ? navigate(`/coursinfo/${course.id}`)
                            : ""
                        }
                      >
                        <CardMedia
                          sx={{
                            display: "flex",
                            width: "100%",
                            maxHeight: "200px",
                            minHeight: "200px",
                            justifyContent: "center",
                            margin: "0",
                          }}
                          component="img"
                          src={course.data.imageCourseUrl}
                          alt="course image"
                        />

                        <CardContent sx={{ padding: "10px", height: "120px" }}>
                          <h2 variant="h3" component="div">
                            {course.data.title}
                          </h2>
                          <Typography variant="body2" color="text.secondary">
                            {course.data.description}
                          </Typography>
                          {userStatus === "etudiant" &&
                          course.data.private === true ? (
                            <>
                              <Tooltip title="Private">
                                <LockRoundedIcon />
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Tooltip title="Open">
                                <IconButton
                                  onClick={() =>
                                    navigate(`/coursinfo/${course.id}`)
                                  }
                                >
                                  <OpenInNewIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </div>
          </>
        ) : (
          <>
            <div className="list-view-cours">
              <h1>Année {`${currentYear}  - ${currentYear + 1} `}</h1>
              {(searchTerm.length > 0
                ? [...filteredCoursesCurrentYear].filter(
                    (course) =>
                      course.data.title &&
                      course.data.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                : [...filteredCoursesCurrentYear]
              )
                .filter((course) =>
                  userStatus === "etudiant"
                    ? userClass.id === course.data.courseClass
                    : true
                )
                .map((course) => (
                  <Card
                    className="list-card"
                    onClick={() => navigate(`/coursinfo/${course.id}`)}
                    sx={{
                      marginBottom: "20px",
                    }}
                  >
                    <div className="list-card-content">
                      <CardMedia
                        className="list-card-image"
                        src={course.data.imageCourseUrl}
                        title={course.data.title}
                      />
                      <div className="list-card-details">
                        <CardContent sx={{ padding: "10px" }}>
                          <h2 variant="h3" component="div">
                            {course.data.title}
                          </h2>
                          <Typography variant="body2" color="text.secondary">
                            {course.data.description}
                          </Typography>
                          <Tooltip title="Open">
                            <IconButton
                              onClick={() =>
                                navigate(`/coursinfo/${course.id}`)
                              }
                            >
                              <OpenInNewIcon />
                            </IconButton>
                          </Tooltip>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
            <div className="list-view-cours">
              <h1>Année {`${currentYear - 1}  - ${currentYear} `}</h1>
              {(searchTerm.length > 0
                ? [...filteredCoursesLastYear].filter(
                    (course) =>
                      course.data.title &&
                      course.data.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                : [...filteredCoursesLastYear]
              )
                .filter((course) =>
                  userStatus === "etudiant"
                    ? userClass.id === course.data.courseClass
                    : true
                )
                .map((course) => (
                  <Card
                    className="list-card"
                    onClick={() => navigate(`/coursinfo/${course.id}`)}
                    sx={{
                      marginBottom: "20px",
                    }}
                  >
                    <div className="list-card-content">
                      <CardMedia
                        className="list-card-image"
                        src={course.data.imageCourseUrl}
                        title={course.data.title}
                      />
                      <div className="list-card-details">
                        <CardContent sx={{ padding: "10px" }}>
                          <h2 variant="h3" component="div">
                            {course.data.title}
                          </h2>
                          <Typography variant="body2" color="text.secondary">
                            {course.data.description}
                          </Typography>
                          <Tooltip title="Open">
                            <IconButton
                              onClick={() =>
                                navigate(`/coursinfo/${course.id}`)
                              }
                            >
                              <OpenInNewIcon />
                            </IconButton>
                          </Tooltip>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </>
        )}
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default Ressources;

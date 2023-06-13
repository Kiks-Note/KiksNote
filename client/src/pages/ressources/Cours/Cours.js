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
  Chip,
  Avatar,
} from "@mui/material";

import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModule from "@mui/icons-material/ViewModule";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/SearchRounded";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import CreateCoursModal from "./../../../components/ressources/cours/CreateCoursModal";
import SkeletonCours from "../../../components/ressources/cours/SkeletonCours";

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

const Cours = () => {
  let navigate = useNavigate();

  const { user } = useFirebase();
  const userStatus = user?.status;
  const userClassConnected = user?.class;

  const [view, setView] = useState("module");

  const [courses, setCourses] = useState([]);
  const [technos, setTechnos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseDateStart, setCourseDateStart] = useState("");
  const [courseDateEnd, setCourseDateEnd] = useState("");
  const [courseCampusNumerique, setCourseCampusNumerique] = useState(false);
  const [courseOwner, setCourseOwner] = useState("");
  const [idSelectedOwner, setIdSelectedOwner] = useState("");
  const [selectedClass, setSelectedClass] = useState([]);
  const [coursePrivate, setCoursePrivate] = useState(false);
  const [courseImageBase64, setCourseImageBase64] = useState("");

  const [selectedTechno, setSelectedTechno] = useState("");

  const [selectedFilterClass, setSelectedFilterClass] = useState("");
  const [selectedIdFilterClass, setSelectedIdFilterClass] = useState("");

  const [userClass, setUserClass] = useState([]);

  const [isAllCoursesDataLoaded, setIsAllCoursesDataLoaded] = useState(false);

  const [files, setFiles] = useState([]);
  const rejectedFiles = files.filter((file) => file.errors);

  const [open, setOpen] = useState(false);

  const [allpo, setAllPo] = useState([]);
  const [allclass, setAllclass] = useState([]);

  const [loading, setLoading] = useState(true);

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

  const createCourse = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const viewChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  /*
    Get an array of technos then set it in the empty array techno
 */

  const getAllTechnos = async () => {
    try {
      await axios
        .get("http://localhost:5050/ressources/technos")
        .then((res) => {
          setTechnos(res.data);
          setIsAllCoursesDataLoaded(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  /*
    Get an array of cours then set it in the empty array courses
 */

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

  /*
    Get an array of all PO then set it in the empty array allPo
 */

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

  /*
    Get an array of all classes data from their class id then set it in the empty array userClass
 */

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

  /*
    Get an array of all id classes then set it in the empty array allClass
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
    create a cours in the database if every data are not null
 */

  const createNewCours = async () => {
    if (
      courseTitle === "" ||
      courseDescription === "" ||
      courseDateStart === "" ||
      courseDateEnd === "" ||
      !selectedClass ||
      idSelectedOwner === "" ||
      courseImageBase64 === ""
    ) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    } else {
      try {
        await axios
          .post("http://localhost:5050/ressources/cours", {
            title: courseTitle,
            description: courseDescription,
            dateStartSprint: courseDateStart,
            dateEndSprint: courseDateEnd,
            campus_numerique: courseCampusNumerique,
            courseClass: selectedClass,
            owner: idSelectedOwner,
            private: coursePrivate,
            imageBase64: courseImageBase64,
          })
          .then((res) => {
            if (res.status === 200) {
              toastSuccess(`Votre cours ${courseTitle} a bien été ajouté`);
              handleClose();
              getAllCours();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        if (error.response.status === 400) {
          toastWarning("Veuillez remplir tous les champs.");
        }
        console.error(error);
        toastFail("Erreur lors de la création de votre cours.");
        throw error;
      }
    }
  };

  /*
    Get all cours, technos, po, class when the page is loading
 */

  useEffect(() => {
    getAllCours()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    getAllTechnos();
    getAllPo();
    getAllClass();
  }, []);

  /*
    Get the class of the current user if it's a student by using his class id
 */

  useEffect(() => {
    if (isAllCoursesDataLoaded) {
      if (userClassConnected !== undefined) {
        getClassId(userClassConnected?.id);
      }
    }
  }, [isAllCoursesDataLoaded, userClassConnected]);

  /*
    Submit the data from the CreateCours form to the function createNewCours() 
 */

  const onSubmit = async () => {
    await createNewCours();
  };

  /*
    Set all Dates value we need
    today = current date
    currentYear = current year
    lastYear = last year
    startCurrentYear = date when the scholar year start (September the 1st)
    endCurrentYear = date when the scholar year end
    startLastYear = date when the last scholar year start
    endLastYear = date when the last scholar year end
 */

  const today = new Date();
  const currentYear =
    today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1;
  const lastYear = currentYear - 1;
  const startCurrentYear = new Date(currentYear, 8, 1);
  const endCurrentYear = new Date(currentYear + 1, 7, 31);
  const startLastYear = new Date(lastYear, 8, 1);
  const endLastYear = new Date(lastYear + 1, 7, 31);

  /*
    Filter the courses and get every cours from the current year
 */

  const filteredCoursesCurrentYear = courses.filter((course) => {
    const courseDate = timeConverter(course.data.dateStartSprint);
    return courseDate >= startCurrentYear && courseDate <= endCurrentYear;
  });

  /*
    Filter the courses and get every cours from the last year
 */

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
            <FormControl sx={{ width: "15%" }}>
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
            {userStatus !== "etudiant" ? (
              <>
                <div className="btn-add-cours">
                  <Button
                    sx={{
                      padding: "10px",
                      margin: "10px",
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
            technos={technos}
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
            allclass={allclass}
            control={control}
            allpo={allpo}
            setCourseOwner={setCourseOwner}
            setIdSelectedOwner={setIdSelectedOwner}
            courseDescription={courseDescription}
            setCourseDescription={setCourseDescription}
            selectedTechno={selectedTechno}
            setSelectedTechno={setSelectedTechno}
            handleChange={(e) => setSelectedTechno(e.target.value)}
            setCourseImageBase64={setCourseImageBase64}
          />
        </div>

        {view === "module" ? (
          <>
            <div className="grid-view-cours ">
              <h1>Année {`${currentYear}  - ${currentYear + 1} `}</h1>
              <Grid container spacing={2}>
                {loading ? (
                  <>
                    <SkeletonCours />
                  </>
                ) : (
                  <>
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
                          ? userClass.id === course.data.courseClass.id
                          : true
                      )
                      .filter((course) =>
                        selectedIdFilterClass !== ""
                          ? course?.data?.courseClass.id ===
                            selectedIdFilterClass
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
                              <h2
                                style={{ paddingLeft: "10px", margin: "0" }}
                                variant="h3"
                                component="div"
                              >
                                {course.data.title}
                              </h2>
                              <CardMedia
                                sx={{
                                  display: "flex",
                                  width: "100%",
                                  maxHeight: "210px",
                                  minHeight: "210px",
                                  justifyContent: "center",
                                  margin: "0",
                                }}
                                component="img"
                                src={course.data.imageCourseUrl}
                                alt="course image"
                              />

                              <CardContent
                                sx={{
                                  padding: "10px",
                                  height: "120px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  {Array.isArray(course.data.courseClass) ? (
                                    course.data.courseClass.map((classData) => (
                                      <Chip
                                        key={classData.id}
                                        label={
                                          <>
                                            <div style={{ display: "flex" }}>
                                              <Typography>
                                                {classData.name}
                                              </Typography>
                                              <SchoolIcon />
                                            </div>
                                          </>
                                        }
                                      />
                                    ))
                                  ) : (
                                    <Chip
                                      key={course.data.courseClass.id}
                                      label={
                                        <>
                                          <div style={{ display: "flex" }}>
                                            <Typography>
                                              {course.data.courseClass.name}
                                            </Typography>
                                            <SchoolIcon />
                                          </div>
                                        </>
                                      }
                                    />
                                  )}

                                  <Chip
                                    avatar={
                                      <Avatar
                                        alt={
                                          course.data.owner.lastname.toUpperCase() +
                                          "" +
                                          course.data.owner.firstname +
                                          "photo-profile"
                                        }
                                        src={course.data.owner.image}
                                      />
                                    }
                                    variant="outlined"
                                    label={
                                      <>
                                        <Typography>
                                          {course.data.owner.lastname.toUpperCase()}{" "}
                                          {course.data.owner.firstname}
                                        </Typography>
                                      </>
                                    }
                                  ></Chip>
                                </div>
                                <div style={{ padding: "10px" }}>
                                  <Typography
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <CalendarTodayIcon />
                                    {"Début "}
                                    {course?.data?.dateStartSprint &&
                                      moment
                                        .unix(
                                          course.data.dateStartSprint._seconds
                                        )
                                        .format("DD.MM.YYYY")}{" "}
                                    - {"Fin "}
                                    {course?.data?.dateEndSprint &&
                                      moment
                                        .unix(
                                          course.data.dateEndSprint._seconds
                                        )
                                        .format("DD.MM.YYYY")}
                                    <EventBusyIcon />
                                  </Typography>
                                </div>

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
                  </>
                )}
              </Grid>
            </div>
            <div className="grid-view-cours ">
              <h1>Année {`${currentYear - 1}  - ${currentYear} `}</h1>
              <Grid container spacing={2}>
                {loading ? (
                  <>
                    <SkeletonCours />
                  </>
                ) : (
                  <>
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
                          ? userClass.id === course.data.courseClass.id
                          : true
                      )
                      .filter((course) =>
                        selectedIdFilterClass !== ""
                          ? course?.data?.courseClass.id ===
                            selectedIdFilterClass
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
                            <h2
                              style={{ paddingLeft: "10px", margin: "0" }}
                              variant="h3"
                              component="div"
                            >
                              {course.data.title}
                            </h2>
                            <CardMedia
                              sx={{
                                display: "flex",
                                width: "100%",
                                maxHeight: "210px",
                                minHeight: "210px",
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
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                {Array.isArray(course.data.courseClass) ? (
                                  course.data.courseClass.map((classData) => (
                                    <Chip
                                      key={classData.id}
                                      label={
                                        <>
                                          <div style={{ display: "flex" }}>
                                            <Typography>
                                              {classData.name}
                                            </Typography>
                                            <SchoolIcon />
                                          </div>
                                        </>
                                      }
                                    />
                                  ))
                                ) : (
                                  <Chip
                                    key={course.data.courseClass.id}
                                    label={
                                      <>
                                        <div style={{ display: "flex" }}>
                                          <Typography>
                                            {course.data.courseClass.name}
                                          </Typography>
                                          <SchoolIcon />
                                        </div>
                                      </>
                                    }
                                  />
                                )}
                                <Chip
                                  avatar={
                                    <Avatar
                                      alt={
                                        course.data.owner.lastname.toUpperCase() +
                                        "" +
                                        course.data.owner.firstname +
                                        "photo-profile"
                                      }
                                      src={course.data.owner.image}
                                    />
                                  }
                                  variant="outlined"
                                  label={
                                    <>
                                      <Typography>
                                        {course.data.owner.lastname.toUpperCase()}{" "}
                                        {course.data.owner.firstname}
                                      </Typography>
                                    </>
                                  }
                                ></Chip>
                              </div>
                              <div style={{ padding: "10px" }}>
                                <Typography
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <CalendarTodayIcon />
                                  {"Début "}
                                  {course?.data?.dateStartSprint &&
                                    moment
                                      .unix(
                                        course.data.dateStartSprint._seconds
                                      )
                                      .format("DD.MM.YYYY")}{" "}
                                  - {"Fin "}
                                  {course?.data?.dateEndSprint &&
                                    moment
                                      .unix(course.data.dateEndSprint._seconds)
                                      .format("DD.MM.YYYY")}
                                  <EventBusyIcon />
                                </Typography>
                              </div>
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
                  </>
                )}
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
                    ? userClass.id === course.data.courseClass.id
                    : true
                )
                .filter((course) =>
                  selectedIdFilterClass !== ""
                    ? course?.data?.courseClass.id === selectedIdFilterClass
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
                      <div className="list-card-details">
                        <CardContent sx={{ padding: "10px" }}>
                          <h2 variant="h3" component="div">
                            {course.data.title}
                          </h2>
                          <Chip
                            label={
                              <>
                                <div style={{ display: "flex" }}>
                                  <Typography>
                                    {course.data.courseClass.name}
                                  </Typography>
                                  <SchoolIcon />
                                </div>
                              </>
                            }
                          ></Chip>
                          <Chip
                            avatar={
                              <Avatar
                                alt={
                                  course.data.owner.lastname.toUpperCase() +
                                  "" +
                                  course.data.owner.firstname +
                                  "photo-profile"
                                }
                                src={course.data.owner.image}
                              />
                            }
                            variant="outlined"
                            label={
                              <>
                                <Typography>
                                  {course.data.owner.lastname.toUpperCase()}{" "}
                                  {course.data.owner.firstname}
                                </Typography>
                              </>
                            }
                          ></Chip>
                          <div style={{ padding: "10px" }}>
                            <Typography
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <CalendarTodayIcon />
                              {"Début "}
                              {course?.data?.dateStartSprint &&
                                moment
                                  .unix(course.data.dateStartSprint._seconds)
                                  .format("DD.MM.YYYY")}{" "}
                              - {"Fin "}
                              {course?.data?.dateEndSprint &&
                                moment
                                  .unix(course.data.dateEndSprint._seconds)
                                  .format("DD.MM.YYYY")}
                              <EventBusyIcon />
                            </Typography>
                          </div>

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
                    ? userClass.id === course.data.courseClass.id
                    : true
                )
                .filter((course) =>
                  selectedIdFilterClass !== ""
                    ? course?.data?.courseClass.id === selectedIdFilterClass
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
                      <div className="list-card-details">
                        <CardContent sx={{ padding: "10px" }}>
                          <h2 variant="h3" component="div">
                            {course.data.title}
                          </h2>
                          <Chip
                            sx={{
                              display: "flex",
                              padding: "10px",
                              alignItems: "center",
                            }}
                            label={
                              <>
                                <div style={{ display: "flex" }}>
                                  <Typography>
                                    {course.data.courseClass.name}
                                  </Typography>
                                  <SchoolIcon />
                                </div>
                              </>
                            }
                          ></Chip>
                          <Chip
                            avatar={
                              <Avatar
                                alt={
                                  course.data.owner.lastname.toUpperCase() +
                                  "" +
                                  course.data.owner.firstname +
                                  "photo-profile"
                                }
                                src={course.data.owner.image}
                              />
                            }
                            variant="outlined"
                            label={
                              <>
                                <Typography>
                                  {course.data.owner.lastname.toUpperCase()}{" "}
                                  {course.data.owner.firstname}
                                </Typography>
                              </>
                            }
                          ></Chip>
                          <div style={{ padding: "10px" }}>
                            <Typography
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <CalendarTodayIcon />
                              {"Début "}
                              {course?.data?.dateStartSprint &&
                                moment
                                  .unix(course.data.dateStartSprint._seconds)
                                  .format("DD.MM.YYYY")}{" "}
                              - {"Fin "}
                              {course?.data?.dateEndSprint &&
                                moment
                                  .unix(course.data.dateEndSprint._seconds)
                                  .format("DD.MM.YYYY")}
                              <EventBusyIcon />
                            </Typography>
                          </div>
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

export default Cours;

import React, { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
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
  Autocomplete,
  Typography,
  Button,
  CardMedia,
  Tooltip,
  TablePagination,
  Grid,
  TextField,
  InputAdornment,
  Modal,
  MenuItem,
  Select,
  Switch,
  FormControl,
  InputLabel,
} from "@mui/material";

import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModule from "@mui/icons-material/ViewModule";
import AddIcon from "@mui/icons-material/Add";
import BackpackIcon from "@mui/icons-material/Backpack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SearchIcon from "@mui/icons-material/SearchRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";

import Dropzone from "./Dropzone";

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
  var studentClass = loggedUserParsed.class;

  const [rows, setRows] = useState([]);
  const [view, setView] = useState("module");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseDate, setCourseDate] = useState("");
  const [courseCampusNumerique, setCourseCampusNumerique] = useState(false);
  const [courseOwner, setCourseOwner] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [coursePrivate, setCoursePrivate] = useState(false);
  const [courseImageBase64, setCourseImageBase64] = useState("");

  const [files, setFiles] = useState([]);

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles((files) => [...files, ...acceptedFiles]);
  }, []);

  const handleRemove = (file) => () => {
    setFiles((files) => files.filter((f) => f !== file));
  };

  const rejectedFiles = files.filter((file) => file.errors);

  const handleFileChange = (fileData) => {
    console.log("File data:", fileData);
    setCourseImageBase64(fileData);
  };

  const { control } = useForm({
    mode: "onTouched",
  });

  const [open, setOpen] = useState(false);

  const [allpo, setAllPo] = useState([]);
  const [allclass, setAllclass] = useState([]);

  const filteredCourses = courses.filter(
    (course) =>
      course.data.title &&
      course.data.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        .get("http://localhost:5050/ressources/allpo")
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

          <Modal open={open} onClose={handleClose}>
            <div className="modal-container">
              <form className="create-card-form">
                <IconButton
                  sx={{
                    marginLeft: "90%",
                    width: "50px",
                    height: "50px",
                  }}
                  onClick={handleClose}
                >
                  <CloseRounded />
                </IconButton>

                <div className="title-cours-date-container">
                  <TextField
                    className="textfield"
                    id="title"
                    name="title"
                    label="Nom du cours"
                    variant="standard"
                    type="text"
                    defaultValue={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    sx={{
                      width: "80%",
                    }}
                  />
                  <TextField
                    className="textfield"
                    id="date"
                    name="date"
                    label=" "
                    variant="standard"
                    type="date"
                    defaultValue={courseDate}
                    onChange={(e) => setCourseDate(e.target.value)}
                  />
                </div>

                <div className="dropzone-coursimg-container">
                  <p className="info-dropdown-img">
                    Drag and drop an image file here, or click to select an
                    image file. (max. 1.00 MB each) as JPG, PNG, GIF, WebP, SVG
                    or BMP.
                  </p>
                  <Dropzone onDrop={handleDrop} onFileChange={handleFileChange}>
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <p>
                            Drag and drop some files here, or click to select
                            files
                          </p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                  {rejectedFiles.length > 0 && (
                    <div>
                      <h4>Rejected files:</h4>
                      <ul>
                        {rejectedFiles.map((file) => (
                          <li key={file.name}>
                            {file.name} - {file.size} bytes - {file.type}
                            <button onClick={handleRemove(file)}>Remove</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="switch-btn-container">
                  <FormControl fullWidth>
                    <InputLabel id="campus-numerique-label">
                      Campus Numérique
                    </InputLabel>
                    <Switch
                      labelId="campus-numerique-label"
                      checked={courseCampusNumerique}
                      onChange={(event) =>
                        setCourseCampusNumerique(event.target.checked)
                      }
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="private-label">En privée</InputLabel>
                    <Switch
                      labelId="campus-numerique-label"
                      checked={coursePrivate}
                      onChange={(event) =>
                        setCoursePrivate(event.target.checked)
                      }
                    />
                  </FormControl>
                </div>

                <div className="select-class-allpo-container">
                  <Select
                    value={selectedClass}
                    onChange={(event) => setSelectedClass(event.target.value)}
                    displayEmpty
                    renderValue={(value) => value || "Choisir la classe"}
                  >
                    <MenuItem value="">Choisir une option</MenuItem>
                    {allclass.map((cours) => (
                      <MenuItem key={cours.id} value={cours.name}>
                        {cours.name}
                      </MenuItem>
                    ))}
                  </Select>

                  <Controller
                    name="po"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        id="po-select"
                        sx={{
                          width: "80%",
                        }}
                        options={allpo}
                        getOptionLabel={(option) =>
                          `${
                            option.lastname ? option.lastname.toUpperCase() : ""
                          } ${option.firstname}`
                        }
                        value={allpo.find((po) => po.id === value) || ""}
                        onChange={(event, newValue) => {
                          onChange(newValue ? newValue.id : "");
                          setCourseOwner(
                            newValue
                              ? `${newValue.lastname.toUpperCase()} ${
                                  newValue.firstname
                                }`
                              : null
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select a PO"
                            variant="outlined"
                            inputProps={{
                              ...params.inputProps,
                              name: "po",
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </div>

                <TextField
                  className="textfield"
                  id="desc"
                  name="desc"
                  label="Description du cours"
                  variant="standard"
                  type="text"
                  multiline
                  maxRows={7}
                  sx={{
                    width: "100%",
                  }}
                  defaultValue={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                />

                <Button
                  color="primary"
                  sx={{
                    marginLeft: "30%",
                    marginRight: "30%",
                    marginTop: "10px",
                  }}
                  onClick={onSubmit}
                >
                  Submit
                </Button>
              </form>
            </div>
          </Modal>

          {view === "module" ? (
            rows.length > 0 && (
              <Box
                sx={{
                  flexGrow: 1,
                  marginTop: 3,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TablePagination
                  component="div"
                  rowsPerPageOptions={[5, 10, 25, { label: "Tout", value: -1 }]}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Par page"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from} - ${to} sur ${count}`
                  }
                />
              </Box>
            )
          ) : (
            <></>
          )}
        </Container>

        {view === "module" ? (
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
            <Grid container spacing={2}>
              {filteredCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "45vh",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
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
        ) : (
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              margin: 0,
              paddingTop: "20px",
            }}
          >
            {filteredCourses.map((course) => (
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
                          onClick={() => navigate(`/cours/${course._id}`)}
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
            ))}
          </Container>
        )}
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default Ressources;

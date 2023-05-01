import React, { useEffect, useState } from "react";
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
} from "@mui/material";

import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModule from "@mui/icons-material/ViewModule";
import AddIcon from "@mui/icons-material/Add";
import BackpackIcon from "@mui/icons-material/Backpack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SearchIcon from "@mui/icons-material/SearchRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";

import "./Cours.scss";
import imageUrl from "./vue.png";

export default function Ressources() {
  let navigate = useNavigate();

  const loggedUser = localStorage.getItem("user");
  const loggedUserParsed = JSON.parse(loggedUser);
  var userStatus = loggedUserParsed.status;

  const [rows, setRows] = useState([]);
  const [view, setView] = useState("module");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    getAllCours();
  }, []);

  const createCourse = () => {
    setOpen(true);
  };

  const pdfBacklogRoute = () => navigate("/pdfBacklog");
  const pdfSupportRoute = () => navigate("/pdfSupport");

  const onSubmit = async (e) => {};

  const handleSubmit = () => {
    console.log("Submited");
  };

  return (
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
          <form onSubmit={handleSubmit(onSubmit)} className="create-card-form">
            <IconButton
              sx={{
                marginLeft: "80%",
                width: "50px",
                height: "50px",
              }}
              onClick={handleClose}
            >
              <CloseRounded />
            </IconButton>
            <TextField
              className="textfield"
              id="title"
              name="title"
              label="Nom du cours"
              variant="standard"
              type="text"
              // {...register("title")}
            />
            <TextField
              className="textfield"
              id="date"
              name="date"
              label=" "
              variant="standard"
              type="date"
              // {...register("date")}
            />
            <TextField
              className="textfield"
              id="image"
              name="image"
              label="Image du cours"
              variant="standard"
            />
            <TextField
              className="textfield"
              id="po"
              name="po"
              label="PO"
              variant="standard"
              type="text"
              // {...register("po")}
            />
            {/* <Controller
              name="po"
              {...register("membres", {
                required: true,
                validate: {
                  valid: (event, item) => {
                    if (event.length < 2 || event.length > 4) {
                      return false;
                    }
                  },
                },
              })}
              // control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  onChange={(event, item) => {
                    onChange(item);
                  }}
                  value={value}
                  // options={membres}
                  getOptionLabel={(option) =>
                    `${option.firstname + option.lastname}`
                  }
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Membres*"
                      placeholder="Choissisez vos partenanires"
                    />
                  )}
                />
              )}
            /> */}
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
                width: "70%",
              }}
              // {...register("description")}
            />

            <Button
              type="submit"
              color="primary"
              sx={{
                marginLeft: "30%",
                marginRight: "30%",
                marginTop: "10px",
              }}
            >
              Submit
            </Button>
          </form>
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
                <Card>
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
        <div className="list-view-container">
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
        </div>
      )}
    </div>
  );
}

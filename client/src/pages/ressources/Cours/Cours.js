import React, { useEffect, useState } from "react";
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
  Divider,
  List,
  ListItem,
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
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import SearchIcon from "@mui/icons-material/SearchRounded";

import "./Cours.scss";
import imageUrl from "./vue.png";

export default function Ressources() {
  const loggedUser = localStorage.getItem("user");
  const loggedUserParsed = JSON.parse(loggedUser);
  var userStatus = loggedUserParsed.status;

  const [rows, setRows] = useState([]);
  const [view, setView] = useState("module");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [ressources, setRessources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCourses = courses.filter(
    (course) =>
      course.title &&
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // * FUNCTION

  //* CHANGE THE VIEW OF THE CARD BOARD
  const viewChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  useEffect(() => {
    const fetchRessources = async () => {
      try {
        const response = await axios.get("http://localhost:5050/ressources");
        setRessources(response.data);
        setCourses(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRessources();
  }, []);

  const navigate = useNavigate();
  const createCardRoute = () => navigate("/createCard");
  const pdfBacklogRoute = () => navigate("/pdfBacklog");
  const pdfSupportRoute = () => navigate("/pdfSupport");

  if (ressources.length === 0) {
    return <div>Aucune carte à afficher</div>;
  }

  console.log(filteredCourses);
  console.log(userStatus);

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
            <div className="btn-add-cours">
              <Button
                variant="contained"
                color="primary"
                aria-label="add"
                onClick={createCardRoute}
              >
                Ajouter un cours <AddIcon />
              </Button>
            </div>
          ) : (
            <div></div>
          )}
        </div>

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
        <Grid container spacing={2}>
          {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((dashboard) => (
              <Grid item xs={3} key={dashboard.id}>
                {/* <CardBoard
                  picture={dashboard.picture}
                  sprint_group={dashboard.sprint_group}
                  fav={dashboard.favorite}
                  isFavoris={favorisTell}
                  id={dashboard.id}
                /> */}
              </Grid>
            ))}
        </Grid>
      ) : (
        rows.length > 0 &&
        // <TableBoard
        //   rows={rows}
        //   addFavorite={favorisTell}
        //   deleteBoards={deleteBoards}
        // />
        console.log("")
      )}

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
        {filteredCourses.map((ressource) => (
          <Card
            key={ressource.id}
            style={{
              width: "24%",
              margin: "auto",
              marginBottom: "20px",
              transition: "0.3s",
              boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
              "&:hover": {
                boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
              },
            }}
          >
            <CardMedia
              style={{ resizeMode: "contain" }}
              src={imageUrl} // À Modifier pour afficher l'image Choisie par l'utilisateur
              height="140"
              title="Contemplative Reptile"
              component="img"
            />
            <CardContent
              style={{
                textAlign: "left",
                flexDirection: "column",
              }}
            >
              <Typography
                variant={"h6"}
                gutterBottom
                paragraph
                sx={{ fontSize: 25 }}
              >
                {ressource.title}
              </Typography>
              <Typography variant={"caption"} paragraph sx={{ fontSize: 18 }}>
                Description : {ressource.description}
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
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
                <Tooltip title="Favori">
                  <IconButton onClick={""}>
                    <FavoriteRounded />
                  </IconButton>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        ))}
      </Container>
    </div>
  );
}

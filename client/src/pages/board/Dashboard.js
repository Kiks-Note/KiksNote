import React, { useState } from "react";
import TableBoard from "../../components/board/TableBoards";
import CardBoard from "../../components/board/CardBoard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Divider, Typography } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

import TablePagination from "@mui/material/TablePagination";
const maDate = new Date();



function Dashboard() {
  const [rows, setRows] = useState([
    {
      id: 1,
      sprint_name: "Java",
      sprint_group: "Kiks",
      start: "12/12/2022",
      end: "29/12/2022",
      backlog: "lien",
      favorite: true,
      students: {
        student_id: "uid(student)",
        firstname: "Chris",
      },
      picture: "https://picsum.photos/500/300?random=" + Math.random(),
      links: "https://mui.com/material-ui/react-button/",
    },
    {
      id: 2,
      sprint_name: "Php",
      sprint_group: "Kiks2",
      start: "22/12/2022",
      end: "29/12/2022",
      backlog: "lien",
      favorite: false,
      students: {
        student_id: "uid(student)",
        firstname: "Elim",
      },
      picture: "https://picsum.photos/500/300?random=" + Math.random(),
      links: "https://mui.com/material-ui/react-button/",
    },
    {
      id: 3,
      sprint_name: "JavaScript",
      sprint_group: "TheVie",
      start: "22/12/2022",
      end: "29/12/2022",
      backlog: "lien",
      favorite: false,
      students: {
        student_id: "uid(student)",
        firstname: "Elim",
      },
      picture: "https://picsum.photos/500/300?random=" + Math.random(),
      links: "https://mui.com/material-ui/react-button/",
    },
    {
      id: 4,
      sprint_name: "Symfony",
      sprint_group: "SMS",
      start: "22/12/2022",
      end: "29/12/2022",
      backlog: "lien",
      favorite: false,
      students: {
        student_id: "uid(student)",
        firstname: "Elim",
      },
      picture: "https://picsum.photos/500/300?random=" + Math.random(),
      links: "https://mui.com/material-ui/react-button/",
    },
    {
      id: 5,
      sprint_name: "Python",
      sprint_group: "BoaTeam",
      start: "22/12/2022",
      end: "29/12/2022",
      backlog: "lien",
      favorite: false,
      students: {
        student_id: "uid(student)",
        firstname: "Elim",
      },
      picture: "https://picsum.photos/500/300?random=" + Math.random(),
      links: "https://mui.com/material-ui/react-button/",
    },
    {
      id: 6,
      sprint_name: "Php",
      sprint_group: "Farid",
      start: "22/12/2022",
      end: "29/12/2022",
      backlog: "lien",
      favorite: false,
      students: {
        student_id: "uid(student)",
        firstname: "Elim",
      },
      picture: "https://picsum.photos/500/300?random=" + Math.random(),
      links: "https://mui.com/material-ui/react-button/",
    },
    {
      id: 7,
      sprint_name: "Php",
      sprint_group: "Storm",
      start: "22/12/2022",
      end: "29/12/2022",
      backlog: "lien",
      favorite: false,
      students: {
        student_id: "uid(student)",
        firstname: "Elim",
      },
      picture: "https://picsum.photos/500/300?random=" + Math.random(),
      links: "https://mui.com/material-ui/react-button/",
    },
  ]);
  const [view, setView] = useState("module");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //FUNCTION

  //CHANGE THE VIEW OF THE CARD BOARD
  const viewChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };
  //DELETE A BOARD
  const deleteBoards = (id) => () => {
    setTimeout(() => {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    });
  };
  //TO MAKE A BOARD IN FAVORI
  const favorisTell = (id) => () => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, favorite: !row.favorite } : row
      )
    );
  };
  //DEFINE BOARDS WHO IS ACTIF
  let actif = rows.filter(
    (person) =>
      person.start <= maDate.toLocaleDateString("fr") &&
      person.end > maDate.toLocaleDateString("fr")
  );
  //DEFINE BOARDS WHO IS IN  FAVORIS
  let favoris = rows.filter((person) => person.favorite === true);
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {favoris.length > 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              <StarBorderIcon /> Tableaux favoris
            </Typography>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {favoris.map((person) => (
                <Grid item xs={2} sm={4} md={4} key={person.id}>
                  <CardBoard
                    key={person.id}
                    picture={person.picture}
                    sprint_group={person.sprint_group}
                    fav={person.favorite}
                    isFavoris={favorisTell(person.id)}
                  />
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ width: " 100%", margin: 2 }} />
          </Box>
        ) : (
          <></>
        )}
        {actif.length > 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Tableau actif
            </Typography>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {actif.map((person) => (
                <Grid item xs={2} sm={4} md={4} key={person.id}>
                  <CardBoard
                    key={person.id}
                    picture={person.picture}
                    sprint_group={person.sprint_group}
                    fav={person.favorite}
                    isFavoris={favorisTell(person.id)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <></>
        )}
      </Box>
      <Divider sx={{ width: " 100%", margin: 2 }} />
      <Box>
        <Typography variant="h6" gutterBottom>
          Mes tableaux
        </Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={viewChange}
          sx={{ width: " 100%", margin: 1 }}
        >
          <ToggleButton value="module" aria-label="module">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {/* DISPLAY  */}
      {view === "module" ? (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((person) => (
            <Grid item xs={2} sm={4} md={4} lg={12} key={person.id}>
              <CardBoard
                key={person.id}
                picture={person.picture}
                sprint_group={person.sprint_group}
                fav={person.favorite}
                isFavoris={favorisTell(person.id)}
              />
            </Grid>
          ))}
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              margin: 3,
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
              labelRowsPerPage="Nombre de board par page "
            />
          </Box>
        </Grid>
      ) : (
        <Box sx={{ width: " 100%", marginTop: 4 }}>
          <TableBoard
            rows={rows}
            addFavorite={favorisTell}
            deleteBoards={deleteBoards}
          />
        </Box>
      )}
    </>
  );
}

export default Dashboard;

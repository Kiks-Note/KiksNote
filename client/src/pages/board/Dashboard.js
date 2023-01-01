import React, { useState } from "react";
import TableBoard from "../../components/board/TableBoards";
import CardBoard from "../../components/board/CardBoard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Divider, List, ListItem, Typography } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

import TablePagination from "@mui/material/TablePagination";
import Modal from "../../components/board/Modal";
let maDate = new Date();

function Dashboard() {
  const [rows, setRows] = useState([
    {
      id: 1,
      sprint_name: "Java",
      sprint_group: "Kiks",
      start: "12/12/2022",
      end: "29/12/2022",
      backlog: "lien",
      favorite: false,
      favoriteDate: "",
      students: {
        student_id: "uid(student)",
        firstname: "Chris",
      },
      picture:
        "https://picsum.photos/500/300?random=" +
        Math.floor(Math.random() * 100) +
        1,
    },
    {
      id: 2,
      sprint_name: "Php",
      sprint_group: "Kiks2",
      start: "22/12/2022",
      end: "29/12/2022",
      backlog: "lien",
      favorite: false,
      favoriteDate: "",
      students: {
        student_id: "uid(student)",
        firstname: "Elim",
      },
      picture:
        "https://picsum.photos/500/300?random=" +
        Math.floor(Math.random() * 100) +
        1,
    },
    {
      id: 3,
      sprint_name: "JavaScript",
      sprint_group: "TheVie",
      start: "22/12/2022",
      end: "29/12/2022",
      backlog: "lien",
      favorite: false,
      favoriteDate: "",
      students: {
        student_id: "uid(student)",
        firstname: "Elim",
      },
      picture:
        "https://picsum.photos/500/300?random=" +
        Math.floor(Math.random() * 100) +
        1,
    },
    {
      id: 4,
      sprint_name: "Symfony",
      sprint_group: "SMS",
      start: "22/12/2022",
      end: "29/12/2022",
      backlog: "lien",
      favorite: false,
      favoriteDate: "",
      students: {
        student_id: "uid(student)",
        firstname: "Elim",
      },
      picture:
        "https://picsum.photos/500/300?random=" +
        Math.floor(Math.random() * 100) +
        1,
    },
    {
      id: 5,
      sprint_name: "Python",
      sprint_group: "BoaTeam",
      start: "22/12/2022",
      end: "29/12/2022",
      backlog: "lien",
      favorite: false,
      favoriteDate: "",
      students: {
        student_id: "uid(student)",
        firstname: "Elim",
      },
      picture:
        "https://picsum.photos/500/300?random=" +
        Math.floor(Math.random() * 100) +
        1,
    },
    {
      id: 6,
      sprint_name: "Php",
      sprint_group: "Farid",
      start: "22/12/2022",
      end: "29/12/2022",
      backlog: "lien",
      favorite: false,
      favoriteDate: "",
      students: {
        student_id: "uid(student)",
        firstname: "Elim",
      },
      picture:
        "https://picsum.photos/500/300?random=" +
        Math.floor(Math.random() * 100) +
        1,
    },
    {
      id: 7,
      sprint_name: "Php",
      sprint_group: "Storm",
      start: "22/12/2022",
      end: "29/12/2022",
      backlog: "lien",
      favorite: false,
      favoriteDate: "",
      students: {
        student_id: "uid(student)",
        firstname: "Elim",
      },
      picture:
        "https://picsum.photos/500/300?random=" +
        Math.floor(Math.random() * 100) +
        1,
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
        row.id === id
          ? {
              ...row,
              favorite: !row.favorite,
              favoriteDate: maDate.toLocaleDateString("fr"),
            }
          : row
      )
    );
  };
  //DEFINE BOARDS WHO IS ACTIF
  let actif = rows.filter(
    (board) =>
      board.start <= maDate.toLocaleDateString("fr") &&
      board.end > maDate.toLocaleDateString("fr")
  );
  //DEFINE BOARDS WHO IS IN  FAVORIS
  let favoris = rows
    .filter((person) => person.favorite === true)
    .sort((a, b) => a - b);
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {favoris.length > 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              <StarBorderIcon /> Tableaux favoris
            </Typography>
            <List
              style={{
                overflow: "auto",
                display: "-webkit-inline-box",
                width: "100%",
              }}
            >
              {favoris.map((person) => (
                <ListItem key={person.id} style={{ maxWidth: "345px" }}>
                  <CardBoard
                    key={person.id}
                    picture={person.picture}
                    sprint_group={person.sprint_group}
                    fav={person.favorite}
                    isFavoris={favorisTell(person.id)}
                    id={person.id}
                  />
                </ListItem>
              ))}
            </List>
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
            <List
              style={{
                overflow: "auto",
                display: "-webkit-inline-box",
                width: "100%",
              }}
            >
              {actif.map((person) => (
                <ListItem key={person.id} style={{ maxWidth: "345px" }}>
                  <CardBoard
                    key={person.id}
                    picture={person.picture}
                    sprint_group={person.sprint_group}
                    fav={person.favorite}
                    isFavoris={favorisTell(person.id)}
                    id={person.id}
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ width: " 100%", margin: 2 }} />
          </Box>
        ) : (
          <></>
        )}
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Mes tableaux
        </Typography>
        <Box sx={{ width: " 100%", display: "flex" }}>
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
          <Modal />
        </Box>
      </Box>
      {/* DISPLAY  */}
      {view === "module" ? (
        <Grid container rowSpacing={2} columnSpacing={2}>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((person) => (
            <Grid item xs={3} key={person.id}>
              <CardBoard
                key={person.id}
                picture={person.picture}
                sprint_group={person.sprint_group}
                fav={person.favorite}
                isFavoris={favorisTell(person.id)}
                id={person.id}
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
              labelRowsPerPage="Par page "
              labelDisplayedRows={({page})=>{
                return`Page : ${page+1}`;
              }}
              
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

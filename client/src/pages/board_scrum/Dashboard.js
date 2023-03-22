import React, { useState } from "react";
import TableBoard from "../../components/board_scrum/dashboard/TableDashboard";
import CardBoard from "../../components/board_scrum/dashboard/CardDashboard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Divider, List, ListItem, Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

import TablePagination from "@mui/material/TablePagination";
import ModalCreateSprint from "../../components/board_scrum/dashboard/ModalCreateSprint";
let maDate = new Date();

function Dashboard() {
  const [rows, setRows] = useState([
    {
      id: 1,
      sprint_name: "Java",
      sprint_group: "Kiks",
      start: "01/03/2023",
      end: "15/03/2023",
      backlog: "lien",
      favorite: false,
      favoriteDate: "",
      students: {
        student_id: "uid(student)",
        firstname: "Chris",
      },
      picture: "https://picsum.photos/500/300?random=" + Math.floor(Math.random() * 100) + 1,
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
      picture: "https://picsum.photos/500/300?random=" + Math.floor(Math.random() * 100) + 1,
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
      picture: "https://picsum.photos/500/300?random=" + Math.floor(Math.random() * 100) + 1,
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
      picture: "https://picsum.photos/500/300?random=" + Math.floor(Math.random() * 100) + 1,
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
      picture: "https://picsum.photos/500/300?random=" + Math.floor(Math.random() * 100) + 1,
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
      picture: "https://picsum.photos/500/300?random=" + Math.floor(Math.random() * 100) + 1,
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
      picture: "https://picsum.photos/500/300?random=" + Math.floor(Math.random() * 100) + 1,
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

  // * FUNCTION

  //* CHANGE THE VIEW OF THE CARD BOARD
  const viewChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };
  // * DELETE A BOARD
  const deleteBoards = (id) => () => {
    setTimeout(() => {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    });
  };
  // * TO MAKE A BOARD IN FAVORI
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
  // * DEFINE BOARDS WHO IS ACTIF
  let actif = rows.filter(
    (board) => board.start <= maDate.toLocaleDateString("fr") && board.end > maDate.toLocaleDateString("fr")
  );
  // * DEFINE BOARDS WHO IS IN  FAVORIS
  let favoris = rows.filter((person) => person.favorite === true).sort((a, b) => a - b);

  function renderList(list, name) {
    return (
      <div>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <List
          style={{
            overflow: "auto",
            display: "-webkit-inline-box",
            width: "100%",
          }}
        >
          {list.map((person) => (
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
      </div>
    );
  }
  return (
    <div style={{ marginLeft: "1%", marginTop: "1%" }}>
      {favoris.length > 0 && renderList(favoris, "Espace de travail favoris")}
      {actif.length > 0 && renderList(actif, "Espace de travail actif")}

      <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" gutterBottom sx={{ flexGrow: 1 }}>
          Mon espace de travail
        </Typography>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <ToggleButtonGroup value={view} exclusive onChange={viewChange} sx={{ margin: 1 }}>
            <ToggleButton value="module" aria-label="module">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>

          <ModalCreateSprint />
        </div>
      </Box>

      {view === "module" ? (
        <Grid container spacing={2}>
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((person) => (
            <Grid item xs={3} key={person.id}>
              <CardBoard
                picture={person.picture}
                sprint_group={person.sprint_group}
                fav={person.favorite}
                isFavoris={favorisTell(person.id)}
                id={person.id}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableBoard rows={rows} addFavorite={favorisTell} deleteBoards={deleteBoards} />
      )}

      {view === "module" ? (
        <Box sx={{ flexGrow: 1, marginTop: 3, display: "flex", justifyContent: "center" }}>
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25, { label: "Tout", value: -1 }]}
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Par page"
            labelDisplayedRows={({ from, to, count }) => `${from} - ${to} sur ${count}`}
          />
        </Box>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Dashboard;

import React, { useState } from "react";
import axios from "axios";
import TableBoard from "../../components/board_scrum/dashboard/TableDashboard";
import CardBoard from "../../components/board_scrum/dashboard/CardDashboard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Divider, List, ListItem, Typography, Button } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import TablePagination from "@mui/material/TablePagination";
import ModalCreateSprint from "../../components/board_scrum/dashboard/ModalCreateSprint";

let maDate = new Date();

function Dashboard() {
  const [rows, setRows] = useState([]);
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
  let actif = rows.filter((board) => {
    const startDate = new Date(board.start);
    const endDate = new Date(board.end);
    const maDateValue = maDate.valueOf();
    return startDate.valueOf() <= maDateValue && maDateValue <= endDate.valueOf();
  });

  // * DEFINE BOARDS WHO IS IN  FAVORIS
  let favoris = rows.filter((person) => person.favorite === true).sort((a, b) => a - b);

  const connectedStudent = "nFVLL3s1TYtZsjFZPnmw";

  async function callBack() {
    await axios
      .get(`http://localhost:5050/dashboard/` + connectedStudent)
      .then((res) => {
        console.log(res.data);
        var dashboards = res.data;
        var listDashboards = [];
        dashboards.forEach((dashboard) => {
          const startDate = new Date(
            res.data[0]["starting_date"]._seconds * 1000 + res.data[0]["starting_date"]._nanoseconds / 100000
          ).toLocaleDateString("fr");

          const endDate = new Date(
            res.data[0]["ending_date"] * 1000 + res.data[0]["ending_date"]._nanoseconds / 100000
          ).toLocaleDateString("fr");

          var dashboardFront = {
            id: dashboard.id,
            sprint_name: dashboard.sprint_name,
            sprint_group: dashboard.group_name,
            start: startDate,
            end: endDate,
            backlog: "lien",
            favorite: dashboard.favorite,
            favoriteDate: "",
            students: dashboard.students,
            picture: dashboard.image,
          };
          listDashboards.push(dashboardFront);
        });
        setRows(listDashboards);
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      });
  }

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
      <Button onClick={callBack}> log back </Button>
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
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dashboard) => (
            <Grid item xs={3} key={dashboard.id}>
              <CardBoard
                picture={dashboard.picture}
                sprint_group={dashboard.sprint_group}
                fav={dashboard.favorite}
                isFavoris={favorisTell(dashboard.id)}
                id={dashboard.id}
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

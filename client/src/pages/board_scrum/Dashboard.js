import React, { useState, useEffect } from "react";
import axios from "axios";
import TableBoard from "../../components/board_scrum/dashboard/TableDashboard";
import CardDashBoard from "../../components/board_scrum/dashboard/CardDashboard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Divider, List, ListItem, Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import TablePagination from "@mui/material/TablePagination";
import ModalCreateSprint from "../../components/board_scrum/dashboard/ModalCreateSprint";
import { w3cwebsocket } from "websocket";

let maDate = new Date();

function Dashboard(props) {
  const [rows, setRows] = useState([]);
  const [view, setView] = useState("module");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [members, setMembers] = useState([]);

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
  async function favorisTell(dashboardId, favorite) {
    try {
      await axios.put(
        `http://localhost:5050/dashboard-favorite/${dashboardId}`
      );
    } catch (error) {
      console.error(error);
      // Gérer l'erreur de manière appropriée, par exemple :
      // throw new Error('Erreur lors de la mise à jour du document');
    }
  }

  // * DEFINE BOARDS WHO IS ACTIF
  let actif = rows.filter((board) => {
    const startDate = new Date(board.start);
    const endDate = new Date(board.end);
    const maDateValue = maDate.valueOf();
    return (
      startDate.valueOf() <= maDateValue && maDateValue <= endDate.valueOf()
    );
  });

  // * DEFINE BOARDS WHO IS IN  FAVORIS
  let favoris = rows
    .filter((person) => person.favorite === true)
    .sort((a, b) => a - b);

  var connectedStudent = localStorage.getItem("userUid");


  useEffect(() => {
    const fetchMembers = async () => {
      const response = await axios.get("http://localhost:5050/members");
      setMembers(response.data);
    };
    fetchMembers();
    (async () => {
      const wsComments = new w3cwebsocket(`ws://localhost:5050/dashboard`);

      wsComments.onopen = function (e) {
        console.log("[open] Connection established");
        console.log("Sending to server");
        console.log("student", connectedStudent);
        wsComments.send(JSON.stringify(connectedStudent));
      };

      wsComments.onmessage = (message) => {
        const data = JSON.parse(message.data);
        var dashboards = data;
        var listDashboards = [];
        dashboards.forEach((dashboard) => {
          const startDate = new Date(
            dashboard.starting_date._seconds * 1000 +
              dashboard.starting_date._nanoseconds / 100000
          ).toLocaleDateString("fr");

          const endDate = new Date(
            dashboard.ending_date._seconds * 1000 +
              dashboard.ending_date._nanoseconds / 100000
          ).toLocaleDateString("fr");

          let favorite = dashboard.favorite === "true";

          var dashboardFront = {
            id: dashboard.id,
            sprint_name: dashboard.sprint_name,
            sprint_group: dashboard.group_name,
            start: startDate,
            end: endDate,
            backlog: "lien",
            favorite: favorite,
            favoriteDate: "",
            students: dashboard.students,
            picture: dashboard.image,
          };
          listDashboards.push(dashboardFront);
        });
        setRows(listDashboards);
      };
    })();
  }, []);

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
              <CardDashBoard
                addTab={props.addTab}
                key={person.id}
                picture={person.picture}
                sprint_group={person.sprint_group}
                fav={person.favorite}
                isFavoris={favorisTell}
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
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={viewChange}
            sx={{ margin: 1 }}
          >
            <ToggleButton value="module" aria-label="module">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <ModalCreateSprint members={members} />
        </div>
      </Box>

      {view === "module" ? (
        <Grid container spacing={2}>
          {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((dashboard) => (
              <Grid item xs={3} key={dashboard.id}>
                <CardDashBoard
                  addTab={props.addTab}
                  picture={dashboard.picture}
                  sprint_group={dashboard.sprint_group}
                  fav={dashboard.favorite}
                  isFavoris={favorisTell}
                  id={dashboard.id}
                />
              </Grid>
            ))}
        </Grid>
      ) : (
        rows.length > 0 && (
          <TableBoard
            id={props.id}
            addTab={props.addTab}
            rows={rows}
            addFavorite={favorisTell}
            deleteBoards={deleteBoards}
          />
        )
      )}

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
    </div>
  );
}

export default Dashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import TableDashboard from "../../components/board_scrum/dashboard/TableDashboard";
import CardDashBoard from "../../components/board_scrum/dashboard/CardDashboard";
import Box from "@mui/material/Box";
import { Typography, Grid } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import TablePagination from "@mui/material/TablePagination";
import CreateDashboard from "./CreateDashboard";
import { w3cwebsocket } from "websocket";
import useFirebase from "../../hooks/useFirebase";
import ListCardDashboard from "../../components/board_scrum/dashboard/ListCardDashboard";
import { Rings } from "react-loader-spinner";

export default function Dashboard() {
  const { user } = useFirebase();
  const [dashboard, setDashboard] = useState([]);
  const [actifDashboard, setActifDashboard] = useState([]);
  const [favorisDashboard, setFavorisDashboard] = useState([]);
  const [view, setView] = useState("module");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // * FUNCTION

  //* CHANGE THE VIEW OF THE CARD BOARD
  const viewChange = (nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  // * TO MAKE A BOARD IN FAVORI
  async function favorisTell(dashboardId) {
    try {
      await axios.put(
        `http://localhost:5050/dashboard/favorite/${dashboardId}`
      );
    } catch (error) {
      console.error(error);
      // throw new Error('Erreur lors de la mise à jour du document');
    }
  }

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/profil/student/${user.id}`
        );
        setMembers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const wsComments = new w3cwebsocket(`ws://localhost:5050/dashboard`);

    wsComments.onopen = function (e) {
      wsComments.send(JSON.stringify({id:user.id,status: user.status}));
    };

    wsComments.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        const listDashboards = data.map((dashboarddto) => {
          const startDate = new Date(
            dashboarddto.starting_date._seconds * 1000 +
              dashboarddto.starting_date._nanoseconds / 100000
          ).toLocaleDateString("fr");
          const endDate = new Date(
            dashboarddto.ending_date._seconds * 1000 +
              dashboarddto.ending_date._nanoseconds / 100000
          ).toLocaleDateString("fr");
          return {
            id: dashboarddto.id,
            sprint_name: dashboarddto.sprint_name,
            sprint_group: dashboarddto.group_name,
            start: startDate,
            end: endDate,
            backlog: "lien",
            favorite: dashboarddto.favorite,
            favoriteDate: "",
            students: dashboarddto.students,
            picture: dashboarddto.image,
          };
        });
        setDashboard(listDashboards);
        setLoading(false);
      } catch (error) {
        setLoading(true);
        console.error(error);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const maDate = new Date();
    const day = maDate.getDate().toString().padStart(2, "0");
    const month = (maDate.getMonth() + 1).toString().padStart(2, "0");
    const year = maDate.getFullYear().toString();
    const maDateFormatted = `${day}/${month}/${year}`;

    const actifDashboards = dashboard.filter((board) => {
      const startDate = board.start;
      const endDate = board.end;
      return startDate <= maDateFormatted && maDateFormatted <= endDate;
    });
    setActifDashboard(actifDashboards);
    const favorisDashboards = dashboard.filter(
      (board) => board.favorite === true
    );

    setFavorisDashboard(favorisDashboards);
  }, [dashboard]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Rings
            height="200"
            width="200"
            color="#00BFFF"
            radius="6"
            wrapperStyle={{}}
            wrapperClass="loader"
            visible={true}
            ariaLabel="rings-loading"
          />
        </div>
      ) : (
        <div style={{ marginLeft: "1%", marginTop: "1%" }}>
          {favorisDashboard.length > 0 &&
            ListCardDashboard(
              favorisDashboard,
              "Espace de travail favoris",
              favorisTell
            )}
          {actifDashboard.length > 0 &&
            ListCardDashboard(
              actifDashboard,
              "Espace de travail actif",
              favorisTell
            )}

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
              <CreateDashboard members={members} />
            </div>
          </Box>

          {view === "module" ? (
            <Grid container spacing={2}>
              {!loading &&
                dashboard
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((board) => (
                    <Grid item xs={3} key={board.id}>
                      <CardDashBoard
                        picture={board.picture}
                        sprint_group={board.sprint_group}
                        fav={board.favorite}
                        isFavoris={favorisTell}
                        id={board.id}
                      />
                    </Grid>
                  ))}
            </Grid>
          ) : (
            !loading &&
            dashboard.length > 0 && (
              <TableDashboard rows={!loading && dashboard} />
            )
          )}

          {view === "module" ? (
            !loading &&
            dashboard.length > 0 && (
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
                  count={!loading && dashboard.length}
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
      )}
    </>
  );
}

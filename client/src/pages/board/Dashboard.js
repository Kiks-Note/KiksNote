import React, { useState } from "react";
import TableBoard from "../../components/table/TableBoards";
import CardBoard from "../../components/card/CardBoard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Divider, Typography } from "@mui/material";
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
  const deleteBoards = (id) => () => {
    setTimeout(() => {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    });
  };
  const favorisTell = 
    (id) => () => {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, favorite: !row.favorite } : row,
        ),
      );
    };

   

  let actif = rows.filter(
    (person) =>
      person.start <= maDate.toLocaleDateString("fr") &&
      person.end > maDate.toLocaleDateString("fr")
  );
  let favoris = rows.filter((person) => person.favorite === true);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {favoris.length > 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Favoris
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
                    firstname={person.students.firstname}
                    sprint_group={person.sprint_group}
                    fav={person.favorite}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Aucun favoris
            </Typography>
          </Box>
        )}
        <Box sx={{ width: " 100%", margin: 2 }}>
          <Divider />
        </Box>
        {actif.length > 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Board actif
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
                    firstname={person.students.firstname}
                    sprint_group={person.sprint_group}
                    fav={person.favorite}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Vous n'avez pas de boards actif.
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ width: " 100%", margin: 2 }}>
        <Divider />
      </Box>
      <Box sx={{ width: " 100%", marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>
          Mes boards
        </Typography>
        <TableBoard
          rows={rows}
          addFavorite={favorisTell}
          deleteBoards={deleteBoards}
        />
      </Box>
    </>
  );
}

export default Dashboard;

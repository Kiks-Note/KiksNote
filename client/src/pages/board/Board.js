import React, { useState } from "react";
import TableBoard from "../../components/table/TableBoards";
import CardBoard from "../../components/card/CardBoard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

function Board() {
  let dataBoard = [
    {
      id: 1,
      sprint_name: "Java",
      sprint_group: "Kiks",
      start: "12/11/2022",
      end: "29/11/2022",
      backlog: "lien",
      favorite: true,
      students: {
        student_id: "uid(student)",
        firstname: "Chris",
      },
      picture: "https://picsum.photos/500/300?random=" + Math.random(),
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
    },
  ];
  const [data] = useState(dataBoard);
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Favoris
          </Typography>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {dataBoard
              .filter((person) => person.favorite === true )
              .map((person) => (
                <Grid item xs={2} sm={4} md={4} key={person.uid}>
                  <CardBoard
                    key={person.uid}
                    picture={person.picture}
                    firstname={person.students.firstname}
                    sprint_group={person.sprint_group}
                    fav={person.favorite}
                  />
                </Grid>
              ))}
          </Grid>
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom>
            Board actif
          </Typography>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {dataBoard
              .filter((person) => person.end < Date())
              .map((person) => (
                <Grid item xs={2} sm={4} md={4} key={person.uid}>
                  <CardBoard
                    key={person.uid}
                    picture={person.picture}
                    firstname={person.students.firstname}
                    sprint_group={person.sprint_group}
                    fav={person.favorite}
                  />
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
      <Box sx={{ width: " 100%", marginTop: 4 }}>
        <TableBoard rows={data} />
      </Box>
    </>
  );
}

export default Board;

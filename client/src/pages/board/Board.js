// import React, { useEffect, useState } from "react";
import TableBoard from "../../components/table/TableBoards";
import CardBoard from "../../components/card/CardBoard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

function Board() {
  const columns = [
    {
      field: "sprint_name",
      headerName: "Nom du sprint",
      flex: 1,
    },
    {
      field: "sprint_group",
      headerName: "Groupe du sprint",
      flex: 1,
    },
    {
      field: "start",
      headerName: "Date de début",
      flex: 1,
    },
    {
      field: "end",
      headerName: "Date de fin",
      flex: 1,
    },
    {
      field: "favorite",
      headerName: "Favoris",
      flex: 1,
      disableReorder: true,
    },
  ];
  const dataBoard = [
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
      picture: "https://thispersondoesnotexist.com/image",
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
      picture: "https://thispersondoesnotexist.com/image",
    },
    {
      id: 3,
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
      picture: "https://thispersondoesnotexist.com/image",
    },
    {
      id: 4,
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
      picture: "https://thispersondoesnotexist.com/image",
    },
    {
      id: 5,
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
      picture: "https://thispersondoesnotexist.com/image",
    },
    {
      id: 6,
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
      picture: "https://thispersondoesnotexist.com/image",
    },
    {
      id: 7,
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
      picture: "https://thispersondoesnotexist.com/image",
    },
  ];
  const favorite = dataBoard.filter((person) => person.favorite === true);
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {favorite.map((data, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <CardBoard
                key={data.uid}
                picture={data.picture}
                firstname={data.students.firstname}
                sprint_group={data.sprint_group}
                fav={data.favorite}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ height: 400, width: 1 }}>
        <TableBoard rows={dataBoard} columns={columns} />
      </Box>
    </>
  );
}

export default Board;

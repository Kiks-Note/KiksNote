import React, { useState, useEffect, useRef } from "react";
import { Divider, List, ListItem, Typography } from "@mui/material";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CardSprint from "../../../components/board_scrum/overview/CardSprint";
import TextList from "./StoryList";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

function OverView() {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        label: "nombre de tâches",
        data: [12, 19, 3],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const stories = [
    {
      id: "1",
      name: "Storie 1",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      assignedTo: [],
      labels: [],
      color: "",
    },
    {
      id: "2",
      name: "Storie 2",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      assignedTo: [],
      labels: [],
      color: "",
    },
    {
      id: "3",
      name: "Storie 3",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      assignedTo: [],
      labels: [],
      color: "",
    },
    {
      id: "4",
      name: "Storie 4",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      assignedTo: [],
      labels: [],
      color: "",
    },
    {
      id: "5",
      name: "Storie 5",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      assignedTo: [],
      labels: [],
      color: "",
    },
    {
      id: "6",
      name: "Storie 6",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      assignedTo: [],
      labels: [],
      color: "",
    },
    {
      id: "7",
      name: "Storie 7",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      assignedTo: [],
      labels: [],
      color: "",
    },
    {
      id: "8",
      name: "Storie 8",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      assignedTo: [],
      labels: [],
      color: "",
    },
    {
      id: "9",
      name: "Storie 9",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      assignedTo: [],
      labels: [],
      color: "",
    },
    {
      id: "10",
      name: "Storie 10",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      assignedTo: [],
      labels: [],
      color: "",
    },
    {
      id: "11",
      name: "Storie 11",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      assignedTo: [],
      labels: [],
      color: "",
    },
    {
      id: "12",
      name: "Storie 12",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      assignedTo: [],
      labels: [],
      color: "",
    },
    {
      id: "13",
      name: "Storie 13",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      assignedTo: [],
      labels: [],
      color: "",
    },
  ];
  const sprint = [
    {
      id: 100,
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
      picture: "https://picsum.photos/500/300?random=" + 2,
    },
    {
      id: 200,
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
      picture: "https://picsum.photos/500/300?random=" + 2,
    },
    {
      id: 300,
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
      picture: "https://picsum.photos/500/300?random=" + 2,
    },
  ];
  /*const moveToPdf = (id) => {
    var x = JSON.parse(localStorage.getItem("tabs")) || [];
    var push = true;
    for (var tab of x) {
      if (tab.id === id) {
        push = false;
      }
    }
    if (push) {
      x.push({ id: id, type: "pdf", label: "nom du pdf" });
      localStorage.setItem("tabs", JSON.stringify(x));
    }
    localStorage.setItem("activeTab", JSON.stringify(id));
  };*/

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <TextList stories={stories} sprints={sprint}></TextList>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
          width: "35%",
        }}
      >
        <Typography variant="h4">Statistiques</Typography>
        <Doughnut data={data} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            minWidth: "100%",
            marginTop: "5vh",
          }}
        >
          <Button variant="contained">BurnDown</Button>
          <Button variant="contained">BurnUp</Button>
        </div>
      </div>
      <Box style={{ width: "30%" }}>
        <Button
          variant="contained"
          //</Box>onClick={moveToPdf(999)}
        >
          Backlog
        </Button>
        <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
          Sprint
        </Typography>
        {sprint.map((person) => (
          <ListItem key={person.id}>
            <CardSprint
              key={person.id}
              picture={person.picture}
              sprint_group={person.sprint_group}
              fav={person.favorite}
              id={person.id}
            />
          </ListItem>
        ))}
      </Box>
    </div>
  );
}
export default OverView;

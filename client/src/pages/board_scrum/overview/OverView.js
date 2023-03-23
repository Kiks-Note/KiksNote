import React, { useState, useEffect, useRef } from "react";
import { Accordion, AccordionSummary, AccordionDetails, List, ListItem, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CardSprint from "../../../components/board_scrum/overview/CardSprint";
import StatTab from "../../../components/board_scrum/overview/StatTab";
import TextList from "./StoryList";
import Grid from "@mui/material/Grid";

function OverView() {
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
  const moveToOverView = () => {
    var x = JSON.parse(localStorage.getItem("tabs")) || [];
    var push = true;
    for (var tab of x) {
      if (tab.id === -1) {
        push = false;
      }
    }
    if (push) {
      var tabsIndex = localStorage.getItem("tabsIndex");

      var newIndex = parseInt(tabsIndex) + 1;

      var tabsIndex = localStorage.setItem("tabsIndex", newIndex);

      x.push({ id: newIndex, idDb: -1, type: "pdf", label: "pdf" });
      localStorage.setItem("tabs", JSON.stringify(x));
    }
    localStorage.setItem("activeTab", JSON.stringify(newIndex));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} sx={{ m: 2 }}>
        <Grid item xs={12} md={4}>
          <Typography variant="h4">Stories</Typography>
          <TextList stories={stories} sprints={sprint} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatTab />
        </Grid>
        <Grid item xs={12} md={3}>
          <Box>
            <Button variant="contained" onClick={moveToOverView}>
              Backlog
            </Button>
            <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
              Release / Sprint
            </Typography>
            <List
              style={{
                minHeight: "70vh",
                maxHeight: "75vh",
                display: "flex",
                borderStyle: "solid",
                borderColor: "white",
                borderWidth: "1px",
                flexDirection: "column",
                alignItems: "center",
                overflow: "auto",
                borderRadius: "5%",
                marginLeft: "5%",
                marginTop: "8%",
              }}
            >
              {sprint.map((person) => (
                <ListItem key={person.id}>
                  <Box sx={{ width: "100%" }}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>{person.sprint_group}</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ width: "100%" }}>
                        <Box sx={{ width: "100%" }}>
                          <CardSprint
                            picture={person.picture}
                            sprint_group={person.sprint_group}
                            fav={person.favorite}
                            id={person.id}
                          />
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
export default OverView;

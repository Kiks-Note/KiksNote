import React, { useState, useEffect, useRef } from "react";
import { Accordion, AccordionSummary, AccordionDetails, List, ListItem, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CardSprint from "../../../components/board_scrum/overview/CardSprint";
import StatTab from "../../../components/board_scrum/overview/StatTab";
import StoryList from "./StoryList";
import Grid from "@mui/material/Grid";
import { w3cwebsocket } from "websocket";

function OverView(props) {
  var [releases, setRelease] = useState({});
  const [stories, setStories] = useState({});
  var [boards, setBoards] = useState({});
  const [display, setDisplay] = useState(false);

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

  useEffect(() => {
    (async () => {
      const wsComments = new w3cwebsocket(`ws://localhost:5050/overview`);

      wsComments.onopen = function (e) {
        console.log("[open] Connection established");
        console.log("Sending to server");
        console.log("dashboard", props.id);
        wsComments.send(JSON.stringify(props.id));
      };

      wsComments.onmessage = (message) => {
        console.log(JSON.parse(message.data));
        var data = JSON.parse(message.data);
        setRelease((releases = data.release));
        setBoards((boards = data.boards));
        setStories(data.stories);
        console.log(stories);
        setDisplay(true);
      };
    })();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} sx={{ m: 2 }}>
        <Grid item xs={12} md={4}>
          <Typography variant="h4">Stories</Typography>
          {display ? <StoryList stories={stories} sprints={releases} dashboardId={props.id} /> : <></>}
        </Grid>
        <Grid item xs={12} md={4}>
          {display ? <StatTab dashboardId={props.id} boards={boards} /> : <></>}
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
              {Object.keys(releases).map((item, i) => (
                <ListItem key={i}>
                  <Box sx={{ width: "100%" }}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>{item}</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ width: "100%" }}>
                        <Box sx={{ width: "100%" }}>
                          <CardSprint release={releases[item]} dashboardId={props.id} />
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

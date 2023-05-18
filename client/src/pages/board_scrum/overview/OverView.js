import React, { useState, useEffect, useRef } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CardSprint from "../../../components/board_scrum/overview/CardSprint";
import StatTab from "../../../components/board_scrum/overview/StatTab";
import StoryList from "../../../components/board_scrum/overview/StoryList";
import Grid from "@mui/material/Grid";
import { w3cwebsocket } from "websocket";
import PdfView from "./PdfView";

function OverView(props) {
  var [releases, setRelease] = useState({});
  const [stories, setStories] = useState({});
  var [boards, setBoards] = useState({});
  const [display, setDisplay] = useState(false);
  const [pdfLink, setPdfLink] = useState("");

  const moveToOverView = () => {
    var x = JSON.parse(localStorage.getItem("tabs")) || [];
    x.push({ id: props.id + "pdf", idDb: -1, type: "pdf", label: "pdf" });
    localStorage.setItem("tabs", JSON.stringify(x));

    props.addTab({
      id: props.id,
      tab: "pdf",
      component: <PdfView link={pdfLink} dashboardId={props.id} />,
      closeable: true,
    });
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
        var data = JSON.parse(message.data);
        setPdfLink(data.pdf_link);
        setRelease((releases = data.release));
        setBoards((boards = data.boards));
        setStories(data.stories);
        setDisplay(true);
      };
    })();
  }, []);

  return (
    <>
      <Grid container spacing={1} sx={{ ml: 1 }}>
        <Grid item xs={12} md={5}>
          {display ? (
            <>
              <Typography variant="h4">Stories</Typography>
              <StoryList
                stories={stories}
                sprints={releases}
                dashboardId={props.id}
              />
              <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
                Release / Sprint
              </Typography>
              <List
                style={{
                  maxHeight: "40vh",
                  display: "flex",
                  borderStyle: "solid",
                  borderColor: "white",
                  borderWidth: "1px",
                  flexDirection: "column",
                  alignItems: "center",
                  overflow: "auto",
                  borderRadius: "7%",
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
                            <CardSprint
                              key={i + 1}
                              addTab={props.addTab}
                              release={releases[item]}
                              dashboardId={props.id}
                            />
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {display ? (
            <>
              <Box>
                {pdfLink.length != 0 ? (
                  <Button variant="contained" onClick={moveToOverView}>
                    Backlog
                  </Button>
                ) : (
                  <></>
                )}
              </Box>{" "}
              <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
               Statistiques
              </Typography>
              <StatTab dashboardId={props.id} boards={boards} />{" "}
            </>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </>
  );
}
export default OverView;

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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
import PropTypes from "prop-types";
import { setActiveTab, addTab } from "../../../redux/slices/tabBoardSlice";

OverView.propTypes = {
  id: PropTypes.string.isRequired,
};
function OverView({ id }) {
  var [releases, setRelease] = useState({});
  const [stories, setStories] = useState({});
  var [boards, setBoards] = useState({});
  const [display, setDisplay] = useState(false);
  const [pdfLink, setPdfLink] = useState("");
  const dispatch = useDispatch();

  const moveToOverView = () => {
    const overViewTab = {
      id: id,
      label: "Backlog ",
      closeable: true,
      component: "PdfView",
      data: { id, pdfLink },
    };
    dispatch(addTab(overViewTab));
    dispatch(setActiveTab(overViewTab.id));
  };

  useEffect(() => {
    (async () => {
      const wsComments = new w3cwebsocket(`ws://localhost:5050/overview`);

      wsComments.onopen = function (e) {
        console.log("[open] Connection established");
        console.log("Sending to server");
        console.log("dashboard", id);
        wsComments.send(JSON.stringify(id));
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
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} sx={{ m: 2 }}>
        <Grid item xs={12} md={4}>
          <Typography variant="h4">Stories</Typography>
          {display ? (
            <StoryList stories={stories} sprints={releases} dashboardId={id} />
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {display ? <StatTab dashboardId={id} boards={boards} /> : <></>}
        </Grid>
        <Grid item xs={12} md={3}>
          <Box>
            {pdfLink.length != 0 ? (
              <Button variant="contained" onClick={moveToOverView}>
                Backlog
              </Button>
            ) : (
              <></>
            )}

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
                          <CardSprint
                            key={i}
                            release={releases[item]}
                            dashboardId={id}
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

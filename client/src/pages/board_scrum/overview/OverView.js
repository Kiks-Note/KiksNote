import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Accordion, AccordionSummary, AccordionDetails, List, ListItem, Typography } from "@mui/material";
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
import ApexChart from "./ApexChart";
import BurndownChart from "./BurnDown";

OverView.propTypes = {
  id: PropTypes.string.isRequired,
};
function OverView({ id }) {
  var [releases, setRelease] = useState({});
  const [stories, setStories] = useState({});
  var [boards, setBoards] = useState({});
  const [display, setDisplay] = useState(false);
  const [pdfLink, setPdfLink] = useState("");
  const [agile, setAgile] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const dispatch = useDispatch();
  const labels = ["Todo", "In Progress", "Done"];
  const series = [50, 20, 30];
  const [value, setValue] = useState(0);

  const moveToOverView = () => {
    const pdfViewTab = {
      id: "Backlog" + id,
      label: "Backlog ",
      closeable: true,
      component: "PdfView",
      data: { dashboardId: id, pdfLink: pdfLink },
    };
    dispatch(addTab(pdfViewTab));
    dispatch(setActiveTab(pdfViewTab.id));
  };
  const moveToImpact = () => {
    const impactTab = {
      id: "Impact" + id,
      label: "Impact mapping ",
      closeable: true,
      component: "Impact",
      data: { agile: agile, dashboardId: id },
    };
    dispatch(addTab(impactTab));
    dispatch(setActiveTab(impactTab.id));
  };

  useEffect(() => {
    (async () => {
      const wsComments = new w3cwebsocket(`ws://localhost:5050/overview`);

      wsComments.onopen = function (e) {
        wsComments.send(JSON.stringify(id));
      };

      wsComments.onmessage = (message) => {
        var data = JSON.parse(message.data);
        setPdfLink(data.pdf_link);
        setRelease((releases = data.release));
        setBoards(data.boards);
        setStories(data.stories);
        setAgile(data.agile);
        setDisplay(true);
        console.log(data.agile);
      };
    })();
  }, []);

  // Generate fake data for boards
  const generateFakeData = () => {
    const boards = [];

    // Generate data for each board
    for (let i = 1; i <= 3; i++) {
      const board = {
        name: `Board ${i}`,
        starting_date: new Date(2023, 0, i),
        ending_date: new Date(2023, 0, i + 5),
        data: {
          toDo: {
            count: Math.floor(Math.random() * 10),
            items: generateTasks(),
          },
          inProgress: {
            count: Math.floor(Math.random() * 10),
            items: generateTasks(),
          },
          done: {
            count: Math.floor(Math.random() * 10),
            items: generateTasks(),
          },
        },
      };

      boards.push(board);
    }

    return boards;
  };

  // Generate fake data for tasks
  const generateTasks = () => {
    const tasks = [];

    for (let i = 1; i <= 5; i++) {
      const task = {
        id: i,
        estimation: Math.floor(Math.random() * 10),
        advancement: generateAdvancements(),
      };

      tasks.push(task);
    }

    return tasks;
  };

  // Generate fake data for task advancements
  const generateAdvancements = () => {
    const advancements = [];

    for (let i = 1; i <= 5; i++) {
      const advancement = {
        day: `Jour ${i}`,
        advance: Math.floor(Math.random() * 5),
      };

      advancements.push(advancement);
    }

    return advancements;
  };

  // Generate fake data for boards
  const fakeBoardsData = generateFakeData();

  return (
    <>
      {false ? (
        <Grid container spacing={1} sx={{ ml: 1 }}>
          <Grid item xs={12} md={5}>
            {display ? (
              <>
                <Typography variant="h4">Stories</Typography>
                <StoryList stories={stories} sprints={releases} dashboardId={id} />
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
                    <ListItem key={i + id}>
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
                              <CardSprint key={id} release={releases[item]} dashboardId={id} />
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
                  <Button variant="contained" onClick={moveToImpact}>
                    Agile
                  </Button>
                </Box>{" "}
                <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
                  Statistiques
                </Typography>
                <StatTab boards={boards} />{" "}
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      ) : (
        <div>
          <Box style={{ display: "flex", justifyContent: "space-between", margin: "5vh" }}>
            <Box
              style={{
                backgroundColor: "#c7c7c7",
                width: "25%",
                height: "30vh",
                borderRadius: "5px",
              }}
            >
              <Typography variant="h6" style={{ textAlign: "center" }}>
                Choisissez un sprint
              </Typography>
              <List>
                {Object.keys(releases).map((item, i) => (
                  <ListItem key={i + id}>
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
                          <Box sx={{ width: "100%" }}></Box>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box
              style={{
                backgroundColor: "#c7c7c7",
                width: "30%",
                height: "30vh",
                borderRadius: "5px",
              }}
            >
              <Typography varian="h6" style={{ textAlign: "center" }}>
                Avancement
              </Typography>
              <Box
                style={{
                  display: "flex",
                }}
              >
                <ApexChart labels={labels} series={series} />
                <Box style={{ marginTop: "5vh" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "5px",
                        backgroundColor: "rgba(0, 143, 251, 0.85)",
                        marginRight: "10px",
                      }}
                    ></div>
                    <span style={{ fontSize: "medium" }}>Todo</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "5px",
                        backgroundColor: "rgba(0, 227, 150, 0.85)",
                        marginRight: "10px",
                      }}
                    ></div>
                    <span style={{ fontSize: "medium" }}>In Progress</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "5px",
                        backgroundColor: "rgba(254, 176, 25, 0.85)",
                        marginRight: "10px",
                      }}
                    ></div>
                    <span style={{ fontSize: "medium" }}>Done</span>
                  </div>
                </Box>
              </Box>
            </Box>
            <Box
              style={{
                backgroundColor: "#c7c7c7",
                width: "40%",
                height: "30vh",
                borderRadius: "5px",
              }}
            >
              {selectedBoard && <BurndownChart board={selectedBoard} value={value} />}
            </Box>
          </Box>
          <Box></Box>
          <Box></Box>
        </div>
      )}
    </>
  );
}
export default OverView;

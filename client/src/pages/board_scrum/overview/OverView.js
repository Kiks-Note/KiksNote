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
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import RadialSeparators from "../../../components/board_scrum/overview/RadialSeparator";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { daDK } from "@mui/x-data-grid";

OverView.propTypes = {
  id: PropTypes.string.isRequired,
};
function OverView({ id }) {
  const [displayedBoards, setDisplayedBoards] = useState([]);
  var [releases, setRelease] = useState({});
  const [stories, setStories] = useState({});
  var [boards, setBoards] = useState([]);
  const [display, setDisplay] = useState(false);
  const [pdfLink, setPdfLink] = useState("");
  const [agile, setAgile] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState({
    data: {
      toDo: {
        items: [],
      },
      done: {
        items: [],
      },
      inProgress: {
        items: [],
      },
    },
  });
  const dispatch = useDispatch();
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

  const moveToBoard = (board) => {
    const boardTab = {
      id: board.id,
      label: `Board ${board.name}`,
      closeable: true,
      component: "Board",
      data: { boardId: board.id, dashboardId: id },
    };
    dispatch(addTab(boardTab));
    dispatch(setActiveTab(boardTab.id));
    console.log("moved ?");
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
        setStories(data.stories);
        setAgile(data.agile);
        setDisplay(true);
        console.log(data.agile);
        sortBoards(data.boards);
        if (data.boards.length > 4) {
          const data = { begin: 0, end: 4 };
          setDisplayedBoards(data);
        } else {
          const data = { begin: 0, end: data.boards.length };
          setDisplayedBoards(data);
        }
      };
    })();
  }, []);

  const nextBoards = () => {
    if (boards.length > displayedBoards.end + 4) {
      const newData = { begin: displayedBoards.begin + 4, end: displayedBoards.end + 4 };
      console.log(newData);
      setDisplayedBoards(newData);
    }
  };

  const prevBoards = () => {
    if (displayedBoards.begin - 4 >= 0) {
      const newData = { begin: displayedBoards.begin - 4, end: displayedBoards.end - 4 };
      console.log(newData);
      setDisplayedBoards(newData);
    }
  };

  const sortBoards = (boards) => {
    const sortedItems = boards.sort((a, b) => {
      const releaseA = parseInt(a.name.split(" / ")[0].split(" ")[1]);
      const sprintA = parseInt(a.name.split(" / ")[1].split(" ")[1]);
      const releaseB = parseInt(b.name.split(" / ")[0].split(" ")[1]);
      const sprintB = parseInt(b.name.split(" / ")[1].split(" ")[1]);

      if (releaseA === releaseB) {
        return sprintA - sprintB;
      }
      return releaseA - releaseB;
    });
    console.log("sorted");
    setBoards(sortedItems);
  };

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

  useEffect(() => {
    console.log(selectedBoard);
  }, [selectedBoard]);

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
                <StatTab boards={boards} />
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      ) : (
        <div>
          <Box>
            <Typography>Statistiques</Typography>
            <Box style={{ display: "flex", justifyContent: "space-between", margin: "5vh" }}>
              <Box
                style={{
                  backgroundColor: "#c7c7c7",
                  width: "25%",
                  height: "35vh",
                  borderRadius: "5px",
                }}
              >
                <Typography variant="h6" style={{ textAlign: "center" }}>
                  Choisissez un sprint
                </Typography>
                <List>
                  {releases &&
                    Object.keys(releases).map((item, i) => (
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
                  height: "35vh",
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
                  <ApexChart selectedBoard={selectedBoard} />

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
                  height: "35vh",
                  borderRadius: "5px",
                }}
              >
                {fakeBoardsData && <BurndownChart board={fakeBoardsData[0]} value={value} />}
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography>Boards</Typography>
            <Box style={{ display: "flex", justifyContent: "space-around" }}>
              <Button onClick={prevBoards}>
                <NavigateBeforeIcon></NavigateBeforeIcon>
              </Button>
              {boards.slice(displayedBoards.begin, displayedBoards.end).map((board) => {
                const startingDate = new Date(board.starting_date).getTime();
                const endingDate = new Date(board.ending_date).getTime();
                const now = new Date().getTime();
                const totalDuration = endingDate - startingDate;
                var timeLeft = 0;
                if (now < startingDate) {
                  timeLeft = Math.max(0, endingDate - startingDate);
                } else {
                  timeLeft = Math.max(0, endingDate - now);
                }
                const percentage = Math.floor((timeLeft / totalDuration) * 100);
                const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

                const totalTask =
                  board.data.done.items.length + board.data.toDo.items.length + board.data.inProgress.items.length;

                const advancement =
                  (board.data.done.items.length / totalTask) * 100 +
                  (board.data.inProgress.items.length / totalTask) * 50;

                return (
                  <Box
                    style={{ width: "20%", backgroundColor: "#c7c7c7", borderRadius: "5px", boxShadow: "5" }}
                    onMouseEnter={() => {
                      setSelectedBoard(board);
                      console.log(board);
                    }}
                    onClick={() => {
                      moveToBoard(board);
                    }}
                  >
                    <Typography variant="h6" style={{ textAlign: "center" }}>
                      {board.name}
                    </Typography>
                    <Box style={{ display: "flex" }}>
                      <Box
                        style={{
                          width: "40%",
                          margin: "2%",
                        }}
                      >
                        <CircularProgressbarWithChildren
                          value={percentage}
                          text={daysLeft > 0 ? `${daysLeft}j ${hoursLeft}h` : `${hoursLeft}h ${minutesLeft}m`}
                          strokeWidth={10}
                          counterClockwise
                          styles={buildStyles({
                            strokeLinecap: "butt",
                            textSize: "14px",
                          })}
                        >
                          <RadialSeparators
                            count={12}
                            style={{
                              background: "#fff",
                              width: "2px",
                              height: `${10}%`,
                            }}
                          />
                        </CircularProgressbarWithChildren>
                      </Box>
                      <Box>
                        <Typography style={{ textAlign: "center" }}>Avancement </Typography>
                        <Typography style={{ textAlign: "center" }}> {advancement ? advancement : 0} %</Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
              <Button onClick={nextBoards}>
                <NavigateNextIcon></NavigateNextIcon>
              </Button>
            </Box>
          </Box>
          <Box></Box>
        </div>
      )}
    </>
  );
}
export default OverView;

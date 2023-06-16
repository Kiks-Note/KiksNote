import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Typography, Divider, Card, Menu, MenuItem, IconButton } from "@mui/material";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CardSprint from "../../../components/board_scrum/overview/CardSprint";
import StatTab from "../../../components/board_scrum/overview/StatTab";
import StoryList from "../../../components/board_scrum/overview/StoryList";
import { w3cwebsocket } from "websocket";
import PropTypes from "prop-types";
import { setActiveTab, addTab } from "../../../redux/slices/tabBoardSlice";

import ApexChart from "./ApexChart";
import BurndownChart from "./BurnDown";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import RadialSeparators from "../../../components/board_scrum/overview/RadialSeparator";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import EngineeringIcon from "@mui/icons-material/Engineering";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";

import BarChart from "../../../components/board_scrum/overview/BarChart";
import { withStyles } from "@material-ui/core/styles";
import Timer from "../../../components/board_scrum/overview/Timer";

import Roadmap from "./Roadmap";

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
  const [anchorEl, setAnchorEl] = useState(null);
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

  const dividerStyle = {
    root: {
      height: "1px",
      backgroundColor: "gray",
    },
  };
  const CustomDivider = withStyles(dividerStyle)(Divider);

  const moveToBacklog = () => {
    const pdfViewTab = {
      id: "Backlog" + id,
      label: "Backlog ",
      closeable: true,
      component: "PdfView",
      data: { dashboardId: id, pdfLink: pdfLink },
    };
    dispatch(addTab(pdfViewTab));
    dispatch(setActiveTab(pdfViewTab.id));
    handleClose();
  };

  const moveToAgileHome = () => {
    const agileTab = {
      id: "Agile" + id,
      label: "Agile",
      closeable: true,
      component: "AgileHome",
      data: { dashboardId: id },
    };
    dispatch(addTab(agileTab));
    dispatch(setActiveTab(agileTab.id));
    handleClose();
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        console.log(data.boards);
        sortBoards(data.boards);
        if (data.boards.length > 4) {
          const data = { begin: 0, end: 4 };
          setDisplayedBoards(data);
        } else {
          // const data = { begin: 0, end: data.boards.length };
          // const data = { begin: 0, end: data.boards.length };
          setDisplayedBoards(data);
        }
      };
    })();
  }, []);

  const nextBoards = () => {
    if (boards.length > displayedBoards.end + 4) {
      const newData = {
        begin: displayedBoards.begin + 4,
        end: displayedBoards.end + 4,
      };
      console.log(newData);
      setDisplayedBoards(newData);
    }
  };

  const prevBoards = () => {
    if (displayedBoards.begin - 4 >= 0) {
      const newData = {
        begin: displayedBoards.begin - 4,
        end: displayedBoards.end - 4,
      };
      console.log(newData);
      setDisplayedBoards(newData);
    }
  };

  const getParticipation = () => {
    const todoItems = selectedBoard.data.toDo.items;
    const doneItems = selectedBoard.data.done.items;
    const inProgressItems = selectedBoard.data.inProgress.items;

    // Combine the three lists into a single array
    const allItems = [...todoItems, ...doneItems, ...inProgressItems];

    // Extract the assignedTo value from each item

    const assignedToList = allItems.flatMap((item) => item.assignedTo).filter((assignedTo) => assignedTo.length > 0);

    // Count the participation for each name
    const participationList = assignedToList.reduce((result, name) => {
      const existingParticipant = result.find((participant) => participant.name === name);

      if (existingParticipant) {
        existingParticipant.participation++;
      } else {
        result.push({ name: name, participation: 1 });
      }
      return result;
    }, []);

    console.log(participationList);
    return participationList;
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

  useEffect(() => {
    getParticipation();
  }, [selectedBoard]);

  return (
    <>
      <div>
        <Box style={{ display: "flex", justifyContent: " flex-end" }}>
          <IconButton onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={moveToAgileHome}>Accéder à la partie Agile</MenuItem>
            {pdfLink.length != 0 && <MenuItem onClick={moveToBacklog}>Accéder au Backlog</MenuItem>}
            <MenuItem>
              <Roadmap stories={stories} releases={releases} boards={boards} dashboardId={id} />
            </MenuItem>
          </Menu>
        </Box>
        <Box>
          <Typography>Statistiques</Typography>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "5vh",
            }}
          >
            <Box
              style={{
                backgroundColor: "#424242",
                width: "25%",
                height: "35vh",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography varian="h5" style={{ textAlign: "center" }}>
                Participation
              </Typography>

              <Box
                style={{
                  marginTop: "5vh",
                }}
              >
                <BarChart participation={getParticipation()} label={"Nombre de taches"} />
              </Box>
            </Box>

            <Box
              style={{
                backgroundColor: "#424242",
                width: "30%",
                height: "35vh",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography varian="h5" style={{ textAlign: "center" }}>
                Avancement
              </Typography>
              <Box
                style={{
                  display: "flex",
                }}
              >
                <ApexChart selectedBoard={selectedBoard} />

                <Box
                  sx={{
                    display: "flex",
                    height: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
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
            <Card
              style={{
                width: "40%",
                height: "35vh",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                padding: "1vh",
              }}
            >
              <BurndownChart board={selectedBoard} value={value} />
            </Card>
          </Box>
        </Box>
        <Box sx={{ padding: "1vh" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", paddingLeft: "5vh" }}>
            Boards
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5vh",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button style={{ backgroundColor: "#ab278e" }} onClick={prevBoards}>
                <NavigateBeforeIcon />
              </Button>
            </Box>
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
                <Card
                  style={{
                    width: "30%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "5px",
                    boxShadow: "5",
                    padding: "1vh",
                    margin: "1vh",
                  }}
                  onMouseEnter={() => {
                    setSelectedBoard(board);
                    console.log(board);
                  }}
                  onClick={() => {
                    moveToBoard(board);
                  }}
                >
                  <Typography
                    varian="h5"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold",
                      paddingLeft: "2vh",
                    }}
                  >
                    {board.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "45%",
                        margin: "1%",
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
                    <Box
                      sx={{
                        display: "flex",
                        padding: "1vh",
                        width: "100%",
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "1vh",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" style={{ textAlign: "center" }}>
                          Avancement
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            display: "flex",
                            width: "100%",
                            justifyContent: "center",
                            textAlign: "center",
                          }}
                        >
                          {advancement ? advancement : 0} %
                        </Typography>
                      </Box>
                      <Divider flexItem />
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                        }}
                      >
                        {now > endingDate ? (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "column",
                              width: "100%",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary" style={{ textAlign: "center" }}>
                              Finis Depuis
                            </Typography>
                            <Timer startingDate={startingDate} endingDate={endingDate} countdown={false} />
                          </Box>
                        ) : now < startingDate ? (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "column",
                              width: "100%",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary" style={{ textAlign: "center" }}>
                              Commence dans
                            </Typography>
                            <Timer startingDate={startingDate} endingDate={endingDate} countdown={true} />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "column",
                              width: "100%",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary" style={{ textAlign: "center" }}>
                              En cours
                            </Typography>
                            <Timer startingDate={startingDate} endingDate={endingDate} countdown={true} />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Card>
              );
            })}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button style={{ backgroundColor: "#ab278e" }} onClick={nextBoards}>
                <NavigateNextIcon />
              </Button>
            </Box>
          </Box>
        </Box>
        <Box sx={{ padding: "1vh" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", paddingLeft: "5vh" }}>
            Stories
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5vh",
              height: "100vh",
            }}
          >
            {display && <StoryList stories={stories} sprints={releases} dashboardId={id} />}
          </Box>
        </Box>
      </div>
    </>
  );
}
export default OverView;

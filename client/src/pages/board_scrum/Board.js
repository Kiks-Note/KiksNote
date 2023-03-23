import React, { useState, useEffect } from "react";
import "./Board.scss";
import AddIcon from "@mui/icons-material/Add";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import CardBoard from "../../components/board_scrum/board/CardBoard";
import { Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ButtonAddCard from "../../components/board_scrum/board/ButtonAddCard";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Slide from "@mui/material/Slide";
import { Switch } from "@mui/material";

function TransitionComponent(props) {
  return <Slide {...props} direction="up" />;
}
const tasks = [
  {
    id: "1",
    name: "Board EduScrum",
    desc: "",
    assignedTo: [
      {
        id: "1",
        name: "John Doe",
        photo: "https://picsum.photos/500/300?random=45",
      },
      {
        id: "2",
        name: "Jane Smith",
        photo: "https://picsum.photos/500/300?random=67",
      },
      { id: "3", name: "Bob Johnson", photo: "https://picsum.photos/500/300?random=89" },
    ],
    labels: ["Urgent", "Fix", "Feature"],
  },
  {
    id: "2",
    name: "Création de sprint agile très très long",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    assignedTo: [
      {
        id: "3",
        name: "Bob Johnson",
        photo: "https://picsum.photos/500/300?random=3",
      },
    ],
    labels: ["Urgent"],
  },
  {
    id: "3",
    name: "BurnDown chart",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    assignedTo: [],
    labels: ["Documentation", "Fix"],
  },
  {
    id: "4",
    name: "Ajout du backlog",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    assignedTo: [
      {
        id: "2",
        name: "Jane Smith",
        photo: "https://picsum.photos/500/300?random=1",
      },
      {
        id: "3",
        name: "Bob Johnson",
        photo: "https://picsum.photos/500/300?random=2",
      },
    ],
    labels: ["Feature", "Urgent"],
  },
  {
    id: "5",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    assignedTo: [],
    labels: [],
  },
  {
    id: "6",
    name: "Exemple avec un titre de carte très long pour voir si c'est moche... Finalement ça rend plutôt bien meme avec un titre de carte très long",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    assignedTo: [],
    labels: [],
  },
  {
    id: "7",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    assignedTo: [],
    labels: [],
  },
  {
    id: "8",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    assignedTo: [],
    labels: [],
  },
  {
    id: "9",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    assignedTo: [],
    labels: [],
  },
  {
    id: "10",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    assignedTo: [],
    labels: [],
  },
  {
    id: "11",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    assignedTo: [],
    labels: [],
  },
  {
    id: "12",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    assignedTo: [],
    labels: [],
  },
  {
    id: "13",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    assignedTo: [],
    labels: [],
  },
];

const LabelList = [
  { name: "Feature", color: "#E6BE65" },
  { name: "Urgent", color: "#FF0000" },
  { name: "Fix", color: "#6c25be" },
  { name: "Documentation", color: "#2596be" },
];

const taskStatus = {
  requested: {
    name: "Stories",
    items: [
      {
        id: "14",
        name: "Tset",
        desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        assignedTo: [],
        labels: [],
      },
      {
        id: "15",
        name: "Do all",
        desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        assignedTo: [],
        labels: [],
      },
    ],
  },
  acceptance: {
    name: "Critère d'acceptation",
    items: tasks,
  },

  toDo: {
    name: "To Do",
    items: [],
  },

  inProgress: {
    name: "In progress",
    items: [],
  },
  done: {
    name: "Done",
    items: [],
  },
};

// useEffect(() => {
//   (async () => {
//     const wsComments = new w3cwebsocket(`ws://localhost:5050/dashboard`);

//     wsComments.onopen = function (e) {
//       console.log("[open] Connection established");
//       console.log("Sending to server");
//       console.log("tutoId", connectedStudent);
//       wsComments.send(JSON.stringify(connectedStudent));
//     };

//     wsComments.onmessage = (message) => {
//       const data = JSON.parse(message.data);
//       var dashboards = data;
//       var listDashboards = [];
//       dashboards.forEach((dashboard) => {
//         const startDate = new Date(
//           dashboard.starting_date._seconds * 1000 + dashboard.starting_date._nanoseconds / 100000
//         ).toLocaleDateString("fr");

//         const endDate = new Date(
//           dashboard.ending_date._seconds * 1000 + dashboard.ending_date._nanoseconds / 100000
//         ).toLocaleDateString("fr");

//         var dashboardFront = {
//           id: dashboard.id,
//           sprint_name: dashboard.sprint_name,
//           sprint_group: dashboard.group_name,
//           start: startDate,
//           end: endDate,
//           backlog: "lien",
//           favorite: dashboard.favorite,
//           favoriteDate: "",
//           students: dashboard.students,
//           picture: dashboard.image,
//         };
//         listDashboards.push(dashboardFront);
//       });
//       setRows(listDashboards);
//     };
//   })();
// }, []);

function Board() {
  const labelChange = () => setLabel(!label);
  const [columns, setColumns] = useState(taskStatus);
  const [label, setLabel] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handleMenuOpen = (event, columnId) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;

    if (result.destination.droppableId === "requested" && result.source.droppableId !== "requested") {
      setErrorMessage("Impossible de déplacer cet élément dans cette colonne");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000); // DELETE AFTER 3 SEC
      return;
    } else if (result.destination.droppableId !== "requested" && result.source.droppableId === "requested") {
      setErrorMessage("Impossible de déplacer une storie dans une autre colonne");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000); // DELETE AFTER 5 SEC
      return;
    }

    const source = result.source;
    const destination = result.destination;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    if (source.droppableId !== destination.droppableId) {
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const copiedItems = [...sourceColumn.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: copiedItems,
        },
      });
    }
  };
  //const { parameter } = useParams();
  // const labelChange = () => setLabel(!label);

  return (
    <>
      <div>
        {errorMessage && (
          <Alert severity="warning" variant="filled" TransitionComponent={TransitionComponent}>
            <AlertTitle>Attention</AlertTitle>
            {errorMessage}
          </Alert>
        )}
        <Typography style={{ textAlign: "center" }} variant="h5">
          Scrum Board
        </Typography>
        <Switch checked={label} onChange={labelChange} inputProps={{ "aria-label": "controlled" }} />
        <p>Label name</p>
        <div className="board_container_all">
          <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <div className="board_container_table" key={columnId}>
                  <div className="board_container_table_header">
                    <div className="board_container_table_header_label">
                      <Typography
                        variant="body1"
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          marginLeft: "5%",
                        }}
                      >
                        {column.name}
                      </Typography>
                      <IconButton aria-label="menu" onClick={(event) => handleMenuOpen(event, columnId)}>
                        <MoreHorizIcon />
                      </IconButton>
                    </div>
                    <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                        }}
                      >
                        <AddIcon />
                        Ajouter une carte
                      </MenuItem>
                    </Menu>

                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver ? "#ed6c0247" : "#ebecf0",
                              padding: 4,
                              width: 260,
                              minHeight: 30,
                              maxHeight: "75vh",
                              overflow: "auto",
                              height: "auto",
                            }}
                          >
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                  isDragDisabled={column.isDragDisabled && column.name === "Stories"} //  disable the drag on the "Stories" column
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          userSelect: "none",
                                          marginBottom: 8,
                                          minHeight: "60px",
                                          borderRadius: 3,
                                          backgroundColor: snapshot.isDragging ? "#FFFFFF" : "#FFFFFF",
                                          boxShadow:
                                            "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                          color: "white",
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        <CardBoard
                                          labelList={LabelList}
                                          card_info={item}
                                          snapshot={snapshot}
                                          label={label}
                                          list_name={column.name}
                                        ></CardBoard>
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                    <ButtonAddCard />
                  </div>
                </div>
              );
            })}
          </DragDropContext>
        </div>
      </div>
    </>
  );
}
export default Board;

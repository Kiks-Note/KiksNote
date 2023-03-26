import React, { useState, useEffect } from "react";
import "./Board.scss";
import axios from "axios";
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
import { w3cwebsocket } from "websocket";

function TransitionComponent(props) {
  return <Slide {...props} direction="up" />;
}
const LabelList = [
  { name: "Feature", color: "#E6BE65" },
  { name: "Urgent", color: "#FF0000" },
  { name: "Fix", color: "#6c25be" },
  { name: "Documentation", color: "#2596be" },
];
const taskStatus = {
  requested: {
    name: "Stories",
    items: [],
  },
  acceptance: {
    name: "Critère d'acceptation",
    items: [],
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

function Board() {
  const labelChange = () => setLabel(!label);
  const [columns, setColumns] = useState(taskStatus);
  const [label, setLabel] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  useEffect(() => {
    (async () => {
      const wsComments = new w3cwebsocket(`ws://localhost:5050/board`);

      wsComments.onopen = function (e) {
        console.log("[open] Connection established");
        console.log("Sending to server");
        wsComments.send(JSON.stringify({ dashboardId: "JUnEQaGjoiSvGZvGfElf", boardId: "HCmKbXNmFtGYn3m6UbFt" }));
      };
      wsComments.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setColumns({
          ...data,
        });
      };
    })();
  }, []);

  async function changeCardIndex(newColumns) {
    await axios.put(
      "http://localhost:5050/dashboard/JUnEQaGjoiSvGZvGfElf/board/HCmKbXNmFtGYn3m6UbFt/setCards",
      newColumns
    );
  }
  const handleMenuOpen = (event, columnId) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    if (result.destination.droppableId === "0" && result.source.droppableId !== "0") {
      setErrorMessage("Impossible de déplacer cet élément dans cette colonne");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000); // DELETE AFTER 3 SEC
      return;
    } else if (result.destination.droppableId !== "0" && result.source.droppableId === "0") {
      setErrorMessage("Impossible de déplacer une storie dans une autre colonne");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000); // DELETE AFTER 5 SEC
      return;
    }
    console.log(result.destination.droppableId);
    if (result.destination.droppableId === "1" && result.source.droppableId !== "1") {
      setErrorMessage("Impossible de déplacer cet élément dans cette colonne");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000); // DELETE AFTER 3 SEC
      return;
    } else if (result.destination.droppableId !== "1" && result.source.droppableId === "1") {
      setErrorMessage("Impossible de déplacer un critère d'acceptation dans une autre colonne");
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
      changeCardIndex({
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
      changeCardIndex({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: copiedItems,
        },
      });
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: copiedItems,
        },
      });
    }
  };

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
                                          columnId={columnId}
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
                    <ButtonAddCard columnId={columnId} />
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

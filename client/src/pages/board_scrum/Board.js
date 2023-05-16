import React, { useState, useEffect } from "react";
import "./Board.scss";
import axios from "axios";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import CardBoard from "../../components/board_scrum/board/CardBoard";
import { Typography } from "@mui/material";
import ButtonAddCard from "../../components/board_scrum/board/ButtonAddCard";
import { Toaster, toast } from "react-hot-toast";
import Slide from "@mui/material/Slide";
import { Switch } from "@mui/material";
import { w3cwebsocket } from "websocket";

function TransitionComponent(props) {
  return <Slide {...props} direction="up" />;
}

export default function Board(props) {
  const labelChange = () => setLabel(!label);
  const [columns, setColumns] = useState({});
  const [boardName, setBoardName] = useState("");
  const [labelList, setLabelList] = useState([]);
  const [label, setLabel] = useState(false);

  useEffect(() => {
    (async () => {
      const wsComments = new w3cwebsocket(`ws://localhost:5050/board`);

      wsComments.onopen = function (e) {
        console.log("[open] Connection established");
        console.log("Sending to server");
        wsComments.send(
          JSON.stringify({
            dashboardId: props.dashboardId,
            boardId: props.boardId,
          })
        );
      };
      wsComments.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setColumns({
          ...data.board,
        });
        setLabelList(data.labels);
        setBoardName(data.name);
      };
    })();
  }, []);

  async function changeCardIndex(newColumns) {
    await axios.put(
      "http://localhost:5050/dashboard/" +
        props.dashboardId +
        "/board/" +
        props.boardId +
        "/setCards",
      newColumns
    );
  }
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;

    const sourceId = result.source.droppableId;
    const destinationId = result.destination.droppableId;
    console.log("source" + sourceId);
    console.log("destinationId" + destinationId);

    if (sourceId === destinationId) {
      // Déplacement au sein de la même colonne
      const column = columns[sourceId];
      const items = [...column.items];
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);

      setColumns((prevColumns) => ({
        ...prevColumns,
        [sourceId]: {
          ...column,
          items: items,
        },
      }));
    } else {
      // Déplacement entre deux colonnes différentes
      const sourceColumn = columns[sourceId];
      const destinationColumn = columns[destinationId];
      if (
        destinationId === "0" ||
        sourceId === "1" ||
        destinationId === "5" ||
        sourceId === "6"
      ) {
        toast.error("Impossible de déplacer cet élément dans cette colonne", {
          duration: 5000,
        });
        return;
      } else if (
        sourceId === "0" ||
        destinationId === "1" ||
        sourceId === "5" ||
        destinationId === "6"
      ) {
        toast.error(
          "Impossible de déplacer une storie dans une autre colonne",
          {
            duration: 5000,
          }
        );
        return;
      }

      const sourceItems = [...sourceColumn.items];
      const destinationItems = [...destinationColumn.items];
      const [removed] = sourceItems.splice(result.source.index, 1);
      destinationItems.splice(result.destination.index, 0, removed);

      setColumns((prevColumns) => ({
        ...prevColumns,
        [sourceId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destinationId]: {
          ...destinationColumn,
          items: destinationItems,
        },
      }));
    }
  };

  return (
    <>
      <div>
        <Typography style={{ textAlign: "center" }} variant="h5">
          {boardName}
        </Typography>
        <Switch
          checked={label}
          onChange={labelChange}
          inputProps={{ "aria-label": "controlled" }}
        />
        <Toaster />
        <div className="board_container_all grid-container">
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
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
                    </div>

                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#ed6c0247"
                                : "#ebecf0",
                              padding: 4,
                              width: 260,
                              minHeight: 30,
                              maxHeight: "40vh",
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
                                  isDragDisabled={
                                    column.isDragDisabled &&
                                    column.name === "Stories"
                                  } //  disable the drag on the "Stories" column
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
                                          backgroundColor: snapshot.isDragging
                                            ? "#FFFFFF"
                                            : "#FFFFFF",
                                          boxShadow:
                                            "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                          color: "white",
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        <CardBoard
                                          labelList={labelList}
                                          card_info={item}
                                          snapshot={snapshot}
                                          label={label}
                                          list_name={column.name}
                                          columnId={columnId}
                                          stories={columns[0].items}
                                          dashboardId={props.dashboardId}
                                          boardId={props.boardId}
                                        />
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
                    <ButtonAddCard
                      columnId={columnId}
                      dashboardId={props.dashboardId}
                      boardId={props.boardId}
                    />
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

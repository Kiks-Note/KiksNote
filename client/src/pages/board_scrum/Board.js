import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Switch, Typography } from "@mui/material";
import axios from "axios";
import { PropTypes } from "prop-types";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { w3cwebsocket } from "websocket";
import ButtonAddCard from "../../components/board_scrum/board/ButtonAddCard";
import CardBoard from "../../components/board_scrum/board/CardBoard";
import "./Board.scss";

Board.propTypes = {
  dashboardId: PropTypes.string.isRequired,
  boardId: PropTypes.string.isRequired,
};
export default function Board({boardId, dashboardId}) {
  const labelChange = () => setLabel(!label);
  const [columns, setColumns] = useState({});
  const [boardName, setBoardName] = useState("");
  const [labelList, setLabelList] = useState([]);
  const [label, setLabel] = useState(false);

  useEffect(() => {
    (async () => {
      const wsComments = new w3cwebsocket(
        `${process.env.REACT_APP_SERVER_API_WS}/board`
      );

      wsComments.onopen = function (e) {
        wsComments.send(
          JSON.stringify({
            dashboardId: dashboardId,
            boardId: boardId,
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
      `${process.env.REACT_APP_SERVER_API}/dashboard/` +
        dashboardId +
        "/board/" +
        boardId +
        "/setCards",
      newColumns
    );
  }
  const onDragEnd = async (result, columns, setColumns) => {
    if (!result.destination) return;

    const source = result.source;
    const destination = result.destination;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceId = result.source.droppableId;
    const destinationId = result.destination.droppableId;

    if (sourceId === destinationId) {
      // Déplacement au sein de la même colonne
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
        toast.error("Impossible de déplacer cet élément dans cette colonne", {
          duration: 5000,
        });
        return;
      }
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      var currentDate = new Date();
      // Options pour le format de la date
      var options = { day: "2-digit", month: "2-digit", year: "numeric" };
      // Formater la date au format "DD/MM/YYYY"
      var formattedDate = currentDate.toLocaleDateString("fr-FR", options);
      // Modifier la propriété 'advancement' en fonction de 'destinationId'
      if (destinationId == "2") {
        // Parcourir 'advancement' pour trouver la clé 'dayNow' correspondant à la date actuelle
        for (const item of removed.advancement) {
          if (
            new Date(item.dayNow._seconds * 1000).toLocaleDateString("fr") ==
            formattedDate
          ) {
            item.advance = 0;
            break; // Sortir de la boucle une fois l'élément trouvé
          }
        }
      } else if (destinationId == "3") {
        // Parcourir 'advancement' pour trouver la clé 'dayNow' correspondant à la date actuelle
        for (const item of removed.advancement) {
          if (
            new Date(item.dayNow._seconds * 1000).toLocaleDateString("fr") ==
            formattedDate
          ) {
            item.advance = removed.estimation / 2;
            break; // Sortir de la boucle une fois l'élément trouvé
          }
        }
      } else if (destinationId == "4") {
        // Parcourir 'advancement' pour trouver la clé 'dayNow' correspondant à la date actuelle
        for (const item of removed.advancement) {
          if (
            new Date(item.dayNow._seconds * 1000).toLocaleDateString("fr") ==
            formattedDate
          ) {
            item.advance = removed.estimation;
            break; // Sortir de la boucle une fois l'élément trouvé
          }
        }
      }
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
    }
  };

  return (
    <>
      <section class="board-info-bar">
        <div class="board-controls">
          <h2> {boardName}</h2>

          <Switch
            checked={label}
            onChange={labelChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>

        {/* <Button variant="outlined" startIcon={<SettingsIcon />}>
          Paramètres
        </Button> */}
      </section>
      <div>
        <Toaster />
        <div className="board_container_all grid-container-board ">
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
                                : "#c4c9cc",
                              paddingInline: 14,
                              minHeight: 20,
                              maxHeight: "30vh",
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
                                          dashboardId={dashboardId}
                                          boardId={boardId}
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
                      dashboardId={dashboardId}
                      boardId={boardId}
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

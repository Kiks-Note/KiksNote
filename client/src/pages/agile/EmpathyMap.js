import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import PostIt from "./PostIt";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const tasks = [
  {
    id: "1",
    content: "Board EduScrum",
  },
  {
    id: "2",
    content: "Création de sprint agile très très long",
  },
  {
    id: "3",
    content: "BurnDown chart",
  },
  {
    id: "4",
    content: "Ajout du backlog",
  },
  {
    id: "5",
    content: "Sprint retro",
  },
  {
    id: "6",
    content:
      "Exemple avec un titre de carte très long pour voir si c'est moche... Finalement ça rend plutôt bien même avec un titre de carte très long",
  },
  {
    id: "7",
    content: "Sprint retro",
  },
  {
    id: "8",
    content: "Sprint retro",
  },
  {
    id: "9",
    content: "Sprint retro",
  },
  {
    id: "10",
    content: "Sprint retro",
  },
  {
    id: "11",
    content: "Sprint retro",
  },
  {
    id: "12",
    content: "Sprint retro",
  },
  {
    id: "13",
    content: "Sprint retro",
  },
];

const taskStatus = {
  think: {
    name: "Penser et ressentir",
    color: "#ff0000",
    params: "1 / 1 / 3 / 3",
    items: [
      {
        id: "78",
        content: "test",
      },
    ],
    isRequested: true,
    isDragDisabled: true, // disable the drag on the "Stories" column
  },
  see: {
    name: "Voir",
    color: "#0000ff",
    params: "1 / 3 / 3 / 5",
    items: tasks,
  },
  do: {
    name: "Dire et faire",
    color: "#9ACD32",
    params: "3 / 1 / 5 / 3",
    items: [],
  },
  hear: {
    name: "Entendre",
    color: "#FFFF00",
    params: "3 / 3 / 5 / 5",
    items: [],
  },
};

export default function EmpathyMap() {
  const [columns, setColumns] = useState(taskStatus);

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;

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

  return (
    <div>
      <Typography
        variant="h3"
        
      >
        Empathy Map de Adrien
      </Typography>
      <div
        className="parent"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          gridColumnGap: "10px",
          gridRowGap: "10px",
          height: "90vh",
        }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column]) => {
            return (
              <div
                style={{
                  backgroundColor: column.color,
                  height: "100%",
                  gridArea: column.params,
                  padding: "10px",
                  borderRadius: "4%",
                }}
                key={columnId}
              >
                <div
                  style={{
                    padding: "10px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    borderRadius: "4%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      marginLeft: "5%",
                    }}
                  >
                    {column.name}
                  </Typography>
                  <IconButton
                    aria-label="Add"
                    color="primary"
                    size="small"
                    style={{ marginLeft: "auto" }}
                    //onClick={handleAddButtonClick} // Ajoutez votre fonction de gestion de l'ajout ici
                  >
                    <AddIcon />
                  </IconButton>
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
                          display: "block",
                          background: "#00000030",
                          minHeight: 30,
                          maxHeight: "39vh",
                          overflow: "auto",
                          height: "auto",
                          borderRadius: "4%",
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <PostIt text={item.content} />
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
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

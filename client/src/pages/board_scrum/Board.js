import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import BasicModal from "../../components/board_scrum/ModalCard";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const tasks = [
  { id: "1", name: "Board EduScrum", desc: "Description de la tâche" },
  {
    id: "2",
    name: "Création de sprint agile",
    desc: "Description de la tâche",
  },
  { id: "3", name: "BurnDown chart", desc: "Description de la tâche" },
  { id: "4", name: "Ajout du backlog", desc: "Description de la tâche" },
  { id: "5", name: "Sprint retro", desc: "Description de la tâche" },
];
const taskStatus = {
  stories: {
    name: "Stories",
    items: tasks,
  },
  acceptance: {
    name: "Critère d'acceptation",
    items: [],
  },

  toDo: {
    name: "TODO",
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

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
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
    const column = columns[source.droppableId];

    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function App() {
  const [columns, setColumns] = useState(taskStatus);
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Scrum Board</h1>
      <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
        <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                key={columnId}
              >
                {" "}
                <h2>{column.name}</h2>
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver ? "lightblue" : "lightgrey",
                            padding: 4,
                            width: 250,
                            minHeight: 500,
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        padding: 16,
                                        marginBottom: 8,
                                        minHeight: "60px",
                                        borderRadius: 3,
                                        backgroundColor: snapshot.isDragging ? "#263B4A" : "#456C86",
                                        color: "white",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <BasicModal card_info={item}></BasicModal>
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
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}
export default App;

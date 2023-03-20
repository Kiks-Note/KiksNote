import "./Groups.scss";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

const students = [{ id: "1", name: "Student 1" }, { id: "2", name: "Student 2" }];

let groups = [
  { id: "1", name: "Groupe 1", students: [] },
  { id: "2", name: "Groupe 2", students: [] },
  { id: "3", name: "Groupe 3", students: [] },
  { id: "4", name: "Groupe 4", students: [] },
];

const taskStatus = {
  Students: {
    name: "Eleves",
    items: students,
  },
  ...groups.reduce((acc, group) => {
    acc[group.id] = {
      name: group.name,
      items: group.students,
    };
    return acc;
  }, {}),
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

    // If the destination is a group, move the student into the group's student array
    if (destination.droppableId !== "Students") {
      groups = groups.map((group) => {
        if (group.id === destination.droppableId) {
          group.students = destItems;
        }
        return group;
      });
    }

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

function Groups() {
  const [columns, setColumns] = useState(taskStatus);
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Scrum Board</h1>
      <div
        style={{ display: "flex", justifyContent: "center", height: "100%" }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: 8,
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  backgroundColor: "#f5f5f5",
                  width: 250,
                  minHeight: 500,
                }}
                key={columnId}
              >
                <h2 style={{ padding: "10px 0" }}>{column.name}</h2>
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "inherit",
                            padding: 4,
                            width: "100%",
                            minHeight: 400,
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
                                      style={{
                                        userSelect: "none",
                                        padding: 16,
                                        margin: "0 0 8px 0",
                                        minHeight: "50px",
                                        backgroundColor: snapshot.isDragging
                                          ? "#263B4A"
                                          : "#456C86",
                                        color: "white",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {item.name}
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

export default Groups;
import "./groups.scss";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

const allStudents = [
  { id: "1", username: "jules" },
  { id: "2", username: "celian" },
  { id: "3", username: "lucas" },
  { id: "4", username: "mohamed" },
  { id: "5", username: "jerance" },
  { id: "6", username: "rui" },
];

function Groups() {
  const [students, updateStudents] = useState(allStudents);

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(students);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateStudents(items);
  }

  const colors = [
    "#f7d472",
    "#cff772",
    "#9ef772",
    "#72f7d8",
    "#72b7f7",
    "#8872f7",
    "#e372f7",
    "#f7729c",
  ];

  return (
    <div className="groups-content">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="students">
          {(provided) => (
            <ul
              className="students"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {students.map(({ id, username }, index) => {
                return (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided) => (
                      <li
                        className="student"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          backgroundColor: colors[index],
                          color: "black",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <p>{username}</p>
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>

        <Droppable droppableId="groups">
          {(provided) => (
            <ul
              className="groups"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Groups;

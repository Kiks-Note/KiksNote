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

  return (
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
                    >
                      <p>
                        {username} id:{id}
                      </p>
                    </li>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Groups;

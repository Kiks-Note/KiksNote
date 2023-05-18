import React, { useState } from 'react';
import Button from '@mui/material/Button';
import PostIt from './PostIt';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function EmpathyMap() {
  const [postIts, setPostIts] = useState([]);

  const addPostIt = () => {
    const newPostIt = `Contenu du post-it ${postIts.length + 1}`;
    setPostIts([...postIts, newPostIt]);
  };

  const handleDragEnd = (result) => {
    console.log(result);
    if (!result.destination) return;

    const items = Array.from(postIts);
    const [itemPlace] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, itemPlace);

    setPostIts(items);
  };

  return (
    <div>
      <h1>Empathy Map</h1>
      <Button variant="contained" onClick={addPostIt}>
        POST-IT
      </Button>
      <DragDropContext onDragEnd={handleDragEnd}>
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
          <Droppable droppableId="parent">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {postIts.map((postIt, index) => (
                  <Draggable
                    key={index}
                    draggableId={`post-it-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <PostIt text={postIt} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div
            className="div1"
            style={{
              gridArea: "1 / 1 / 3 / 3",
              backgroundColor: "red",
            }}
          >
            <Droppable droppableId="div1">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ height: "100%" }}
                >
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div
            className="div2"
            style={{
              gridArea: "1 / 3 / 3 / 5",
              backgroundColor: "blue",
            }}
          >
            <Droppable droppableId="div2">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ height: "100%" }}
                >
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div
            className="div3"
            style={{
              gridArea: "3 / 1 / 5 / 3",
              backgroundColor: "green",
            }}
          >
            <Droppable droppableId="div3">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ height: "100%" }}
                >
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div
            className="div4"
            style={{
              gridArea: "3 / 3 / 5 / 5",
              backgroundColor: "yellow",
            }}
          >
            <Droppable droppableId="div4">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ height: "100%" }}
                >
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}








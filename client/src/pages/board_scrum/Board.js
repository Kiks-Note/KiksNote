import React, { useState } from "react";
//import { useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import CardBoard from "../../components/board_scrum/CardBoard";
import { Switch } from "@mui/material";
import ModalAddCard from "../../components/board_scrum/ModalAddCart";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };

const tasks = [
  {
    id: "1",
    name: "Board EduScrum",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: "2",
    name: "Création de sprint agile très très long",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: "3",
    name: "BurnDown chart",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: "4",
    name: "Ajout du backlog",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: "5",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: "6",
    name: "Exemple avec un titre de carte très long pour voir si c'est moche... Finalement ça rend plutôt bien meme avec un titre de carte très long",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: "7",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: "8",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: "9",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: "10",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: "11",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: "12",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: "13",
    name: "Sprint retro",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
];
const taskStatus = {
  requested: {
    name: "Stories",
    items: [
      {
        id: "1",
        name: "Tset",
        desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      },
    ],
    isRequested: true,
    isDragDisabled: true, // disable the drag on the "Stories" column
  },
  acceptance: {
    name: "Critère d'acceptation",
    items: tasks,
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




function Board() {
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;

    const source = result.source;
    const destination = result.destination;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    // Vérifier si la colonne de destination est "requested"
    if (destColumn.isRequested) {
      setErrorMessage("Impossible de déplacer cet élément dans cette colonne");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000); // DELETE AFTER 3 SEC
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      console.log(columns);
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
  const labelChange = () => setLabel(!label);

  const [columns, setColumns] = useState(taskStatus);
  const [label, setLabel] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  return (
    <div>
      {errorMessage && (
        <Alert severity="error">
          <AlertTitle>Erreur</AlertTitle>
          {errorMessage}
        </Alert>
      )}

      <h1 style={{ textAlign: "center" }}>Scrum Board</h1>
      <Switch
        checked={label}
        onChange={labelChange}
        inputProps={{ "aria-label": "controlled" }}
      />
      <p>Label name</p>

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
                }}
                key={columnId}
              >
                {" "}
                <h>{column.name}</h>
                <div
                  style={{
                    margin: 8,
                    borderColor: "#e0dede",
                    borderStyle: "solid",
                    borderWidth: "thin",
                  }}
                >
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "#e0dede",
                            padding: 4,
                            width: 250,
                            minHeight: 30,
                            maxHeight: 350,
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
                  <ModalAddCard />
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}
export default Board;

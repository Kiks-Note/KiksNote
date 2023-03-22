import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import "./Groups.scss";

const tasks = [
    {
        id: "1",
        name: "Lucie",
    },
    {
        id: "2",
        name: "Celian",
    },
    {
        id: "3",
        name: "Killian",
    },
    {
        id: "4",
        name: "Antoine",
    },
    {
        id: "5",
        name: "Johan",
    },
    {
        id: "6",
        name: "Rui",
    },
    {
        id: "7",
        name: "Louis",
    },
    {
        id: "8",
        name: "Jules",
    },
    {
        id: "9",
        name: "Mohammed",
    },
    {
        id: "10",
        name: "Eddy",
    },
    {
        id: "11",
        name: "Lucas",
    },
    {
        id: "12",
        name: "Alan",
    },
    {
        id: "13",
        name: "Etienne",
    },
    {
        id: "14",
        name: "Adrien",
    },
    /*     {
            id: "15",
            name: "Ilan",
        },
        {
            id: "16",
            name: "Guillaume",
        },
        {
            id: "17",
            name: "Theo",
        },
        {
            id: "18",
            name: "Julien",
        },
        {
            id: "19",
            name: "Jerance",
        },
        {
            id: "20",
            name: "Maxime",
        },
        {
            id: "21",
            name: "Florian",
        },
        {
            id: "22",
            name: "Xavier",
        },
        {
            id: "23",
            name: "Thomas",
        }, */
];
const colContent = {
    students: {
        name: "Students",
        items: tasks,
    },
    g1: {
        name: "Groupe 1",
        items: [],
    },

    g2: {
        name: "Groupe 2",
        items: [],
    },

    g3: {
        name: "Groupe 3",
        items: [],
    },
    g4: {
        name: "Groupe 4",
        items: [],
    },
};




function App() {
    const [columns, setColumns] = useState(colContent);
    function addStudent(columnId, student, columns) {
        columns[columnId].items.push(student);
        setColumns({ ...columns });
    }

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

            // move the item directly to the clicked column
            const columnId = destination.droppableId;
            const student = columns[columnId].items[destination.index];
            addStudent(columnId, student, columns);
        }
    };

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Creation de Groupes</h1>
            <div style={{ display: "flex", justifyContent: "center", height: "100%", flexWrap: "wrap" }}>
                <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
                    {Object.entries(columns).map(([columnId, column], index) => {
                        if (index === 0) {
                            return (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        width: "100%"
                                    }}
                                    key={columnId}
                                >
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
                                                            width: "100%",
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            justifyContent: "space-around",
                                                            alignItems: "center",
                                                            flexWrap: "wrap",
                                                            minHeight: 140,
                                                            maxHeight: 500,
                                                            overflow: "auto",
                                                            height: "auto",
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
                                                                                className="post-it"
                                                                            >
                                                                                <p>{item.name}</p>
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
                        }
                        else {
                            return (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        width: "45 %"
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
                                                            minHeight: 140,
                                                            maxHeight: 500,
                                                            overflow: "auto",
                                                            height: "auto",
                                                        }}
                                                        onClick={() => {
                                                            if (columns.students.items.length > 0) {
                                                                const student = columns.students.items.pop();
                                                                addStudent(columnId, student, columns);
                                                                setColumns({ ...columns });
                                                            }
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
                                                                                className="post-it"

                                                                            >
                                                                                <p>{item.name}</p>
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
                        }
                    })}
                </DragDropContext>
            </div>
        </div>
    );
}
export default App;
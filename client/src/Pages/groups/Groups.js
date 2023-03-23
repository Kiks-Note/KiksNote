import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import CachedIcon from '@mui/icons-material/Cached';
import LockIcon from '@mui/icons-material/Lock';
import CasinoIcon from '@mui/icons-material/Casino';
import LockOpenIcon from '@mui/icons-material/LockOpen';
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
];
const colContent = {
    students: {
        name: "Students",
        items: tasks,
    },
};


function App() {
    const [columns, setColumns] = useState(colContent);

    function addStudent(columnId, student, columns) {
        columns[columnId].items.push(student);
        setColumns({ ...columns });
    }

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;
        if (source.droppableId === destination.droppableId) return;
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
        } else if (source.index !== destination.index) {
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


    function resetButton() {
        setColumns(colContent);
    }

    function generateGroupCase(event) {
        if (!isNaN(event.target.value) && event.target.value) {
            const number = event.target.value;
            const numberOfStudents = columns.students.items.length; //TODO update in function of BDD link

            let copiedColContent = { ...colContent };

            let numberOfCase = Math.floor(numberOfStudents / number);

            if (numberOfStudents % number !== 0) {
                numberOfCase++;
            }

            for (let index = 1; index < numberOfCase + 1; index++) {
                copiedColContent[`g${index}`] = {
                    name: `Group ${index}`,
                    items: []
                };
            }

            setColumns(copiedColContent);
        }
        else {
            //TODO make a toast here
            setColumns(colContent);
        }
    }
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    function randomGeneration() {
        let nsgp = parseInt(document.querySelector('input[type="text"]').value) // Number of students per groups
        if (!nsgp) { alert("Merci de renseigner d'abords le nombre de groupe d'élèves par groupe souhaité") }
        else {
            var studentsArrayRandom = shuffle(columns.students.items);
            var groups = Object.keys(columns).filter(key => key.startsWith('g'));
            var groupIndex = 0;

            var numberGroup = groups.length;

            var nbNotFull = (numberGroup * nsgp) - studentsArrayRandom.length;

            for (var i = 0; i < studentsArrayRandom.length; i += nsgp) {
                const groupKey = groups[groupIndex];
                var groupItems = [];
                if (nbNotFull > 0) {
                    groupItems = studentsArrayRandom.slice(i, (i + nsgp) - 1);
                    i = i - 1;
                    nbNotFull -= 1;
                }
                else {
                    groupItems = studentsArrayRandom.slice(i, i + nsgp);

                }
                console.log(nbNotFull)
                const updatedGroup = {
                    ...columns[groupKey],
                    items: groupItems
                };
                columns[groupKey] = updatedGroup;

                groupIndex++;
            }
            setColumns({ ...columns });
            console.log(columns);
        }
    }


    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Création de Groupes</h1>
            <div className="groups-inputs">
                <input type="text" list="students-list" placeholder="Eleves/groupes" onChange={generateGroupCase} />
                <datalist id="students-list">
                    <option value={3}></option>
                    <option value={4}></option>
                    <option value={5}></option>
                </datalist>
                <button className="input-button" onClick={resetButton}><CachedIcon className="icon-svg" /></button>
                <button className="input-button" onClick={randomGeneration}><CasinoIcon className="icon-svg" /></button>
                <button className="input-button"><LockOpenIcon className="icon-svg" /></button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", height: "100%", flexWrap: "wrap" }}>
                <DragDropContext onDragEnd={onDragEnd}>
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
                                    <div style={{ margin: 8 }} className="group-div">
                                        <Droppable droppableId={columnId} key={columnId}>
                                            {(provided, snapshot) => {
                                                return (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        style={{
                                                            background: snapshot.isDraggingOver ? "#e697b3" : "#252525",
                                                            padding: 4,
                                                            width: "100%",
                                                            minHeight: 140,
                                                            maxHeight: 500,
                                                            overflow: "auto",
                                                            height: "auto",
                                                        }}
                                                        className="group"
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
                                                                                    backgroundColor: snapshot.isDragging ? "#7d0229" : "#f50057",
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
                                                            background: snapshot.isDraggingOver ? "#e697b3" : "#252525",
                                                            padding: 4,
                                                            width: 250,
                                                            minHeight: 140,
                                                            maxHeight: 500,
                                                            overflow: "auto",
                                                            height: "auto",
                                                        }}
                                                        className="group"
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
                                                                                    backgroundColor: snapshot.isDragging ? "#7d0229" : "#f50057",
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
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from 'axios';
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import CachedIcon from "@mui/icons-material/Cached";
import LockIcon from "@mui/icons-material/Lock";
import CasinoIcon from "@mui/icons-material/Casino";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SettingsIcon from '@mui/icons-material/Settings';
import { PopUp } from "../../components/groups/Popup";
import useFirebase from "../../hooks/useFirebase";
import { w3cwebsocket } from "websocket";
import { useNavigate } from 'react-router-dom';

import "./Groups.scss";

function App() {
    const [classStudents, setClassStudents] = useState();
    const [showSettings, setShowSettings] = useState(false);
    const [inRoom, setInRoom] = useState(false);

    const [settings, setSettings] = useState();
    const [lock, setLock] = useState(true);
    const [columns, setColumns] = useState();
    const [nbSPGrp, setNbSPGrp] = useState();

    const [userCursors, setUserCursors] = useState();

    const [nbUserConnected, setNbUserConnected] = useState(0);

    const navigate = useNavigate();
    const { user } = useFirebase();

    const ws = useMemo(() => {
        return new w3cwebsocket('ws://localhost:5050/groupes');
    }, []);

    const getStudents = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:5050/groupes/${classStudents}`);
            return res.data;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }, [classStudents]);

    const fetchData = useCallback(async () => {
        const studentsData = await getStudents();
        const colContent = {
            students: {
                name: "Students",
                items: studentsData,
            },
        };
        return colContent;
    }, [getStudents]);

    const fetchAndSetData = useCallback(async () => {
        const colContent = await fetchData();
        ws.send(JSON.stringify({ type: "updateCol", data: { columns: colContent, class: classStudents } }))
        setColumns(colContent);
    }, [classStudents, fetchData, ws]);

    const LogToExistingRoomStudent = useCallback(async () => {
        try {
            axios.get(`http://localhost:5050/groupes/getRoom/${user?.class}`).then((res) => {
                if (res.data.length > 0) {
                    const message = {
                        type: 'joinRoom',
                        data: {
                            userID: user?.id,
                            name: user?.name,
                            class: user?.class,
                        }
                    };
                    ws.send(JSON.stringify(message));
                    setClassStudents(user?.class);
                    setInRoom(true);
                }
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, [user?.class, user?.id, user?.name, ws]);

    const logToExistingRoom = useCallback(async () => {
        try {
            axios.get(`http://localhost:5050/groupes/getRoomPo/${user?.id}`).then((res) => {
                if (res.data.length > 0) {
                    const message = {
                        type: 'joinRoom',
                        data: {
                            userID: user?.id,
                            name: user?.name,
                            class: res.data[0].class
                        }
                    };
                    ws.send(JSON.stringify(message));
                    setClassStudents(res.data[0].class);
                    setInRoom(true);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }, [user?.id, user?.name, ws]);

    function displayUserCursorPositions(users) {
        const map = new Map(Object.entries(users));
        setUserCursors(map);
    }

    useEffect(() => {

        const handleOpen = async () => {

            if (user?.status === "etudiant") {
                await LogToExistingRoomStudent();
            } else if (user?.status === "po") {
                await logToExistingRoom();
            }

            if (inRoom) {

                if (user?.status === "po") {
                    await fetchAndSetData();
                }

                document.addEventListener('mousemove', (event) => {
                    const cursorPosition = {
                        x: event.clientX,
                        y: event.clientY,
                    };

                    const message = {
                        type: 'cursorPosition',
                        data: { position: cursorPosition, userID: user?.id, class: classStudents }
                    }
                    ws.send(JSON.stringify(message));
                });

                ws.onmessage = (message) => {
                    const messageReceive = JSON.parse(message.data);

                    switch (messageReceive.type) {
                        case 'updateRoom':
                            displayUserCursorPositions(messageReceive.data.currentRoom.users);
                            if (user.status === "etudiant") {
                                setNbSPGrp(messageReceive.data.currentRoom.SpGrp);
                                setLock(messageReceive.data.currentRoom.lock);
                            }
                            if (messageReceive.data.currentRoom.columns) {
                                setColumns(messageReceive.data.currentRoom.columns);
                            }
                            else {
                                fetchAndSetData();
                            }
                            setNbUserConnected(messageReceive.data.currentRoom.nbUsers);
                            break;
                        default:
                            break;
                    }
                };
            }
        };

        if (ws.readyState === WebSocket.OPEN) {
            handleOpen();
        } else {
            ws.onopen = handleOpen;
        }


        return () => {
            document.removeEventListener('mousemove', () => { });
            ws.send(JSON.stringify({ type: 'leaveRoom', data: { userID: user?.id, class: classStudents } }));
        }
    }, [LogToExistingRoomStudent, classStudents, fetchAndSetData, inRoom, lock, logToExistingRoom, user?.id, user.status, ws]);

    function moveOnClick(columnId, student, columns) {
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

            ws.send(JSON.stringify({ type: 'updateCol', data: { columns: { ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems }, [destination.droppableId]: { ...destColumn, items: destItems } }, class: classStudents } }));

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

            ws.send(JSON.stringify({
                type: 'updateCol', data: {
                    columns: {
                        ...columns,
                        [source.droppableId]: {
                            ...column,
                            items: copiedItems,
                        },
                    }, class: classStudents
                }
            }));

            // move the item directly to the clicked column
            const columnId = destination.droppableId;
            const student = columns[columnId].items[destination.index];
            moveOnClick(columnId, student, columns);
        }
    };

    function resetButton() {
        document.querySelector('input[type="text"]').value = "";
        fetchAndSetData();
    }

    function generateGroupCase(event) {
        if ((!isNaN(event.target.value) && event.target.value)) {
            const number = event.target.value;
            setNbSPGrp(number);
            ws.send(JSON.stringify({ type: 'nbSPGrp', data: { nbSPGrp: number, class: classStudents, status: user.status } }));
            const numberOfStudents = columns.students.items.length;

            let copiedColContent = { ...columns };

            let numberOfCase = Math.floor(numberOfStudents / number);

            if (numberOfStudents % number !== 0) {
                numberOfCase++;
            }

            for (let index = 1; index < numberOfCase + 1; index++) {
                copiedColContent[`g${index}`] = {
                    name: `Group ${index}`,
                    items: [],
                };
            }

            setColumns(copiedColContent);
            ws.send(JSON.stringify({ type: 'updateCol', data: { columns: copiedColContent, class: classStudents } }));
        } else {
            //TODO make a toast here
            fetchAndSetData();
        }
    }

    function shuffle(array) {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }

        return array;
    }

    const handlePopupData = (data) => {
        setClassStudents(data.classChoose);
        setSettings(data);
        setShowSettings(false);
        setInRoom(true);
    };

    const handleClosePopUp = (showFalse) => {
        setShowSettings(showFalse);
    }

    async function saveGroups() {
        setLock(true);
        ws.send(JSON.stringify({ type: 'lock', data: { class: classStudents, lock: true, status: user.status } }))
        var groupsKey = Object.keys(columns).filter((key) => key.startsWith("g"));

        groupsKey.forEach(group => {
            axios.post(`http://localhost:5050/groupes/exportGroups`, {
                start_date: settings.start_date,
                end_date: settings.end_date,
                students: columns[group].items.map(student => student.id),
                po_id: "todo",
            });
        });

        try {
            await axios.delete(`http://localhost:5050/groupes/deleteRoom/${user?.id}`);
        } catch (error) {
            console.error(error);
        }

        setInRoom(false);
        ws.send(JSON.stringify({ type: 'closeRoom', data: { class: classStudents } }));
        navigate("/");
    }

    function randomGeneration() {

        if (!nbSPGrp) {
            alert(
                "Merci de renseigner d'abord le nombre de groupe d'élèves par groupe souhaité"
            );
        }
        else {

            const numberOfStudents = columns.students.items.length;

            let copiedColContent = { ...columns };

            let numberOfCase = Math.floor(numberOfStudents / nbSPGrp);

            if (numberOfStudents % nbSPGrp !== 0) {
                numberOfCase++;
            }

            for (let index = 1; index < numberOfCase + 1; index++) {
                copiedColContent[`g${index}`] = {
                    name: `Groupe ${index}`,
                    items: [],
                };
            }

            setColumns(copiedColContent);

            var studentsArrayRandom = shuffle(columns.students.items);
            var groups = Object.keys(columns).filter((key) => key.startsWith("g"));
            var students = Object.keys(columns).filter((key) => key.startsWith("s"));
            var groupIndex = 0;

            var numberGroup = groups.length;

            var nbNotFull = numberGroup * nbSPGrp - studentsArrayRandom.length;

            for (var i = 0; i < studentsArrayRandom.length; i += nbSPGrp) {
                const groupKey = groups[groupIndex];
                var groupItems = [];
                if (nbNotFull > 0) {
                    groupItems = studentsArrayRandom.slice(i, i + nbSPGrp - 1);
                    i = i - 1;
                    nbNotFull -= 1;
                } else {
                    groupItems = studentsArrayRandom.slice(i, i + nbSPGrp);
                }
                const updatedGroup = {
                    ...columns[groupKey],
                    items: groupItems,
                };
                columns[groupKey] = updatedGroup;

                groupIndex++;
            }
            columns[students[0]].items = [];
            setColumns({ ...columns });
            ws.send(JSON.stringify({ type: 'updateCol', data: { columns: columns, class: classStudents } }));
        }
    }

    function lockGroups() {
        if (lock) {
            setLock(false);
            ws.send(JSON.stringify({ type: 'lock', data: { class: classStudents, lock: false, status: user.status } }))
        }
        else {
            setLock(true);
            ws.send(JSON.stringify({ type: 'lock', data: { class: classStudents, lock: true, status: user.status } }))
        }
    }


    function settingsPopUp() {
        setShowSettings(true);
    }

    if (!columns && inRoom) {
        return <p>Loading...</p>;
    }

    if (user?.status === "po" && !inRoom) {
        return <PopUp onPopupData={handlePopupData} dataPopUp={null} showPopUp={null} />;
    }


    return (
        <>
            {inRoom ? <div>
                <nav>
                    {showSettings && user?.status === "po" ? <PopUp onPopupData={handlePopupData} dataPopUp={settings} showPopUp={handleClosePopUp} /> : null}
                    <p>Utilisateur connectés: {nbUserConnected}</p>
                    {user?.status === "po" ?
                        <div className="groups-inputs">
                            <input
                                type="text"
                                list="students-list"
                                placeholder="Eleves/groupes"
                                onChange={generateGroupCase} />
                            <datalist id="students-list">
                                <option value={3}></option>
                                <option value={4}></option>
                                <option value={5}></option>
                            </datalist>
                            <button className="input-button" onClick={resetButton}>
                                <CachedIcon className="icon-svg" />
                            </button>
                            <button className="input-button" onClick={randomGeneration}>
                                <CasinoIcon className="icon-svg" />
                            </button>
                            <button className="input-button">
                                {lock ? <LockOpenIcon className="icon-svg" onClick={lockGroups} /> : <LockIcon className="icon-svg" onClick={lockGroups} />}
                            </button>
                            <button className="input-button" onClick={settingsPopUp}>
                                <SettingsIcon className="icon-svg" />
                            </button>
                        </div>
                        : <div>
                            <p>Nombre d'élèves par groupe : {nbSPGrp ? nbSPGrp : "En attente.."}</p>
                        </div>}
                </nav>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        height: "100%",
                        width: "100%",
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        {userCursors ? (
                            Array.from(userCursors.entries()).map(([userID, userData]) => {
                                if (userID !== user?.id) {
                                    return (
                                        <div
                                            key={userID}
                                            style={{
                                                position: "absolute",
                                                left: userData.position?.x,
                                                top: userData.position?.y,
                                                width: "10px",
                                                height: "10px",
                                                backgroundColor: userData.color,
                                                borderRadius: "50%",
                                            }}
                                        >
                                            {user?.firstname}
                                        </div>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        ) : null}
                    </div>
                    <DragDropContext onDragEnd={onDragEnd}>
                        {Object.entries(columns).map(([columnId, column], index) => {
                            if (index === 0 && (columns.students.items.length > 0)) {
                                return (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            width: "100%",
                                            height: "100%",
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
                                                                backgroundColor: snapshot.isDraggingOver ? "#e697b3" : "#252525",
                                                                padding: "0px 50px",
                                                                width: "100%",
                                                                minHeight: 140,
                                                                maxHeight: 500,
                                                                overflow: "auto",
                                                                height: "auto",
                                                                ...(!lock && { backgroundColor: "#999999", opacity: 0.5, pointerEvents: "none" })
                                                            }}
                                                            className="group"
                                                        >
                                                            {column.items.map((item, index) => {
                                                                return (
                                                                    <Draggable
                                                                        key={item.id}
                                                                        draggableId={item.id}
                                                                        index={index}
                                                                    >
                                                                        {(provided, snapshot) => {
                                                                            console.log(userCursors);
                                                                            return (
                                                                                <div
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                    style={{
                                                                                        userSelect: "none",
                                                                                        borderRadius: 3,
                                                                                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                                                                                        backgroundColor: snapshot.isDragging
                                                                                            ? "#7d0229"
                                                                                            : (userCursors ? userCursors.get(item.id)?.color : "#f50057"),
                                                                                        color: "white",
                                                                                        ...provided.draggableProps.style,
                                                                                    }}
                                                                                    className="post-it"
                                                                                >
                                                                                    <p>{item.firstname}</p>
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
                                        {!nbSPGrp ? <p style={{ color: "grey", fontSize: "100px", textAlign: "center", fontWeight: "bold" }}>Veuillez choisir le nombre d'élèves par groupe</p> : null}
                                    </div>
                                );
                            } else if (index !== 0) {
                                return (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            width: "45 %",
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
                                                                backgroundColor: snapshot.isDraggingOver ? "#e697b3" : "#252525",
                                                                padding: 4,
                                                                width: 250,
                                                                minHeight: 140,
                                                                maxHeight: 500,
                                                                overflow: "auto",
                                                                height: "auto",
                                                                ...(!lock && { backgroundColor: "#999999", opacity: 0.5, pointerEvents: "none" })
                                                            }}
                                                            className="group"
                                                            onClick={() => {
                                                                if (columns.students.items.length > 0) {
                                                                    const student = columns.students.items.pop();
                                                                    moveOnClick(columnId, student, columns);
                                                                    setColumns({ ...columns });
                                                                    ws.send(JSON.stringify({ type: "updateCol", data: { columns: { ...columns }, class: classStudents } }))
                                                                }
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
                                                                                        marginBottom: 8,
                                                                                        minHeight: "60px",
                                                                                        borderRadius: 3,
                                                                                        backgroundColor: snapshot.isDragging
                                                                                            ? "#7d0229"
                                                                                            : "#f50057",
                                                                                        color: "white",
                                                                                        ...provided.draggableProps.style,
                                                                                    }}
                                                                                    className="post-it"
                                                                                >
                                                                                    <p>{item.firstname}</p>
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
                                return <span></span>;
                            }
                        })}
                    </DragDropContext>
                </div>
                {user?.status === "po" ? <button onClick={saveGroups} >Valider</button> : null}
            </div> : <h1>Pas de Room pour le moment</h1>}

        </>
    );
}
export default App;

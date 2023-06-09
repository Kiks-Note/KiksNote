import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import axios from "axios";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import CachedIcon from "@mui/icons-material/Cached";
import LockIcon from "@mui/icons-material/Lock";
import CasinoIcon from "@mui/icons-material/Casino";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SettingsIcon from "@mui/icons-material/Settings";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import { Button, useTheme, Tooltip, IconButton } from "@mui/material";
import { PopUp } from "../../components/groups/Popup";
import { toast, ToastContainer } from "react-toastify";
import useFirebase from "../../hooks/useFirebase";
import { w3cwebsocket } from "websocket";
import { useNavigate } from "react-router-dom";

import "./Groups.scss";

const options = {
  autoClose: 2000,
  className: "",
  position: toast.POSITION.TOP_RIGHT,
  theme: "colored",
};

export const toastSuccess = (message) => {
  toast.success(message, options);
};

function GroupsCreation() {
  const [classStudents, setClassStudents] = useState();
  const [showSettings, setShowSettings] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [file, setFile] = useState();
  const [settings, setSettings] = useState();
  const [lock, setLock] = useState(true);
  const [columns, setColumns] = useState();
  const [nbSPGrp, setNbSPGrp] = useState();
  const [courseChoose, setCourseChoose] = useState();
  const [hasLock, setHasLock] = useState(true);

  const [userCursors, setUserCursors] = useState();

  const [nbUserConnected, setNbUserConnected] = useState(0);
  const [numberOfStudentsInClass, setNumberOfStudentInclass] = useState(0);

  const navigate = useNavigate();
  const { user } = useFirebase();

  const theme = useTheme();
  const uploadBacklog = useRef();

  const ws = useMemo(() => {
    return new w3cwebsocket("ws://localhost:5050/groupes/creation");
  }, []);

  const getStudents = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5050/groupes/${classStudents}`
      );
      setNumberOfStudentInclass(res.data.length);
      return res.data;
    } catch (error) {
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
    ws.send(
      JSON.stringify({
        type: "updateCol",
        data: {
          columns: colContent,
          class: classStudents,
          nbStudents: numberOfStudentsInClass,
        },
      })
    );
    setColumns(colContent);
  }, [classStudents, fetchData, numberOfStudentsInClass, ws]);

  const LogToExistingRoomStudent = useCallback(async () => {
    try {
      axios
        .get(`http://localhost:5050/groupes/getRoom/${user?.class.id}`)
        .then((res) => {
          if (res.data.length > 0) {
            const message = {
              type: "joinRoom",
              data: {
                userID: user?.id,
                name: user?.firstname,
                class: user?.class.id,
              },
            };
            ws.send(JSON.stringify(message));
            setClassStudents(user?.class.id);
            setInRoom(true);
            setSettings(res.data[0].settings);
          }
        });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [user?.class, user?.id, user?.firstname, ws]);

  const logToExistingRoom = useCallback(async () => {
    try {
      axios
        .get(`http://localhost:5050/groupes/getRoomPo/${user?.id}`)
        .then((res) => {
          if (res.data.length > 0) {
            const message = {
              type: "joinRoom",
              data: {
                userID: user?.id,
                name: user?.firstname,
                class: res.data[0].class,
              },
            };
            ws.send(JSON.stringify(message));
            setClassStudents(res.data[0].class);
            setInRoom(true);
            setSettings(res.data[0].settings);
          }
        });
    } catch (error) {
      console.error(error);
    }
  }, [user?.id, user?.firstname, ws]);

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

        document.addEventListener("mousemove", (event) => {
          const cursorPosition = {
            x: event.clientX,
            y: event.clientY,
          };

          const message = {
            type: "cursorPosition",
            data: {
              position: cursorPosition,
              userID: user?.id,
              class: classStudents,
              nbStudents: numberOfStudentsInClass,
            },
          };
          ws.send(JSON.stringify(message));
        });

        ws.onmessage = (message) => {
          const messageReceive = JSON.parse(message.data);

          switch (messageReceive.type) {
            case "updateRoom":
              displayUserCursorPositions(messageReceive.data.currentRoom.users);
              if (user.status === "etudiant") {
                let number = parseInt(messageReceive.data.currentRoom.nbSPGrp);
                setNbSPGrp(number);
                setLock(messageReceive.data.currentRoom.lock);
                setNumberOfStudentInclass(
                  messageReceive.data.currentRoom.nbStudents
                );
              }
              if (messageReceive.data.currentRoom.columns) {
                setColumns(messageReceive.data.currentRoom.columns);
              } else {
                fetchAndSetData();
              }
              setNbUserConnected(messageReceive.data.currentRoom.nbUsers);
              break;
            case "closeRoom":
              setInRoom(false);
              navigate("/groupes");
              break;
            case "updateCol":
              setColumns(messageReceive.data.currentRoom.columns);
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
      document.removeEventListener("mousemove", () => {});
      ws.send(
        JSON.stringify({
          type: "leaveRoom",
          data: { userID: user?.id, class: classStudents },
        })
      );
    };
  }, [
    LogToExistingRoomStudent,
    classStudents,
    fetchAndSetData,
    inRoom,
    lock,
    logToExistingRoom,
    navigate,
    numberOfStudentsInClass,
    user?.id,
    user.status,
    ws,
  ]);

  function deleteStudent(userID) {
    const copiedColContent = { ...columns };

    Object.keys(copiedColContent).forEach((key) => {
      const group = copiedColContent[key];
      const updatedItems = group.items.filter(
        (student) => student.id !== userID
      );
      group.items = updatedItems;
    });

    setColumns(copiedColContent);
    ws.send(
      JSON.stringify({
        type: "updateCol",
        data: { columns: copiedColContent, class: classStudents },
      })
    );
  }

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

      ws.send(
        JSON.stringify({
          type: "updateCol",
          data: {
            columns: {
              ...columns,
              [source.droppableId]: { ...sourceColumn, items: sourceItems },
              [destination.droppableId]: { ...destColumn, items: destItems },
            },
            class: classStudents,
          },
        })
      );
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

      ws.send(
        JSON.stringify({
          type: "updateCol",
          data: {
            columns: {
              ...columns,
              [source.droppableId]: {
                ...column,
                items: copiedItems,
              },
            },
            class: classStudents,
          },
        })
      );

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
    if (!isNaN(event.target.value) && event.target.value) {
      const number = event.target.value;
      setNbSPGrp(number);
      ws.send(
        JSON.stringify({
          type: "nbSPGrp",
          data: {
            nbSPGrp: number,
            class: classStudents,
            status: user.status,
            nbStudents: numberOfStudentsInClass,
          },
        })
      );
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
      ws.send(
        JSON.stringify({
          type: "updateCol",
          data: {
            columns: copiedColContent,
            class: classStudents,
            nbStudents: numberOfStudentsInClass,
          },
        })
      );
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
    setCourseChoose(data.courseChoose);
  };

  const handleClosePopUp = (showFalse) => {
    setShowSettings(showFalse);
  };

  async function saveGroups() {
    setLock(true);
    ws.send(
      JSON.stringify({
        type: "lock",
        data: { class: classStudents, lock: true, status: user.status },
      })
    );
    var groupsKey = Object.keys(columns).filter((key) => key.startsWith("g"));
    setInRoom(false);
    ws.send(
      JSON.stringify({ type: "closeRoom", data: { class: classStudents } })
    );
    ws.close();

    groupsKey.forEach((group) => {
      axios.post(`http://localhost:5050/groupes/exportGroups`, {
        start_date: settings.start_date,
        end_date: settings.end_date,
        students: columns[group].items.map((student) => ({
          id: student.id,
          firstname: student.firstname,
          lastname: student.lastname,
        })),
        po_id: user?.id,
        course_id: courseChoose,
      });
    });

    try {
      await axios.delete(
        `http://localhost:5050/groupes/deleteRoom/${user?.id}`
      );
    } catch (error) {
      console.error(error);
    }

    setInRoom(false);
    ws.send(
      JSON.stringify({ type: "closeRoom", data: { class: classStudents } })
    );
    navigate("/");
  }

  function randomGeneration() {
    if (!nbSPGrp) {
      alert(
        "Merci de renseigner d'abord le nombre de groupe d'élèves par groupe souhaité"
      );
    } else {
      const numberOfStudents = columns.students.items.length;
      let copiedColContent = { ...columns };
      let numberOfGroups = Math.ceil(numberOfStudents / nbSPGrp);

      for (let index = 1; index <= numberOfGroups; index++) {
        copiedColContent[`g${index}`] = {
          name: `Groupe ${index}`,
          items: [],
        };
      }

      setColumns(copiedColContent);

      var studentsArrayRandom = shuffle(columns.students.items);
      var groups = Object.keys(copiedColContent).filter((key) =>
        key.startsWith("g")
      );
      var students = Object.keys(columns).filter((key) => key.startsWith("s"));
      var groupIndex = 0;

      for (var i = 0; i < studentsArrayRandom.length; i++) {
        const groupKey = groups[groupIndex];
        const student = studentsArrayRandom[i];

        copiedColContent[groupKey].items.push(student);

        groupIndex = (groupIndex + 1) % numberOfGroups;
      }

      copiedColContent[students[0]].items = [];
      setColumns({ ...copiedColContent });
      ws.send(
        JSON.stringify({
          type: "updateCol",
          data: { columns: copiedColContent, class: classStudents },
        })
      );
    }
  }

  function lockGroups() {
    ///TODO: add a toast here
    if (hasLock) {
      setHasLock(false);
      ws.send(
        JSON.stringify({
          type: "lock",
          data: { class: classStudents, lock: false, status: user.status },
        })
      );
    } else {
      setHasLock(true);
      ws.send(
        JSON.stringify({
          type: "lock",
          data: { class: classStudents, lock: true, status: user.status },
        })
      );
    }
  }

  function settingsPopUp() {
    setShowSettings(true);
  }

  function handleChangeFile(event) {
    setFile(event.target.files[0]);
    console.log(event.target.files[0]);
  }

  const handleClickBacklog = (event) => {
    uploadBacklog.current.click();
  };

  if (!columns && inRoom) {
    return <p>Loading...</p>;
  }

  if (user?.status === "po" && !inRoom) {
    return (
      <PopUp onPopupData={handlePopupData} dataPopUp={null} showPopUp={null} />
    );
  }

  return (
    <>
      {inRoom ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {showSettings && user?.status === "po" ? (
            <PopUp
              onPopupData={handlePopupData}
              dataPopUp={settings}
              showPopUp={handleClosePopUp}
            />
          ) : null}
          <nav
            style={{
              backgroundColor: theme.palette.background.container,
            }}
          >
            <p
              style={{
                backgroundColor: theme.palette.custom.button,
                height: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                padding: "0 10px",
                marginRight: "10px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              <GroupIcon
                style={{
                  marginRight: "10px",
                }}
              />{" "}
              {nbUserConnected}/{numberOfStudentsInClass + 1}
            </p>
            {user?.status === "po" ? (
              <div className="groups-inputs">
                <input
                  type="text"
                  list="students-list"
                  placeholder="Eleves/groupes"
                  onChange={generateGroupCase}
                />
                <datalist id="students-list">
                  <option value={3}></option>
                  <option value={4}></option>
                  <option value={5}></option>
                </datalist>
                <Tooltip title="Réinitialiser">
                  <IconButton className="input-button" onClick={resetButton}>
                    <CachedIcon
                      className="icon-svg"
                      style={{
                        fill: theme.palette.text.primary,
                        color: theme.palette.text.primary,
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Aléatoire">
                  <IconButton
                    className="input-button"
                    onClick={randomGeneration}
                  >
                    <CasinoIcon
                      className="icon-svg"
                      style={{
                        fill: theme.palette.text.primary,
                        color: theme.palette.text.primary,
                      }}
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Lock">
                  <IconButton onClick={lockGroups}>
                    {lock ? (
                      <LockOpenIcon
                        className="icon-svg"
                        style={{
                          fill: theme.palette.text.primary,
                          color: theme.palette.text.primary,
                        }}
                      />
                    ) : (
                      <LockIcon
                        className="icon-svg"
                        style={{
                          fill: theme.palette.text.primary,
                          color: theme.palette.text.primary,
                        }}
                      />
                    )}
                  </IconButton>
                </Tooltip>
                <input
                  type="file"
                  className="input-button"
                  style={{ display: "none" }}
                  ref={uploadBacklog}
                  onChange={handleChangeFile}
                  encType="multipart/form-data"
                />
                <Tooltip title="Upload un backlog">
                  <IconButton onClick={handleClickBacklog}>
                    <FileUploadIcon
                      className="icon-svg"
                      style={{
                        fill: theme.palette.text.primary,
                        color: theme.palette.text.primary,
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Changer les paramètres">
                  <IconButton className="input-button" onClick={settingsPopUp}>
                    <SettingsIcon
                      className="icon-svg"
                      style={{
                        fill: theme.palette.text.primary,
                        color: theme.palette.text.primary,
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            ) : (
              <div>
                <p
                  style={{
                    color: theme.palette.text.primary,
                    fontWeight: "bold",
                  }}
                >
                  Nombre d'élèves par groupe :{" "}
                  {nbSPGrp ? nbSPGrp : "En attente.."}
                </p>
              </div>
            )}
          </nav>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              {userCursors
                ? Array.from(userCursors.entries()).map(
                    ([userID, userData]) => {
                      if (userID !== user?.id) {
                        return (
                          <div
                            key={userID}
                            style={{
                              position: "absolute",
                              left: userData.position?.x,
                              top: userData.position?.y,
                              zIndex: 100,
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 50 50"
                              width="30px"
                              height="30px"
                            >
                              <path
                                fill={userData.color}
                                d="M 29.699219 47 C 29.578125 47 29.457031 46.976563 29.339844 46.933594 C 29.089844 46.835938 28.890625 46.644531 28.78125 46.398438 L 22.945313 32.90625 L 15.683594 39.730469 C 15.394531 40.003906 14.96875 40.074219 14.601563 39.917969 C 14.238281 39.761719 14 39.398438 14 39 L 14 6 C 14 5.601563 14.234375 5.242188 14.601563 5.082031 C 14.964844 4.925781 15.390625 4.996094 15.683594 5.269531 L 39.683594 27.667969 C 39.972656 27.9375 40.074219 28.355469 39.945313 28.726563 C 39.816406 29.101563 39.480469 29.363281 39.085938 29.398438 L 28.902344 30.273438 L 35.007813 43.585938 C 35.117188 43.824219 35.128906 44.101563 35.035156 44.351563 C 34.941406 44.601563 34.757813 44.800781 34.515625 44.910156 L 30.113281 46.910156 C 29.980469 46.96875 29.84375 47 29.699219 47 Z"
                              />
                            </svg>

                            <div
                              style={{
                                display: "inline-block",
                                backgroundColor: userData.color,
                                padding: "0px 6px",
                                color: "#fff",
                                fontSize: "12px",
                                borderRadius: "4px",
                                margin: "0px",
                              }}
                            >
                              <p
                                style={{
                                  selection: "none",
                                  fontWeight: "bold",
                                  textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
                                  margin: "0px",
                                }}
                              >
                                {userData.name}
                              </p>
                            </div>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    }
                  )
                : null}
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
              {Object.entries(columns).map(([columnId, column], index) => {
                if (index === 0 && columns.students.items.length > 0) {
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        marginTop: "50px",
                      }}
                      key={columnId}
                    >
                      <div
                        style={{
                          margin: 8,
                          width: "70%",
                          minHeight: 140,
                          maxHeight: 500,
                        }}
                        className="group-div"
                      >
                        <Droppable droppableId={columnId} key={columnId}>
                          {(provided, snapshot) => {
                            return (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{
                                  backgroundColor: snapshot.isDraggingOver
                                    ? theme.palette.custom.selectBackground
                                    : "#6b6b6b",
                                  padding: "0px 50px",
                                  width: "100%",
                                  minHeight: 140,
                                  maxHeight: 500,
                                  overflow: "auto",
                                  height: "auto",
                                  display: "flex",
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                  ...(!lock && {
                                    backgroundColor: "#999999",
                                    opacity: 0.5,
                                    pointerEvents: "none",
                                  }),
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
                                        return (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                              userSelect: "none",
                                              borderRadius: 3,
                                              boxShadow:
                                                "0 0 10px rgba(0, 0, 0, 0.2)",
                                              backgroundColor:
                                                snapshot.isDragging
                                                  ? `red brightness(0.8)`
                                                  : userCursors
                                                  ? userCursors.get(item.id)
                                                      ?.color ||
                                                    theme.palette.custom.button
                                                  : theme.palette.custom.button,
                                              color: "white",
                                              ...provided.draggableProps.style,
                                              margin: "10px",
                                            }}
                                            className="post-it"
                                          >
                                            <p>{item.firstname}</p>
                                            {!userCursors?.get(item.id) ? (
                                              <p className="no-connect-label">
                                                <WifiOffIcon />
                                              </p>
                                            ) : null}
                                            {!userCursors?.get(item.id) &&
                                            user.status === "po" ? (
                                              <p
                                                className="student-cross"
                                                onClick={() =>
                                                  deleteStudent(item.id)
                                                }
                                              >
                                                {" "}
                                                <DeleteIcon />{" "}
                                              </p>
                                            ) : null}
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
                      {!nbSPGrp ? (
                        <p
                          style={{
                            color: "grey",
                            fontSize: "70px",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          Veuillez choisir le nombre d'élèves par groupe
                        </p>
                      ) : null}
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
                                  backgroundColor: snapshot.isDraggingOver
                                    ? theme.palette.custom.selectBackground
                                    : "#6b6b6b",
                                  padding: 4,
                                  width: 250,
                                  minHeight: 140,
                                  maxHeight: 500,
                                  overflow: "auto",
                                  height: "auto",
                                  ...(!lock && {
                                    backgroundColor: "#999999",
                                    opacity: 0.5,
                                    pointerEvents: "none",
                                  }),
                                }}
                                className="group"
                                onClick={() => {
                                  if (columns.students.items.length > 0) {
                                    const student =
                                      columns.students.items.pop();
                                    moveOnClick(columnId, student, columns);
                                    setColumns({ ...columns });
                                    ws.send(
                                      JSON.stringify({
                                        type: "updateCol",
                                        data: {
                                          columns: { ...columns },
                                          class: classStudents,
                                        },
                                      })
                                    );
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
                                              borderRadius: 3,
                                              boxShadow:
                                                "0 0 10px rgba(0, 0, 0, 0.2)",
                                              backgroundColor:
                                                snapshot.isDragging
                                                  ? "red brightness(0.8)"
                                                  : userCursors
                                                  ? userCursors.get(item.id)
                                                      ?.color ||
                                                    theme.palette.custom.button
                                                  : theme.palette.custom.button,
                                              color: "white",
                                              margin: "10px",
                                              ...provided.draggableProps.style,
                                            }}
                                            className="post-it"
                                          >
                                            <p>{item.firstname}</p>
                                            {!userCursors?.get(item.id) ? (
                                              <p className="no-connect-label">
                                                <WifiOffIcon />
                                              </p>
                                            ) : null}

                                            {!userCursors?.get(item.id) &&
                                            user.status === "po" ? (
                                              <p
                                                className="student-cross"
                                                onClick={() =>
                                                  deleteStudent(item.id)
                                                }
                                              >
                                                {" "}
                                                <DeleteIcon />{" "}
                                              </p>
                                            ) : null}
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
                } else {
                  return <span></span>;
                }
              })}
            </DragDropContext>
          </div>
          {user?.status === "po" ? (
            <div
              style={{
                width: "100%",
                textAlign: "center",
                margin: "20px 0px",
              }}
            >
              <Button
                onClick={saveGroups}
                style={{
                  backgroundColor: theme.palette.custom.button,
                  borderRadius: "10px",
                  padding: "5px 10px",
                  color: "white",
                  height: "50px",
                  width: "100px",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                }}
              >
                Valider
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <h1>Pas de Room pour le moment</h1>
      )}
      <ToastContainer></ToastContainer>
    </>
  );
}
export default GroupsCreation;

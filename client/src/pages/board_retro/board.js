import React, {useState, useEffect, useCallback, useMemo} from "react";
import axios from "axios";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import {Button, useTheme, Tooltip, IconButton, TextField} from "@mui/material";
import {PopUp} from "../../components/retro/Popup";
import {toast, ToastContainer} from "react-toastify";
import useFirebase from "../../hooks/useFirebase";
import {w3cwebsocket} from "websocket";
import {useNavigate} from "react-router-dom";

import "./Retro.scss";

const options = {
  autoClose: 2000,
  className: "",
  position: toast.POSITION.BOTTOM_RIGHT,
  theme: "colored",
};

export const toastSuccess = (message) => {
  toast.success(message, options);
};

export const toastWarning = (message) => {
  toast.warning(message, options);
};

export const toastFail = (message) => {
  toast.error(message, options);
};

function GroupsCreation() {
  const [classStudents, setClassStudents] = useState();
  const [showSettings, setShowSettings] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [columns, setColumns] = useState();
  const [courseChoose, setCourseChoose] = useState();
  const [notAllowed, setNotAllowed] = useState(false);
  const [userCursors, setUserCursors] = useState();
  const [nbUserConnected, setNbUserConnected] = useState(1);
  const [showEdit, setShowEdit] = useState(false);
  const [postItId, setPostItId] = useState();

  const navigate = useNavigate();
  const {user} = useFirebase();
  const theme = useTheme();

  const [clickedIds, setClickedIds] = useState([]);

  const handleTextFieldClick = (event) => {
    event.stopPropagation();
  };

  const handleClick = (id) => {
    if (clickedIds.includes(id)) {
      setClickedIds(clickedIds.filter((clickedId) => clickedId !== id));
    } else {
      setClickedIds([...clickedIds, id]);
    }
  };

  const ws = useMemo(() => {
    return new w3cwebsocket(`${process.env.REACT_APP_SERVER_API_WS}/retro`);
  }, []);

  const fetchData = useCallback(async () => {
    const colContent = {
      positive: {
        name: "Positif",
        items: [],
      },
      negative: {
        name: "Négatif",
        items: [],
      },
      improve: {
        name: "Amélioration",
        items: [],
      },
      miss: {
        name: "Manqué",
        items: [],
      },
    };
    return colContent;
  }, []);

  const fetchAndSetData = useCallback(async () => {
    const colContent = await fetchData();
    ws.send(
      JSON.stringify({
        type: "updateCol",
        data: {
          columns: colContent,
          class: classStudents,
        },
      })
    );
    setColumns(colContent);
  }, [classStudents, fetchData, ws]);

  const LogToExistingRoomStudent = useCallback(async () => {
    try {
      axios
        .get(
          `${process.env.REACT_APP_SERVER_API}/retro/getRoom/${user?.class.id}`
        )
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
            setCourseChoose(res.data[0].course);
            fetchAndSetData();
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
        .get(`${process.env.REACT_APP_SERVER_API}/retro/getRoomPo/${user?.id}`)
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
            setCourseChoose(res.data[0].course);
            fetchAndSetData();
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
          if (ws.readyState !== WebSocket.OPEN) return;
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
            },
          };
          ws.send(JSON.stringify(message));
        });

        ws.onmessage = (message) => {
          const messageReceive = JSON.parse(message.data);

          switch (messageReceive.type) {
            case "updateRoom":
              displayUserCursorPositions(messageReceive.data.currentRoom.users);
              if (messageReceive.data.currentRoom.columns) {
                setColumns(messageReceive.data.currentRoom.columns);
              }
              setNbUserConnected(messageReceive.data.currentRoom.nbUsers);
              break;
            case "closeRoom":
              setInRoom(false);
              navigate("/");
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
          data: {userID: user?.id, class: classStudents},
        })
      );
    };
  }, [
    LogToExistingRoomStudent,
    classStudents,
    fetchAndSetData,
    inRoom,
    logToExistingRoom,
    navigate,
    user?.id,
    user.status,
    ws,
  ]);

  useEffect(() => {
    document.addEventListener("click", (event) => {
      if (showEdit) {
        setShowEdit(false);
        setPostItId(null);
      }
    });
  });

  function deletePostIt(postID) {
    const copiedColContent = {...columns};

    Object.keys(copiedColContent).forEach((key) => {
      const group = copiedColContent[key];
      const updatedItems = group.items.filter(
        (student) => student.id !== postID
      );
      group.items = updatedItems;
    });

    setColumns(copiedColContent);
    ws.send(
      JSON.stringify({
        type: "updateCol",
        data: {columns: copiedColContent, class: classStudents},
      })
    );
  }

  function updatePostIt(postID, content) {
    const copiedColContent = {...columns};
    Object.keys(copiedColContent).forEach((key) => {
      const group = copiedColContent[key];
      const updatedItems = group.items.map((item) => {
        if (item.id === postID) {
          return {...item, content};
        }
        return item;
      });
      group.items = updatedItems;
    });
    setColumns(copiedColContent);
    ws.send(
      JSON.stringify({
        type: "updateCol",
        data: {columns: copiedColContent, class: classStudents},
      })
    );
    setShowEdit(false);
  }

  function addPostIt(columnId, columns) {
    const copiedColContent = {...columns};
    const group = copiedColContent[columnId];
    const updatedItems = group.items;
    updatedItems.push({
      id: Date.now().toString(),
      content: "Entrez votre texte ici..",
      color: userCursors?.get(user?.id).color,
      user: user?.id,
      userName: user?.firstname,
    });
    group.items = updatedItems;
    setColumns(copiedColContent);

    const message = {
      type: "updateCol",
      data: {columns: copiedColContent, class: classStudents},
    };
    ws.send(JSON.stringify(message));
  }

  const onDragEnd = (result) => {
    const message = {
      type: "dragEnd",
      data: {
        userID: user?.id,
        class: classStudents,
      },
    };
    ws.send(JSON.stringify(message));
    if (!result.destination) return;
    const {source, destination} = result;
    if (notAllowed) {
      setNotAllowed(false);
      toast.error("Vous ne pouvez pas déplacer ce post-it");
      return;
    }
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
              [source.droppableId]: {...sourceColumn, items: sourceItems},
              [destination.droppableId]: {...destColumn, items: destItems},
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
    }
  };

  const onDragStart = (data) => {
    const item = columns[data.source.droppableId].items[data.source.index];
    if (user.status === "etudiant" && item.user !== user.id) {
      setNotAllowed(true);
      return;
    }
    const message = {
      type: "dragStart",
      data: {userID: user?.id, class: classStudents, itemID: item.id},
    };
    ws.send(JSON.stringify(message));
  };

  const handlePopupData = (data) => {
    setShowSettings(false);
    setInRoom(true);
    setCourseChoose(data.courseChoose);
    setClassStudents(data.courseChoose.data.courseClass.id);
  };

  const handleClosePopUp = (showFalse) => {
    setShowSettings(showFalse);
  };

  async function saveRetro() {
    axios.post(`${process.env.REACT_APP_SERVER_API}/retro/saveRetro`, {
      retro: columns,
      classRetro: classStudents,
      course: courseChoose.id,
      po_id: user.id,
    });

    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_API}/groupes/deleteRoom/${user?.id}`
      );
    } catch (error) {
      console.error(error);
    }

    setInRoom(false);
    ws.send(JSON.stringify({type: "closeRoom", data: {class: classStudents}}));
    navigate("/");
  }

  function settingsPopUp() {
    setShowSettings(true);
  }

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
        <>
          {userCursors
            ? Array.from(userCursors.entries()).map(([userID, userData]) => {
                if (
                  userID !== user?.id &&
                  userID &&
                  userID !== "undefined" &&
                  userData.color
                ) {
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
                        style={{stroke: "#3d3d3d"}}
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
                          padding: "2px 8px",
                          color: "#fff",
                          fontSize: "12px",
                          borderRadius: "30px",
                          margin: "0px",
                          border: "1px solid transparent",
                          boxShadow: "0px 0px 5px #3d3d3d",
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
              })
            : null}
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
            className="retro-container"
          >
            {showSettings && user?.status === "po" ? (
              <PopUp
                onPopupData={handlePopupData}
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
                <GroupIcon style={{marginRight: "10px"}} />
                {nbUserConnected}
              </p>

              {user?.status === "po" ? (
                <div className="groups-inputs">
                  <Tooltip title="Changer les paramètres">
                    <IconButton
                      className="input-button"
                      onClick={settingsPopUp}
                    >
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
              ) : null}
            </nav>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                {Object.entries(columns).map(([columnId, column], index) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "45%",
                        margin: "10px",
                      }}
                      key={columnId}
                    >
                      {" "}
                      <h2>{column.name}</h2>
                      <div
                        style={{
                          margin: 8,
                          width: "100%",
                          height: "100%",
                          minHeight: "40vh",
                        }}
                      >
                        <Droppable droppableId={columnId} key={columnId}>
                          {(provided, snapshot) => {
                            return (
                              <div
                                id="post-its"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{
                                  backgroundColor: snapshot.isDraggingOver
                                    ? theme.palette.custom.selectBackground
                                    : theme.palette.background.paper,
                                  padding: 4,
                                  width: "100%",
                                  minHeight: 140,
                                  height: "100%",
                                  overflow: "auto",
                                }}
                                className="group"
                                onClick={() => {
                                  addPostIt(columnId, columns);
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
                                            id="post-it-container"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                              userSelect: "none",
                                              borderRadius: 3,
                                              color: "black",
                                              margin: "10px",
                                              width: "150px",
                                              height: "150px",
                                              ...(userCursors?.get(item.user)
                                                ?.isDragging &&
                                                item.user !== user?.id &&
                                                userCursors?.get(item.user)
                                                  ?.itemID === item.id && {
                                                  position: "absolute",
                                                  left: userCursors?.get(
                                                    item.user
                                                  ).position?.x,
                                                  top: userCursors?.get(
                                                    item.user
                                                  ).position?.y,
                                                }),
                                              ...provided.draggableProps.style,
                                            }}
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              handleClick(item.id);
                                              if (item.user === user.id) {
                                                setShowEdit(true);
                                                setPostItId(item.id);
                                              }
                                            }}
                                            className={
                                              clickedIds.includes(item.id)
                                                ? "post-it clicked"
                                                : "post-it"
                                            }
                                          >
                                            {showEdit &&
                                            item.id === postItId ? (
                                              <div
                                                id="post-it-card"
                                                class="shadow"
                                              >
                                                <div class="front face">
                                                  <div class="strategy">
                                                    {item.userNam}
                                                  </div>
                                                </div>
                                                <div class="back face center">
                                                  <TextField
                                                    onClick={
                                                      handleTextFieldClick
                                                    }
                                                    sx={{ color: "black" }}
                                                    onKeyDown={(event) => {
                                                      if (
                                                        event.key === "Enter"
                                                      ) {
                                                        event.preventDefault();
                                                        updatePostIt(
                                                          item.id,
                                                          event.target.value
                                                        );
                                                      }
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                            ) : (
                                              <div
                                                id="post-it-card"
                                                class="shadow"
                                              >
                                                <div class="front face">
                                                  <div class="strategy">
                                                    {item.user.split(".")[0]}
                                                  </div>
                                                </div>
                                                <div class="back face center">
                                                  <p>{item.content}</p>
                                                </div>
                                              </div>
                                            )}

                                            {!userCursors?.get(item.id) &&
                                            item.user === user.id ? (
                                              <p
                                                className="student-cross"
                                                onClick={(event) => {
                                                  event.stopPropagation();
                                                  deletePostIt(item.id);
                                                }}
                                              >
                                                <DeleteIcon />
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
                  onClick={saveRetro}
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
        </>
      ) : (
        <h1>Pas de Room pour le moment</h1>
      )}
      <ToastContainer></ToastContainer>
    </>
  );
}
export default GroupsCreation;

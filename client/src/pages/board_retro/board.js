import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CreateIcon from "@mui/icons-material/Create";
import DialogTitle from "@mui/material/DialogTitle";
import {
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  selectClasses,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PostIt from "../../components/retro/PostIt";
import { PopUp } from "../../components/retro/Popup";
import { w3cwebsocket } from "websocket";
import useFirebase from "../../hooks/useFirebase";
import { json, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { set } from "date-fns";
import { useLocation } from "react-router-dom";

export default function Board() {
  const [openPostItEdit, setOpenPostItEdit] = useState(false);
  const [postItText, setPostItText] = useState("");
  const [categorie, setCategorie] = useState("");
  const [selectedPostItIndex, setSelectedPostItIndex] = useState();
  const [showTextField, setShowTextField] = useState(false);
  const [newPostItContent, setNewPostItContent] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [connectedUsersList, setConnectedUsersList] = useState({});

  const [userCursors, setUserCursors] = useState();

  const [columns, setColumns] = useState();
  const [inRoom, setInRoom] = useState(false);
  const [classStudents, setClassStudents] = useState();
  const [roomData, setRoomData] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [courseChoose, setCourseChoose] = useState();

  const { user } = useFirebase();
  const theme = useTheme();
  const navigate = useNavigate();

  const ws = useMemo(() => {
    return new w3cwebsocket("ws://localhost:5050/retro");
  }, []);

  function displayUserCursorPositions(users) {
    const map = new Map(Object.entries(users));
    setUserCursors(map);
  }

  const LogToExistingRoomStudent = useCallback(async () => {
    try {
      axios
        .get(`http://localhost:5050/retro/getRoom/${user?.class.id}`)
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
        .get(`http://localhost:5050/retro/getRoomPo/${user?.id}`)
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
          }
        });
    } catch (error) {
      console.error(error);
    }
  }, [user?.id, user?.firstname, ws]);

  useEffect(() => {
    const GMDBoard = {
      Glad: {
        name: "Glad",
        color: "#ff0000",
        params: "1 / 1 / 3 / 3",
        items: [],
      },
      Mad: {
        name: "Mad",
        color: "#0000ff",
        params: "1 / 3 / 3 / 5",
        items: [],
      },
      Sad: {
        name: "Sad",
        color: "#9ACD32",
        params: "3 / 1 / 5 / 3",
        items: [],
      },
    };

    setColumns(GMDBoard);
    const handleOpen = async () => {
      if (user?.status === "etudiant") {
        await LogToExistingRoomStudent();
      } else if (user?.status === "po") {
        await logToExistingRoom();
      }

      if (inRoom) {
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
              if (user.status === "etudiant") {
                console.log(messageReceive.data.currentRoom);
              }
              if (messageReceive.data.currentRoom.columns) {
                setColumns(messageReceive.data.currentRoom.columns);
              }
              setConnectedUsers(messageReceive.data.currentRoom.users);
              break;
            case "closeRoom":
              setInRoom(false);
              navigate("/");
              ws.close();
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
    inRoom,
    logToExistingRoom,
    navigate,
    user?.id,
    user.status,
    ws,
  ]);

  const PNABoard = {
    Positif: {
      name: "Positif",
      color: "#ff0000",
      params: "1 / 1 / 3 / 3",
      items: [],
    },
    Negatif: {
      name: "Négatif",
      color: "#0000ff",
      params: "1 / 3 / 3 / 5",
      items: [],
    },
    Axe: {
      name: "Axe d'amélioration",
      color: "#9ACD32",
      params: "3 / 1 / 5 / 3",
      items: [],
    },
  };

  const FourLBoard = {
    Liked: {
      name: "Liked",
      color: "#ff0000",
      params: "1 / 1 / 3 / 3",
      items: [],
    },
    Learned: {
      name: "Learned",
      color: "#0000ff",
      params: "1 / 3 / 3 / 5",
      items: [],
    },
    Lacked: {
      name: "Lacked",
      color: "#9ACD32",
      params: "3 / 1 / 5 / 3",
      items: [],
    },
    Longed: {
      name: "Longed",
      color: "#FFFF00",
      params: "3 / 3 / 5 / 5",
      items: [],
    },
  };

  const deletePostit = async (item) => {
    const copiedColContent = { ...columns };

    Object.keys(copiedColContent).forEach((key) => {
      const group = copiedColContent[key];
      const updatedItems = group.items.filter(
        (student) => student.id !== item.id
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
  };

  const handleClickOpenEditPostIt = () => {
    setOpenPostItEdit(true);
  };

  const handleChange = (event) => {
    setNewPostItContent(event.target.value);
  };

  const handleCloseEditPostIt = () => {
    setOpenPostItEdit(false);
  };

  const changePostiTText = () => {
    let selectedColumn = { ...columns };
    selectedColumn[categorie]["items"][selectedPostItIndex]["content"] =
      postItText;
    setColumns(selectedColumn);
    const message = {
      type: "updateCol",
      data: {
        columns: selectedColumn,
        class: roomData["class"], //classStudents
      },
    };
    ws.send(JSON.stringify(message));
    handleCloseEditPostIt();
  };

  const addPostIt = (columnId) => {
    const newPostIt = {
      id: `postIt-${Date.now()}`,
      content: newPostItContent,
    };

    // Add the new PostIt to the specific column
    const updatedItems = [...columns[columnId].items, newPostIt];
    const updatedColumn = {
      ...columns[columnId],
      items: updatedItems,
    };

    setColumns({
      ...columns,
      [columnId]: updatedColumn,
    });
    const message = {
      type: "updateCol",
      data: {
        columns: {
          ...columns,
          [columnId]: updatedColumn,
        },
        class: roomData["class"],
      },
    };
    console.log(message);
    ws.send(JSON.stringify(message));

    console.log(columnId);

    setShowTextField(false); // Hide the TextField and button after adding the post-it
    setNewPostItContent(""); // Reset the new post-it content
  };

  const onDragEnd = (result, columns) => {
    if (!result.destination) return;

    const source = result.source;
    const destination = result.destination;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    console.log(source);
    console.log(destination);

    if (source.droppableId !== destination.droppableId) {
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

      const message = {
        type: "updateCol",
        data: {
          columns: {
            ...columns,
            [source.droppableId]: {
              ...sourceColumn,
              items: sourceItems,
            },
            [destination.droppableId]: {
              ...destColumn,
              items: destItems,
            },
          },
          class: roomData["class"], //classStudents
        },
      };
      ws.send(JSON.stringify(message));
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

      const message = {
        type: "updateCol",
        data: {
          columns: {
            ...columns,
            [source.droppableId]: {
              ...sourceColumn,
              items: copiedItems,
            },
          },
          class: roomData["class"],
        },
      };
      ws.send(JSON.stringify(message));
    }
  };

  const handleClickAddButton = (columnId) => {
    setSelectedColumnId(columnId);
    setShowTextField(true);
  };

  const cancelClick = () => {
    setShowTextField(false);
  };

  const updateCol = () => {
    const message = {
      type: "updateCol",
      data: {
        userID: user?.id,
        columns: columns,
        class: roomData["class"],
      },
    };

    ws.send(JSON.stringify(message));
  };

  const setRightPostItCategorie = (obj, i) => {
    if (obj["name"]) {
      setCategorie(obj["name"]);
    }
    handleClickOpenEditPostIt();
    setSelectedPostItIndex(i);
  };

  const handleDeleteRoom = async () => {
    const message = {
      type: "closeRoom",
      data: {
        class: classStudents, // Pass the class name of the room to delete
      },
    };
    ws.send(JSON.stringify(message));
    ws.close();

    // Save retro here
    try {
      await axios.delete(`http://localhost:5050/retro/deleteRoom/${user?.id}`);
    } catch (error) {
      console.error(error);
    }

    navigate("/ ");
  };

  const handlePopupData = (data) => {
    setShowSettings(false);
    setInRoom(true);
    console.log("He ?");
    setCourseChoose(data.courseChoose);
    setClassStudents(data.courseChoose.data.courseClass.id);
  };

  if (user?.status === "po" && !inRoom) {
    return (
      <PopUp onPopupData={handlePopupData} dataPopUp={null} showPopUp={null} />
    );
  }

  return (
    <>
      {inRoom ? (
        <div>
          <div>
            <Dialog
              open={openPostItEdit}
              onClose={handleCloseEditPostIt}
              fullWidth={true}
              maxWidth={"sm"}
            >
              <DialogTitle>Post it</DialogTitle>
              <DialogContent>
                <TextField
                  placeholder="Veuillez écrire votre texte ici"
                  fullWidth
                  onChange={(e) => setPostItText(e.target.value)}
                ></TextField>
              </DialogContent>
              <DialogActions>
                <Button onClick={changePostiTText}>Modifier</Button>
                <Button onClick={handleCloseEditPostIt}>Annuler</Button>
              </DialogActions>
            </Dialog>
          </div>

          <div
            className="parent"
            id="pdf-content"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "repeat(4, 1fr)",
              gridColumnGap: "10px",
              gridRowGap: "10px",
              height: "90vh",
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
            {connectedUsersList ? (
              <div>
                <h4> Présents :</h4>

                {Object.entries(connectedUsersList).map(
                  ([email, userInfo]) => (
                    console.log("**********************"),
                    console.log(email),
                    console.log("**********************"),
                    console.log(userInfo),
                    console.log("$$$$$$$$$$$$$$$$$$$$$$$"),
                    (
                      <p key={email}>
                        {email["name"]}/{userInfo["name"]}
                      </p>
                    )
                  )
                )}
              </div>
            ) : null}
            <DragDropContext onDragEnd={(result) => onDragEnd(result, columns)}>
              {Object.entries(columns).map(([columnId, column]) => {
                return (
                  <div
                    style={{
                      backgroundColor: column.color,
                      height: "100%",
                      gridArea: column.params,
                      padding: "10px",
                      borderRadius: "4%",
                    }}
                    key={columnId}
                  >
                    <div
                      style={{
                        padding: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                        borderRadius: "4%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          marginLeft: "5%",
                        }}
                      >
                        {column.name}
                      </Typography>
                      <IconButton
                        aria-label="Add"
                        color="primary"
                        size="small"
                        style={{ marginLeft: "auto" }}
                        onClick={() => handleClickAddButton(columnId)}
                      >
                        <AddIcon />
                      </IconButton>
                    </div>

                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              display: "flex",
                              background: "#00000030",
                              minHeight: 30,
                              maxHeight: "90%",
                              overflow: "auto",
                              height: "auto",
                              borderRadius: "4%",
                              flexWrap: "wrap",
                            }}
                          >
                            {selectedColumnId === columnId && showTextField ? (
                              <div className="empathy-post-it empathy-post-it--custom">
                                <TextField
                                  variant="outlined"
                                  autoFocus
                                  value={newPostItContent}
                                  onChange={handleChange}
                                  style={{ marginRight: "10px" }}
                                  InputProps={{
                                    style: {
                                      color: "#130d6b",
                                      fontFamily: "Permanent Marker, cursive",
                                    },
                                  }}
                                  placeholder="Saisissez un titre pour cette carte…"
                                />
                                <IconButton
                                  aria-label="Add"
                                  color="success"
                                  size="small"
                                  disabled={!newPostItContent}
                                  onClick={() => addPostIt(columnId)}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                                <IconButton
                                  aria-label="Cancel"
                                  color="error"
                                  size="small"
                                  onClick={cancelClick}
                                >
                                  <CancelIcon />
                                </IconButton>
                              </div>
                            ) : (
                              <></>
                            )}
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
                                      >
                                        <div className="empathy-post-it">
                                          {item.content}
                                          <IconButton
                                            style={{
                                              position: "absolute",
                                              top: 0,
                                              right: 0,
                                              color: "red",
                                            }}
                                            aria-label="delete"
                                            onClick={() => deletePostit(item)}
                                            size="small"
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                          <IconButton
                                            style={{
                                              position: "absolute",
                                              bottom: 0,
                                              right: 0,
                                              color: "black",
                                            }}
                                            aria-label="Edit"
                                            onClick={() =>
                                              setRightPostItCategorie(
                                                column,
                                                index
                                              )
                                            }
                                            size="small"
                                          >
                                            <CreateIcon />
                                          </IconButton>
                                        </div>
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
                );
              })}
            </DragDropContext>
          </div>
          {user.status === "po" ? (
            <Button variant="contained" onClick={handleDeleteRoom}>
              Terminer la Retro & Sauvegarder
            </Button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

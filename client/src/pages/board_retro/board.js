import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField, Typography } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PostIt from "../../components/agile/PostIt";
import { useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';



export default function Board() {

  const [openPostItEdit, setOpenPostItEdit] = useState(false);
  const [postItText, setPostItText] = useState("");
  const [categorie, setCategorie] = useState("")
  const [selectedPostItIndex, setSelectedPostItIndex] = useState();
  const [showTextField, setShowTextField] = useState(false);
  const [newPostItContent, setNewPostItContent] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [selectedRetro, setSelectedRetro] = useState('');
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [currentRetroIndex, setCurrentRetroIndex] = useState(null)



  const location = useLocation();
  const retroData = location.state && location.state.retro;
  const [columns, setColumns] = useState([]);

  useEffect(() => {

    setColumns(retroData["dataRetro"])
    console.log(columns);

  },[])


  console.log("$$$$$$$$$");
  console.log(retroData);
  console.log("$$$$$$$$$");
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
    }
  };

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
    }
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
    }
  };


  const handleClickOpenEditPostIt = () => {
    setOpenPostItEdit(true)
  };

  const handleChange = (event) => {
    setNewPostItContent(event.target.value);
  };

  const handleCloseEditPostIt = () => {
    setOpenPostItEdit(false);
  };

  const sendAddedPostIt = async (newObjPostIt, columnId) => {
    axios.post("http://localhost:5050/retro/addPostIt", {
      newObjPostIt : newObjPostIt,
      columnId : columnId,
      //currentRetroIndex: currentRetroIndex
    })
  }

  const sendEditPostit = async (categorie,selectedPostItIndex,postItText) => {
    console.log(currentRetroIndex);
    await axios.put("http://localhost:5050/retro/editPostit", {
      categorie : categorie,
      selectedPostItIndex: selectedPostItIndex,
      postItText: postItText,
   //   currentRetroIndex: currentRetroIndex
    })
  }


  const sendMovePostIt = async (source, destination) => {
    axios.put("http://localhost:5050/retro/movePostIt", {
      source: source,
      destination: destination,
   //  currentRetroIndex: currentRetroIndex
    })
  } 




  const changePostiTText = () => {
    let selectedColumn = { ...columns }

    selectedColumn[categorie]["items"][selectedPostItIndex]["content"] = postItText

    sendEditPostit(categorie,selectedPostItIndex,postItText);

    setColumns(selectedColumn)


    handleCloseEditPostIt();
  }


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

    console.log(columnId);
    sendAddedPostIt(newPostIt, columnId);

    setShowTextField(false); // Hide the TextField and button after adding the post-it
    setNewPostItContent(""); // Reset the new post-it content

    console.log(columns);
  };



  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;

    const source = result.source;
    const destination = result.destination;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    console.log(source);
    console.log(destination);

    sendMovePostIt(source, destination)
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

  const handleClickAddButton = (columnId) => {
    setSelectedColumnId(columnId);
    setShowTextField(true);
  };

  const cancelClick = () => {
    setShowTextField(false);
  };

  
  const setRightPostItCategorie = (obj, i) => {

    if (obj["name"] == "Glad") {
      setCategorie("Glad")
    } else if (obj["name"] == "Mad") {
      setCategorie("Mad")
    } else if (obj["name"] == "Sad") {
      setCategorie("Sad")
    } else if (obj["name"] == "Positif") {
      setCategorie("Positif")
    } else if (obj["name"] == "Négatif") {
      setCategorie("Negatif")
    } else if (obj["name"] == "Axe d'amélioration") {
      setCategorie("Axe")
    } else if (obj["name"] == "Liked") {
      setCategorie("Liked")
    } else if (obj["name"] == "Learned") {
      setCategorie("Learned")
    } else if (obj["name"] == "Longed") {
      setCategorie("Longed")
    } else if (obj["name"] == "Lacked") {
      setCategorie("Lacked")
    }
    handleClickOpenEditPostIt();
    setSelectedPostItIndex(i)
  }

    return (

        (
            <>
             <div>
            <Dialog
              open={openPostItEdit}
              onClose={handleCloseEditPostIt}
              fullWidth={true}
              maxWidth={"sm"}
            >
              <DialogTitle>Post it</DialogTitle>
              <DialogContent>
                <TextField placeholder="Veuillez écrire votre texte ici"
                  fullWidth
                  onChange={(e) => setPostItText(e.target.value)}
                ></TextField>
              </DialogContent>
              <DialogActions>
                <Button onClick={changePostiTText} >Modifier</Button>
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
    
            <DragDropContext
              onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
            >
              {Object.entries(columns).map(([columnId, column]) => {
                return (
                  <div
                    style={{
                      backgroundColor: column.color,
                      height: "100%",
                      gridArea: column.params,
                      padding: "10px",
                      borderRadius: "4%",
                      height: "100%",
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
                                        onClick={() => setRightPostItCategorie(column, index)}
                                      >
                                        <PostIt text={item.content} />
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
            </>
           )

    )


}
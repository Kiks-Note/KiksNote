import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import PostIt from "../../components/agile/PostIt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Retrospective() {

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



  const [open, setOpen] = useState(false);
  const [openPostItEdit, setOpenPostItEdit] = useState(false);
  const [postItText, setPostItText] = useState("");
  const [categorie, setCategorie] = useState("")
  const [selectedPostItIndex, setSelectedPostItIndex] = useState();
  const [retroModel, setRetroModel] = useState('Model de retro')
  const [message, setMessage] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [columns, setColumns] = useState(null);
  const [showTextField, setShowTextField] = useState(false);
  const [newPostItContent, setNewPostItContent] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState(null);


  const handleClickAddButton = (columnId) => {
    setSelectedColumnId(columnId);
    setShowTextField(true);
  };
  const cancelClick = () => {
    setShowTextField(false);
  };

  const changePostiTText = () => {
    let selectedColumn = { ...columns }


    console.log(selectedColumn);

    selectedColumn[categorie]["items"][selectedPostItIndex]["content"] = postItText
    setColumns(selectedColumn)

    handleCloseEditPostIt();

  }
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

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;

    const source = result.source;
    const destination = result.destination;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

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

    setShowTextField(false); // Hide the TextField and button after adding the post-it
    setNewPostItContent(""); // Reset the new post-it content
  };


  const handleChange = (event) => {
    setNewPostItContent(event.target.value);
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpenEditPostIt = () => {
    setOpenPostItEdit(true)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseEditPostIt = () => {
    setOpenPostItEdit(false);
  };


  const handleValidate = (e) => {
    let value = e.target.value;
    if (value == "GMDBoard") {
      setColumns(GMDBoard)
    } else if (value == "fourLBoard") {
      setColumns(FourLBoard)
    } else if (value == "PNABoard") {
      setColumns(PNABoard)
    }
    setRetroModel(e.target.value)
    setOpen(false);

  }

  let board;
  if (retroModel !== "Model de retro") {
    board = <p> Hey Im {retroModel} </p>;
  } else {
    board = <p>Didn't change</p>;
  }

  return (
    <div>
      <h2> Retrospective </h2>

      <div>
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          sx={{ marginRight: 1 }}
        >
          Créer une rétrospective
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth={"sm"}
        >
          <DialogTitle>Créer une nouvelle retrospective</DialogTitle>
          <DialogContent>
            <InputLabel id="demo-simple-select-label">Type de representation</InputLabel>
            <Select
              labelId="model-retro-select-label"
              id="model-retro-select"
              value={retroModel}
              label="model de retro"
              onChange={handleValidate}
            >
              <MenuItem value="GMDBoard">Glad, Mad, Sad</MenuItem>
              <MenuItem value="fourLBoard">4L</MenuItem>
              <MenuItem value="PNABoard">Positif, Negatif, Axe d'amélioration</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
          </DialogActions>
        </Dialog>
      </div>
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
      <div>
        {board}
      </div>

      {columns !== null ? (<div
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
                                // const [textPostIt , settextPostIt] = item.content;
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
      </div>) : (<></>)}


    </div>
  );
}

export default Retrospective;

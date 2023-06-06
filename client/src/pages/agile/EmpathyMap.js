import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import PostIt from "../../components/agile/PostIt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import { w3cwebsocket } from "websocket";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import html2pdf from "html2pdf.js";
import "../../components/agile/Postit.scss";
import { Rings } from "react-loader-spinner";
import { Toaster, toast } from "react-hot-toast";

export default function EmpathyMap({ dashboardId, actorId }) {
  const [columns, setColumns] = useState([]);
  const [showTextField, setShowTextField] = useState(false);
  const [newPostItContent, setNewPostItContent] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const wsComments = new w3cwebsocket(`ws://localhost:5050/empathy`);
    wsComments.onopen = function (e) {
      wsComments.send(
        JSON.stringify({ dashboardId: dashboardId, actorId: actorId })
      );
    };
    wsComments.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        setColumns(data.empathy_map);
        console.log(data.empathy_map);
        setLoading(false);
      } catch (error) {
        setLoading(true);
        console.error(error);
      }
    };
  }, []);

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;

    const source = result.source;
    const destination = result.destination;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceId = result.source.droppableId;
    const destinationId = result.destination.droppableId;

    if (sourceId === destinationId) {
      const copiedItems = [...sourceColumn.items];
      const [removed] = copiedItems.splice(source.index, 1);
      const destItems = [...destColumn.items];
      copiedItems.splice(destination.index, 0, removed);
      changeCardIndex({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: copiedItems,
        },
      });
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: copiedItems,
        },
      });
    } else {
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      changeCardIndex({
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
    }
  };
  const addPostIt = (columnId) => {
    axios.put(
      "http://localhost:5050/agile/" +
        dashboardId +
        "/empathy/" +
        actorId +
        "/column/" +
        columnId +
        "/addPostit",
      {
        content: newPostItContent,
      }
    );
    setShowTextField(false); // Hide the TextField and button after adding the post-it
    setNewPostItContent(""); // Reset the new post-it content
  };
  async function changeCardIndex(newColumns) {
    await axios.put(
      "http://localhost:5050/agile/" +
        dashboardId +
        "/empathy/" +
        actorId +
        "/setPostit",
      newColumns
    );
  }
  const handleChange = (event) => {
    setNewPostItContent(event.target.value);
  };

  const handleClickAddButton = (columnId) => {
    setSelectedColumnId(columnId);
    setShowTextField(true);
  };
  const cancelClick = () => {
    setShowTextField(false);
  };

  const exportToPDF = () => {
    const element = document.getElementById("pdf-content");
    const opt = {
      margin: [0, 0, 0, 0],
      filename: "empathy-map.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    //html2pdf().set(opt).from(element).save();

    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        return pdf.output("arraybuffer");
      })
      .then((buffer) => {
        const formData = new FormData();
        formData.append(
          "pdfFile",
          new Blob([buffer], { type: "application/pdf" }),
          "empathy-map.pdf"
        );
        formData.append("fieldName", "empathy_map");

        return axios.post(
          "http://localhost:5050/agile/" + dashboardId + "/folder",
          formData
        );
      })
      .then((response) => {
        toast.success("Votre empathy a été ajouté a votre dossier agile", {
          duration: 5000,
        });
      })
      .catch((error) => {
        toast.error(
          "Une erreur s'est produite veuillez réessayer ultérieurement",
          {
            duration: 5000,
          }
        );
      });
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Rings
            height="200"
            width="200"
            color="#00BFFF"
            radius="6"
            wrapperStyle={{}}
            wrapperClass="loader"
            visible={true}
            ariaLabel="rings-loading"
          />
        </div>
      ) : (
        <div style={{ margin: 2 }}>
          <Button variant="contained" onClick={exportToPDF}>
            Exporter mon EmpathyMap
          </Button>
          <Toaster />
          <div
            className="parent"
            id="pdf-content"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridColumnGap: "10px",
              gridRowGap: "10px",
              margin: "40px",
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
                      height: "800px",
                      padding: "10px",
                      borderRadius: "4%",
                      "max-height": "1000px",
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
                              "max-height": "700px",
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
                                        <PostIt
                                          text={item.content}
                                          dashboardId={dashboardId}
                                          actorId={actorId}
                                          columnId={columnId}
                                          postitId={item.id}
                                        />
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
        </div>
      )}
    </>
  );
}

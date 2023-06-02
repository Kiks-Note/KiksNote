import React, { useState } from "react";
import Button from "@mui/material/Button";
import { TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import PostIt from "../../components/agile/PostIt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import html2pdf from "html2pdf.js";
import "../../components/agile/Postit.scss";
const taskStatus = {
  think: {
    name: "Penser et ressentir",
    color: "#ff0000",
    items: [],
  },
  see: {
    name: "Voir",
    color: "#0000ff",
    items: [],
  },
  do: {
    name: "Dire et faire",
    color: "#9ACD32",
    items: [],
  },
  hear: {
    name: "Entendre",
    color: "#FFFF00",
    items: [],
  },
};
export default function EmpathyMap() {
  const [columns, setColumns] = useState(taskStatus);
  const [showTextField, setShowTextField] = useState(false);
  const [newPostItContent, setNewPostItContent] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState(null);

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
      margin: [0, 0, 0, 0], // Marge du document PDF
      filename: "empathy-map.pdf", // Nom du fichier PDF résultant
      image: { type: "jpeg", quality: 0.98 }, // Type d'image et qualité
      html2canvas: { scale: 2 }, // Échelle pour améliorer la qualité de l'image
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }, // Format et orientation du document PDF
    };

    html2pdf().set(opt).from(element).save();

    // html2pdf()
    //   .set(opt)
    //   .from(element)
    //   .toPdf()
    //   .get("pdf")
    //   .then((pdf) => {
    //     // Convertir le PDF en ArrayBuffer
    //     return pdf.output("arraybuffer");
    //   })
    //   .then((buffer) => {
    //     // Envoyer le fichier PDF vers votre endpoint
    //     const formData = new FormData();
    //     formData.append(
    //       "pdfFile",
    //       new Blob([buffer], { type: "application/pdf" }),
    //       "empathy-map.pdf"
    //     );

    //     return axios.post("URL_DE_VOTRE_ENDPOINT", formData);
    //   })
    //   .then((response) => {
    //     // Gérer la réponse de l'endpoint, par exemple afficher un message de réussite
    //     console.log("PDF envoyé avec succès !");
    //   })
    //   .catch((error) => {
    //     // Gérer les erreurs, par exemple afficher un message d'erreur
    //     console.error("Erreur lors de l'envoi du PDF :", error);
    //   });
  };

  return (
    <>
      <div style={{ margin: 2 }}>
        <Typography variant="h6">Empathy Map de Adrien</Typography>
        <Button variant="contained" onClick={exportToPDF}>
          Exporter mon EmpathyMap
        </Button>
        <div
          className="parent"
          id="pdf-content"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(4, 1fr)",
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
                    height: "100%",
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
      </div>
    </>
  );
}

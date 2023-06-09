import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, {useEffect, useRef, useState} from "react";
import {Toaster, toast} from "react-hot-toast";
import {useParams} from "react-router-dom";
import BasicModal from "../../components/inventory/BasicModal";
import GridData from "../../components/inventory/GridData";
import timeConverter from "../../functions/TimeConverter";
import useFirebase from "../../hooks/useFirebase";
import {w3cwebsocket} from "websocket";

const ChatBox = ({sender, message}) => {
  const {user} = useFirebase();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: 8,
        backgroundColor: message.userId !== user.id ? "#1E4675" : "#fff",
        maxWidth: "80%",
        borderRadius: 8,
        alignSelf: message.userId === user.id ? "flex-end" : "flex-start",
      }}
    >
      <Typography
        sx={{
          fontFamily: "poppins-regular",
          fontSize: 14,
          color: "grey",
          alignSelf: "flex-start",
          marginTop: 2,
          marginLeft: 2,
          maxWidth: "80%",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {message.userId}
      </Typography>
      <Typography
        sx={{
          fontFamily: "poppins-regular",
          fontSize: 14,
          color: message.userId !== user.id ? "#fff" : "#000",
          alignSelf: "flex-start",
          padding: 2,

          wordBreak: "break-word",
          alignSelf: message.userId !== user.id ? "flex-end" : "flex-start",
        }}
      >
        {message.comment}
      </Typography>
    </div>
  );
};

const CommentModal = ({open, setOpen, ideaId, messages, setComments}) => {
  const [comment, setComment] = useState("");
  const {user} = useFirebase();
  const bottomRef = useRef();

  const handleClose = () => {
    setOpen(false);
    setComments([]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  const handleSend = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_API}/inventory/ideas/comment/${ideaId}`,
        {comment, userId: user.id}
      );
      toast.success("Commentaire envoyé");
      setComment("");
      // setOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'envoi");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          backgroundColor: "#1E4675",
          textAlign: "center",
          minWidth: 600,
        }}
      >
        <Typography
          sx={{
            fontFamily: "poppins-bold",
            fontSize: 20,
            color: "#fff",
            alignSelf: "center",
          }}
        >
          Ecrire un commentaire
        </Typography>
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          {messages.map((message) => (
            <ChatBox sender={message.sender} message={message} />
          ))}
          <div ref={bottomRef} />
        </div>
        <TextField
          autoFocus
          margin="dense"
          id="comment"
          label="Commentaire"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          inputProps={{
            maxLength: 500,
            style: {
              fontFamily: "poppins-regular",
              minHeight: 40,
              fontSize: 16,
            },
          }}
          sx={{
            minHeight: 40,
            fontFamily: "poppins-regular",
            marginTop: 4,
            fontSize: 16,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          <Typography
            sx={{
              fontFamily: "poppins-regular",
              fontSize: 16,
              color: "#fff",
              textTransform: "none",
            }}
          >
            Annuler
          </Typography>
        </Button>
        <Button onClick={() => handleSend()}>
          <Typography
            sx={{
              fontFamily: "poppins-regular",
              fontSize: 16,
              color: "#fff",
              textTransform: "none",
            }}
          >
            Envoyer
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const InventoryIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalType, setModalType] = useState("");
  const [modalCommentOpen, setModalCommentOpen] = useState(false);
  const [clickedIdeaId, setClickedIdeaId] = useState("");
  const [comments, setComments] = useState([]);

  const params = useParams();

  useEffect(() => {
    loading &&
      (async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_API}/inventory/ideas`
          );

          if (params.status === "treated") {
            setIdeas(
              response.data.filter((idea) =>
                ["accepted", "refused"].includes(idea.status)
              )
            );
          } else if (params.status === "pending") {
            setIdeas(response.data.filter((idea) => idea.status === "pending"));
          } else {
            setIdeas(
              response.data.sort((a, b) => {
                if (a.status === "pending" && b.status !== "pending") {
                  return -1; // a comes before b
                } else if (a.status !== "pending" && b.status === "pending") {
                  return 1; // a comes after b
                } else if (a.status === "accepted" && b.status === "refused") {
                  return -1; // a comes before b
                } else if (a.status === "refused" && b.status === "accepted") {
                  return 1; // a comes after b
                }
                return 0; // a and b are equal in terms of sorting
              })
            );
          }

          setLoading(false);
        } catch (error) {
          toast.error("Erreur lors du chargement");
          console.error(error);
        }
      })();
  }, [loading]);

  const handleAccept = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_API}/inventory/ideas/${id}/accept`
      );
      toast.success("Idée acceptée");
      setLoading(true);
    } catch (error) {
      toast.error("Erreur lors de l'acceptation");
      console.error(error);
    }
  };

  const handleRefuse = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_API}/inventory/ideas/${id}/refuse`
      );
      toast.success("Idée refusée");
      setLoading(true);
    } catch (error) {
      toast.error("Erreur lors du refus");
      console.error(error);
    }
  };

  const loadComments = async (value) => {
    const ws = new w3cwebsocket(
      `${process.env.REACT_APP_SERVER_API_WS}/getIdeaComments`
    );

    ws.onopen = () => {
      const message = JSON.stringify({value}); // Convert the value to JSON string
      ws.send(message); // Send the message to the server
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setComments(message);
      console.log(message);
    };
  };

  const renderCells = (value, skeletonWidth = 100) => {
    return (
      <>
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rounded"
            sx={{width: skeletonWidth}}
          />
        ) : (
          <Typography
            sx={{
              fontFamily: "poppins-regular",
              fontSize: 14,
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {value}
          </Typography>
        )}
      </>
    );
  };

  const renderCellUrlButton = (value, skeletonWidth = 100) => {
    return (
      <>
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rounded"
            sx={{width: skeletonWidth}}
          />
        ) : (
          <Button
            sx={{
              backgroundColor: "#1E4675",
              fontFamily: "poppins-regular",
              fontSize: 14,
              color: "#fff",

              "&:hover": {
                backgroundColor: "#2868B6",
              },
            }}
            href={value}
          >
            Lien
          </Button>
        )}
      </>
    );
  };

  const renderCellStatus = (value, skeletonWidth = 100) => {
    return (
      <>
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rounded"
            sx={{width: skeletonWidth}}
          />
        ) : (
          <Button
            sx={{
              backgroundColor:
                value === "pending"
                  ? "#ECD044"
                  : value === "accepted"
                  ? "#4FA280"
                  : "#7B0D1E",
              fontFamily: "poppins-regular",
              fontSize: 14,
              color:
                value === "pending"
                  ? "#ECD044"
                  : value === "accepted"
                  ? "#4FA280"
                  : "#7B0D1E",
              maxWidth: 50,
              height: 30,

              "&:hover": {
                backgroundColor:
                  value === "pending"
                    ? "#ECD044"
                    : value === "accepted"
                    ? "#4FA280"
                    : "#7B0D1E",
              },
            }}
          ></Button>
        )}
      </>
    );
  };

  const renderCellReason = (value, skeletonWidth = 100) => {
    return (
      <>
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rounded"
            sx={{width: skeletonWidth}}
          />
        ) : (
          <Button
            aria-describedby={value}
            onClick={() => {
              setModalOpen(true);
              setModalText(value);
              setModalType("Raison");
            }}
            sx={{
              backgroundColor: "#1E4675",
              "&:hover": {
                backgroundColor: "#2868B6",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                fontSize: 14,
                textOverflow: "ellipsis",
                overflow: "hidden",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              Voir
            </Typography>
          </Button>
        )}
      </>
    );
  };

  const renderCellDescription = (value, skeletonWidth = 100) => {
    return (
      <>
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rounded"
            sx={{width: skeletonWidth}}
          />
        ) : (
          <Button
            aria-describedby={value}
            onClick={() => {
              setModalOpen(true);
              setModalText(value);
              setModalType("Description");
            }}
            sx={{
              backgroundColor: "#1E4675",
              "&:hover": {
                backgroundColor: "#2868B6",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                fontSize: 14,
                textOverflow: "ellipsis",
                overflow: "hidden",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              Voir
            </Typography>
          </Button>
        )}
      </>
    );
  };

  const renderCellAction = (value, skeletonWidth) => {
    return (
      <>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Skeleton
              animation="wave"
              variant="rounded"
              sx={{width: skeletonWidth}}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              sx={{width: skeletonWidth}}
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              sx={{
                backgroundColor: "#4FA280",
                fontFamily: "poppins-regular",
                fontSize: 14,
                color: "#fff",

                "&:hover": {
                  backgroundColor: "#1EA36C",
                },
              }}
              onClick={() => handleAccept(value)}
            >
              Accepter
            </Button>
            <Button
              sx={{
                backgroundColor: "#7B0D1E",
                fontFamily: "poppins-regular",
                fontSize: 14,
                color: "#fff",

                "&:hover": {
                  backgroundColor: "#B00E1E",
                },
              }}
              onClick={() => handleRefuse(value)}
            >
              Refuser
            </Button>
          </div>
        )}
      </>
    );
  };

  const renderCellComment = (value, skeletonWidth) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rounded"
            sx={{width: skeletonWidth}}
          />
        ) : (
          <>
            <Button
              aria-describedby={value}
              onClick={() => {
                setModalCommentOpen(true);
                setClickedIdeaId(value);
                loadComments(value);
              }}
              sx={{
                backgroundColor: "#1E4675",
                "&:hover": {
                  backgroundColor: "#2868B6",
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "poppins-regular",
                  fontSize: 14,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                Ecrire
              </Typography>
            </Button>
          </>
        )}
      </div>
    );
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 130,
      editable: false,
      renderCell: (params) => renderCells(params.value, 100),
    },
    {
      field: "name",
      headerName: "Nom",
      width: 150,
      editable: false,
      renderCell: (params) => renderCells(params.value, 150),
    },
    {
      field: "createdBy",
      headerName: "Créé par",
      width: 200,
      editable: false,
      renderCell: (params) => renderCells(params.value, 200),
    },
    {
      field: "createAt",
      headerName: "Créé le",
      width: 130,
      editable: false,
      renderCell: (params) => renderCells(params.value, 130),
    },
    {
      field: "status",
      headerName: "Statut",
      width: 125,
      editable: false,
      hide: params.status !== undefined,
      renderCell: (params) => renderCellStatus(params.value, 125),
    },
    {
      field: "url",
      headerName: "URL",
      width: 125,
      editable: false,
      renderCell: (params) => renderCellUrlButton(params.value, 125),
    },
    {
      field: "price",
      headerName: "Prix",
      width: 125,
      editable: false,
      renderCell: (params) => renderCells(params.value.toFixed(2) + " €", 125),
    },
    {
      field: "reason",
      headerName: "Raison",
      width: 125,
      editable: false,
      renderCell: (params) => renderCellReason(params.value, 125),
    },
    {
      field: "description",
      headerName: "Description",
      width: 125,
      editable: false,
      renderCell: (params) => renderCellDescription(params.value, 125),
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      editable: false,
      hide: params.status !== "pending",
      renderCell: (params) => renderCellAction(params.row.id, 80),
    },
    {
      field: "comment",
      headerName: "Commentaires",
      width: 200,
      editable: false,
      // hide: params.status === "treated",
      renderCell: (params) => renderCellComment(params.row.id, 200),
    },
  ];

  const rows = ideas.map((idea) => {
    return {
      id: idea.id,
      name: idea.name,
      createdBy: idea.createdBy,
      createAt: moment(timeConverter(idea.createdAt)).format("DD MMM YYYY"),
      status: idea.status,
      url: idea.url,
      price: idea.price,
      reason: idea.reason,
      description: idea.description,
    };
  });

  return (
    <div>
      <Toaster />
      <BasicModal
        open={modalOpen}
        setOpen={setModalOpen}
        text={modalText}
        type={modalType}
      />

      <CommentModal
        open={modalCommentOpen}
        setOpen={setModalCommentOpen}
        ideaId={clickedIdeaId}
        messages={comments}
        setComments={setComments}
      />

      {params.status === undefined && (
        <div
          style={{
            display: "flex",
            gap: "50px",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#ECD044",
                width: "75px",
                height: "30px",
                borderRadius: "5px",
              }}
            />
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                fontSize: 16,
                marginTop: "5px",
              }}
            >
              En attente
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#4FA280",
                width: "75px",
                height: "30px",
                borderRadius: "5px",
              }}
            />
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                fontSize: 16,
                marginTop: "5px",
              }}
            >
              Acceptée
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#7B0D1E",
                width: "75px",
                height: "30px",
                borderRadius: "5px",
              }}
            />
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                fontSize: 16,
                marginTop: "5px",
              }}
            >
              Refusée
            </Typography>
          </div>
        </div>
      )}

      <GridData columns={columns} rows={rows} />
    </div>
  );
};

export default InventoryIdeas;

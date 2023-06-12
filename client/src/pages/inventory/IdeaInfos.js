import {Button, Link, TextField, Typography} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import timeConverter from "../../functions/TimeConverter";
import useFirebase from "../../hooks/useFirebase";
import {Toaster, toast} from "react-hot-toast";
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

function IdeaInfos() {
  const params = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [messages, setMessages] = useState([]);
  const {user} = useFirebase();
  const bottomRef = useRef();

  const handleSend = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_API}/inventory/ideas/comment/${params.ideaId}`,
        {comment, userId: user.id}
      );
      toast.success("Commentaire envoyé");
      setComment("");
    } catch (error) {
      toast.error("Erreur lors de l'envoi");
      console.error(error);
    }
  };

  useEffect(() => {
    loading &&
      (async () => {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_API}/inventory/idea/${params.ideaId}`
        );

        const ws = new w3cwebsocket(
          `${process.env.REACT_APP_SERVER_API_WS}/getIdeaComments`
        );

        const sendID = (ws.onopen = () => {
          const message = JSON.stringify({value: params.ideaId}); // Convert the value to JSON string
          ws.send(message); // Send the message to the server
          console.log("Message sent to the server");
        });

        const getMessages = (ws.onmessage = (e) => {
          const message = JSON.parse(e.data);
          setMessages(message);
          console.log("Message received from the server", message);
        });

        Promise.all([response, sendID, getMessages]).then((values) => {
          setIdea(response.data);
          setLoading(false);
        });
      })();
  }, [loading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  return (
    <div>
      <Toaster />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <img
              src={idea.imageURL}
              style={{
                width: "300px",
                height: "200px",
                borderRadius: "5px",
                resizeMode: "cover",
                marginBottom: "10px",
              }}
            />
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                color: "#fff",
                fontSize: "16px",
              }}
              variant="h6"
            >
              Nom de l'idée : {idea.name}
            </Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "poppins-regular",
                  color: "#fff",
                  fontSize: "16px",
                }}
                variant="body1"
              >
                Statut :
              </Typography>
              <Typography
                sx={{
                  fontFamily: "poppins-regular",
                  color: "#fff",
                  fontSize: "16px",
                  backgroundColor:
                    idea.status === "pending"
                      ? "#FFC107"
                      : idea.status === "accepted"
                      ? "#4CAF50"
                      : "#F44336",

                  borderRadius: "5px",
                  paddingInline: "5px",
                  marginLeft: "5px",
                }}
                variant="body1"
              >
                {idea.status === "pending"
                  ? " En attente"
                  : idea.status === "accepted"
                  ? " Accepté"
                  : " Refusé"}
              </Typography>
            </div>

            <Typography
              sx={{
                fontFamily: "poppins-regular",
                color: "#fff",
                fontSize: "16px",
              }}
              variant="body1"
            >
              Description : {idea.description}
            </Typography>
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                color: "#fff",
                fontSize: "16px",
              }}
              variant="body1"
            >
              Raison : {idea.reason}
            </Typography>
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                color: "#fff",
                fontSize: "16px",
              }}
              variant="body1"
            >
              Prix : {idea.price.toFixed(2)} €
            </Typography>
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                color: "#fff",
                fontSize: "16px",
              }}
              variant="body1"
            >
              Date de création :
              {moment(timeConverter(idea.createdAt)).format(" DD MMM YYYY")}
            </Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "poppins-regular",
                  color: "#fff",
                  fontSize: "16px",
                }}
                variant="body1"
              >
                Lien :{" "}
              </Typography>
              <Link
                sx={{
                  fontFamily: "poppins-regular",
                  color: "#fff",
                  fontSize: "14px",
                  width: "250px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginLeft: "5px",
                }}
                href={idea.url}
                target="_blank"
              >
                {idea.url}
              </Link>
            </div>
          </div>
          {/* {idea.status === "pending" && ( */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
              height: "100%",
              justifyContent: "center",
              paddingInline: "40px",
              paddingBlock: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                maxHeight: "600px",
                overflowY: "auto",
              }}
            >
              {messages.map((message) => (
                <ChatBox sender={message.sender} message={message} />
              ))}
              <div ref={bottomRef} />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
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
                  minHeight: 30,
                  fontFamily: "poppins-regular",
                  marginTop: 4,
                  fontSize: 16,
                }}
              />
              <Button
                onClick={() => handleSend()}
                sx={{
                  fontFamily: "poppins-regular",
                  fontSize: 16,
                  color: "#fff",
                  textTransform: "none",
                  backgroundColor: "#4CAF50",
                  marginLeft: 2,
                  marginTop: 4,
                  marginRight: 2,
                  "&:hover": {
                    backgroundColor: "#4CAF50",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "poppins-regular",
                    fontSize: 16,
                    color: "#fff",
                    textTransform: "none",
                    paddingInline: 2,
                  }}
                >
                  Envoyer
                </Typography>
              </Button>
            </div>
          </div>
          {/* //   )} */}
        </div>
      )}
    </div>
  );
}

export default IdeaInfos;

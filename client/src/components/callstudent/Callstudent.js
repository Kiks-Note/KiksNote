import ReactGiphySearchbox from "react-giphy-searchbox";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import "./Callstudent.scss";
import SendIcon from "@mui/icons-material/Send";
import GifBoxIcon from "@mui/icons-material/GifBox";
import Popup from "reactjs-popup";
import axios from "axios";
import { w3cwebsocket } from "websocket";
import useFirebase from "../../hooks/useFirebase";

function AppelEleve({ callId }) {
  const [Call, setCall] = useState({
    id_lesson: "",
    qrcode: "",
    student_scan: [],
    chats: [],
  });
  const callToUpdate = useRef();
  const { user } = useFirebase();
  const open = useRef();
  const msg = useRef();
  const [inRoom, setInRoom] = useState(false);
  const ip = process.env.REACT_APP_IP;

  const id = useRef();
  const ws = useMemo(() => {
    return new w3cwebsocket(`ws://localhost:5050/callws`);
  }, []);

  const LogToExistingRoom = useCallback(async () => {
    try {
      axios
        .get(`http://localhost:5050/call/getRoom/${user?.class.name}`)
        .then((res) => {
          console.log(res);
          if (res.data.length > 0) {
            const message = {
              type: "joinRoom",
              data: {
                userID: user?.id,
                name: user?.firstname,
                class: user?.class,
                type: "call",
              },
            };
            console.log("sending");
            ws.send(JSON.stringify(message));
            setInRoom(true);
            setCall(res.data);
            callToUpdate.current = res.data;
            console.log(callToUpdate.current);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }, [user?.id, user?.firstname, user?.class, ws]);

  useEffect(() => {
    const handleOpen = async () => {
      if (user.status === "student") {
        if (!inRoom) {
          await LogToExistingRoom();
        }
      }

      if (inRoom) {
        ws.onmessage = (message) => {
          const messageReceive = JSON.parse(message.data);

          switch (messageReceive.type) {
            case "updateRoom":
              const keys = Object.keys(
                messageReceive.data.currentRoom.appel
              )[0];
              const appel = messageReceive.data.currentRoom.appel[keys].appel;
              id.current = appel.id;
              setCall(appel);
              break;
            default:
              break;
          }
        };
      }
    };
    console.log(ws);

    if (ws.readyState === WebSocket.OPEN) {
      handleOpen();
    } else {
      ws.onopen = handleOpen;
    }

    return () => {
      /*       if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "leaveRoom",
            data: { userID: user?.id, class: user?.class },
          })
        );
      } */
    };
  }, [LogToExistingRoom, inRoom, user.class, user?.id, user.status, ws]);

  const addGif = (gif) => {
    const date = new Date();
    const chatCopy = [
      ...Call.chats,
      {
        id: Call.chats.length + 1,
        date:
          date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
        username: user.firstname,
        content: gif.images.fixed_height_small.url,
        isGif: true,
      },
    ];

    setCall((prevCall) => ({
      ...prevCall,
      chats: chatCopy,
    }));
    open.current.close();
    // callToUpdate.current.chats = chatCopy;

    // updateCall();
  };

  const addMsg = () => {
    if (msg.current == "") {
      return;
    }
    const date = new Date();
    const chatCopy = [
      ...Call.chats,
      {
        id: Call.chats.length + 1,
        date:
          date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
        username: user.firstname,
        content: msg.current.value,
        isGif: false,
      },
    ];
    setCall((prevCall) => ({
      ...prevCall,
      chats: chatCopy,
    }));
    //callToUpdate.current.chats = chatCopy;
    console.log(callToUpdate.current);
    // updateCall();
  };

  const updateCall = async () => {
    try {
      const res = await axios.put(`http://localhost:5050/call/updatecall`, {
        id: id.current,
        object: callToUpdate.current,
      });
      const message = {
        type: "updateCall",
        data: {
          appel: callToUpdate.current,
        },
      };
      ws.send(JSON.stringify(message));
      console.log(res);
    } catch (error) {
      console.error("Error updating call:", error);
    }
  };
  return (
    <div className="container clearfix">
      <div className="people-list" id="people-list">
        <ul className="list">
          <li className="clearfix">
            <img
              src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg"
              alt="avatar"
            />
            <div className="about">
              <div className="name">Vincent Porter</div>
            </div>
          </li>
        </ul>
      </div>

      <div className="chat">
        <div className="chat-history">
          <ul>
            {Call.chats.map((chat) => {
              return (
                <li className="clearfix" key={chat.id}>
                  {chat.username == user.firstname ? (
                    <>
                      <div className="message-data">
                        <span className="message-data-name">
                          <i className="fa fa-circle online"></i>{" "}
                          {chat.username}
                        </span>
                        <span className="message-data-time">{chat.date}</span>
                      </div>
                      <div className="message my-message">
                        {chat.isGif ? (
                          <img src={chat.content} alt="gif" />
                        ) : (
                          <span>{chat.content}</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="message-data align-right">
                        <span className="message-data-time">{chat.date}</span>{" "}
                        &nbsp; &nbsp;
                        <span className="message-data-name">
                          {chat.username}
                        </span>{" "}
                        <i className="fa fa-circle me"></i>
                      </div>
                      <div className="message other-message float-right">
                        {chat.isGif ? (
                          <img src={chat.content} alt="gif" />
                        ) : (
                          <span>{chat.content}</span>
                        )}
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="chat-message clearfix">
          <textarea
            ref={msg}
            name="message-to-send"
            id="message-to-send"
            placeholder="Entrer vôtre message"
            rows="3"
          ></textarea>
          <Popup
            ref={open}
            trigger={
              <button className="ButtonAddMsg">
                <GifBoxIcon></GifBoxIcon>
              </button>
            }
            position="top right"
          >
            <div
              className="PopupGif"
              style={{
                backgroundColor: "lightgray",
                padding: "0.25em",
                borderRadius: "5px",
              }}
            >
              <ReactGiphySearchbox
                apiKey="CHO3gHhn8JI87jBJ8zFewMT7jT8uRGJe"
                onSelect={(item) => addGif(item)}
              />
            </div>
          </Popup>
          <button onClick={addMsg}>Envoyer</button>
        </div>
      </div>
    </div>
  );
}

export default AppelEleve;

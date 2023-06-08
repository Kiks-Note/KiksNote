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
    return new w3cwebsocket(`ws://${ip}:5050/call`);
  }, []);

  const LogToExistingRoom = useCallback(async () => {
    try {
      axios
        .get(`http://localhost:5050/call/getRoom/${user?.class}`)
        .then((res) => {
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
            //ws.send(JSON.stringify(message));
            setInRoom(true);
            setCall(res.data);
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
              setCall(messageReceive.appel);
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
      {
        id: Call.chats.length + 1,
        date:
          date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
        username: user.firstname,
        content: gif.images.fixed_height_small.url,
        isGif: true,
      },
      ...Call.chats,
    ];

    setCall((prevCall) => ({
      ...prevCall,
      chats: chatCopy,
    }));
    open.current.close();
    callToUpdate.current.chats = chatCopy;

    updateCall();
  };

  const addMsg = () => {
    const date = new Date();
    const chatCopy = [
      {
        id: Call.chats.length + 1,
        date:
          date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
        username: user.firstname,
        content: msg.current.value,
        isGif: false,
      },
      ...Call.chats,
    ];
    setCall((prevCall) => ({
      ...prevCall,
      chats: chatCopy,
    }));
    callToUpdate.current.chats = chatCopy;
    updateCall();
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
    <div className="ContentEleve">
      <div className="DivChatEleve">
        <h1>Chat</h1>
        <div className="ChatEleve">
          {Call.chats.map((chat) => {
            return (
              <div className="ChatContentEleve" key={chat.id}>
                <div className="ChatContentHeaderEleve">
                  <span>{chat.username}</span>
                  <span>{chat.date}</span>
                </div>
                <div>
                  {chat.isGif ? (
                    <img src={chat.content} alt="gif" />
                  ) : (
                    <span>{chat.content}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="DivInputChat">
        <Popup
          ref={open}
          trigger={
            <button className="ButtonAddMsg">
              <GifBoxIcon></GifBoxIcon>
            </button>
          }
          position="top left"
        >
          <div className="PopupGif">
            <ReactGiphySearchbox
              apiKey="CHO3gHhn8JI87jBJ8zFewMT7jT8uRGJe"
              onSelect={(item) => addGif(item)}
            />
          </div>
        </Popup>
        <input
          ref={msg}
          type="text"
          name="comment"
          id=""
          className="InputChat"
        />
        <button onClick={addMsg} className="ButtonAddMsg">
          <SendIcon></SendIcon>
        </button>
      </div>
    </div>
  );
}

export default AppelEleve;

import ReactGiphySearchbox from "react-giphy-searchbox";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import "./Callstudent.scss";
import SendIcon from "@mui/icons-material/Send";
import GifBoxIcon from "@mui/icons-material/GifBox";
import Popup from "reactjs-popup";
import axios from "axios";
import { w3cwebsocket } from "websocket";
import useFirebase from "../../hooks/useFirebase";

function AppelEleve(props) {
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
    return new w3cwebsocket(`ws://${ip}:5050/Call`);
  });

  useEffect(() => {
    const handleOpen = async () => {
      await LogToExistingRoom();

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
      ws.send(
        JSON.stringify({
          type: "leaveRoom",
          data: { userID: user?.id, class: user.class },
        })
      );
    };
  }, []);

  const LogToExistingRoom = useCallback(async () => {
    try {
      axios
        .get(`http://localhost:5050/groupes/call/getcall/` + props.callId)
        .then((res) => {
          if (res.data.length > 0) {
            const message = {
              type: "joinRoom",
              data: {
                userID: user?.id,
                name: user?.firstname,
                class: user?.class,
              },
            };
            ws.send(JSON.stringify(message));
            setInRoom(true);
            id.current = props.id;
            setCall(res.data);
            callToUpdate.current = res.data;
          }
        });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [user?.class, user?.id, user?.firstname, ws]);

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

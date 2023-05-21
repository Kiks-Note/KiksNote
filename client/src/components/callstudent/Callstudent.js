import ReactGiphySearchbox from "react-giphy-searchbox";
import { useEffect, useRef, useState } from "react";
import "./Callstudent.scss";
import SendIcon from "@mui/icons-material/Send";
import GifBoxIcon from "@mui/icons-material/GifBox";
import Popup from "reactjs-popup";
import axios from "axios";
import { w3cwebsocket } from "websocket";
import useFirebase from "../../hooks/useFirebase";

function AppelEleve() {
  const [Call, setCall] = useState({
    id_lesson: "",
    qrcode: "",
    student_scan: [],
    chats: [],
  });
  const { user } = useFirebase();
  const open = useRef();
  const msg = useRef();
  const generated = useRef(false);
  const id = useRef();

  useEffect(() => {
    if (!generated.current) {
      getCall();
      generated.current = true;
    }
  }, []);

  const addGif = (gif) => {
    const chatCopy = [
      {
        id: Call.chats.length + 1,
        date: new Date().getDay().toString(),
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
    updateCall();
  };

  const addMsg = () => {
    const chatCopy = [
      {
        id: Call.chats.length + 1,
        date: new Date().getDay().toString(),
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

    updateCall();
  };

  const updateCall = async () => {
    try {
      const res = await axios.put(`http://localhost:5050/call/updatecall`, {
        id: id.current,
        object: Call,
      });
      console.log(res);
    } catch (error) {
      console.error("Error updating call:", error);
    }
  };

  const getCall = async () => {
    try {
      const response = await axios.get("http://localhost:5050/call/calls");
      const data = response.data;

      const latestCall = data[data.length - 1];
      const { id: callId, ...callData } = latestCall;

      id.current = callId;
      setCall(callData);

      if (!id) {
        const wsComments = new w3cwebsocket(`ws://localhost:5050/call`);
        wsComments.onopen = function (e) {
          console.log("[open] Connection established");
          console.log("Sending to server");
          wsComments.send(JSON.stringify({ CallId: id }));
        };

        wsComments.onmessage = (message) => {
          console.log(message);
          const data = JSON.parse(message.data);
          setCall(data);
        };
      }
    } catch (error) {
      console.error("Error retrieving call data:", error);
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

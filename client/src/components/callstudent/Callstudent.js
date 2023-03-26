import ReactGiphySearchbox from "react-giphy-searchbox";
import { useEffect, useRef, useState } from "react";
import "./Callstudent.scss";
import SendIcon from "@mui/icons-material/Send";
import GifBoxIcon from "@mui/icons-material/GifBox";
import Popup from "reactjs-popup";
import axios from "axios";
import { w3cwebsocket } from "websocket";

function AppelEleve() {
  const [Call, setCall] = useState({
    id_lesson: "",
    qrcode: "",
    student_scan: [],
    chats: [],
  });
  const [Users, setUsers] = useState([]);
  const open = useRef();
  const msg = useRef();
  let generated = false;
  const id = useRef();
  const userID = localStorage.getItem("user_uid");

  useEffect(() => {
    if (!generated) {
      getCall();
      getUsers();
      generated = true;
    }
  }, []);
  const addGif = (gif) => {
    const chatCopy = [...Call.chats];
    chatCopy.unshift({
      id: chatCopy.length + 1,
      date: new Date().getDay.toString(),
      username: Users.firstname,
      content: gif.images.fixed_height_small.url,
      isGif: true,
    });
    const callCopy = Call;
    callCopy.chats = chatCopy;
    setCall(callCopy);
    open.current.close();
    updateCall();
  };

  const addMsg = () => {
    const chatCopy = [...Call.chats];
    chatCopy.unshift({
      id: chatCopy.length + 1,
      date: new Date().getDay.toString(),
      username: Users.firstname,
      content: msg.current.value,
      isGif: false,
    });
    const callCopy = Call;
    callCopy.chats = chatCopy;
    setCall(callCopy);
    updateCall();
  };
  const updateCall = async () => {
    const res = await axios
      .post(`http://localhost:5050/updatecall`, {
        id: id.current,
        object: Call,
      })
      .then((res) => {
        console.log(res);
      });
  };
  const getCall = () => {
    axios.get("http://localhost:5050/calls").then((res) => {
      id.current = res.data.at(-1).id;
      delete res.data.at(-1).id;
      setCall(res.data.at(-1));
      (async () => {
        const wsComments = new w3cwebsocket(`ws://localhost:5050/Call`);

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
      })();
    });
  };
  const getUsers = () => {
    axios
      .get(`http://localhost:5050/user`, { params: { id: userID } })
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
      });
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
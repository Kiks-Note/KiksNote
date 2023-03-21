import ReactGiphySearchbox from "react-giphy-searchbox";
import { useEffect, useRef, useState } from "react";
import "./Callstudent.scss";
import SendIcon from "@mui/icons-material/Send";
import GifBoxIcon from "@mui/icons-material/GifBox";
import Popup from "reactjs-popup";

function AppelEleve() {
  const [ChatsEleve, setChats] = useState([]);
  const open = useRef();
  const msg = useRef();

  const addGif = (gif) => {
    console.log(gif);
    const chatCopy = [...ChatsEleve];
    chatCopy.unshift({
      id: ChatsEleve.length + 1,
      date: "07/12/2022 14:43",
      username: "jules",
      content: gif.images.fixed_height_small.url,
      isGif: true,
    });
    setChats(chatCopy);
    open.current.close();
  };

  const addMsg = () => {
    const chatCopy = [...ChatsEleve];
    chatCopy.unshift({
      id: ChatsEleve.length + 1,
      date: "07/12/2022 14:43",
      username: "jules",
      content: msg.current.value,
      isGif: false,
    });
    setChats(chatCopy);
  };

  return (
    <div className="ContentEleve">
      <div className="DivChatEleve">
        <h1>Chat</h1>
        <div className="ChatEleve">
          {ChatsEleve.map((chat) => {
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

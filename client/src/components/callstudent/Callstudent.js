import ReactGiphySearchbox from "react-giphy-searchbox";
import { useEffect, useRef, useState } from "react";
import "./Callstudent.scss";
import SendIcon from "@mui/icons-material/Send";
import GifBoxIcon from "@mui/icons-material/GifBox";
import Popup from "reactjs-popup";
import axios from "axios";
import {data} from "autoprefixer";

function AppelEleve() {
  const [ChatsEleve, setChats] = useState([
  ]);
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

  const postChat = async (token) => {
    console.log("**********")
    console.log(ChatsEleve)
    console.log("**********")
    await axios.post("http://localhost:5050/addChat", {
      token: token,
      object: ChatsEleve
    }).then((res) => {
      console.log("add front")
    })
  }

  const chatCopy = [...ChatsEleve];

  const addMsg = () => {
    chatCopy.unshift({
      id: ChatsEleve.length + 1,
      date: "07/12/2022 14:43",
      username: "jules",
      content: msg.current.value,
      isGif: false,
    });

    setChats(chatCopy)
    };

  const seeChats = () => {
    axios.get("http://localhost:5050/chats").then((res) => {
      console.log(res.data.chats);
      const chatCopy = [...ChatsEleve];
      for (let i = 0; i < res.data.chats.length; i++) {
        chatCopy.unshift(res.data.chats[i])
      }
      console.log(chatCopy)
      setChats(chatCopy);
    });
  };

    //seeChats();

    useEffect( () => {
      const token = "yk7atyTe9HNKNICvfHwo"
      console.log("posting...");
      postChat(token);
      // console.log("trop petit " + ChatsEleve);
      console.log(ChatsEleve);
    });

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
        <button onClick={seeChats}>
          See chats
        </button>
      </div>
    </div>
  );
}

export default AppelEleve;

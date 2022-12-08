import "./Callteacher.scss";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

function AppelProf() {
  const [url, setUrl] = useState("");
  const [qrcode, setQrcode] = useState("");

  const users = [
    { id: 1, username: "jules" },
    { id: 2, username: "celian" },
    { id: 3, username: "lucas" },
    { id: 4, username: "mohamed" },
    { id: 5, username: "jerance" },
    { id: 6, username: "rui" },
  ];

  const [Chats, setChats] = useState([
    {
      id: 1,
      date: "07/12/2022 14:43",
      username: "jules",
      content:
        "https://media2.giphy.com/media/8L00JcT3slsmfVYldi/giphy.gif?cid=e8452e68e80occrhiho8lvwha7tl3mgvjkp9ry9294msfys2&rid=giphy.gif&ct=g",
      isGif: true,
    },
    {
      id: 2,
      date: "07/12/2022 14:43",
      username: "jules",
      content: "🐑",
      isGif: false,
    },
    {
      id: 3,
      date: "07/12/2022 14:43",
      username: "jules",
      content: "trop bien",
      isGif: false,
    },
    {
      id: 4,
      date: "07/12/2022 14:43",
      username: "jules",
      content: "trop bien",
      isGif: false,
    },
    {
      id: 5,
      date: "07/12/2022 14:43",
      username: "jules",
      content: "trop bien",
      isGif: false,
    },
    {
      id: 6,
      date: "07/12/2022 14:43",
      username: "jules",
      content: "trop bien",
      isGif: false,
    },
    {
      id: 7,
      date: "07/12/2022 14:43",
      username: "jules",
      content: "trop bien",
      isGif: false,
    },
    {
      id: 8,
      date: "07/12/2022 14:43",
      username: "jules",
      content: "trop bien",
      isGif: false,
    },
  ]);

  useEffect(() => {
    GenerateQrcode();
  }, []);

  const GenerateQrcode = () => {
    QRCode.toDataURL(
      "https://www.google.com/",
      {
        width: 800,
        margin: 2,
      },
      (err, url) => {
        if (err) return console.log(err);
        setQrcode(url);
      }
    );
  };

  return (
    <div className="ContentProf">
      <div className="Timer">
        <h1>15:00</h1>
      </div>
      <div className="ContentInfo">
        <div className="DivQr">
          <img src={qrcode} className="Qrcode" />
        </div>
        <div className="DivList">
          <div>
            <div className="ListUser">
              {users.map((user) => {
                return (
                  <span key={user.id} className="UserItem">
                    {user.username}
                  </span>
                );
              })}
            </div>
          </div>
          <div>
            <div className="ListUser">
              {users.map((user) => {
                return (
                  <span key={user.id} className="UserItem">
                    {user.username}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="DivChat">
          <h1>Chat</h1>
          <div className="Chat">
            {Chats.map((chat) => {
              return (
                <div className="ChatContent">
                  <div className="ChatContentHeader">
                    <span>{chat.username}</span>
                    <span>{chat.date}</span>
                  </div>
                  <div>
                    {chat.isGif ? (
                      <img src={chat.content} />
                    ) : (
                      <span>{chat.content}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppelProf;

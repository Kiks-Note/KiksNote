import QRCode from "qrcode";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Callteacher.scss";

function AppelProf() {
  const [url, setUrl] = useState("");
  const [qrcode, setQrcode] = useState("");
  const [calls, setCalls] = useState([]);

  const users = [
    { id: 1, username: "jules" },
    { id: 2, username: "celian" },
    { id: 3, username: "lucas" },
    { id: 4, username: "mohamed" },
    { id: 5, username: "jerance" },
    { id: 6, username: "rui" },
  ];

  const [Chats, setChats] = useState([]);

  useEffect(() => {
    GenerateQrcode();
  }, []);

  const addCall = async () => {
    const res = await axios.post("http://localhost:4000/callAdd", {
      id_lesson: "",
      qrcode: "",
      student_scan: [],
      chats: [],
    });
    console.log(res);
  };

  const getCalls = () => {
    axios.get("http://localhost:4000/calls").then((res) => {
      setCalls(res.data);
    });
    console.log(calls);
  };

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
        <div>
          <button onClick={addCall}>add</button>
          <button onClick={getCalls}>get</button>
        </div>
      </div>
    </div>
  );
}

export default AppelProf;

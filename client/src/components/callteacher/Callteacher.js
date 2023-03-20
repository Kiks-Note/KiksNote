import QRCode from "qrcode";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Callteacher.scss";

function AppelProf() {
  // const [url, setUrl] = useState("");
  const [qrcode, setQrcode] = useState("");
  const [call, setCall] = useState({
    id_lesson: "",
    qrcode: "",
    student_scan: [],
    chats: [],
  });
  const [Chats, setChats] = useState([]);
  const dataFetchedRef = useRef(false);
  const generated = useRef(false);
  let tempCall;
  const ws = new WebSocket("ws://192.168.1.16:4050");

  useEffect(() => {
    if (dataFetchedRef.current) {
      return;
    }
    dataFetchedRef.current = true;
    // addCall();
    getCall();

    ws.onmessage = (event) => {
      setCall(JSON.parse(event.data));
      console.log(JSON.parse(event.data));
    };
  }, []);

  useEffect(() => {
    if (generated.current);
  }, [call]);

  const users = [
    { id: 1, username: "jules" },
    { id: 2, username: "celian" },
    { id: 3, username: "lucas" },
    { id: 4, username: "mohamed" },
    { id: 5, username: "jerance" },
    { id: 6, username: "rui" },
  ];

  const addCall = async () => {
    const res = await axios
      .post("http://localhost:4000/callAdd", {
        id_lesson: "",
        qrcode: "",
        student_scan: [],
        chats: [],
      })
      .then((res) => {
        console.log(res);
        getCall();
      });
  };

  const getCall = () => {
    axios.get("http://localhost:4000/calls").then((res) => {
      console.log(res.data.at(-1));
      tempCall = res.data.at(-1);
      GenerateQrcode();
    });
  };

  const GenerateQrcode = () => {
    QRCode.toDataURL(
      `http://192.168.1.16:3000/presence/${tempCall.id}`,
      {
        width: 800,
        margin: 2,
      },
      (err, url) => {
        if (err) return console.log(err);
        setQrcode(url);
        tempCall.qrcode = url;
        setCall(tempCall);
        generated.current = true;
      }
    );
  };

  const updateCall = async () => {
    const res = await axios
      .post("http://localhost:4000/updatecall", { id: call.id, object: call })
      .then((res) => {
        console.log(res);
      });
    ws.send(JSON.stringify(call));
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
          <button onClick={updateCall}>modification</button>
          <button onClick={addCall}>add</button>
          <button
            onClick={() => {
              console.log(call);
            }}
          >
            call
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppelProf;

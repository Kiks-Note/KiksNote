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
  const [users, setUsers] = useState([]);
  const [Chats, setChats] = useState([]);
  const dataFetchedRef = useRef(false);
  const generated = useRef(false);
  let tempCall;
  const ws = new WebSocket(`ws://10.57.29.159:5050`);

  useEffect(() => {
    if (dataFetchedRef.current) {
      return;
    }
    dataFetchedRef.current = true;
    // addCall();
    getCall();
    getUsers();
    ws.onmessage = (event) => {
      setCall(JSON.parse(event.data));
      console.log(JSON.parse(event.data));
    };
  }, []);

  useEffect(() => {
    if (generated.current);
  }, [call]);

  const addCall = async () => {
    const res = await axios
      .post("http://localhost:5050/callAdd", {
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
    axios.get("http://localhost:5050/calls").then((res) => {
      tempCall = res.data.at(-1);
      GenerateQrcode();
    });
  };

  const getUsers = () => {
    axios.get("http://localhost:5050/users").then((res) => {
      setUsers(res.data);
      console.log(res.data);
    });
  };

  const GenerateQrcode = () => {
    QRCode.toDataURL(
      `http://10.57.29.159:3000/Presence/${tempCall.id}`,
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
      .post("http://localhost:5050/updatecall", { id: call.id, object: call })
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
                    {user.firstname}
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
                    {user.firstname}
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

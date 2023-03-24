import QRCode from "qrcode";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Callteacher.scss";
import Timer from "../timer/Timer";
import { w3cwebsocket } from "websocket";

function AppelProf() {
  const [qrcode, setQrcode] = useState("");
  const [call, setCall] = useState({
    id_lesson: "",
    qrcode: "",
    student_scan: [],
    chats: [],
  });
  const ip = process.env.REACT_APP_IP;
  const [users, setUsers] = useState([]);
  const [usersPresent, setUsersPresent] = useState([]);
  const dataFetchedRef = useRef(false);
  const generated = useRef(false);
  let tempCall;

  useEffect(() => {
    if (!dataFetchedRef.current) {
      dataFetchedRef.current = true;
      getCall();
      getUsers();
    }
  }, []);

  useEffect(() => {
    if (generated.current) {
      setUsersPresent(call.student_scan);
      const usersCopy = [...users];
      const filteredUsers = usersCopy.filter(
        (element1) =>
          !call.student_scan.some(
            (element2) => element2["firstname"] === element1["firstname"]
          )
      );
      setUsers(filteredUsers);
    }
  }, [call]);

  const getCall = () => {
    axios.get("http://localhost:5050/calls").then((res) => {
      tempCall = res.data.at(-1);
      GenerateQrcode();
      (() => {
        const wsComments = new w3cwebsocket(`ws://${ip}:5050/Call`);

        wsComments.onopen = function (e) {
          console.log("[open] Connection established");
          console.log("Sending to server");
          wsComments.send(JSON.stringify({ CallId: tempCall.id }));
        };
        wsComments.onmessage = (message) => {
          const data = JSON.parse(message.data);
          setCall(data);
        };
      })();
    });
  };

  const getUsers = () => {
    axios.get("http://localhost:5050/users").then((res) => {
      setUsers(res.data);
    });
  };

  const GenerateQrcode = () => {
    QRCode.toDataURL(
      `http://${ip}:3000/Presence/${tempCall.id}`,
      {
        width: 800,
        margin: 2,
      },
      (err, url) => {
        if (err) return console.log(err);
        setQrcode(url);
        tempCall.qrcode = url;
        setCall(tempCall);
      }
    );
  };

  return (
    <div className="ContentProf">
      <div className="Timer">
        <Timer />
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
              {usersPresent.map((user) => {
                return (
                  <span key={user.id} className="UserItemPresent">
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
            {call.chats.map((chat) => {
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

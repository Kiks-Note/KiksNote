import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import axios from "axios";
import "./Callteacher.scss";
import Timer from "../timer/Timer";
import { w3cwebsocket } from "websocket";
import useFirebase from "../../hooks/useFirebase";

function AppelProf(callId) {
  const [qrcode, setQrcode] = useState("");
  const [call, setCall] = useState({
    id_lesson: "",
    qrcode: "",
    student_scan: [],
    chats: [],
  });
  const { user } = useFirebase();

  const ip = "localhost";
  const [users, setUsers] = useState([]);
  const [usersPresent, setUsersPresent] = useState([]);
  const [inRoom, setInRoom] = useState(false);
  const dataFetchedRef = useRef(false);
  const generated = useRef(false);
  const [tempCall, setTempCall] = useState({});

  const ws = useMemo(() => {
    return new w3cwebsocket(`ws://${ip}:5050/call`);
  }, []);

  const LogToExistingRoom = useCallback(async () => {
    try {
      axios
        .get(`http://localhost:5050/groupes/getRoomPo/${user?.id}`)
        .then((res) => {
          if (res.data.length > 0) {
            const message = {
              type: "joinRoom",
              data: {
                userID: user?.id,
                name: user?.firstname,
                class: user?.class,
                type: "call",
              },
            };
            ws.send(JSON.stringify(message));
            setInRoom(true);
            generated.current = true;
            setTempCall(res.data);
            setCall(res.data);
            setQrcode(res.data.qrcode);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }, [user?.id, user?.firstname, user?.class, ws]);

  useEffect(() => {
    const handleOpen = async () => {
      console.log("test");
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
  }, [LogToExistingRoom, inRoom, user.class, user?.id, ws]);

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
  }, [call, users]);

  return (
    <div className="ContentProf">
      <div className="Timer">
        <Timer />
      </div>
      <div className="ContentInfo">
        <div className="DivQr">
          <img src={qrcode} className="Qrcode" alt="" />
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
                      <img src={chat.content} alt="" />
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

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
    students_scan: [],
    chats: [],
  });
  const { user } = useFirebase();
  const tempCall = useRef("");
  const tempUsers = useRef([]);
  const ip = process.env.REACT_APP_IP;
  const [users, setUsers] = useState([]);
  const [usersPresent, setUsersPresent] = useState([]);
  const [inRoom, setInRoom] = useState(false);
  const generated = useRef(false);

  const ws = useMemo(() => {
    return new w3cwebsocket(`ws://localhost:5050/callws`);
  }, []);

  const LogToExistingRoom = useCallback(async () => {
    try {
      axios
        .get(`http://localhost:5050/call/getRoomPo/${user?.id}`, {
          params: { callId: callId },
        })
        .then((res) => {
          if (res.data.length > 0) {
            const message = {
              type: "joinRoom",
              data: {
                userID: user?.id,
                name: user?.firstname,
                class: res.data[0].class,
                type: "call",
              },
            };
            console.log("sending");
            const msgToSend = JSON.stringify(message);
            ws.send(msgToSend);
            setInRoom(true);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }, [user?.id, user?.firstname, user?.class, ws]);

  useEffect(() => {
    const handleOpen = async () => {
      if (user.status === "po") {
        if (!inRoom) {
          await LogToExistingRoom();
        }
      }

      if (inRoom) {
        ws.onmessage = (message) => {
          const messageReceive = JSON.parse(message.data);

          switch (messageReceive.type) {
            case "updateRoom":
              console.log(messageReceive);
              const keys = Object.keys(
                messageReceive.data.currentRoom.appel
              )[0];
              const appel = messageReceive.data.currentRoom.appel[keys].appel;
              tempCall.current = appel;
              setCall(appel);
              setQrcode(appel.qrcode);
              if (!generated.current) {
                getUsers(appel.id_lesson);
              }
              generated.current = true;

              displayUsers();
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
      /* if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "leaveRoom",
            data: { userID: user?.id, class: user?.class },
          })
        );
      } */
    };
  }, [LogToExistingRoom, call, inRoom, user.class, user.id, user.status, ws]);

  const getUsers = (coursId) => {
    axios
      .get(`http://localhost:5050/call/getUsersFromClassiId/${coursId}`)
      .then((res) => {
        tempUsers.current = res.data;
        console.log(tempUsers.current);
        setUsers(res.data);
        displayUsers();
      });
  };

  const displayUsers = () => {
    setUsersPresent(tempCall.current.students_scan);
    const usersCopy = [...tempUsers.current];
    console.log(usersCopy);
    const filteredUsers = usersCopy.filter(
      (element1) =>
        !tempCall.current.students_scan.some(
          (element2) => element2["firstname"] === element1["firstname"]
        )
    );
    console.log(filteredUsers);
    setUsers(filteredUsers);
  };

  return (
    <div className="ContentProf">
      <div className="Timer">{/* <Timer /> */}</div>
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
            {/* {call.chats.map((chat) => {
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
            })} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppelProf;

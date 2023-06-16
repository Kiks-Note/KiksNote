import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import axios from "axios";
import "./Callteacher.scss";
//import Timer from "../timer/Timer";
import { w3cwebsocket } from "websocket";
import useFirebase from "../../hooks/useFirebase";
import { Timer } from "react-digital-timer";

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
  const divRef = useRef("");

  const [isQrCodeVisible, setIsQrCodeVisible] = useState(true);

  const [inRoom, setInRoom] = useState(false);
  const generated = useRef(false);
  const INIT_TIME = {
    hour: 0,
    minute: 0,
    second: 15 * 60,
  };
  const ws = useMemo(() => {
    return new w3cwebsocket(`ws://localhost:5050/callws`);
  }, []);

  const LogToExistingRoom = useCallback(async () => {
    try {
      axios
        .get(`${process.env.REACT_APP_SERVER_API}/call/getRoomPo/${user?.id}`, {
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
              console.log(appel);
              tempCall.current = appel;
              setCall(appel);
              setQrcode(appel.qrcode);
              generated.current = true;
              divRef.current.scrollIntoView({
                behavior: "instant",
                block: "end",
              });
              break;
            default:
              break;
          }
        };
      }
    };
    console.log(ws);
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

  return (
    <div className="ContentProf">
      <div className="ContentInfo">
        <div className="container clearfix">
          <div className="people-list-bis" id="people-list">
            <ul className="list">
              {call.students_scan.map((user) => {
                return (
                  <li className="clearfix" key={user.firstname}>
                    <img src={user.image} alt="avatar" />
                    <div className="about">
                      <div className="name">{user.firstname}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="DivQr">
            {isQrCodeVisible ? (
              <>
                <img
                  src={qrcode}
                  className="Qrcode"
                  alt=""
                  style={{ display: isQrCodeVisible ? "hidden" : "" }}
                />
                <Timer
                  countDownTime={INIT_TIME}
                  onComplete={() => setIsQrCodeVisible(false)}
                />
              </>
            ) : (
              ""
            )}
          </div>

          <div className="chat-bis">
            <div className="chat-history-bis">
              <ul ref={divRef}>
                {call.chats.map((chat) => {
                  return (
                    <li className="clearfix" key={chat.id}>
                      {chat.username == user.firstname ? (
                        <>
                          <div className="message-data">
                            <span className="message-data-name">
                              <i className="fa fa-circle online"></i>{" "}
                              {chat.username}
                            </span>
                            <span className="message-data-time">
                              {chat.date}
                            </span>
                          </div>
                          <div className="message my-message">
                            {chat.isGif ? (
                              <img src={chat.content} alt="gif" />
                            ) : (
                              <span>{chat.content}</span>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="message-data align-right">
                            <span className="message-data-time">
                              {chat.date}
                            </span>{" "}
                            &nbsp; &nbsp;
                            <span className="message-data-name">
                              {chat.username}
                            </span>{" "}
                            <i className="fa fa-circle me"></i>
                          </div>
                          <div className="message other-message float-right">
                            {chat.isGif ? (
                              <img src={chat.content} alt="gif" />
                            ) : (
                              <span>{chat.content}</span>
                            )}
                          </div>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppelProf;

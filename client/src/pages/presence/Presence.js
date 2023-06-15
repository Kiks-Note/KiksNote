import { useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { w3cwebsocket } from "websocket";
import useFirebase from "../../hooks/useFirebase";
import { idID } from "@mui/material/locale";

function Presence() {
  const { id } = useParams();
  const dataFetchedRef = useRef(false);
  const tempCall = useRef();
  const navigate = useNavigate();
  const { user } = useFirebase();
  const ws = useMemo(() => {
    return new w3cwebsocket(`ws://localhost:5050/callws`);
  }, []);
  useEffect(() => {
    if (dataFetchedRef.current) {
      return;
    }
    dataFetchedRef.current = true;
    getCall();
  });

  const updateCall = async () => {
    await axios
      .put(`http://localhost:5050/call/updatecall`, {
        id: id,
        object: tempCall.current,
      })
      .then((res) => {
        if (ws.readyState === WebSocket.OPEN) {
          websocket();
        } else {
          ws.onopen = websocket;
        }
      });
  };
  const websocket = () => {
    const message = {
      type: "joinRoom",
      data: {
        class: user.class.name,
        appel: tempCall.current,
        userID: user.email,
        name: user.firstname,
      },
    };
    ws.send(JSON.stringify(message));
    navigate(`/appel/${tempCall.current.id}`);
  };
  const getCall = () => {
    axios.get(`http://localhost:5050/call/getcall/${id}`).then((res) => {
      tempCall.current = res.data;
      getUsers();
    });
  };
  const getUsers = () => {
    console.log("test");
    axios
      .get(
        `http://localhost:5050/ressources/cours/${tempCall.current.id_lesson}`
      )
      .then((res) => {
        console.log(res.data.data.courseClass.id);
        if (user.class.id === res.data.data.courseClass.id) {
          const scanEleveCopy = [...tempCall.current.students_scan];
          const userItem = {
            firstname: user.firstname,
            image: user?.image
              ? user.image
              : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg",
            id: user.id,
          };
          console.log(userItem);
          if (
            scanEleveCopy.some(
              (element) => element.firstname === userItem.firstname
            )
          ) {
            navigate(`/appel/${tempCall.current.id}`);
          } else {
            scanEleveCopy.push(userItem);
          }
          console.log(scanEleveCopy);
          tempCall.current.students_scan = scanEleveCopy;
          updateCall();
        }
      });
  };
}

export default Presence;

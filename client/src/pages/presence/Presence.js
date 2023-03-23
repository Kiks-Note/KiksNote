import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import axios from "axios";

function Presence() {
  const { id } = useParams();
  const ip = process.env.REACT_APP_IP;
  const dataFetchedRef = useRef(false);
  const ws = new WebSocket(`ws://${ip}:5050`);
  const tempCall = useRef();
  const user = useRef();
  const userID = localStorage.getItem("user_uid");
  useEffect(() => {
    if (dataFetchedRef.current) {
      return;
    }
    dataFetchedRef.current = true;
    ws.onmessage = (event) => {
      tempCall.current = JSON.parse(event.data);
    };
    getCall();
    // getUsers();
  });

  const updateCall = async () => {
    console.log(tempCall.id);
    const res = await axios
      .post(`http://${ip}:5050/updatecall`, {
        id: tempCall.current.id,
        object: tempCall.current,
      })
      .then((res) => {
        console.log(res);
      });
    ws.send(JSON.stringify(tempCall));
  };

  const getCall = () => {
    axios
      .get(`http://${ip}:5050/getcall`, { params: { id: id } })
      .then((res) => {
        tempCall.current = res.data;
      });
  };
  const getUsers = () => {
    axios
      .get(`http://${ip}:5050/user`, { params: { id: userID } })
      .then((res) => {
        console.log(res.data);
        user.current = res.data;
        const scanEleveCopy = [...tempCall.current.student_scan];
        scanEleveCopy.push(user.current.firstname);
        console.log(scanEleveCopy);

        tempCall.current.student_scan = scanEleveCopy;
        console.log(tempCall.current.student_scan);
      });
  };

  return (
    <div>
      <button
        onClick={() => {
          updateCall();
        }}
      >
        Présent
      </button>
    </div>
  );
}

export default Presence;

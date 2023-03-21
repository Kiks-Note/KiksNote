import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

function Presence() {
  const { id } = useParams();
  const dataFetchedRef = useRef(false);
  const ws = new WebSocket(`ws://10.57.29.159:5050`);
  let tempCall;
  const [call, setCall] = useState();

  useEffect(() => {
    if (dataFetchedRef.current) {
      return;
    }
    dataFetchedRef.current = true;
    ws.onmessage = (event) => {
      tempCall = JSON.parse(event.data);
    };
    getCall();
  });

  const updateCall = async () => {
    console.log(tempCall.id);
    const res = await axios
      .post(`http://10.57.29.159:5050/updatecall`, {
        id: tempCall.id,
        object: tempCall,
      })
      .then((res) => {
        console.log(res);
      });
    ws.send(JSON.stringify(tempCall));
  };

  const getCall = () => {
    axios
      .get(`http://10.57.29.159:5050/getcall`, { params: { id: id } })
      .then((res) => {
        tempCall = res.data;
        setCall(call);
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

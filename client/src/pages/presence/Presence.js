import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

function Presence() {
  const { id } = useParams();
  const dataFetchedRef = useRef(false);
  const ws = new WebSocket("ws://192.168.1.16:4050");
  let tempCall;
  const [call, setCall] = useState();

  useEffect(() => {
    if (dataFetchedRef.current) {
      return;
    }
    dataFetchedRef.current = true;
    ws.onmessage = (event) => {
      console.log(JSON.parse(event.data));
    };
    getCall();
  });

  const updateCall = async () => {
    console.log(tempCall.id);
    const res = await axios
      .post("http://192.168.1.16:4000/updatecall", {
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
      .get("http://192.168.1.16:4000/getcall", { params: { id: id } })
      .then((res) => {
        console.log(res.data);
        tempCall = res.data;
        setCall(call);
      });
  };

  return (
    <div>
      <span>{id}</span>
      <button
        onClick={() => {
          updateCall();
        }}
      >
        test
      </button>
    </div>
  );
}

export default Presence;

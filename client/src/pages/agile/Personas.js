import React, { useState, useEffect } from "react";
import CardPersona from "../../components/agile/CardPersona";
import { w3cwebsocket } from "websocket";
import { Rings } from "react-loader-spinner";
import FormPersona from "../../components/agile/FormPersona";
export default function Persona({ dashboardId, actorId }) {
  const [loading, setLoading] = useState(true);
  const [persona, setPersona] = useState({});
  useEffect(() => {
    const wsComments = new w3cwebsocket(`ws://localhost:5050/persona`);
    wsComments.onopen = function (e) {
      wsComments.send(
        JSON.stringify({ dashboardId: dashboardId, actorId: actorId })
      );
    };
    wsComments.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        console.log(data.persona);
        setPersona(data.persona);
        setLoading(false);
      } catch (error) {
        setLoading(true);
        console.error(error);
      }
    };
  }, []);

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Rings
            height="200"
            width="200"
            color="#00BFFF"
            radius="6"
            wrapperStyle={{}}
            wrapperClass="loader"
            visible={true}
            ariaLabel="rings-loading"
          />
        </div>
      ) : Object.keys(persona).length === 0 ? (
        <FormPersona dashboardId={dashboardId} actorId={actorId} />
      ) : (
        <div style={{ margin: "40px" }}>
          <CardPersona info={persona} />
        </div>
      )}
    </>
  );
}

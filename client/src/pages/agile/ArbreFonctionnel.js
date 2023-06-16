import { useState, useEffect } from "react";
import { w3cwebsocket } from "websocket";
import { Rings } from "react-loader-spinner";
import Arbre from "../../components/agile/Arbre.js";

function ArbreFonctionnel({ dashboardId }) {
  const [selectedProject, setSelectedProject] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const wsComments = new w3cwebsocket(`ws://localhost:5050/three`);
    wsComments.onopen = function (e) {
      wsComments.send(JSON.stringify(dashboardId));
    };
    wsComments.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        console.log(data);
        setSelectedProject(data);
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
      ) : (
        <Arbre projet={selectedProject} dashboardId={dashboardId} />
      )}
    </>
  );
}

export default ArbreFonctionnel;

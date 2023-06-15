import React, {useEffect, useState} from "react";
import useFirebase from "../../hooks/useFirebase";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

function PhoneRequestDevice() {
  const [resquestDone, setRequestDone] = useState(false);
  const params = useParams();

  useEffect(() => {
    (async () => {
      await axios
        .post(`http://212.73.217.176:5050/inventory/preRequest/${params.deviceId}`)
        .then(() => {
          setRequestDone(true);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  return (
    <div>
      {resquestDone ? (
        <h1>La demande a bien été effectuée</h1>
      ) : (
        <h1>La demande n'a pas pu être effectuée</h1>
      )}
    </div>
  );
}

export default PhoneRequestDevice;

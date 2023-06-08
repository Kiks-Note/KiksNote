import AppelProf from "../../components/callteacher/Callteacher";
import AppelEleve from "../../components/callstudent/Callstudent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFirebase from "../../hooks/useFirebase";

function Appel() {
  const { user } = useFirebase();
  const callId = useParams();
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    console.log(callId.id);
    if (!generated) {
      setGenerated(true);
    }
  }, [callId.id, generated, user.status]);

  return (
    <div>
      {user.status === "po" ? (
        <AppelProf callId={callId.id}></AppelProf>
      ) : (
        <AppelEleve callId={callId.id}></AppelEleve>
      )}
    </div>
  );
}

export default Appel;

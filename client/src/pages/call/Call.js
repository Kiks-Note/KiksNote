import AppelProf from "../../components/callteacher/Callteacher";
import AppelEleve from "../../components/callstudent/Callstudent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFirebase from "../../hooks/useFirebase";

function Appel() {
  const [admin, setAdmin] = useState(false);
  let generated = false;
  const { user } = useFirebase();
  const callId = useParams();

  useEffect(() => {
    console.log(callId.id);
    if (!generated) {
      generated = true;
      user.status == "po" ? setAdmin(true) : setAdmin(false);
    }
  }, []);

  return (
    <div>
      {admin ? (
        <AppelProf callId={callId.id}></AppelProf>
      ) : (
        <AppelEleve callId={callId.id}></AppelEleve>
      )}
    </div>
  );
}

export default Appel;

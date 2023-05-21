import AppelProf from "../../components/callteacher/Callteacher";
import AppelEleve from "../../components/callstudent/Callstudent";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import jwt from "jwt-decode"; // import dependency
import useFirebase from "../../hooks/useFirebase";

function Appel() {
  const [admin, setAdmin] = useState(false);
  let generated = false;
  const { user } = useFirebase();

  useEffect(() => {
    if (!generated) {
      generated = true;
      user.status == "po" ? setAdmin(true) : setAdmin(false);
    }
  }, []);

  return (
    <div>{admin ? <AppelProf></AppelProf> : <AppelEleve></AppelEleve>}</div>
  );
}

export default Appel;

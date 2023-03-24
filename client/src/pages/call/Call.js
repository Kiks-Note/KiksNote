import AppelProf from "../../components/callteacher/Callteacher";
import AppelEleve from "../../components/callstudent/Callstudent";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function Appel() {
  const userID = localStorage.getItem("user_uid");
  const ip = process.env.REACT_APP_IP;
  const user = useRef();
  const [admin, setAdmin] = useState(false);
  let generated = false;
  useEffect(() => {
    if (!generated) {
      getUsers();
      generated = true;
    }
  }, []);

  const getUsers = () => {
    axios
      .get(`http://${ip}:5050/user`, { params: { id: userID } })
      .then((res) => {
        user.current = res.data;
        user.current.status == "po" ? setAdmin(true) : setAdmin(false);
      });
  };
  return (
    <div>
      {admin ? <AppelProf ip={ip}></AppelProf> : <AppelEleve></AppelEleve>}
    </div>
  );
}

export default Appel;

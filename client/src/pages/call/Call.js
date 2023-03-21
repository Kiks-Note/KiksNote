import AppelProf from "../../components/callteacher/Callteacher";
import AppelEleve from "../../components/callstudent/Callstudent";

function Appel() {
  const admin = true;

  return (
    <div>{admin ? <AppelProf></AppelProf> : <AppelEleve></AppelEleve>}</div>
  );
}

export default Appel;

import AppelProf from "../../components/appelprof/AppelProf";
import AppelEleve from "../../components/appeleleve/AppelEleve";

function Appel() {
  const admin = false;
  return (
    <div>{admin ? <AppelProf></AppelProf> : <AppelEleve></AppelEleve>}</div>
  );
}

export default Appel;

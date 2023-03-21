import AppelProf from "../../components/callteacher/Callteacher";
import AppelEleve from "../../components/callstudent/Callstudent";
import { useEffect, useState, useRef } from "react";

function Appel() {
  const admin = true;
  // Préparer une constante `ip` avec des données vides par défaut
  const [ip, setIp] = useState();

  const getIp = async () => {
    // Connecter ipapi.co avec fetch()
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    // Définir l'adresse IP avec la constante `ip`.
    setIp(data.ip);
  };

  // Exécutez la fonction `getIP` ci-dessus une seule fois lorsque la page est rendue.
  useEffect(() => {
    getIp();
  }, []);

  return (
    <div>
      {admin ? <AppelProf ip={ip}></AppelProf> : <AppelEleve></AppelEleve>}
    </div>
  );
}

export default Appel;

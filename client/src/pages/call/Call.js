import CallProf from "../../components/callteacher/Callteacher";
import CallEleve from "../../components/callstudent/Callstudent";

function Call() {
  const admin = true;
  return <div>{admin ? <CallProf></CallProf> : <CallEleve></CallEleve>}</div>;
}

export default Call;

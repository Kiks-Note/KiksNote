import RoutesProvider from "./Routes";
import { useEffect } from "react";
import { refreshToken } from "./services/refreshToken";
function App() {

  useEffect(() => {
    setInterval(refreshToken, 3600000);
  }, []);

  // const loggedUser = localStorage.getItem("user");
  // const loggedUserParsed = JSON.parse(loggedUser);
  // var status = loggedUserParsed.status
  // console.log(status)


  return (
    <>
      <RoutesProvider />
    </>
  );
}

export default App;

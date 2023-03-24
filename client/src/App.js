import RoutesProvider from "./Routes";
import { useEffect } from "react";
import { refreshToken } from "./services/refreshToken";
function App() {
  useEffect(() => {
    setInterval(refreshToken, 3600000);
  }, []);

  // exemple get data authentificate user 
  /* 
    const test = localStorage.getItem("user");
    const testParsed = JSON.parse(test);
    // firstname of user --> testParsed.firstname
  */

  return (
    <>
      <RoutesProvider />
    </>
  );
}

export default App;

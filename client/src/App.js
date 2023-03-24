import RoutesProvider from "./Routes";
import { useEffect } from "react";
import { refreshToken } from "./services/refreshToken";
function App() {
  useEffect(() => {
    setInterval(refreshToken, 3600000);
  }, []);

  return (
    <>
      <RoutesProvider />
    </>
  );
}

export default App;

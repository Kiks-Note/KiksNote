import RoutesProvider from "./Routes";
import { AppBar } from "@mui/material";
import Presence from "./pages/presence/Presence";
import { useEffect } from "react";
import { refreshToken } from "./services/refreshToken";
function App() {
  useEffect(() => {
    setInterval(refreshToken, 3600000);
  }, []);

  return (
    <>
      <RoutesProvider />
      <AppBar />
    </>
  );
}

export default App;

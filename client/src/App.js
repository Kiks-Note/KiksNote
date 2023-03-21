import RoutesProvider from "./Routes";
import { AppBar } from "@mui/material";
import Presence from "./pages/presence/Presence";
import Call from "./pages/call/Call";
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

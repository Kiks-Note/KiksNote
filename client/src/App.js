import RoutesProvider from "./Routes";
import { useEffect } from "react";
import { refreshToken } from "./services/refreshToken";
import { AppBar } from "@mui/material";
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

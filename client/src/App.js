import RoutesProvider from "./Routes";
import { AppBar } from "@mui/material";
import Presence from "./pages/presence/Presence";
import Call from "./pages/call/Call";
function App() {
  return (
    <>
      <RoutesProvider />
      <AppBar />
      <Call />
    </>
  );
}

export default App;

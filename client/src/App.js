import FirebaseContextProvider from "./config/firebase";
import RoutesProvider from "./Routes";
import { AppBar } from "@mui/material";

function App() {
  return (
    <FirebaseContextProvider>
      <RoutesProvider />
      <AppBar />
    </FirebaseContextProvider>
  );
}

export default App;

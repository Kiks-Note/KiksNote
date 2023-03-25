import RoutesProvider from "./Routes";
import {AppBar} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {useEffect} from "react";
import {refreshToken} from "./services/refreshToken";
import axios from "axios";

function App() {
  useEffect(() => {
    setInterval(refreshToken, 3600000);
  }, []);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <RoutesProvider />
        <AppBar />
      </LocalizationProvider>
    </>
  );
}

export default App;

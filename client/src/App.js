import RoutesProvider from "./Routes";
import {AppBar} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";

import {useEffect} from "react";
import {refreshToken} from "./services/refreshToken";
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
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <RoutesProvider />
        <AppBar />
      </LocalizationProvider>
    </>
  );
}

export default App;

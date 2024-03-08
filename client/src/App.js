import {AppBar} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import RoutesProvider from "./Routes";
import {useEffect} from "react";
import {refreshToken} from "./services/refreshToken";
function App() {
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

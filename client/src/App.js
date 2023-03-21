import RoutesProvider from "./Routes";
import {AppBar} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";

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

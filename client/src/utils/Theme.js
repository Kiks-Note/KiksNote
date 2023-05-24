import * as React from "react";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import App from "../App";
import { frFR } from "@mui/material/locale";
import CssBaseline from "@mui/material/CssBaseline";
import {FirebaseContextProvider} from "../hooks/useFirebase";

export const ColorModeContext = React.createContext();

export default function ToggleColorMode() {
  const [mode, setMode] = React.useState(() => {
    const savedMode = localStorage.getItem("color-mode");
    return savedMode !== null ? savedMode : "dark";
  });

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  React.useEffect(() => {
    localStorage.setItem("color-mode", mode);
  }, [mode]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          text: {
            primary: mode === "light" ? "#000" : "#fff",
            secondary: mode === "light" ? "#424242" : "#9e9e9e",
            default: mode === "light" ? "#000" : "#fff",
          },
          background: {
            default: mode === "light" ? "#f5f5f5" : "#212121",
            paper: mode === "light" ? "#eaeaea" : "#424242",
            container: mode === "light" ? "#eaeaea" : "#0f0f0f",
          },
          primary: {
            main: mode === "light" ? "#2196f3" : "#90caf9",
            dark: mode === "light" ? "#1976d2" : "#2196f3",
            light: mode === "light" ? "#64b5f6" : "#64b5f6",
          },
          secondary: {
            main: mode === "light" ? "#f50057" : "#f48fb1",
            dark: mode === "light" ? "#c51162" : "#f06292",
            light: mode === "light" ? "#ff4081" : "#ff8a80",
          },
          error: {
            main: mode === "light" ? "#f44336" : "#ff5252",
          },
          custom: {
            iconDrawer: mode === "light" ? "#000" : "#fff",
            iconPdf: mode === "light" ? "#fff" : "#000",
          },
        },
        frFR,
      }),
    [mode]
  );

  return (
    <FirebaseContextProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
           <CssBaseline />
          <App />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </FirebaseContextProvider>
  );
}

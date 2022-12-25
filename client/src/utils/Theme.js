import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import App from "../App";
import { frFR } from "@mui/material/locale";
import useMediaQuery from "@mui/material/useMediaQuery";

export const ColorModeContext = React.createContext();

export default function ToggleColorMode() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  let themeMode = "";
  prefersDarkMode === true ? (themeMode = "dark") : (themeMode = "light");
  const [mode, setMode] = React.useState(themeMode);
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          ...(mode === "dark"
            ? {
                text: {
                  primary: "#fff",
                  secondary: "#9e9e9e",
                },
                background: {
                  default: " #4d4d4d",
                  paper: " #404040",
                },
              }
            : {
                text: {
                  primary: "#000",
                  secondary: "#42424",
                },
                background: {
                  default: "#dedddd",
                  paper: "#cdcbcb",
                },
              }),
        },
        frFR,
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

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
  // ? TO ADD COLOR AND USE 
  // THIS THE PALETTE OF THE APP IF YOU CHANGE WANT TO ADD COLOR SPECIFIC ADD A ITEM IN CUSTOM
  // EXEMPLE WITH iconDrawer TO USE ON THE CODE  -->    style={{ color: theme.palette.custom.iconDrawer }}

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          ...(mode === "dark"
            ? {
                text: {
                  primary: "#fff",
                  secondary: "#9e9e9e",
                  default:"#000",
                },
                background: {
                  default: "#212121",
                  paper: "#424242",
                },
                primary: {
                  main: "#90caf9",
                  dark: "#2196f3",
                  light: "#64b5f6",
                },
                secondary: {
                  main: "#f48fb1",
                  dark: "#f06292",
                  light: "#ff8a80",
                },
                error: {
                  main: "#ff5252",
                },
                custom: {
                  iconDrawer: "#fff",
                },
              }
            : {
                text: {
                  primary: "#000",
                  secondary: "#424242",
                  default:"#000",
                },
                background: {
                  default: "#fafafa",
                  paper: "#fff",
                },
                primary: {
                  main: "#2196f3",
                  dark: "#1976d2",
                  light: "#64b5f6",
                },
                secondary: {
                  main: "#f50057",
                  dark: "#c51162",
                  light: "#ff4081",
                },
                error: {
                  main: "#f44336",
                },
                custom: {
                  iconDrawer: "#000",
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

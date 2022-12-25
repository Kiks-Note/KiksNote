import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Person2Icon from "@mui/icons-material/Person2";
import PropTypes from "prop-types";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import BallotIcon from "@mui/icons-material/Ballot";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../../utils/Theme";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer({ element }) {
  const [open, setOpen] = React.useState(false);
  const colorMode = React.useContext(ColorModeContext);
  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open} color="background.paper">
        <DrawerHeader>
          {open ? (
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon htmlColor="white" fontSize="large" />
            </IconButton>
          ) : (
            <IconButton onClick={handleDrawerOpen}>
              <ChevronRightIcon htmlColor="white" fontSize="large" />
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {[
            {
              id: 1,
              name: "Accueil",
              route: "/",
              icon: <HomeIcon  htmlColor="white" />,
            },
            {
              id: 2,
              name: "Agile",
              route: "#",
              icon: <BallotIcon  htmlColor="white" />,
            },
            {
              id: 3,
              name: "Profile",
              route: "#",
              icon: <Person2Icon  htmlColor="white" />,
            },
            {
              id: 4,
              name: "Espace de travail",
              route: "/dashboard",
              icon: <DashboardIcon  htmlColor="white" />,
            },
            {
              id: 5,
              name: "Blog",
              route: "#",
              icon: <AlternateEmailIcon  htmlColor="white" />,
            },
          ].map((page) => (
            <ListItem key={page.id} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                href={page.route}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {page.icon}
                </ListItemIcon>

                <ListItemText
                  primary={page.name}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        {/* Information for List to Logout */}
        <List>
          {[
            {
              id: 1,
              name: "Déconnexion",
              route: "#",
              icon: <LogoutOutlinedIcon  htmlColor="white" />,
            },
          ].map((page) => (
            <ListItem key={page.id} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {page.icon}
                </ListItemIcon>
                <ListItemText
                  primary={page.name}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          {theme.mode === "dark" ? (
            <IconButton
              sx={{ ml: 1 }}
              onClick={colorMode.toggleColorMode}
              color="inherit"
            >
              <Brightness7Icon />
            </IconButton>
          ) : (
            <IconButton
              sx={{ ml: 1 }}
              onClick={colorMode.toggleColorMode}
              color="inherit"
            >
              <Brightness4Icon />
            </IconButton>
          )}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <>{element}</>
      </Box>
    </Box>
  );
}

MiniDrawer.propTypes = {
  element: PropTypes.any,
};

import React from "react";
import PropTypes from "prop-types";
import { ColorModeContext } from "../../utils/Theme";
import { useTheme } from "@mui/material/styles";
import { createBrowserHistory } from "history";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolIcon from "@mui/icons-material/School";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import Logo from "./../../assets/logo/logo.png";

/// Drawer width where is open
const drawerWidth = 240;
/// Drawer open style
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});
/// Drawer close style
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

/// Drawer Header style
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
/// Drawer style
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

export default function MiniDrawerNotConnected({ element }) {
  const history = createBrowserHistory();
  const [open, setOpen] = React.useState(false);
  const colorMode = React.useContext(ColorModeContext);
  const theme = useTheme();
  const navigate = useNavigate();
  // List of page for the drawer NOT CONNECTED
  const [listPage, setListPage] = React.useState([
    {
      id: 1,
      name: "Blog",
      route: "/blog",
      icon: (
        <AlternateEmailIcon sx={{ color: theme.palette.custom.iconDrawer }} />
      ),
    },
    {
      id: 2,
      name: "Projet Mis en avant",
      route: "/studentprojects",
      icon: <SchoolIcon sx={{ color: theme.palette.custom.iconDrawer }} />,
    },
    {
      id: 3,
      name: "Connexion",
      route: "/login",
      icon: (
        <ConnectWithoutContactIcon
          sx={{ color: theme.palette.custom.iconDrawer }}
        />
      ),
    },
    {
      id: 4,
      name: "Inscription",
      route: "/signup",
      icon: (
        <AccountCircleIcon sx={{ color: theme.palette.custom.iconDrawer }} />
      ),
    },
  ]);
  /// Function for open or Close Drawer
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  /// Add an indicator if the page is active
  const isPageActive = (page) => {
    return (
      history.location.pathname === page.route ||
      (page.children &&
        page.children.some(
          (child) => child.route === history.location.pathname
        ))
    );
  };
  //To navigate on drawer
  const handleToggle = (id, route) => {
    const newPages = [...listPage];
    const index = newPages.findIndex((page) => page.id === id);

    if (newPages[index].children) {
      newPages[index].open = !newPages[index].open;
      setListPage(newPages);
    } else if (history.location.pathname !== route) {
      navigate(route);
    }
  };
  // MiniDrawer Types
  MiniDrawerNotConnected.propTypes = {
    element: PropTypes.any.isRequired,
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" open={open} color="background.default">
        <DrawerHeader>
          {open ? (
            <>
              <img
                src={Logo}
                alt="Code Note"
                style={{
                  height: "3vh",
                  width: "80%",
                  cursor: "pointer",
                }}
              />
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon
                  sx={{ color: theme.palette.custom.iconDrawer }}
                  fontSize="small"
                />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={handleDrawerOpen}>
              <ChevronRightIcon
                sx={{ color: theme.palette.custom.iconDrawer }}
                fontSize="large"
              />
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {listPage.map((page) => (
            <div key={page.id}>
              <ListItem
                disablePadding
                sx={{ display: "block" }}
                selected={isPageActive(page)}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: "space-between",
                    px: 2.5,
                    ...(isPageActive(page) && {
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                      borderRight: `4px solid ${theme.palette.secondary.main}`,
                    }),
                    "& svg": {
                      color: theme.palette.custom.iconDrawer,
                    },
                  }}
                  onClick={() => handleToggle(page.id, page.route)}
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
                    sx={{ opacity: open ? 1 : 0 }}
                    primary={page.name}
                  />
                  {page.children &&
                    (page.open ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                </ListItemButton>
              </ListItem>
              {page.children && (
                <Collapse in={page.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ marginLeft: 2 }}>
                    {page.children.map((child) => (
                      <ListItem
                        key={child.id}
                        disablePadding
                        sx={{ display: "block" }}
                      >
                        <ListItemButton
                          href={child.route}
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? "initial" : "center",
                            px: 2.5,
                            "& svg": {
                              color: theme.palette.custom.iconDrawer,
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : "auto",
                              justifyContent: "center",
                            }}
                          >
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={child.name}
                            sx={{ opacity: open ? 1 : 0 }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </List>
        <Divider />
        <List>
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
      <Box component="main">
        <>{element}</>
      </Box>
    </Box>
  );
}

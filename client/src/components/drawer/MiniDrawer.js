import React from "react";
import PropTypes from "prop-types";
import {ColorModeContext} from "../../utils/Theme";
import {useTheme} from "@mui/material/styles";
import {createBrowserHistory} from "history";
import {styled} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
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
import Tooltip from "@mui/material/Tooltip";

import GroupsIcon from "@mui/icons-material/Groups";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Person2Icon from "@mui/icons-material/Person2";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import BallotIcon from "@mui/icons-material/Ballot";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InventoryIcon from "@mui/icons-material/Inventory";
import WbIridescentIcon from "@mui/icons-material/WbIridescent";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import TimelineIcon from "@mui/icons-material/Timeline";
import SchoolIcon from "@mui/icons-material/School";
import BookIcon from "@mui/icons-material/Book";
import EventIcon from "@mui/icons-material/Event";

import Logo from "./../../assets/logo/logo.png";
import useFirebase from "../../hooks/useFirebase";

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
const DrawerHeader = styled("div")(({theme}) => ({
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
})(({theme, open}) => ({
  width: drawerWidth,
  flexShrink: 0,
  marginRight: "32px",
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

export default function MiniDrawer({element}) {
  const {user, logout} = useFirebase();
  const history = createBrowserHistory();
  const [open, setOpen] = React.useState(false);
  const colorMode = React.useContext(ColorModeContext);
  const theme = useTheme();
  const navigate = useNavigate();

  // List of page for the drawer
  const [listPage, setListPage] = React.useState([
    {
      id: 1,
      name: "Actus",
      icon: <NewspaperIcon sx={{color: theme.palette.custom.iconDrawer}} />,
      children: [
        {
          id: 9,
          name: "JPO",
          route: "/jpo",
          icon: <ListAltIcon sx={{color: theme.palette.custom.iconDrawer}} />,
        },
        {
          id: 10,
          name: "Blog",
          route: "/blog",
          icon: (
            <AlternateEmailIcon sx={{color: theme.palette.custom.iconDrawer}} />
          ),
        },
        {
          id: 11,
          name: "Projet Étudiant",
          route: "/studentprojects",
          icon: <SchoolIcon sx={{color: theme.palette.custom.iconDrawer}} />,
        },
      ],
    },
    {
      id: 2,
      name: "Profil",
      route: `/profil/${user?.id}`,
      icon: <Person2Icon sx={{color: theme.palette.custom.iconDrawer}} />,
    },
    {
      id: 3,
      name: "Cours",
      route: "/cours",
      icon: <LibraryBooksIcon sx={{color: theme.palette.custom.iconDrawer}} />,
    },
    {
      id: 4,
      name: "Calendrier",
      route: "/calendrier",
      icon: <CalendarTodayIcon sx={{color: theme.palette.custom.iconDrawer}} />,
    },
    ...(user && user?.status !== "Pédago"
      ? [
          {
            id: 5,
            name: "Agile",
            icon: <BallotIcon sx={{color: theme.palette.custom.iconDrawer}} />,
            children: [
              {
                id: 12,
                name: "Coding Board",
                route: "/tableau-de-bord",
                icon: (
                  <DashboardIcon
                    sx={{color: theme.palette.custom.iconDrawer}}
                  />
                ),
              },
              {
                id: 13,
                name: "Coding Retro",
                route: "/board",
                icon: (
                  <WbIridescentIcon
                    sx={{color: theme.palette.custom.iconDrawer}}
                  />
                ),
              },
              {
                id: 14,
                name: "Coding Agile",
                route: "/agile",
                icon: (
                  <TimelineIcon sx={{color: theme.palette.custom.iconDrawer}} />
                ),
              },
            ],
          },
        ]
      : []),
    {
      id: 6,
      name: "Inventaire",
      route: "/inventory",
      icon: <InventoryIcon sx={{color: theme.palette.custom.iconDrawer}} />,
    },
    {
      id: 7,
      name: "Groupes",
      route: "/groupes/creation",
      icon: <GroupsIcon sx={{color: theme.palette.custom.iconDrawer}} />,
    },
    {
      id: 8,
      name: "Mode d'emploi",
      route: "#",
      icon: <BookIcon sx={{color: theme.palette.custom.iconDrawer}} />,
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
    return history.location.pathname === page.route;
  };

  //To navigate on drawer
  const handleToggle = (id, route) => {
    const newPages = [...listPage];
    const index = newPages.findIndex((page) => page.id === id);

    if (newPages[index]?.children) {
      newPages[index].open = !newPages[index].open;
      setListPage(newPages);
    } else if (history.location.pathname !== route) {
      navigate(route);
    }
  };

  //To navigate on home
  const handleAvatarClick = () => {
    if (history.location.pathname !== "/") {
      navigate("/");
    }
  };
  //To logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  // MiniDrawer Types
  MiniDrawer.propTypes = {
    element: PropTypes.any.isRequired,
  };

  return (
    <Box sx={{display: "flex"}}>
      <Drawer variant="permanent" open={open} color="background.default">
        <DrawerHeader>
          {open ? (
            <>
              <img
                src={Logo}
                alt="Code Note"
                onClick={handleAvatarClick}
                style={{
                  height: "3vh",
                  width: "80%",
                  cursor: "pointer",
                }}
              />
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon
                  sx={{color: theme.palette.custom.iconDrawer}}
                  fontSize="small"
                />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={handleDrawerOpen}>
              <ChevronRightIcon
                sx={{color: theme.palette.custom.iconDrawer}}
                fontSize="large"
              />
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {listPage.map((page) => (
            <div key={page.id}>
              <ListItem disablePadding selected={isPageActive(page)}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: "space-between",
                    px: 2.5,
                    ...(isPageActive(page) && {
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                      borderRight: `4px solid ${theme.palette.secondary.main} !important`,
                    }),
                    "& svg": {
                      color: theme.palette.custom.iconDrawer,
                    },
                  }}
                  onClick={() => handleToggle(page.id, page.route)}
                >
                  <Tooltip title={page.name} placement="right">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {page.icon}
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText
                    sx={{display: open ? "block" : "none"}}
                    primary={page.name}
                  />
                  {page.children &&
                    (page.open ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                </ListItemButton>
              </ListItem>
              {page.children && (
                <Collapse in={page.open} timeout="auto" unmountOnExit>
                  <List
                    component="div"
                    disablePadding
                    sx={{marginLeft: open ? 5 : 0}}
                  >
                    {page.children &&
                      page.children.map((child) => (
                        <ListItem
                          key={child.id}
                          disablePadding
                          selected={isPageActive(child)}
                        >
                          <ListItemButton
                            sx={{
                              minHeight: 48,
                              justifyContent: "space-between",
                              ...(isPageActive(child) && {
                                backgroundColor: "rgba(0, 0, 0, 0.08)",
                                borderRight: `4px solid ${theme.palette.secondary.main} !important`,
                              }),
                              "& svg": {
                                color: theme.palette.custom.iconDrawer,
                              },
                            }}
                            onClick={() => handleToggle(child.id, child.route)}
                          >
                            <Tooltip title={child.name} placement="right">
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 3 : "auto",
                                  justifyContent: "center",
                                }}
                              >
                                {child.icon}
                              </ListItemIcon>
                            </Tooltip>
                            <ListItemText
                              primary={child.name}
                              sx={{opacity: open ? 1 : 0}}
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
        {user?.status === "pedago" && (
          <ListItem disablePadding sx={{display: "block"}}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                py: 1.5,
              }}
              onClick={() => navigate("/inventory/admin/dashboard")}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <InventoryIcon sx={{color: theme.palette.custom.iconDrawer}} />
              </ListItemIcon>
              <ListItemText
                primary={"Admin Inventaire"}
                sx={{opacity: open ? 1 : 0}}
              />
            </ListItemButton>
          </ListItem>
        )}
        <Divider />
        {/* Information for List to Logout */}
        <List>
          {[
            {
              id: 1,
              name: "Déconnexion",
              icon: (
                <LogoutOutlinedIcon
                  sx={{color: theme.palette.custom.iconDrawer}}
                />
              ),
            },
          ].map((page) => (
            <ListItem key={page.id} disablePadding sx={{display: "block"}}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={handleLogout}
              >
                <Tooltip title={page.name} placement="right">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {page.icon}
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  primary={page.name}
                  sx={{opacity: open ? 1 : 0}}
                />
              </ListItemButton>
            </ListItem>
          ))}
          {theme.mode === "dark" ? (
            <IconButton
              sx={{ml: 1}}
              onClick={colorMode.toggleColorMode}
              color="inherit"
            >
              <Brightness7Icon />
            </IconButton>
          ) : (
            <IconButton
              sx={{ml: 1}}
              onClick={colorMode.toggleColorMode}
              color="inherit"
            >
              <Brightness4Icon />
            </IconButton>
          )}
        </List>
      </Drawer>
      <Box component="main" sx={{width: "100%"}}>
        <>{element}</>
      </Box>
    </Box>
  );
}

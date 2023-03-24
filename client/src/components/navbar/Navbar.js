import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import BallotIcon from "@mui/icons-material/Ballot";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Person2Icon from "@mui/icons-material/Person2";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {styled} from "@mui/material/styles";
import PropTypes from "prop-types";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import userObj from "../../userObj";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {useTheme} from "@mui/material/styles";
import {ColorModeContext} from "../../utils/Theme";
import {accountAuthService} from "../../services/accountAuth";

const drawerWidth = 275;
const admin = true;

/// Drawer open style
const openedMixin = (theme) => ({
  width: drawerWidth,
  backgroundColor: "#1A2027",
  margin: 15,
  borderRadius: 15,
  height: "97%",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: 400,
  }),
  overflowX: "hidden",
});
/// Drawer close style
const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: 400,
  }),
  margin: 15,
  borderRadius: 15,
  backgroundColor: "#1A2027",
  overflowX: "hidden",
  // width: `calc(${theme.spacing(7)} + 1px)`,
  height: "97%",
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

/// Drawer Header style
const DrawerHeader = styled("div")(({theme}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  backgroundColor: "#1A2027",
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
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  borderRadius: 15,
  backgroundColor: "#1A2027",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const userRoutes = [
  {
    id: 1,
    name: "Accueil",
    route: "#",
    icon: <HomeIcon style={{color: "white"}} />,
  },
  {
    id: 2,
    name: "Agile",
    route: "#",
    icon: <BallotIcon style={{color: "white"}} />,
  },
  {
    id: 3,
    name: "Profile",
    route: "#",
    icon: <Person2Icon style={{color: "white"}} />,
  },
  {
    id: 4,
    name: "Board",
    route: "#",
    icon: <DashboardIcon style={{color: "white"}} />,
  },
  {
    id: 5,
    name: "Blog",
    route: "#",
    icon: <AlternateEmailIcon style={{color: "white"}} />,
  },
  {
    id: 6,
    name: "Inventaire",
    route: "/inventory",
    icon: <InventoryIcon style={{color: "white"}} />,
  },
];

const adminRoutes = [
  {
    id: 1,
    name: "Inventaire Dashboard",
    route: "/inventory/admin/dashboard",
    icon: <DashboardIcon style={{color: "white"}} />,
  },
];

export default function MiniDrawer({element}) {
  const [open, setOpen] = React.useState(false);
  const user = userObj;
  const colorMode = React.useContext(ColorModeContext);
  const theme = useTheme();
  /// Function for open or Close Drawer
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    accountAuthService.logout();
    localStorage.removeItem("userUid");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#11151a",
        minHeight: "100vh",
        // width: "100%",
      }}
    >
      {/* <CssBaseline /> */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
            <ChevronLeftIcon
              sx={{
                transform: open ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s ease-in-out",
                color: "white",
              }}
            />
          </IconButton>
        </DrawerHeader>
        <Divider
          sx={{
            backgroundColor: "transparent",
            flexShrink: 0,
            borderTop: "0px solid rgba(255, 255, 255, 0.12)",
            borderRight: "0px solid rgba(255, 255, 255, 0.12)",
            borderLeft: "0px solid rgba(255, 255, 255, 0.12)",
            borderBottom: "none",
            height: "0.0625rem",
            margin: "1rem 0",
            opacity: 0.25,
            backgroundImage:
              "linear-gradient(to right, rgba(52, 71, 103, 0), rgb(255, 255, 255), rgba(52, 71, 103, 0)) !important",
          }}
        />
        <List>
          {[
            {
              id: 1,
              name: "Accueil",
              route: "/",
              icon: (
                <HomeIcon style={{color: theme.palette.custom.iconDrawer}} />
              ),
            },
            {
              id: 2,
              name: "Agile",
              route: "#",
              icon: (
                <BallotIcon style={{color: theme.palette.custom.iconDrawer}} />
              ),
            },
            {
              id: 3,
              name: "Profil",
              route: "#",
              icon: (
                <Person2Icon style={{color: theme.palette.custom.iconDrawer}} />
              ),
            },
            {
              id: 4,
              name: "Espace de travail",
              route: "/tabList",
              icon: (
                <DashboardIcon
                  style={{color: theme.palette.custom.iconDrawer}}
                />
              ),
            },
            {
              id: 5,
              name: "Blog",
              route: "/blog",
              icon: (
                <AlternateEmailIcon
                  style={{color: theme.palette.custom.iconDrawer}}
                />
              ),
            },
          ].map((page) => (
            <ListItem key={page.id} disablePadding sx={{display: "block"}}>
              <ListItemButton
                href={page.route}
                sx={{
                  minHeight: 48,
                  justifyContent: "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 0,
                    transition: "all 0.3s ease-in-out",
                    justifyContent: "center",
                  }}
                >
                  {page.icon}
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Link
                      underline="none"
                      style={{
                        color: "white",
                        fontFamily: "poppins-regular",
                        fontSize: 16,
                        textDecoration: "none",
                        opacity: open ? 1 : 0,
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      {page.name}
                    </Link>
                  }
                  sx={{
                    opacity: open ? 1 : 0,
                    // transition: "opacity 0.3s ease-in-out",
                    color: "white",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {admin && (
          <>
            <Divider
              sx={{
                backgroundColor: "transparent",
                flexShrink: 0,
                borderTop: "0px solid rgba(255, 255, 255, 0.12)",
                borderRight: "0px solid rgba(255, 255, 255, 0.12)",
                borderLeft: "0px solid rgba(255, 255, 255, 0.12)",
                borderBottom: "none",
                height: "0.0625rem",
                margin: "0.5rem 0",
                opacity: 0.25,
                backgroundImage:
                  "linear-gradient(to right, rgba(52, 71, 103, 0), rgb(255, 255, 255), rgba(52, 71, 103, 0)) !important",
              }}
            />
            <List>
              {adminRoutes.map((page) => (
                <ListItem
                  onClick={() => {
                    navigate(page.route, {replace: true});
                  }}
                  key={page.id}
                  disablePadding
                  sx={{display: "block"}}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 0,
                        transition: "all 0.3s ease-in-out",
                        justifyContent: "center",
                      }}
                    >
                      {page.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Link
                          underline="none"
                          style={{
                            color: "white",
                            fontFamily: "poppins-regular",
                            fontSize: 16,
                            textDecoration: "none",
                            opacity: open ? 1 : 0,
                            transition: "all 0.3s ease-in-out",
                          }}
                        >
                          {page.name}
                        </Link>
                      }
                      sx={{
                        opacity: open ? 1 : 0,
                        // transition: "opacity 0.3s ease-in-out",
                        color: "white",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        )}
        <Divider
          sx={{
            backgroundColor: "transparent",
            flexShrink: 0,
            borderTop: "0px solid rgba(255, 255, 255, 0.12)",
            borderRight: "0px solid rgba(255, 255, 255, 0.12)",
            borderLeft: "0px solid rgba(255, 255, 255, 0.12)",
            borderBottom: "none",
            height: "0.0625rem",
            margin: "0.5rem 0",
            opacity: 0.25,
            backgroundImage:
              "linear-gradient(to right, rgba(52, 71, 103, 0), rgb(255, 255, 255), rgba(52, 71, 103, 0)) !important",
          }}
        />

        {/* Information for List to Logout */}
        <List>
          {[
            {
              id: 1,
              name: "Déconnexion",
              route: "#",
              icon: (
                <LogoutOutlinedIcon
                  style={{color: theme.palette.custom.iconDrawer}}
                />
              ),
            },
          ].map((page) => (
            <ListItem
              onClick={() => {
                navigate(page.route, {replace: true});
              }}
              key={page.id}
              disablePadding
              sx={{display: "block"}}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: "center",
                  px: 2.5,
                }}
                onClick={handleLogout}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 0,
                    transition: "all 0.3s ease-in-out",
                    justifyContent: "center",
                  }}
                >
                  {page.icon}
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Link
                      underline="none"
                      style={{
                        color: "white",
                        fontFamily: "poppins-regular",
                        fontSize: 16,
                        textDecoration: "none",
                        opacity: open ? 1 : 0,
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      {page.name}
                    </Link>
                  }
                  sx={{
                    opacity: open ? 1 : 0,
                    // transition: "opacity 0.3s ease-in-out",
                    color: "white",
                  }}
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
      <Box component="main" sx={{flexGrow: 1, p: 3}}>
        <>{element}</>
      </Box>
    </Box>
  );
}

MiniDrawer.propTypes = {
  element: PropTypes.func,
};

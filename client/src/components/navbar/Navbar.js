import * as React from "react";
import {styled} from "@mui/material/styles";
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
import Link from "@mui/material/Link";
import PropTypes from "prop-types";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import BallotIcon from "@mui/icons-material/Ballot";
import userObj from "../../userObj";
import {useNavigate} from "react-router-dom";
import InventoryIcon from "@mui/icons-material/Inventory";
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

const DrawerHeader = styled("div")(({theme}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({theme, open}) => ({
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

const userRoutes = [
  {id: 1, name: "Accueil", route: "#", icon: <HomeIcon />},
  {id: 2, name: "Agile", route: "#", icon: <BallotIcon />},
  {id: 3, name: "Profile", route: "#", icon: <Person2Icon />},
  {id: 4, name: "Board", route: "#", icon: <DashboardIcon />},
  {id: 5, name: "Blog", route: "#", icon: <AlternateEmailIcon />},
  {
    id: 6,
    name: "Inventaire",
    route: "/inventory",
    icon: <InventoryIcon />,
  },
];

export default function MiniDrawer({element}) {
  const [open, setOpen] = React.useState(false);
  const user = userObj;
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{display: "flex"}}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
            <ChevronLeftIcon
              sx={{
                transform: open ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {userRoutes.map((page) => (
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
                  primary={
                    <Link underline="none" color="dark">
                      {page.name}
                    </Link>
                  }
                  sx={{opacity: open ? 1 : 0}}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        {user.admin && (
          <>
            <List>
              {[
                {
                  id: 1,
                  name: "Demandes Inventaire",
                  route: "/inventoryRequests",
                  icon: <InventoryIcon />,
                },
              ].map((page) => (
                <ListItem
                  onClick={() => {
                    navigate(page.route);
                  }}
                  key={page.id}
                  disablePadding
                  sx={{display: "block"}}
                >
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
                      primary={
                        <Link underline="none" color="dark">
                          {page.name}
                        </Link>
                      }
                      sx={{opacity: open ? 1 : 0}}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
          </>
        )}
        {/* Information for List to Logout */}
        <List>
          {[
            {
              id: 1,
              name: "Déconnexion",
              route: "#",
              icon: <LogoutOutlinedIcon />,
            },
          ].map((page) => (
            <ListItem key={page.id} disablePadding sx={{display: "block"}}>
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
                  primary={
                    <Link href={page.route} underline="none" color="dark">
                      {page.name}
                    </Link>
                  }
                  sx={{opacity: open ? 1 : 0}}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{flexGrow: 1, p: 3}}>
        <DrawerHeader />
        <>{element}</>
      </Box>
    </Box>
  );
}

MiniDrawer.propTypes = {
  element: PropTypes.func,
};

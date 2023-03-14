import {makeStyles} from "@mui/styles";
import React, {useRef, useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import BallotIcon from "@mui/icons-material/Ballot";
import {Link, useNavigate} from "react-router-dom";
import Person2Icon from "@mui/icons-material/Person2";
import InventoryIcon from "@mui/icons-material/Inventory";
import {Box} from "@mui/system";

let drawerWidth = "15.625rem";
const drawerHeight = 1000;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    // height: drawerHeight,
  },
  drawer: {
    position: "fixed",
    display: "flex",
    width: 300,
    zIndex: 1000,
    backgroundColor: "#1A2027",
    boxShadow: "rgb(0 0 0 / 5%) 0rem 1.25rem 1.6875rem 0rem",
    display: "block",
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    borderRadius: 15,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
  },
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

function FloatingSidebar({element}) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const windowSize = useRef([window.innerWidth, window.innerHeight]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: 10,
        backgroundColor: "#11151a",
      }}
    >
      <div
        variant="permanent"
        open={open}
        className={classes.drawer}
        style={{
          width: open ? "15.625rem" : 65,
          transition: "width 0.5s",
          height: windowSize.current[1] - 40,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: open ? "flex-end" : "center",
          }}
        >
          <ChevronLeftIcon
            onClick={toggleDrawer}
            style={{
              color: "white",
              fontSize: 30,
              marginRight: open ? 10 : 0,
              marginTop: 10,
              cursor: "pointer",
              transform: open ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </div>

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
      </div>

      <Box
        style={{
          width: "100%",
          // height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#11151a",
          padding: 10,
          marginLeft: open ? "16.85rem" : 85,
          transition: "margin-left 0.5s",
        }}
      >
        {element}
      </Box>
    </div>
  );
}

export default FloatingSidebar;

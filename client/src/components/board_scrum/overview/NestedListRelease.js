import React, { useState } from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewListIcon from "@mui/icons-material/ViewList";
import axios from "axios";



function NestedListRelease({
  releases,
  dashboardId,
  selectedStories,
}) {
  const [open, setOpen] = useState({});

  const handleClick = (key) => () => {
    setOpen((prevState) => ({ ...prevState, [key]: !prevState[key] }));
  };

  const chooseBoard = async (sprint) => {
    await axios.post(
      `http://localhost:5050/dashboard/${dashboardId}/moveStories`,
      {
        boardId: sprint.boardId,
        storiesId: selectedStories,
      }
    );
  };

  return (
    <div >
      <List component="nav">
        {releases.map((release) => {
          const isOpen = open[release[0]] || false;
          return (
            <div key={release[0]}>
              <ListItem button onClick={handleClick(release[0])}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText inset primary={release[0]} />
                {isOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  style={{ marginLeft: "5%" }}
                >
                  {release[1].map((sprint) => (
                    <ListItem
                      key={sprint.id}
                      button
                      onClick={() => {
                        chooseBoard(sprint);
                      }}
                    >
                      <ListItemIcon>
                        <ViewListIcon />
                      </ListItemIcon>
                      <ListItemText inset primary={sprint.name} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </div>
          );
        })}
      </List>
    </div>
  );
}

NestedListRelease.propTypes = {
  releases: PropTypes.array.isRequired,
  dashboardId: PropTypes.string.isRequired,
  selectedStories: PropTypes.array.isRequired,
};

export default NestedListRelease;

import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
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

const styles = (theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

class NestedListRelease extends React.Component {
  state = { open: {} };

  handleClick = (key) => () => {
    console.log(key);
    this.setState({ [key]: !this.state[key] });
  };

  async chooseBoard(sprint) {
    axios.post("http://localhost:5050/dashboard/" + this.props.dashboardId + "/moveStories", {
      boardId: sprint.boardId,
      storiesId: this.props.selectedStories,
    });
  }

  render() {
    const { releases } = this.props;

    return (
      <div>
        <List component="nav">
          {releases.map((release) => {
            const open = this.state[release[0]] || false;
            return (
              <div key={release[0]}>
                <ListItem button onClick={this.handleClick(release[0])}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText inset primary={release[0]} />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding style={{ marginLeft: "5%" }}>
                    {release[1].map((sprint) => (
                      <ListItem
                        key={sprint.id}
                        button
                        onClick={() => {
                          this.chooseBoard(sprint);
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
}

export default withStyles(styles)(NestedListRelease);

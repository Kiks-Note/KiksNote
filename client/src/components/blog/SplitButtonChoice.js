import { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Grow from "@mui/material/Grow";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NewBlog from "./form/NewBlog";
import NewTuto from "./form/NewTuto";
import NewTuto2 from "./form/NewTuto2";

export default function SplitButtonChoice() {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [openBlog, setOpenBlog] = useState(false);
  const [openTuto, setOpenTuto] = useState(false);
  const [openTuto2, setOpenTuto2] = useState(false);
  const anchorRef = useRef(null);
  const toggleDrawerBlog = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenBlog(open);
  };
  const toggleDrawerTuto = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenTuto(open);
  };

  const toggleDrawerTuto2 = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenTuto2(open);
  };

  const handleMenuItemClick = (event, index) => {
    switch (index) {
      case 0:
        toggleDrawerBlog(event, true);
        break;
      case 1:
        toggleDrawerTuto(event, true);
        break;

      case 2:
        toggleDrawerTuto2(event, true);
        break;

      default:
        break;
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        <Button variant="contained" color="primary">
          Créer
        </Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>

        <Popper
          sx={{
            zIndex: 999999,
          }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    <MenuItem
                      onClick={(event) => handleMenuItemClick(event, 0)}
                    >
                      Créer un article de blog
                    </MenuItem>
                    <MenuItem
                      onClick={(event) => handleMenuItemClick(event, 2)}
                    >
                      Créer un tutoriel
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </ButtonGroup>
      <NewBlog open={openBlog} toggleDrawerModify={toggleDrawerBlog} />
      <NewTuto2 open={openTuto2} toggleDrawerModify={toggleDrawerTuto2} />
    </>
  );
}

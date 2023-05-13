import { useState } from "react";
import { Box } from "@mui/material";
import List from "@mui/material/List";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import SimpleDashboardForm from "../../components/board_scrum/dashboard/SimpleDashboardForm";

export default function ModalCreateSprint(props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Dione");

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue) => {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  };
  return (
    <Box>
      <List component="div" role="group">
        <IconButton
          aria-label="delete"
          onClick={handleClickListItem}
          size="large"
          color="primary"
        >
          <AddIcon />
        </IconButton>
        <SimpleDashboardForm
          id="ringtone-menu"
          keepMounted
          open={open}
          onClose={handleClose}
          value={value}
          members={props.members}
        />
      </List>
    </Box>
  );
}

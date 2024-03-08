import { useState } from "react";
import { Box, Button } from "@mui/material";
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
    <Box sx={{ margin: "1%" }}>
      <List component="div" role="group">
        <Button
          onClick={handleClickListItem}
          style={{
            backgroundColor: "#dd006b",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <AddIcon /> Dashboard
        </Button>
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

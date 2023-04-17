import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import {blue} from "@mui/material/colors";
import {useEffect, useState} from "react";

export function UserListDialog({open, toogleDialog, emails}) {
  const [_emails, setEmails] = useState([]);

  useEffect(() => {
    open === true && setEmails(emails) && console.log(emails);
  }, [open === true]);

  return (
    <Dialog open={open} onClose={() => toogleDialog(false)}>
      <DialogTitle>Liste du groupe</DialogTitle>
      <List sx={{pt: 0}}>
        {_emails.map((email, i) => (
          <ListItem key={i}>
            <ListItemAvatar>
              <Avatar sx={{bgcolor: blue[100], color: blue[600]}}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={email} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

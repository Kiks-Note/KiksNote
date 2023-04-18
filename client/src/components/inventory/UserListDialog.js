import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import {blue} from "@mui/material/colors";
import * as React from "react";

export function UserListDialog({open, toogleDialog, emails}) {
  const [_emails, setEmails] = React.useState([]);
  console.log(emails);

  React.useEffect(() => {
    open === true && setEmails(emails);
  }, [open === true]);

  return (
    <Dialog open={open} onClose={() => toogleDialog(false)}>
      <DialogTitle>Liste du groupe</DialogTitle>
      <List sx={{pt: 0, minWidth: "300px"}}>
        {_emails.map((email) => (
          <ListItem key={email}>
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

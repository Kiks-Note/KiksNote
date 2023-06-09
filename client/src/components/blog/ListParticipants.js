import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

export default function ListParticipants({ participants }) {
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        position: "relative",
        overflow: "auto",
        maxHeight: 300,
        "& ul": { padding: 0 },
      }}
      subheader={<li />}
    >
      {participants.map((participant) => (
        <li key={`section-${participant}`}>
          <ul>
            <ListItem key={`item-${participant.id}`}>
              <ListItemAvatar>
                <Avatar alt={participant.firstname} src={participant.image} />
              </ListItemAvatar>
              <ListItemText
                primary={`${participant.firstname} ${participant.lastname}`}
              />
            </ListItem>
          </ul>
        </li>
      ))}{" "}
    </List>
  );
}

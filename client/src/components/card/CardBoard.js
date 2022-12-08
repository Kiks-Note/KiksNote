import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function CardBoard({ picture, firstname, sprint_group ,fav }) {
  // const [fav, setFav] = React.useState(false);

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={<Avatar src={picture}></Avatar>}
        action={
          <IconButton aria-label="add to favorites">
            <FavoriteIcon color="secondary" />
          </IconButton>
        }
        title={firstname}
        subheader={sprint_group}
      />
      <CardContent></CardContent>
      <CardActions disableSpacing></CardActions>
    </Card>
  );
}

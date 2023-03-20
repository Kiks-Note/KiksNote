import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";

export default function CardBoard({ picture, firstname, sprint_group, fav }) {
  // const [fav, setFav] = React.useState(false);
  const navigate = useNavigate();

  const action = function () {
    navigate("/board");
  };

  return (
    <Card sx={{ maxWidth: 345 }} onClick={action}>
      <CardHeader
        avatar={<Avatar src={picture}></Avatar>}
        action={fav ? <FavoriteIcon color="secondary" /> : ""}
        title={firstname}
        subheader={sprint_group}
      />
      <CardContent></CardContent>
      <CardActions disableSpacing></CardActions>
    </Card>
  );
}

import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function CardBoard({ picture, firstname }) {
  const [fav, setFav] = React.useState(false);

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={<Avatar src={picture}></Avatar>}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={firstname}
        subheader="Groupe"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the
          mussels, if you like.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={() => setFav(!fav)} aria-label="add to favorites">
          {fav ? <StarIcon color="primary" /> : <StarIcon color="secondary" />}
        </IconButton>
      </CardActions>
    </Card>
  );
}

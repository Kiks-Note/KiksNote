
import {Typography,Grid } from "@mui/material";
import CardDashboard from "./CardDashboard";
import PropTypes from "prop-types";

ListCardDashboard.propTypes = {
  list: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  props: PropTypes.array.isRequired,
  favorisTell: PropTypes.func.isRequired,
};
ListCardDashboard.defaultProps = {
  favorisTell: () => {},
};
export default function ListCardDashboard(list, name,props,favorisTell) {
  return (
    <div sx={{ width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        {name}
      </Typography>
      <Grid container spacing={1}>
        {list.map((person) => (
          <Grid item xs={4} key={person.id}>
            <CardDashboard
              addTab={props.addTab}
              key={person.id}
              picture={person.picture}
              sprint_group={person.sprint_group}
              fav={person.favorite}
              isFavoris={favorisTell}
              id={person.id}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

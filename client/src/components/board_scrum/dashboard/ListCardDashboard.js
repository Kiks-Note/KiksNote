import { Typography, Grid } from "@mui/material";
import CardDashboard from "./CardDashboard";
import PropTypes from "prop-types";

ListCardDashboard.propTypes = {
  list: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  favorisTell: PropTypes.func.isRequired,
};
ListCardDashboard.defaultProps = {
  favorisTell: () => {},
};
export default function ListCardDashboard(list, name, favorisTell) {
  return (
    <div style={{ width: "100%" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        {name}
      </Typography>
      <Grid container spacing={2} style={{ padding: 16 }}>
        {list.map((person) => (
          <Grid item xs={3} key={person.id} style={{ padding: 16 }}>
            <CardDashboard
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

// import React, { useEffect, useState } from "react";

import CardBoard from "../../components/card/CardBoard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

function Board() {
  const infoUser = [
    {
      id: 1,
      prenom: "Chris",
      picture: "https://thispersondoesnotexist.com/image",
    },
    {
      id: 2,
      prenom: "Elim",
      picture: "https://thispersondoesnotexist.com/image",
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {infoUser.map((user, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <CardBoard picture={user.picture} firstname={user.prenom} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Board;

import React from "react";
import Card from "../../components/agile/Card";
import ImpactMapping from "../../components/agile/ImpactMapping";
import { Grid } from "@material-ui/core";

const AnalyseAgile = () => {
  return (
    <Grid container sx={{
      width: "100%",
      height: "100%",
      padding: 2,
      backgroundColor: "white",
    }}>
      {/* <Card title="Adrien" /> */}
      <Grid item xs={12} sx={{
        height: "100%",
        padding: 2,
        backgroundColor: "white",
      }}>
        <ImpactMapping />
      </Grid>
    </Grid>
  );
};

export default AnalyseAgile;

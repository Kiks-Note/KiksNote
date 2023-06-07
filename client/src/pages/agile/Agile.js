import React from "react";
import ImpactMapping from "../../components/agile/ImpactMapping";
import EmpathyMap from "../../pages/agile/EmpathyMap";
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
        {/* <EmpathyMap /> */}
      </Grid>
    </Grid>
  );
};

export default AnalyseAgile;

import React from "react";


import {
    Skeleton,
    Typography,
    Card,
    Grid
} from "@mui/material";

const SkeletonHistoryJpo = () => {
    return (
        <>
<div className="history-jpo-page">
            <div className="header-jpo">
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                Historique des JPO
              </Typography>
            </div>
            <div className="jpo-list-container">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card
                  key={index}
                  className="jpo-card"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    width: "70%",
                    margin: "30px",
                  }}
                >
                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      <Skeleton width={400} height={400} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div className="jpo-text">
                        <Typography
                          sx={{ paddingBottom: "10px", fontSize: "24px" }}
                        >
                          <Skeleton width={200} />
                        </Typography>
                        <Typography sx={{ paddingBottom: "10px" }}>
                          <Skeleton count={2} />
                        </Typography>
                        <Typography sx={{ textAlign: "center" }}>
                          <Skeleton width={150} />
                        </Typography>
                        <div>
                          <p>
                            <Skeleton />
                          </p>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </div>
          </div>
          </>
    );
};

export default SkeletonHistoryJpo;
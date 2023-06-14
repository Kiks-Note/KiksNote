import React from "react";


import {
    Grid,
    Typography,
    Skeleton,
    Card,
    CardContent,
    Chip,
    Avatar,
    Tooltip,

} from "@mui/material";

import LockRoundedIcon from "@mui/icons-material/LockRounded";

const SkeletonCours = () => {
    return (
        <>
        {Array.from({ length: 4 }).map((_, index) => (
    <Grid item xs={12} sm={6} md={3} key={index}>
        <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          height: "450px",
        }}
      >
        <h2
          style={{ paddingLeft: "10px", margin: "0" }}
          variant="h3"
          component="div"
        >
          <Skeleton width={150} />
        </h2>
        <Skeleton
          width={500}
          height={200}
          variant="rectangular"
        />

        <CardContent
          sx={{ padding: "10px", height: "120px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Chip label={<Skeleton width={100} />} />
            <Chip
              avatar={<Avatar />}
              variant="outlined"
              label={<Skeleton width={150} />}
            />
          </div>
          <div style={{ padding: "10px" }}>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Skeleton width={100} />
            </Typography>
          </div>

          <Tooltip title="Private">
            <LockRoundedIcon />
          </Tooltip>
        </CardContent>
      </Card>
    </Grid>
  ))}
        </>
  );
};

export default SkeletonCours;
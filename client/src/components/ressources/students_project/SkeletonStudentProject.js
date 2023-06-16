import React from "react";


import {
    Skeleton,
    Typography,
    Card,
    CardContent,
    Grid,
    FormControl,
    Select,
    MenuItem,
    Chip,
    Button
} from "@mui/material";

import CarouselProjects from "./../../../pages/ressources/students_project/CarouselProjects.js";

const SkeletonStudentProject = (props) => {
    return (
        <>
        <div className="students-project-container">
            <div className="header-students-projects">
              <FormControl sx={{ width: "20%" }}>
                <Select
                  value=""
                  displayEmpty
                  renderValue={() => "Type"}
                  disabled
                >
                  <MenuItem value="">Filtrer sur le type de projet</MenuItem>
                  <MenuItem value={1}>Type 1</MenuItem>
                  <MenuItem value={2}>Type 2</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ width: "20%" }}>
                <Select
                  value=""
                  displayEmpty
                  renderValue={() => "Promo"}
                  disabled
                >
                  <MenuItem value="">Filtrer sur la promo</MenuItem>
                  <MenuItem value={1}>Promo 1</MenuItem>
                  <MenuItem value={2}>Promo 2</MenuItem>
                </Select>
              </FormControl>
              <div></div>
            </div>
            <h1 className="h1-project">Top10 Projets Étudiants</h1>
            <CarouselProjects
              topProjects={props.filteredProjects.slice(0, 10)}
              loading={props.loading}
            />
            <h1 className="h1-project">Projets Étudiants</h1>
            <Grid container spacing={2}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "300px",
                    }}
                  >
                    <Skeleton width={300} height={300} variant="rectangular" />
                    <CardContent sx={{ padding: "10px", height: "120px" }}>
                      <div>
                        <h2 variant="h3" component="div">
                          <Skeleton width={200} />
                        </h2>
                      </div>
                      <Chip
                        sx={{ marginRight: "10px" }}
                        label={
                          <Typography>
                            <Skeleton width={100} />
                          </Typography>
                        }
                      />
                      <Button sx={{ color: "#7a52e1" }}>
                        <Skeleton width={30} height={20} />
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </>
    );
};

export default SkeletonStudentProject;
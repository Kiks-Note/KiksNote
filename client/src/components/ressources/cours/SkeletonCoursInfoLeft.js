import React from "react";


import {
    Skeleton,
    Divider

} from "@mui/material";

const SkeletonCoursInfoLeft = () => {
    return (
        <>
        <div className="cours-left-side-container">
                    <h2>Description</h2>
                    <Divider />
                    <p className="p-description-coursinfo">
                      <Skeleton />
                    </p>
                    <h2>Contenu du Cours</h2>
                    <Divider />
                    <div className="list-course-pdf">
                      <Skeleton
                        variant="rectangular"
                        width={750}
                        height={130}
                        sx={{ marginBottom: "30px" }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={750}
                        height={130}
                        sx={{ marginBottom: "30px" }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={750}
                        height={130}
                        sx={{ marginBottom: "30px" }}
                      />
                    </div>
                    <h2>Contenu du BackLog</h2>
                    <Divider />
                    <div className="list-course-pdf">
                      <Skeleton
                        variant="rectangular"
                        width={750}
                        height={130}
                        sx={{ marginBottom: "30px" }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={750}
                        height={130}
                        sx={{ marginBottom: "30px" }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={750}
                        height={130}
                        sx={{ marginBottom: "30px" }}
                      />
                    </div>
                  </div>
        </>
    );
};

export default SkeletonCoursInfoLeft;
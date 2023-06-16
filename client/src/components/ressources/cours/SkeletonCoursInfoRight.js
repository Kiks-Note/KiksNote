import React from "react";


import {
    Skeleton,
    Divider

} from "@mui/material";

const SkeletonCoursInfoRight = () => {
    return (
        <>
            <div className="cours-right-side-container">
                <Skeleton
                    variant="rect"
                    height={200}
                    style={{ borderTopRightRadius: "10px" }}
                />
                    <div className="display-date">
                      <h4 className="h4-data-cours-info">
                        <Skeleton variant="circle" width={20} height={20} />
                        Date début de Sprint :
                      </h4>
                      <Skeleton width={100} />
                    </div>
                    <div className="display-date">
                      <h4 className="h4-data-cours-info">
                        <Skeleton variant="circle" width={20} height={20} />
                        Date fin de Sprint :
                      </h4>
                      <Skeleton width={100} />
                    </div>
                    <h2 style={{ marginTop: "10px" }} variant="h6">
                      Classe concernée
                    </h2>
                    <Divider />
                    <div
                      style={{
                        display: "flex",
                        height: "7%",
                        alignItems: "center",
                      }}
                    >
                      <Skeleton variant="rect" width="40%" height={40} />
                    </div>
                    <h2 style={{ marginTop: "0px" }} variant="h6">
                      Products Owner / Pedago
                    </h2>
                    <Divider />
                    <div
                      style={{
                        display: "flex",
                        height: "7%",
                        alignItems: "center",
                      }}
                    >
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton width={100} />
                    </div>
                    <h2 style={{ marginTop: "10px" }} variant="h6">
                      Détails / Actions
                    </h2>
                    <Divider />
                    <div className="details-actions-container">
                      <div className="display-campus-num">
                        <h4 className="h4-data-cours-info">
                          <Skeleton variant="circle" width={20} height={20} />
                          Campus Numérique :
                        </h4>
                        <Skeleton width={100} />
                      </div>
                      <div className="display-cours-status">
                        <h4 className="h4-data-cours-info">
                          Statut du cours :{" "}
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Skeleton variant="circle" width={20} height={20} />
                          <Skeleton width={100} />
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
    );
};

export default SkeletonCoursInfoRight;
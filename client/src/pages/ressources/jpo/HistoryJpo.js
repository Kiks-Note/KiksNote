import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { Card, Typography, Grid, Skeleton } from "@mui/material";

import JpoCard from "./JpoCard";
import "./HistoryJpo.scss";

const HistoryJpo = () => {
  const [allPastJpo, setAllPastJpo] = useState([]);

  const [loading, setLoading] = useState(true);

  const getAllOldJpo = async () => {
    try {
      await axios
        .get("http://localhost:5050/ressources/pastjpo")
        .then((res) => {
          setAllPastJpo(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllOldJpo()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ? (
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
      ) : (
        <>
          <div className="history-jpo-page">
            <div className="header-jpo">
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                Historique des JPO
              </Typography>
            </div>
            <div className="jpo-list-container">
              {allPastJpo.map((jpoData, index) => (
                <JpoCard key={index} jpoData={jpoData} />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HistoryJpo;

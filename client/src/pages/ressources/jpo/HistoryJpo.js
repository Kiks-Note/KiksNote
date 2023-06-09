import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { Card, Typography, Grid, Skeleton } from "@mui/material";

import JpoCard from "./JpoCard";
import "./HistoryJpo.scss";

import SkeletonHistoryJpo from "../../../components/ressources/jpo/SkeletonHistoryJpo";

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
          <SkeletonHistoryJpo />
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

import React, {useState, useEffect} from "react";

import axios from "axios";

import {Typography, Box, List, ListItem} from "@mui/material";

import JpoCard from "./../../../components/ressources/jpo/JpoCard";
import SkeletonHistoryJpo from "../../../components/ressources/jpo/SkeletonHistoryJpo";

import "./Jpo.scss";

const HistoryJpo = () => {
  const [allPastJpo, setAllPastJpo] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllOldJpo = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_SERVER_API}/ressources/pastjpo`)
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
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  padding: "20px",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{fontWeight: "bold", marginLeft: "5%"}}
                >
                  Historique des JPO
                </Typography>
              </Box>
            </div>

            <div className="jpo-list-container">
              <List sx={{width: "85%"}}>
                {allPastJpo.map((jpoData, index) => (
                  <ListItem key={index}>
                    <JpoCard jpoData={jpoData} index={index} />
                  </ListItem>
                ))}
              </List>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HistoryJpo;

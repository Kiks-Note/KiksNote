import {Box, Divider, IconButton, Typography} from "@mui/material";
import React from "react";
import {IoIosEye} from "react-icons/io";

const BoxStats = ({label, value, onClick, loading}) => {
  return (
    <Box
      sx={{
        backgroundColor: "#1A2027",
        borderRadius: 5,
        px: 2,
        py: 3,
        mt: 2.5,
        boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
        width: "20%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        minHeight: 200,
      }}
    >
      <Typography
        sx={{
          fontFamily: "poppins-bold",
          color: "#fff",
          fontSize: 18,
          textAlign: "center",
        }}
      >
        {label}
      </Typography>
      <Divider
        sx={{
          width: "100%",
          height: "1px",
          backgroundColor: "#fff",
          opacity: 0.2,
          my: "10px",
        }}
      />
      <Typography
        sx={{
          fontFamily: "poppins-semiBold",
          color: "#fff",
          fontSize: 30,
        }}
      >
        {loading ? "..." : value}
      </Typography>
      <IconButton
        onClick={onClick}
        sx={{
          position: "absolute",
          bottom: 10,
          right: 10,
          opacity: 0.8,
        }}
      >
        <IoIosEye style={{fontSize: 30, color: "#fff", opacity: 0.6}} />
      </IconButton>
    </Box>
  );
};

export default BoxStats;

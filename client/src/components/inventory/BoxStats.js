import {Box, Divider, IconButton, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import React from "react";
import {IoIosEye} from "react-icons/io";

const BoxStats = ({label, value, onClick, loading}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
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
        style={{
          fontFamily: "poppins-bold",
          color: theme.palette.text.primary,
          fontSize: 18,
          textAlign: "center",
        }}
      >
        {label}
      </Typography>
      <Divider
        sx={{
          width: "100%",
          height: "2px",
          borderRadius: 1,
          backgroundColor: theme.palette.text.secondary,
          opacity: 0.4,
          my: "10px",
        }}
      />
      <Typography
        style={{
          fontFamily: "poppins-semiBold",
          color: theme.palette.text.primary,
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
        <IoIosEye
          style={{
            fontSize: 30,
            color: theme.palette.text.primary,
            opacity: 0.6,
          }}
        />
      </IconButton>
    </Box>
  );
};

export default BoxStats;

import {TextField} from "@mui/material";
import React from "react";

const StyledTextField = ({
  defaultValue,
  onChange,
  value,
  placeholder,
  type,
  disabled,
  multiline,
  rows,
}) => {
  return (
    <TextField
      sx={{marginBottom: 2}}
      id="outlined-search"
      variant="outlined"
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      multiline={multiline}
      rows={rows}
      fullWidth
      onChange={onChange}
      disabled={disabled}
      value={value}
      InputProps={{
        sx: {
          "&:hover fieldset": {
            border: "2px solid white!important",
            borderRadius: "5px",
          },
          "&:focus-within fieldset, &:focus-visible fieldset": {
            border: "2px solid white!important",
            borderRadius: "5px",
          },
        },
      }}
      inputProps={{
        sx: {
          color: "white",
          fontFamily: "poppins-regular",
          "&:disabled": {
            color: "white",
            fontFamily: "poppins-regular",
            "&:disabled": {
              color: "white", // change this to the desired color
              fontFamily: "poppins-regular",
            },
          },
        },
      }}
      InputLabelProps={{
        sx: {
          color: "white",
          fontFamily: "poppins-regular",
          "&:disabled": {
            color: "white", // change this to the desired color
            fontFamily: "poppins-regular",
          },
        },
      }}
    />
  );
};

export default StyledTextField;

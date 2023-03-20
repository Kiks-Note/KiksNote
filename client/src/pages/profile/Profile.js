import React, { useEffect } from "react";
import axios from "axios";

import { FormControl, Input, InputLabel, FormHelperText } from "@mui/material";

import "./Profile.scss";

export default function Profile() {

  const fetchUser = async () => {
    const res = await axios.get("http://localhost:5050/profile/getUser");
    console.log(res.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="userForms">
      <FormControl className="formControl">
        <InputLabel htmlFor="my-input">Email address</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text" />
        <FormHelperText id="my-helper-text">
          We'll never share your email.
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input"> User's Name</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text" />
        <FormHelperText id="my-helper-text">
          We'll never share your name.
        </FormHelperText>
      </FormControl>
    </div>
  );
}

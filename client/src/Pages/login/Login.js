import React, { useState, useEffect } from "react";
import "./Login.scss";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import {
  FormControl,
  InputLabel,
  Input /*FormHelperText*/,
} from "@mui/material";

const Login = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    console.log(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(verifError(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  });

  const verifError = (values) => {
    const errors = {};
    const regexedu = /^[^\s@]+@edu\.esiee-it\.fr$/;
    const password = "coding";

    if (!regexedu.test(values.email)) {
      errors.email = "L'adresse mail est incorrect !";
    }
    if (password !== values.password) {
      errors.password = "Le mot de passe est incorrect!";
    }
    
    return errors;
  };

  // @edu.itescia.fr
  return (
    <div className="Login">
      <header className="Login-header">
        <Box sx={{ boxShadow: 5 }} style={{ width: "50%", padding: "15px" }}>
          <h1 style={{ margin: 10 }}>Connexion</h1>
          <Divider
            variant="middle"
            style={{ background: "#fff", height: "1px" }}
          />
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            padding={2}
          >
            <form >
              <InputLabel
                htmlFor="input-email"
                style={{ color: "white", fontWeight: "bold" }}
              >
                Adresse mail
              </InputLabel>
              <Input
                name="email"
                type="email"
                id="input-email"
                aria-describedby="my-helper-text"
                style={{ color: "white" }}
                value={formValues.email}
                onChange={handleChange}
              />
              <span>{formErrors.email}</span>
              <InputLabel
                htmlFor="input-password"
                style={{ color: "white", fontWeight: "bold" }}
              >
                Mot de passe
              </InputLabel>
              <Input
                name="password"
                type="password"
                id="input-password"
                aria-describedby="my-helper-text"
                style={{ color: "white" }}
                value={formValues.password}
                onChange={handleChange}
              />
              <span>{formErrors.password}</span>
            </form>

            {/* <FormHelperText id="my-helper-text">
                  <Link href="#" underline="none" style={{ color: "white" }}>
                    Mot de passe oublie ?
                  </Link>
                </FormHelperText> */}
            <button onClick={handleSubmit}>Gz</button>
          </Grid>
          <p style={{ fontSize: "12px", marginTop: 0 }}>
            Pas encore de compte? Créez-en un{" "}
            <Link href="#" underline="none">
              ici
            </Link>
          </p>
        </Box>
      </header>
    </div>
  );
};

export default Login;

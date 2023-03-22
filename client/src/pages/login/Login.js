import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Container,
  Box,
  Button,
  Link,
  Grid,
} from "@mui/material";

import axios from "axios";

import { accountAuthService } from "../../services/accountAuth";

import { useNavigate } from "react-router-dom";

import { initializeApp } from "firebase/app";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import "./Login.scss";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
};

initializeApp(firebaseConfig);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setMessageError] = useState("");

  const auth = getAuth();

  const navigate = useNavigate();

  const onChangeEmail = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        userCredential.user.getIdToken().then(async (idToken) => {
          console.log(userCredential.user);
          await axios
            .post("http://localhost:5050/auth/login", {
              idToken,
            })
            .then((res) => {
              accountAuthService.saveTokens(
                res.data.token,
                userCredential.user.stsTokenManager.refreshToken
              );
              navigate("/");
            })
            .catch(
              (err) => setMessageError(err.response.data),
              console.log(errorMessage)
            );
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  return (
    <div className="Login">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        className="login-page"
      >
        <Grid item xs={6}>
          <div className="Login-header">
            <div className="container-login">
              <Typography
                component="h1"
                className="text-4xl font-extrabold m-4 text-center"
              >
                Connexion
              </Typography>
              <form className="p-15" onSubmit={onSubmit}>
                {/* mail adress label and input */}
                <Container fixed className="textfield-box-login">
                  <TextField
                    variant="standard"
                    fullWidth
                    className="textfield-login"
                    label="Adresse mail"
                    // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="input-email"
                    defaultValue={email}
                    onChange={onChangeEmail}
                  />
                  {errorMessage === "Incorrect email" && (
                    <Typography
                      sx={{ fontWeight: "bold" }}
                      className="error-text-login"
                    >
                      L'email est incorrecte
                    </Typography>
                  )}
                </Container>
                {/* password label and input */}
                <Container fixed className="textfield-box-login">
                  <TextField
                    type="password"
                    variant="standard"
                    fullWidth
                    label="Mot de passe"
                    // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="input-password"
                    defaultValue={password}
                    onChange={onChangePassword}
                  />
                  {errorMessage === "Wrong password" && (
                    <Typography
                      sx={{ fontWeight: "bold" }}
                      className="error-text-login"
                    >
                      Le mot de passe est incorrect
                    </Typography>
                  )}
                  {errorMessage ===
                    "Email and password is required to login" && (
                    <Typography
                      sx={{ fontWeight: "bold" }}
                      className="error-text-login"
                    >
                      Il manque l'email ou le mot de passe
                    </Typography>
                  )}

                  <Link href="/askresetpass">Mot de passe oublie ?</Link>
                </Container>
                <Box textAlign="center" className="button-box-login">
                  <Button type="submit" variant="contained">
                    Connexion
                  </Button>
                </Box>
              </form>

              <p className="text-sm font-medium text-center m-3">
                Pas encore de compte? Créez-en un{" "}
                <Link href="/signup">ici</Link>
              </p>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;

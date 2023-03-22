import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Container,
  Box,
  Button,
  Link,
  Grid
} from "@mui/material";
import { createTheme } from '@mui/material/styles';
import MailIcon from '@mui/icons-material/Mail';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';

import axios from "axios";

import { accountAuthService } from "../../services/accountAuth";

import { useNavigate } from "react-router-dom";

import "./Login.scss";
import imgLogin from "./../../assets/img/login_img.svg";

const theme = createTheme({
  palette: {
    primary: {
      main: '#7a52e1',
      darker: '#7a52e1',
    },
    neutral: {
      main: '#341a9f',
      contrastText: '#fff',
    },
  },
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setMessageError] = useState("");

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
    await axios
      .post("http://localhost:5050/auth/login", {
        email,
        password,
      })
      .then((res) => {
        accountAuthService.saveTokens(
          res.data.access_token,
          res.data.refreshToken
        );
        navigate("/");
      })
      .catch(
        (err) => setMessageError(err.response.data),
        console.log(errorMessage)
      );
  };

  return (
    <div className="login">
      <Container className="login-image-box" sx={{
        backgroundImage: `url(${imgLogin})`,
        width: "60%",
        borderRadius: "25px 0px 0px 25px",
        objectFit: "scale-down",
        backgroundColor: "#7a52e1"
      }}>
      </Container>
      <div className="login-header">
        <Container sx={{
          marginTop: "20%",
          marginBottom: "20%",
          width: "90%",
        }}>
          <Typography component="h1" sx={{
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
          }}>
            Connexion
          </Typography>
          <form className="p-15" onSubmit={onSubmit}>
            {/* mail adress label and input */}
            <Container fixed maxWidth="lg" sx={{
              padding: "10px",
              display: "flex",
              flexDirection: "row", 
            }}>
              <MailIcon sx={{
                marginTop: "20px",
                marginRight: "10px",
                color: "#7a52e1",
              }}/>
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
                <Typography sx={{fontWeight: 'bold'}} className="error-text-login">
                  L'email est incorrecte
                </Typography>
              )}
            </Container>
            {/* password label and input */}
            <Container fixed maxWidth="xl" sx={{
              padding: "10px",
              display: "flex",
              flexDirection: "row", 
            }}>
              <LockIcon sx={{
                marginTop: "20px",
                marginRight: "10px",
                color: "#7a52e1",
              }}/>
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
                <Typography sx={{fontWeight: 'bold'}} className="error-text-login">Le mot de passe est incorrect</Typography>
              )}
              {errorMessage === "Email and password is required to login" && (
                <Typography sx={{fontWeight: 'bold'}} className="error-text-login">
                  Il manque l'email ou le mot de passe
                </Typography>
              )}
              
            </Container>
            <Container sx={{
              textAlign: "right",
              marginBottom: "20px",
            }}>
              <Link href="/askresetpass" sx={{
                color: "#7a52e1",
                textDecoration: "none",
              }}>Mot de passe oublie ?</Link>
            </Container>
            <Box textAlign='center' className="button-box-login">
              <Button type="submit" className="login-button" sx={{
                backgroundColor: "#7a52e1",
              }} variant="contained">
                Connexion
              </Button>
            </Box>
          </form>

          <p className="text-sm font-medium text-center m-3">
            Pas encore de compte? Créez-en un{" "}
            <Link
              href="/signup"
              sx={{
                color: "#7a52e1",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              ici
            </Link>
          </p>
        </Container>
      </div>
    </div>
  );
};

export default Login;

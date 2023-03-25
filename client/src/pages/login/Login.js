import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  TextField,
  Typography,
  Container,
  Box,
  Button,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";

import axios from "axios";

import { accountAuthService } from "../../services/accountAuth";

import "./Login.scss";
import imgLogin from "./../../assets/img/login_img.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setMessageError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [messageEmail, setMessageEmail] = useState("");
  const [messagePassword, setMessagePassword] = useState("");
  const regex = /@edu\.esiee-it\.fr/;

  const navigate = useNavigate();

  const onChangeEmail = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };



  const login = async (email, password) => {
    await axios
      .post("http://localhost:5050/auth/login", {
        email,
        password,
      })
      .then((res) => {
        console.log(res.data.userUid)
        localStorage.setItem("userUid", res.data.userUid)
        localStorage.setItem("user", JSON.stringify(res.data.user))
        accountAuthService.saveTokens(res.data.token, res.data.refreshToken);
        navigate("/");
      })
      .catch(
        (err) => setMessageError(err.response.data),
        console.log(errorMessage)
      );
  }

  const verifInputErrors = (email, password) => {
    if (email === "") {
      setErrorEmail(true);
      setMessageEmail("Email requis");
    }
    else if (regex.test(email)) {
      setErrorEmail(false);
      setMessageEmail("");
    }
    else {
      setErrorEmail(true);
      setMessageEmail("L'email doit finir par @edu.esiee-it.fr");
    }
    if (password === "") {
      setErrorPassword(true);
      setMessagePassword("Password requis");
    }
    else if (password.length >= 6) {
      setErrorPassword(false);
      setMessagePassword("");
    }
    else {
      setErrorPassword(true);
      setMessagePassword("Le mot de passe est incorrect");
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
    verifInputErrors(email, password);
  };

  return (
    <div className="login-page-container">
      <div className="login">
        <Container
          className="login-image-box"
          sx={{
            backgroundImage: `url(${imgLogin})`,
            width: "60%",
            borderRadius: "25px 0px 0px 25px",
            objectFit: "scale-down",
            backgroundColor: "#7a52e1",
          }}
        ></Container>
        <div className="login-header">
          <Container
            sx={{
              marginTop: "20%",
              marginBottom: "20%",
              width: "90%",
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontSize: 30,
                fontWeight: "bold",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Connexion
            </Typography>
            <form className="p-15" onSubmit={onSubmit}>
              {/* mail adress label and input */}
              <Container
                fixed
                maxWidth="lg"
                sx={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <MailIcon
                  sx={{
                    marginTop: "20px",
                    marginRight: "10px",
                    color: "#7a52e1",
                  }}
                />
                <TextField
                  variant="standard"
                  fullWidth
                  className="textfield-login"
                  label="Adresse mail"
                  id="input-email"
                  defaultValue={email}
                  onChange={onChangeEmail}
                  error={errorEmail}
                  helperText={messageEmail}
                />
              </Container>
              {/* password label and input */}
              <Container
                fixed
                maxWidth="xl"
                sx={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <LockIcon
                  sx={{
                    marginTop: "20px",
                    marginRight: "10px",
                    color: "#7a52e1",
                  }}
                />
                <TextField
                  type={showPassword ? "text" : "password"}
                  variant="standard"
                  fullWidth
                  label="Mot de passe"
                  id="input-password"
                  defaultValue={password}
                  onChange={onChangePassword}
                  error={errorPassword}
                  helperText={messagePassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility style={{ color: "#7a52e1" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Container>
              <Container
                sx={{
                  textAlign: "right",
                  marginBottom: "20px",
                }}
              >
                <Link
                  href="/askresetpassword"
                  sx={{
                    color: "#7a52e1",
                    textDecoration: "none",
                  }}
                >
                  Mot de passe oublie ?
                </Link>
              </Container>
              <Box textAlign="center" className="button-box-login">
                <Button
                  type="submit"
                  className="login-button"
                  sx={{
                    backgroundColor: "#7a52e1",
                  }}
                  variant="contained"
                >
                  Connexion
                </Button>
              </Box>
            </form>

            <p className="text-sm font-medium text-center m-3">
              Pas encore de compte? Créez-en un{" "}
              <Link
                href="/register"
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
    </div>
  );
};

export default Login;

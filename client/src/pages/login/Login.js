import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import MailIcon from "@mui/icons-material/Mail";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  useTheme,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "universal-cookie";
import { signInWithEmailAndPassword } from "firebase/auth";

import imgLogin from "./../../assets/img/login_img.svg";
import "./Login.scss";
import useFirebase from "../../hooks/useFirebase";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

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
  const theme = useTheme();
  const cookies = new Cookies();
  const { auth } = useFirebase();

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

  const login = async () => {
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }
    try {
      const loggedInUser = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await loggedInUser.user.getIdToken();

      await axios
        .post("http://10.160.33.226:5050/auth/login", {
          token,
        })
        .then(() => {
          cookies.set("token", token, {
            path: "/",
            secure: true,
            sameSite: "none",
            expires: new Date(Date.now() + 604807200),
          });
          cookies.set("lastConnectionAt", Date.now() + 604807200, {
            path: "/",
            secure: true,
            sameSite: "none",
            expires: new Date(Date.now() + 604807200),
          });
          navigate("/");
        })
        .catch((err) => {
          console.log(err.message);
          toast.error(err.message);
        });
    } catch (e) {
      if (e.message.includes("auth/invalid-email")) {
        toast.error("Cet email n'est associé à aucun compte !");
        return;
      }
      if (e.message.includes("auth/wrong-password")) {
        toast.error("Mot de passe incorrect !");
        return;
      }
      toast.error("Une erreur est survenue");
      console.log(e);
    }
  };

  const verifInputErrors = (email, password) => {
    if (email === "") {
      setErrorEmail(true);
      setMessageEmail("L'adresse email est requis");
    } else if (regex.test(email)) {
      setErrorEmail(false);
      setMessageEmail("");
    } else {
      setErrorEmail(true);
      setMessageEmail("L'email doit finir par @edu.esiee-it.fr");
    }
    if (password === "") {
      setErrorPassword(true);
      setMessagePassword("Le mot de passe est requis");
    } else if (password.length >= 6) {
      setErrorPassword(false);
      setMessagePassword("");
    } else {
      setErrorPassword(true);
      setMessagePassword("Le mot de passe est incorrect");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
    verifInputErrors(email, password);
  };

  return (
    <div className="login-page-container">
      <Toaster />
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
        <div
          className="login-header"
          style={{ backgroundColor: theme.palette.background.container }}
        >
          <Container
            sx={{
              marginTop: "20%",
              marginBottom: "20%",
              width: "90%",
            }}
          >
            <Typography
              component="h1"
              color="text.primary"
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
                  sx={{
                    input: { color: "text.primary" },
                  }}
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
                  sx={{
                    input: { color: "text.primary" },
                  }}
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
                            <VisibilityOff style={{ color: "#7a52e1" }} />
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
                    cursor: "pointer",
                  }}
                >
                  Mot de passe oublié ?
                </Link>
              </Container>
              <Box textAlign="center" className="button-box-login">
                <Button
                  type="submit"
                  className="login-button"
                  sx={{
                    backgroundColor: "#7a52e1",
                    color: "white",
                    cursor: "pointer",
                  }}
                  variant="contained"
                >
                  Connexion
                </Button>
              </Box>
            </form>

            <p className="text-sm font-medium text-center m-3 font-bold">
              Pas encore de compte ? Créez-en un{" "}
              <Link
                href="/signup"
                sx={{
                  color: "#7a52e1",
                  textDecoration: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Ici
              </Link>
            </p>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Login;

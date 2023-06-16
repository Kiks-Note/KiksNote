import React, {useState} from "react";
import "./AskResetPassword.scss";
import axios from "axios";
import {Box, TextField, Button, Typography} from "@mui/material";

import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {useTheme} from "@mui/material";

import ForgotPasswordArt from "../../assets/img/forgot_password.svg";

const options = {
  autoClose: 2000,
  className: "",
  position: toast.POSITION.TOP_RIGHT,
  theme: "colored",
};

export const toastSuccess = (message) => {
  toast.success(message, options);
};

export const toastFail = (message) => {
  toast.error(message, options);
};

const AskResetPassword = () => {
  const theme = useTheme();
  const [mail, setMail] = useState("");

  const sendEmailFromFront = async () => {
    try {
      await axios
        .post(`${process.env.REACT_APP_SERVER_API}/auth/reset-password`, {
          email: mail,
        })
        .then((res) => {
          if (res.status === 200) {
            toastSuccess(`Mail envoyé à ${mail}`);
          }
        })
        .catch((err) => {
          if (err.response.status === 404) {
            toastFail(err.response.data.message);
          }
        });
    } catch (error) {
      toastFail(error.response.data.message);
    }
  };

  const onChangeEmail = (e) => {
    e.preventDefault();
    setMail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendEmailFromFront();
  };

  return (
    <div
      className="reset-password-page"
      style={{backgroundColor: theme.palette.background.paper}}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          style={{
            width: "80%",
            height: "70%",
            display: "flex",
            padding: "20px",
            backgroundColor: theme.palette.background.container,
          }}
          className="box-form-reset-with-mail"
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            style={{margin: 10, fontSize: "2vw"}}
          >
            Réinitialiser le mot de passe
          </Typography>
          <div style={{padding: "5%"}}>
            <img
              src={ForgotPasswordArt}
              style={{
                width: "100%",
                borderRadius: "25px",
                objectFit: "scale-down",
                backgroundColor: "#7a52e1",
              }}
              alt="forgot-password-img"
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              placeholder="votre adresse mail"
              variant="standard"
              fullWidth
              className="textfield-login"
              label="Adresse mail"
              id="input-email"
              defaultValue={mail}
              onChange={onChangeEmail}
              sx={{
                input: {color: "text.primary"},
                width: "70%",
              }}
            />
            <Button
              id="submit-email"
              type="submit"
              variant="contained"
              style={{
                backgroundColor: "#7a52e1",
                color: "black",
                fontWeight: "bold",
                textTransform: "none",
                margin: "10px",
                marginTop: "20px",
              }}
              onClick={handleSubmit}
            >
              Envoyer
            </Button>
          </div>
        </Box>
      </div>

      <ToastContainer></ToastContainer>
    </div>
  );
};
export default AskResetPassword;

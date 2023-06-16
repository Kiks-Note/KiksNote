import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {
  TextField,
  Typography,
  Container,
  Button,
  Link,
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";

import {parseISO, isValid} from "date-fns";
import {format} from "date-fns";

import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MailIcon from "@mui/icons-material/Mail";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import HttpsRoundedIcon from "@mui/icons-material/HttpsRounded";

import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";

import signupImg from "../../assets/img/signup-art.svg";
import "./Register.scss";

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

const Register = () => {
  const navigate = useNavigate();

  const [allclass, setAllclass] = useState([]);
  const [selectedStudentClass, setSelectedStudentClass] = useState("");
  const [selectedStudentClassId, setSelectedStudentClassId] = useState("");

  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userBirthDate, setUserBirthDate] = useState(new Date());
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [userStatus, setUserStatus] = useState("");

  const [messageFirstName, setMessageFirstName] = useState("");
  const [messageLastName, setMessageLastName] = useState("");
  const [messageEmail, setMessageEmail] = useState("");
  const [messageBirthDate, setMessageBirthDate] = useState("");
  const [messagePassword, setMessagePassword] = useState("");
  const [messageConfirmPassword, setMessageConfirmPassword] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [messageClass, setMessageClass] = useState("");

  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorBirthDate, setErrorBirthDate] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorClass, setErrorClass] = useState(false);
  const theme = useTheme();

  const getAllClass = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_SERVER_API}/ressources/classes`)
        .then((res) => {
          setAllclass(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const register = async () => {
    if (userStatus === "etudiant" || userStatus === "pedago") {
      if (
        !userEmail.includes("edu.esiee-it.fr") &&
        !userEmail.includes("edu.itescia.fr") &&
        !userEmail.includes("cergy.itin.fr")
      ) {
        return;
      }
    }
    await axios
      .post(`${process.env.REACT_APP_SERVER_API}/auth/signup`, {
        userEmail: userEmail,
        userPassword: userPassword,
        userFirstName: userFirstName,
        userLastName: userLastName,
        userBirthDate: userBirthDate,
        userStatus: userStatus,
        userClass: selectedStudentClassId,
      })
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          toastSuccess(
            `Utilisateur inscrit ! Vous avez recu un mail de confirmation sur ${userEmail}`
          );
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          toastFail("Utilisateur non enregistré");
        }
      })
      .catch((err) => {
        if (
          err.response.status === 400 &&
          err.response.data.message === "L'adresse e-mail est déjà utilisée."
        ) {
          toastFail("L'adresse email est déjà utilisée");
        }
      });
  };

  const validateEmail = (email, userStatus) => {
    if (userStatus === "etudiant" || userStatus === "pedago") {
      if (
        !email.includes("edu.esiee-it.fr") &&
        !email.includes("edu.itescia.fr") &&
        !email.includes("cergy.itin.fr")
      ) {
        setErrorEmail(true);
        setMessageEmail(
          "L'adresse e-mail doit contenir les domaines edu.esiee-it.fr, edu.itescia.fr ou cergy.itin.fr"
        );
        toastFail(
          "L'adresse e-mail doit contenir les domaines edu.esiee-it.fr, edu.itescia.fr ou cergy.itin.fr"
        );
        return false;
      }
    }
    setErrorEmail(false);
    setMessageEmail("");
    return true;
  };

  const verifInputErrors = (
    lastname,
    firstname,
    email,
    password,
    confirmpassword,
    status,
    student_class,
    birthdate
  ) => {
    if (lastname === "") {
      setErrorLastName(true);
      setMessageLastName("Le nom est requis");
      toastFail("Le nom est un champ obligatoire");
    } else {
      setErrorLastName(false);
      setMessageLastName("");
    }

    if (firstname === "") {
      setErrorFirstName(true);
      setMessageFirstName("Le prénom est requis");
      toastFail("Le prénom est un champ obligatoire");
    } else {
      setErrorFirstName(false);
      setMessageFirstName("");
    }

    if (email === "") {
      setErrorEmail(true);
      setMessageEmail("L'adresse email est requis");
      toastFail("L'adresse email est un champ obligatoire");
    } else if (validateEmail(email, status)) {
      setErrorEmail(false);
      setMessageEmail("");
    } else {
      setErrorEmail(true);
      setMessageEmail(
        "L'adresse mail que vous avez rentrée n'est pas conforme. Celle-ci doit inclure les domaines edu.esiee-it.fr, edu.itescia.fr ou cergy.itin.fr"
      );
      toastFail(
        "L'adresse email doit contenir les domaines edu.esiee-it.fr, edu.itescia.fr ou cergy.itin.fr"
      );
    }

    if (password === "") {
      setErrorPassword(true);
      setMessagePassword("Mot de passe requis");
      toastFail("Le champ du mot de passe est obligatoire");
    } else if (password.length < 6) {
      setErrorPassword(true);
      setMessagePassword("Le mot de passe doit comporter plus de 6 caractères");
      toastFail("Le mot de passe doit comporter plus de 6 caractères");
    } else if (password.length > 24) {
      setErrorPassword(true);
      setMessagePassword("Le mot de passe ne peut pas dépasser 24 caractères");
      toastFail("Le mot de passe ne peut pas dépasser 24 caractères");
    } else {
      setErrorPassword(false);
      setMessagePassword("");
    }

    if (confirmpassword === "") {
      setErrorConfirmPassword(true);
      setMessageConfirmPassword("Confirmez le mot de passe");
      toastFail("Le champ de confirmation du mot de passe est obligatoire");
    } else if (password !== confirmpassword) {
      setErrorConfirmPassword(true);
      setMessageConfirmPassword("Le mot de passe ne correspond pas");
      toastFail(
        "Le mot de passe ne correspond pas au mot de passe que vous avez saisi"
      );
    } else {
      setErrorConfirmPassword(false);
      setMessageConfirmPassword("");
    }

    if (status === "") {
      setErrorStatus(true);
      setMessageStatus("Choisissez le statut");
      toastFail("Veuillez renseigner votre statut au sein de l'école");
    } else if (student_class === "etudiant" && !validateEmail(email, status)) {
      setErrorStatus(true);
      setMessageEmail("Courriel edu introuvable");
      toastFail("Courriel edu introuvable");
    } else {
      setErrorStatus(false);
      setMessageStatus("");
    }

    if (status === "etudiant" && student_class === "") {
      setErrorClass(true);
      setMessageClass("Indiquez votre classe");
      toastFail("Choisissez votre classe");
    } else {
      setErrorClass(false);
      setMessageClass("");
    }

    if (birthdate === "") {
      setErrorBirthDate(true);
      setMessageBirthDate("La date de naissance est requise");
      toastFail("Le champ de la date de naissance est obligatoire");
    } else {
      setErrorBirthDate(false);
      setMessageBirthDate("");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    verifInputErrors(
      userLastName,
      userFirstName,
      userEmail,
      userPassword,
      userConfirmPassword,
      userStatus,
      selectedStudentClassId,
      userBirthDate
    );
    if (
      !errorLastName &&
      !errorFirstName &&
      !errorEmail &&
      !errorPassword &&
      !errorConfirmPassword &&
      !errorStatus &&
      !errorClass &&
      !errorBirthDate
    ) {
      await register();
    }
  };

  const handleDateChange = (event) => {
    const {value} = event.target;
    const parsedDate = parseISO(value);

    if (isValid(parsedDate)) {
      setUserBirthDate(parsedDate);
      setErrorBirthDate(false);
      setMessageBirthDate("");
    } else {
      setUserBirthDate(null);
      setErrorBirthDate(true);
      setMessageBirthDate("Invalid date");
    }
  };

  useEffect(() => {
    getAllClass();
  }, []);

  return (
    <div className="register">
      <div
        className="register-header"
        style={{backgroundColor: theme.palette.background.container}}
      >
        <div className="container-register">
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
            Inscription
          </Typography>
          <form className="p-15 form" onSubmit={onSubmit}>
            <Container
              fixed
              maxWidth="lg"
              sx={{
                padding: "10px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <AccountBoxIcon
                sx={{
                  marginTop: "20px",
                  marginRight: "10px",
                  color: "#7a52e1",
                }}
              />
              <TextField
                variant="standard"
                fullWidth
                label="Nom"
                id="input-lastname"
                defaultValue={userLastName}
                onChange={(e) => setUserLastName(e.target.value)}
                sx={{
                  input: {color: "text.primary"},
                }}
                error={errorLastName}
                helperText={messageLastName}
              />
            </Container>
            <Container
              fixed
              maxWidth="lg"
              sx={{
                padding: "10px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <AccountBoxIcon
                sx={{
                  marginTop: "20px",
                  marginRight: "10px",
                  color: "#7a52e1",
                }}
              />
              <TextField
                variant="standard"
                fullWidth
                label="Prénom"
                id="input-firstname"
                defaultValue={userFirstName}
                onChange={(e) => setUserFirstName(e.target.value)}
                error={errorFirstName}
                helperText={messageFirstName}
                sx={{
                  input: {color: "text.primary"},
                }}
              />
            </Container>
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
                label="Adresse email"
                id="input-email"
                placeholder="votrecompte@edu.esiee-it.fr"
                defaultValue={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                error={errorEmail}
                helperText={messageEmail}
                sx={{
                  input: {color: "text.primary"},
                }}
              />
            </Container>
            <Container
              fixed
              maxWidth="lg"
              sx={{
                padding: "10px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <CalendarMonthRoundedIcon
                sx={{
                  marginTop: "20px",
                  marginRight: "10px",
                  color: "#7a52e1",
                }}
              />
              <TextField
                label="Date de naissance"
                type="date"
                fullWidth
                sx={{
                  input: {color: "text.primary"},
                }}
                id="input-birthdate"
                value={userBirthDate ? format(userBirthDate, "yyyy-MM-dd") : ""}
                onChange={handleDateChange}
                error={errorBirthDate}
                helperText={messageBirthDate}
              />
            </Container>
            <Container
              fixed
              maxWidth="lg"
              sx={{
                padding: "10px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <HttpsRoundedIcon
                sx={{
                  marginTop: "20px",
                  marginRight: "10px",
                  color: "#7a52e1",
                }}
              />
              <TextField
                variant="standard"
                fullWidth
                label="Mot de passe"
                id="input-password"
                type="password"
                name="password"
                defaultValue={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                sx={{
                  input: {color: "text-primary"},
                }}
                error={errorPassword}
                helperText={messagePassword}
              />
            </Container>
            <Container
              fixed
              maxWidth="lg"
              sx={{
                padding: "10px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <HttpsRoundedIcon
                sx={{
                  marginTop: "20px",
                  marginRight: "10px",
                  color: "#7a52e1",
                }}
              />
              <TextField
                variant="standard"
                fullWidth
                label="Confirmer le mot de passe"
                id="input-confirmpassword"
                type="password"
                name="password"
                defaultValue={userConfirmPassword}
                onChange={(e) => setUserConfirmPassword(e.target.value)}
                sx={{
                  input: {color: "text.primary"},
                }}
                error={errorConfirmPassword}
                helperText={messageConfirmPassword}
              />
            </Container>

            <Container
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl sx={{m: 1, minWidth: 120}} error={errorStatus}>
                <InputLabel>Status</InputLabel>
                <Select
                  variant="filled"
                  id="input-status"
                  sx={{color: "text.primary"}}
                  label="Status"
                  value={userStatus}
                  onChange={(e) => setUserStatus(e.target.value)}
                >
                  <MenuItem value="etudiant">Étudiant</MenuItem>
                  <MenuItem value="po">PO</MenuItem>
                  <MenuItem value="pedago">Pedago</MenuItem>
                </Select>
                {errorStatus && (
                  <FormHelperText>{messageStatus}</FormHelperText>
                )}
              </FormControl>
              {userStatus === "etudiant" ? (
                <FormControl sx={{m: 1, minWidth: 120}} error={errorClass}>
                  <Select
                    value={selectedStudentClass}
                    onChange={(event) => {
                      setSelectedStudentClass(event.target.value);
                      const selectedClass = allclass.find(
                        (coursClass) => coursClass.name === event.target.value
                      );
                      setSelectedStudentClassId(
                        selectedClass ? selectedClass.id : ""
                      );
                    }}
                    displayEmpty
                    renderValue={(value) => value || "Classe"}
                  >
                    <MenuItem value="">Choissisez votre classe</MenuItem>
                    {allclass.map((promo) => (
                      <MenuItem value={promo.name}>{promo.name}</MenuItem>
                    ))}
                  </Select>
                  {errorClass && (
                    <FormHelperText>{messageClass}</FormHelperText>
                  )}
                </FormControl>
              ) : (
                <div></div>
              )}
            </Container>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Button
                sx={{
                  backgroundColor: "#7a52e1",
                  color: "white",
                  margin: "15px",
                }}
                variant="contained"
                id="btn-register"
                className="bg-[#7751d9] hover:bg-[#ab278e] text-white text-sm font-base py-1 px-3 rounded "
                type="submit"
              >
                S'inscrire
              </Button>
            </div>
          </form>
          <div className="text-xs font-medium text-center m-3">
            <Typography
              style={{
                color: theme.palette.text.primary,
                fontWeight: "bold",
                margin: "10px",
              }}
            >
              Vous avez déjà un compte ?
              <Link
                href="/login"
                sx={{
                  color: "#7a52e1",
                  textDecoration: "none",
                  fontWeight: "bold",
                  marginLeft: "5px",
                  cursor: "pointer",
                }}
              >
                Se connecter
              </Link>
            </Typography>
          </div>
        </div>
        <div className="image-container">
          <img className="image py-3" src={signupImg} alt="SignUp"></img>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default Register;

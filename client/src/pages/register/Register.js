import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import Divider from "@mui/material/Divider";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import "./Register.scss";
import {ReactComponent as ReactLogo} from "../../assets/img/undraw_Sign_up_n6im.svg";

const Register = () => {
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userBirthDate, setUserBirthDate] = useState(new Date());
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [userClass, setUserClass] = useState("");

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

  const toastFail = (message) => {
    toast.error(message, options);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate());
    setIsSubmit(true);
  };

  useEffect(() => {
    // console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      register();
      setIsSubmit(false);
    }
  });

  const register = async () => {
    await axios
      .post("http://localhost:5050/auth/signup", {
        userEmail, userPassword, userFirstName, userLastName, userBirthDate, userStatus, userClass
      })
      .then((res) => {
        console.log(res.status)
        if (res.status === 200) {
          toastSuccess("Utilisateur enregistré");
        } else {
          toastFail("Utilisateur non enregistré");
        }
      })
      .catch((err) => {
        toastFail("Erreur pendant l'enregistrement");
        console.log(err);
      });
  };

  const verifInputErrors = (lastname, firstname, email, password, confirmpassword, status, student_class, birthdate) => {
    if (lastname === "") {
      setErrorLastName(true)
      setMessageLastName("Le nom est requis")
    }
    else{
      setErrorLastName(false)
      setMessageLastName("")
    }
    if (firstname === "") {
      setErrorFirstName(true)
      setMessageFirstName("Le prénom est requis")
    }
    else{
      setErrorFirstName(false)
      setMessageFirstName("")
    }
    if (email === "") {
      setErrorEmail(true);
      setMessageEmail("L'adresse email est requis");
    }
    else if (regex.test(email)) {
      setErrorEmail(false);
      setMessageEmail("");
    }
    else {
      setErrorEmail(true);
      setMessageEmail("L'adresse mail que vous avez rentrés n'est pas conforme. Celle-ci doit  par @edu.esiee-it.fr");
    }
    if (password === "") {
      setErrorPassword(true);
      setMessagePassword("Mot de passe requis");
    } else if (password.length < 6) {
      setErrorPassword(true);
      setMessagePassword("Le mot de passe doit comporter plus de 6 caractères");
    } else if (password.length > 24) {
      setErrorPassword(true);
      setMessagePassword("Le mot de passe ne peut pas dépasser plus de 24 caractères");
    }
    else {
      setErrorPassword(false);
      setMessagePassword("");
    }
    if (confirmpassword === "") {
      setErrorConfirmPassword(true)
      setMessageConfirmPassword("Confirmez le mot de passe");
    } else if (password !== confirmpassword) {
      setErrorConfirmPassword(true)
      setMessageConfirmPassword("Le mot de passe ne correspond pas");
    }
    else{
      setErrorConfirmPassword(false)
      setMessageConfirmPassword("");
    }
    if (status === "") {
      setErrorStatus(true)
      setMessageStatus("Choisissez le statut");
    } else if (student_class === "etudiant" && !regex.test(email)) {
      setErrorStatus(true)
      setMessageEmail("Courriel edu introuvable");
    }
    else{
      setErrorStatus(false)
      setMessageStatus("");
    }
    if (status === "etudiant" && student_class === "") {
      setErrorClass(true)
      setMessageClass("Indiquez votre classe")
    }
    else{
      setErrorClass(false);
      setMessageClass("")
    }
    if (birthdate === "") {
      setErrorBirthDate(true)
      setMessageBirthDate("La date de naissance est requis");
    }
    else{
      setErrorBirthDate(false)
      setMessageBirthDate("");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await register();
    verifInputErrors(userLastName, userFirstName, userEmail, userPassword, userConfirmPassword, userStatus, userClass, userBirthDate);
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    const parsedDate = parseISO(value);

    if (isValid(parsedDate)) {
      setUserBirthDate(parsedDate);
      setErrorBirthDate(false);
      setMessageBirthDate('');
    } else {
      setUserBirthDate(null);
      setErrorBirthDate(true);
      setMessageBirthDate('Invalid date');
    }
  };
  
  return (
    <div className="register">
      <div className="register-header">
        <div className="container-register">
          <Typography
            component="h1"
            sx={{
              fontSize: 30,
              fontWeight: "bold",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Inscription
          </h1>
          <Divider
            variant="middle"
            style={{background: "#fff", height: "1px"}}
          />
          <form className="p-15 form">
            <div className="m-4">
              <input
                id="input-lastname"
                className=" text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                name="lastname"
                placeholder="Nom"
                value={userLastName}
                onChange={(e) => setUserLastName(e.target.value)}
                sx={{
                  input: { color: 'black' }
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
                className="text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                name="firstname"
                placeholder="Prénom"
                value={userFirstName}
                onChange={(e) => setUserFirstName(e.target.value)}
                sx={{
                  input: { color: 'black' }
                }}
                error={errorFirstName}
                helperText={messageFirstName}
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
                className="text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="email"
                name="email"
                placeholder="votrecompte@edu.esiee-it.fr"
                defaultValue={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                sx={{
                  input: { color: 'black' }
                }}
                error={errorEmail}
                helperText={messageEmail}
              />
              <span className="flex mt-1 text-sm text-red-600 dark:text-red-500">
                {formErrors.email}
              </span>
            </div>
            <div className="m-4">
              <input
                id="input-birthdate"
                className="text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="date"
                fullWidth
                sx={{
                  input: { color: 'black' }
                }}
                id="input-birthdate"
                value={userBirthDate ? format(userBirthDate, 'yyyy-MM-dd') : ''}
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
                className="text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="password"
                name="password"
                defaultValue={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                sx={{
                  input: { color: 'black' }
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
                className="text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="password"
                name="password"
                defaultValue={userConfirmPassword}
                onChange={(e) => setUserConfirmPassword(e.target.value)}
                sx={{
                  input: { color: 'black' }
                }}
                error={errorConfirmPassword}
                helperText={messageConfirmPassword}
              />
            </Container>

            <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <FormControl sx={{ m: 1, minWidth: 120 }} error={errorStatus}>
                <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
                <Select variant="filled" id="input-status" sx={{ color: 'black' }} label="Status" value={userStatus} onChange={(e) => setUserStatus(e.target.value)}>
                  <MenuItem value="etudiant">Étudiant</MenuItem>
                  <MenuItem value="po">PO</MenuItem>
                  <MenuItem value="pedago">Pedago</MenuItem>
                </Select>
                {errorStatus && <FormHelperText>{messageStatus}</FormHelperText>}
              </FormControl>
              {userStatus === "etudiant" ? (

                <FormControl sx={{ m: 1, minWidth: 120 }} error={errorClass}>
                  <InputLabel id="demo-simple-select-helper-label">Classe</InputLabel>
                  <Select variant="filled" id="input-class" sx={{ color: 'black' }} value={userClass} onChange={(e) => setUserClass(e.target.value)}>
                    <MenuItem value="L1-paris">L1-Paris</MenuItem>
                    <MenuItem value="L1-cergy">L1-Cergy</MenuItem>
                    <MenuItem value="L2-paris">L2-Paris</MenuItem>
                    <MenuItem value="L2-cergy">L2-Cergy</MenuItem>
                    <MenuItem value="L3-paris">L3-Paris</MenuItem>
                    <MenuItem value="L3-cergy">L3-Cergy</MenuItem>
                    <MenuItem value="M1-lead">M1-LeadDev</MenuItem>
                    <MenuItem value="M1-gaming">M1-Gaming</MenuItem>
                    <MenuItem value="M2-lead">M2-LeadDev</MenuItem>
                    <MenuItem value="M2-gaming">M2-Gaming</MenuItem>
                  </Select>
                  {errorClass && <FormHelperText>{messageClass}</FormHelperText>}
                </FormControl>
              ) : (
                <div></div>
              )}
            </Container>
            <div className="flex justify-center">
              <Button
                sx={{
                  backgroundColor: "#7a52e1",
                  color: 'white'
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
            <p>Vous avez déjà un compte</p>
            <Link
              href="/login"
              sx={{
                color: "#7a52e1",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Se connecter
            </Link>
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

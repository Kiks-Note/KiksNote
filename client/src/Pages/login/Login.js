import React, { useState, useEffect } from "react";
import "./Login.scss";

import Divider from "@mui/material/Divider";

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

    if (!values.email) {
      errors.email = "L'adresse mail est requis !";
    } else if (!regexedu.test(values.email)) {
      errors.email = "Ce n'est pas un format d'e-mail valide !";
    }
    if (!values.password) {
      errors.password = "Le mode de passe est requis !";
    } else if (password !== values.password) {
      errors.password = "Le mot de passe est incorrect!";
    }

    return errors;
  };

  // @edu.itescia.fr
  return (
    <div className="Login">
      <div className="Login-header">
        <div>
          <h1 style={{ margin: 10 }}>Connexion</h1>
          <Divider
            variant="middle"
            style={{ background: "#fff", height: "1px" }}
          />
          <form>
            <label
              for="input-email"
            >
              Adresse mail
            </label>
            <input
              id="input-email"
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="votrecompte@edu.esiee-it.fr"
              required
            />
            <span>{formErrors.email}</span>
            <label
              for="input-password"
            >
              Mot de passe
            </label>
            <input
              id="input-password"
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              required
            />
            <a href="../resetpassword/ResetPassword.js">
              Mot de passe oublie ?
            </a>
            <span>{formErrors.password}</span>
            <button type="submit" onClick={handleSubmit}>
              Connexion
            </button>
          </form>

          <p>
            Pas encore de compte? Créez-en un{" "}
            <a href="../register/Register.js">ici</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

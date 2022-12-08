import React, { useState, useEffect } from "react";
import "./Login.scss";
import Divider from "@mui/material/Divider";
import CaptchaTest from "./CaptchaTest";

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
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  });

  const verifError = (values) => {
    const errors = {};
    const regexedu = /^[^\s@]+@edu\.esiee-it\.fr$/;
    const password = "coding";
    // const label_email = document.getElementById("label-email");
    // const label_password = document.getElementById("label-password");
    // const input_email = document.getElementById("input-email");
    // const input_password = document.getElementById("input-password");

    // const button = document.getElementById("btn-login");

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

  return (
    <div className="Login">
      <div className="Login-header">
        <div className="container-login">
          <h1 className="text-4xl font-extrabold dark:text-white m-4 text-center">
            Connexion
          </h1>
          <Divider
            variant="middle"
            style={{ background: "#fff", height: "1px" }}
          />
          <form className="p-15">
            <div className="m-4">
              <label
                id="label-email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="input-email"
              >
                Adresse mail
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="input-email"
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="votrecompte@edu.esiee-it.fr"
              />
              <span className="mt-2 text-sm text-red-600 dark:text-red-500">
                {formErrors.email}
              </span>
            </div>

            <div className="m-4">
              <label
                id="label-password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="input-password"
              >
                Mot de passe
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="input-password"
                type="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder="votre mot de passe"
              />
              <div className="flex flex-col">
                <span className="mt-4 text-sm text-red-600 dark:text-red-500">
                  {formErrors.password}
                </span>
                <a
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline pt-4"
                  href="/resetpassword"
                >
                  Mot de passe oublie ?
                </a>
              </div>
            </div>
            <div>
              <CaptchaTest />
            </div>
            <div></div>
            <div className="flex justify-center">
              <button
                id="btn-login"
                className="bg-[#93258c] hover:bg-[#ab278e] text-white text-base font-bold py-2 px-4 rounded "
                type="submit"
                onClick={handleSubmit}
              >
                Connexion
              </button>
            </div>
          </form>

          <p className="text-sm font-medium text-center m-3">
            Pas encore de compte? Créez-en un{" "}
            <a
              className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
              href="/signup"
            >
              ici
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

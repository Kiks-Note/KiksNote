import React, { useState, useEffect } from "react";
import axios from "axios";

import { accountAuthService } from "../../services/accountAuth";

import { useNavigate } from "react-router-dom";

import "./Login.scss";

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
    <div className="Login">
      <div className="Login-header">
        <div className="container-login">
          <h1 className="text-4xl font-extrabold dark:text-white m-4 text-center">
            Connexion
          </h1>
          <form className="p-15" onSubmit={onSubmit}>
            {/* mail adress label and input */}
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
                value={email}
                onChange={onChangeEmail}
                placeholder="votrecompte@edu.esiee-it.fr"
              />
              { errorMessage === "Incorrect email" && (
                <span className="flex mt-1 text-sm text-red-600 dark:text-red-500 font-bold">
                  L'email est incorrecte
                </span>
              )}
            </div>
            {/* password label and input */}
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
                value={password}
                onChange={onChangePassword}
                placeholder="votre mot de passe"
              />
              {errorMessage === "Wrong password" && (
                <span>Le mot de passe est incorrect</span>
              )}
              {errorMessage === "Email and password is required to login" && (
                <span className="flex mt-1 text-sm text-red-600 dark:text-red-500 font-bold">
                  Il manque l'email ou le mot de passe
                </span>
              )}

              <a
                className="flex text-sm text-[#B312FF] dark:text-[#B312FF] hover:underline"
                href="/askresetpass"
              >
                Mot de passe oublie ?
              </a>
            </div>
            <div className="flex justify-center">
              <button
                id="btn-login"
                className="bg-[#93258c] hover:bg-[#ab278e] text-white text-base font-bold py-2 px-4 rounded "
                type="submit"
              >
                Connexion
              </button>
            </div>
          </form>

          <p className="text-sm font-medium text-center m-3">
            Pas encore de compte? Créez-en un{" "}
            <a
              className="text-sm font-medium text-[#B312FF] dark:text-[#B312FF] hover:underline"
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

import React, { useState , useEffect } from 'react';
import { Link } from "react-router-dom";
import Divider from "@mui/material/Divider";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import "./Register.scss"
import {ReactComponent as ReactLogo} from '../../asset/img/undraw_Sign_up_n6im.svg';

const Register = () => {

    const [ userFirstName, setUserFirstName] = useState("")
    const [ userLastName, setUserLastName] = useState("")
    const [ userEmail, setUserEmail] = useState("")
    const [ userBirthDate, setUserBirthDate] = useState("")
    const [ userPassword, setUserPassword] = useState("")
    const [ userConfirmPassword, setUserConfirmPassword] = useState("")
    const [ userStatus, setUserStatus] = useState("")
    const [ userClass, setUserClass] = useState("")
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const options = {
        autoClose: 2000,
        className: '',
        position: toast.POSITION.TOP_RIGHT,
    };

    const toastSuccess = message => {
        toast.success(message, options);
    }

    const toastFail = message => {
        toast.error(message, options);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate());
        setIsSubmit(true);
    }

    useEffect(() => {
        console.log(formErrors);
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            register()
        }
    });

    const register = async () => {
        await axios.post("http://localhost:5050/register", {
            userEmail,
            userPassword,
            userFirstName,
            userLastName,
            userBirthDate,
            userStatus,
            userClass
        }).then((res) => {
            if (res.data.message === "User created successfully") {
                toastSuccess("Utilisateur enregistré");
            } else {
                toastFail("Utilisateur non enregistré");
            }
        }).catch((err) => {
            toastFail("Erreur pendant l'enregistrement");
            console.log(err)
        })
    }

    const validate = () => {
        const errors = {};
        const email_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        const emailedu_regex = /^[^\s@]+@edu\.esiee-it\.fr$/;

        if (userLastName === "") {
            errors.lastname = "Le nom est requis!";
        }
        if (userFirstName === "") {
            errors.firstname = "Le prénom est requis!";
        }
        if (userEmail === "") {
            errors.email = "L'adresse mail est requis !";
        } else if (!email_regex.test(userEmail)) {
            errors.email = "Ce n'est pas un format d'e-mail valide !";
        }
        if (userPassword === "") {
            errors.password = "Mot de passe requis";
        } else if (userPassword.length < 6) {
            errors.password = "Le mot de passe doit comporter plus de 6 caractères";
        } else if (userPassword.length > 24) {
            errors.password = "Le mot de passe ne peut pas dépasser plus de 24 caractères";
        }
        if(userConfirmPassword === "") {
            errors.confirmPassword = "Confirmez le mot de passe";
        } else if(userPassword !== userConfirmPassword) {
            errors.confirmPassword = "Le mot de passe ne correspond pas";
        }
        if(userStatus === "") {
            errors.status = "Choisissez le statut"
        } else if(userStatus === "etudiant" && !emailedu_regex.test(userEmail)) {
            errors.email = "Courriel edu introuvable";
        }
        if (userStatus === "etudiant" && userClass === "") {
            errors.class = "Indiquez votre classe";
        }
        if(userBirthDate === "") {
            errors.birthdate = "Remplir";
        }

        return errors;
    };

    return(
        <div className="register">
            <div className="register-header">
                <div className="container-register">
                    <h1 className="text-4l font-extrabold m-4 text-center">
                        Inscription
                    </h1>
                    <Divider
                        variant="middle"
                        style={{ background: "#fff", height: "1px" }}
                    />
                    <form className="p-15 form">
                        <div className="m-4">
                            <input
                                id="input-lastname"
                                className="input text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                name="lastname"
                                placeholder="Nom"
                                value={userLastName}
                                onChange={(e) => setUserLastName(e.target.value)}
                            />
                            <span className="flex mt-1 text-sm text-red-600 dark:text-red-500">
                                {formErrors.lastname}
                            </span>
                        </div>
                        <div className="m-4">
                            <input
                                id="input-firstname"
                                className="input text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                name="firstname"
                                placeholder="Prénom"
                                value={userFirstName}
                                onChange={(e) => setUserFirstName(e.target.value)}
                            />
                            <span className="flex mt-1 text-sm text-red-600 dark:text-red-500">
                                {formErrors.firstname}
                            </span>
                        </div>
                        <div className="m-4">
                            <input
                                id="input-email"
                                className="input text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="email"
                                name="email"
                                placeholder="votrecompte@edu.esiee-it.fr"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                            <span className="flex mt-1 text-sm text-red-600 dark:text-red-500">
                                {formErrors.email}
                            </span>
                        </div>
                        <div className="m-4">
                            <input
                                id="input-birthdate"
                                className="input text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="date"
                                name="birthdate"
                                placeholder="Date de Naissance"
                                value={userBirthDate}
                                onChange={(e) => setUserBirthDate(e.target.value)}
                            />
                            <span className="flex mt-1 text-sm text-red-600 dark:text-red-500">
                                {formErrors.birthdate}
                            </span>
                        </div>
                        <div className="m-4">
                            <input
                                id="input-password"
                                className="input text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="password"
                                name="password"
                                placeholder="Mot de passe"
                                value={userPassword}
                                onChange={(e) => setUserPassword(e.target.value)}
                            />
                            <span className="flex mt-1 text-sm text-red-600 dark:text-red-500">
                                {formErrors.password}
                            </span>
                        </div>
                        <div className="m-4">
                            <input
                                id="input-confirmpassword"
                                className="input text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={userConfirmPassword}
                                onChange={(e) => setUserConfirmPassword(e.target.value)}
                            />
                            <span className="flex mt-1 text-sm text-red-600 dark:text-red-500">
                                {formErrors.confirmPassword}
                            </span>
                        </div>
                        <div className="m-4 select-div">
                            <label
                                id="label-status"
                                className="block mb-2 text-sm font-medium text-gray-900"
                                htmlFor="input-status"
                            >
                                <select name="status"
                                        id="input-status"
                                        onChange={(e)=>setUserStatus(e.target.value)}>
                                    <option disabled={true} value="">
                                        --Status--
                                    </option>
                                    <option value="etudiant">Étudiant</option>
                                    <option value="po">PO</option>
                                    <option value="pedago">Pedago</option>
                                </select>
                            </label>
                            { userStatus === "etudiant" ?
                                <label
                                    id="label-class"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                    htmlFor="input-class"
                                >
                                    <select name="status"
                                            id="input-class"
                                            onChange={(e)=>setUserClass(e.target.value)}>
                                        <option disabled={true} value="">
                                            --Classe--
                                        </option>
                                        <option value="L1-paris">L1-Paris</option>
                                        <option value="L1-cergy">L1-Cergy</option>
                                        <option value="L2-paris">L2-Paris</option>
                                        <option value="L2-cergy">L2-Cergy</option>
                                        <option value="L3-paris">L3-Paris</option>
                                        <option value="L3-cergy">L3-Cergy</option>
                                        <option value="M1-lead">M1-LeadDev</option>
                                        <option value="M1-gaming">M1-Gaming</option>
                                        <option value="M2-lead">M2-LeadDev</option>
                                        <option value="M2-gaming">M2-Gaming</option>
                                    </select>
                                </label> : <div></div>
                            }
                        </div>
                        <div className="flex justify-center">
                            <button
                                id="btn-register"
                                className="bg-[#7751d9] hover:bg-[#ab278e] text-white text-sm font-base py-1 px-3 rounded "
                                type="submit"
                                onClick={handleSubmit}
                            >
                                S'inscrire
                            </button>
                        </div>
                    </form>
                    <div className="text-xs font-medium text-center m-3">
                        <p>Vous avez déjà un compte</p>
                        <Link
                            className="text-xs font-medium text-[#B312FF] dark:text-[#B312FF] hover:underline"
                            to="/login">
                            Se connecter
                        </Link>
                    </div>
                </div>
                <div className="image-container">
                    <ReactLogo className="image py-3"></ReactLogo>
                </div>
            </div>
            <ToastContainer></ToastContainer>
        </div>
    )
}

export default Register

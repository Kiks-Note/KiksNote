import React, { useState , useEffect } from 'react';
import { Link } from "react-router-dom";
import Divider from "@mui/material/Divider";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

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
                    <h1 className="text-4xl font-extrabold dark:text-white m-4 text-center">
                        Inscription
                    </h1>
                    <Divider
                        variant="middle"
                        style={{ background: "#fff", height: "1px" }}
                    />
                    <form className="p-15">
                        <div className="m-4">
                            <label
                                id="label-lastname"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                htmlFor="input-lastname"
                            >
                                Nom
                                </label>
                            <input
                                id="input-lastname"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                            <label
                                id="label-firstname"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                htmlFor="input-firstname"
                            >
                                Prénom
                            </label>
                            <input
                                id="input-firstname"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                            <label
                                id="label-email"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                htmlFor="input-email"
                            >
                            </label>
                            <input
                                id="input-email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                            <label
                                id="label-birthdate"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                htmlFor="input-birthdate"
                            >
                            </label>
                            <input
                                id="input-birthdate"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                        <label
                            id="label-password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            htmlFor="input-password"
                        >
                        </label>
                            <input
                                id="input-password"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                        <label 
                            id="label-confirmpassword"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            htmlFor="input-confirmpassword"
                        >
                        </label>
                            <input
                                id="input-confirmpassword"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                        <div className="m-4">
                        <label 
                            id="label-status"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                            className="bg-[#93258c] hover:bg-[#ab278e] text-white text-base font-bold py-2 px-4 rounded "
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Connexion
                        </button>
                        </div>
                    </form>
                    <p className="text-sm font-medium text-center m-3">
                        Vous avez déjà un compte
                        <Link
                            className="text-sm font-medium text-[#B312FF] dark:text-[#B312FF] hover:underline"
                            to="/login">
                                Se connecter
                        </Link>
                    </p>
            </div>
        </div>
        <ToastContainer></ToastContainer>
    </div>
    )
}

export default Register
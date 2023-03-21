import React, { useState , useEffect } from 'react';
import { Link } from "react-router-dom";
import Divider from "@mui/material/Divider";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Register = () => {

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

    const onSubmit = (data) => {
        var user = {
            dateofbirth: new Date(data.birthdate),
            email: data.email,
            firstname: data.firstname,
            hashed_password: data.password,
            lastname: data.lastname,
            status: data.status
        }
        register(user)
    }
    async function register(user)  {
        await axios.post("http://localhost:5050/register", {
            user: user
        }).then( (response) => {
            if (response.data === "User created successfully") {
                toastSuccess("Utilisateur bien enregistré");
            } else {
                toastFail("Utilisateur non enregistré");
            }
        }).catch((err) => {
            console.warn("error : ", err);
        });
    }
    /* async function sendEmailFromFront(mail)  {
        await axios.post("http://localhost:5050/sendemail", {
            email: mail
        }).then( (response) => {
            if (response.data === "mail there") {
                toastSuccess("Mail enregistré");
            } else {
                toastFail("Mail non enregistré");
            }
        }).catch((err) => {
            console.warn("error : ", err);
        });
    } */

    const initialValues = {
        firstname: "",
        lastname: "",
        password: "",
        confirmPassword: "",
        email: "",
        birthdate: "",
        status: ""
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    // const p = "5981eda53eeb4100828394dd43631aede8015e58311c5caaa3f5c67598a327d5";

    const handleChange = (e) => {
    const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setFormErrors(validate(formValues));
        setIsSubmit(true);
    };

    useEffect(() => {
        console.log(formErrors);
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log(formValues);
            onSubmit(formValues);
        }
    });

    const validate = (values) => {
        const errors = {};
        const pwd_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
        const email_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        const emailedu_regex = /^[^\s@]+@edu\.esiee-it\.fr$/;

        if (!values.lastname) {
            errors.lastname = "Le nom est requis!";
        }
        if (!values.firstname) {
            errors.firstname = "Le prénom est requis!";
        }
        if (!values.email) {
            errors.email = "L'adresse mail est requis !";
        } else if (!email_regex.test(values.email)) {
            errors.email = "Ce n'est pas un format d'e-mail valide !";
        }
        if (!values.password) {
            errors.password = "Mot de passe requis";
        } else if (!pwd_regex) {
            errors.password = "Format mot de passe invalide";
        } else if (values.password.length < 4) {
            errors.password = "Le mot de passe doit comporter plus de 4 caractères";
        } else if (values.password.length > 10) {
            errors.password = "Le mot de passe ne peut pas dépasser plus de 10 caractères";
        }
        if(!values.confirmPassword) {
            errors.confirmPassword = "Confirmez le mot de passe";
        } else if(values.password !== values.confirmPassword) {
            errors.confirmPassword = "Le mot de passe ne correspond pas";
        }
        if(!values.status) {
            errors.status = "Choisissez le statut"
        } else if(values.status === "etudiant" && !emailedu_regex.test(values.email)) {
            errors.email = "Courriel edu introuvable";
        }
        if(!values.birthdate) {
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
                                value={formValues.lastname}
                                onChange={handleChange}
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
                                value={formValues.firstname}
                                onChange={handleChange}
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
                                value={formValues.email}
                                onChange={handleChange}
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
                                value={formValues.birthdate}
                                onChange={handleChange}
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
                                value={formValues.password}
                                onChange={handleChange}
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
                                id="input-password"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formValues.confirmPassword}
                                onChange={handleChange}
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
                                onChange={handleChange}>
                                value=""
                                <option disabled={true} value="">
                                    --Status--
                                </option>
                                <option value="etudiant">Étudiant</option>
                                <option value="po">PO</option>
                                <option value="pedago">Pedago</option>
                            </select>
                        </label>
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
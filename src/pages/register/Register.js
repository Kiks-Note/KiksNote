import React, { useState } from 'react';

const initialState = {
    lastName: '',
    firstName: '',
    password: '',
    confirmPassword: '',
    birthdate: '',
    status: '',
    mail: '',
}

const Register = () => {
    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(true);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(form);

        window.location.reload();
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
    }

    return(
        <div className="auth__form-container">
            <div className="auth__form-container_fields">
                <div className="auth__form-container_fields-content">
                    <p>{isSignup ? 'Inscription' : 'Connexion'}</p>
                    <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="lastName"></label>
                            <input
                                name="lastName"
                                type="text"
                                placeholder="Prénom"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="firstName"></label>
                            <input
                                name="firstName"
                                type="text"
                                placeholder="Nom"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    <div className="auth__form-container_fields-content_input">
                        <label htmlFor="mail"></label>
                            <input
                                name="mail"
                                type="mail"
                                placeholder="Mail"
                                onChange={handleChange}
                                required
                            />
                    </div>
                    {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="birthdate"></label>
                            <input
                                name="birthdate"
                                type="birthdate"
                                placeholder="Date de Naissance"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    <div className="auth__form-container_fields-content_input">
                        <label htmlFor="password"></label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Mot de passe"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="confirmPassword"></label>
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="status">
                                <select name="status" onChange={handleChange} required>
                                    <option disabled={true} value="">
                                        --Status--
                                    </option>
                                    <option value="administration">Administration</option>
                                    <option value="po">PO</option>
                                    <option value="codeur">Codeur</option>
                                </select>
                            </label>
                        </div>
                    )}
                    <div className="auth__form-container_fields-content_button">
                        <button>{isSignup ? "S'inscrire" : "Connexion"}</button>
                    </div>
                    </form>
                    <div className="auth__form-container_fields-account">
                        <p>
                            {isSignup
                             ? "Vous avez déjà un compte. "
                             : "Pas encore de compte ? Créer en un "
                             }
                             <span onClick={switchMode}>
                             {isSignup ? 'Se connecter' : 'ici'}
                             </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register

import './Register.scss';
import { useForm } from "react-hook-form";

function Register() {
    const {handleSubmit} = useForm();
    const onSubmit = (data, r) => {
        alert(`Vérifier votre adresse mail.`);
        const templateId = 'ConfirmMail';
        const serviceID = 'ConfirmKiks';
        sendConfirm(serviceID, templateId, { from_name: "Kik's Note", message_html: "http://localhost:3000/Confirmation/0", to_email: "davidroquain03@gmail.com" })
        r.target.reset();
    }
    const sendConfirm = (serviceID, templateId, variables) => {
        window.emailjs.send(
            serviceID, templateId,
            variables
        ).then(res => {
            console.log('Email successfully sent!')
        })
            .catch(err => console.error('There has been an error.  Here some thoughts on the error that occured:', err))
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="submit" />
        </form>
    );
}

export default Register;
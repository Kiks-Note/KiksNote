import React, { useState , useEffect } from 'react';

const Register = () => {
    const [isSignup, setIsSignup] = useState(true);

    const onSubmit = (data) => {
        const templateId = 'ConfirmMail';
        const serviceID = 'ConfirmKiks';
        sendConfirm(serviceID, templateId, { to_name: data.lastname+" "+data.firstname,from_name: "Kik's Note", message_html: "http://localhost:3000/Confirmation/0", to_email: data.email })
    }
    const sendConfirm = (serviceID, templateId, variables) => {
        window.emailjs.send(
            serviceID, templateId,
            variables
        ).then(res => {
            alert('Vérifier votre adresse mail pour finaliser votre inscription.')
        })
            .catch(err => {alert('Un problème est survenu pendant votre inscription, nous nous excusons de la gêne occasionée.')})
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
    }

    const initialValues = {
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        email: "",
        birthdate: "",
        status: ""
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
        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        const regexedu = /^[^\s@]+@edu\.esiee-it\.fr$/;

        if (!values.lastname) {
            errors.lastname = "Le nom est requis!";
        }
        if (!values.firstname) {
            errors.firstname = "Le prénom est requis!";
        }
        if (!values.email) {
            errors.email = "L'adresse mail est requis !";
        } else if (!regex.test(values.email)) {
            errors.email = "Ce n'est pas un format d'e-mail valide !";
        }
        if (!values.password) {
            errors.password = "Mot de passe requis";
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
        } else if(values.status === "etudiant" && !regexedu.test(values.email)) {
            errors.email = "Courriel edu introuvable";
        }
        if(!values.birthdate) {
            errors.birthdate = "Remplir";
        }

        return errors;
    };

    return(
        <div className="auth__form-container">
            <div className="auth__form-container_fields">
                <div className="auth__form-container_fields-content">
                    <p>{isSignup ? 'Inscription' : 'Connexion'}</p>
                    {Object.keys(formErrors).length === 0 && isSubmit ? (
                        <div className="ui message success">Signed in successfully</div>
                        )
                        : <div className="ui message"></div>
                        // : (<pre>{JSON.stringify(formValues, undefined, 2)}</pre>)
                    }
                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="lastName"></label>
                            <input
                                type="text"
                                name="lastname"
                                placeholder="Nom"
                                value={formValues.lastname}
                                onChange={handleChange}
                            />
                            <span>{formErrors.lastname}</span>
                        </div>
                        )}
                        {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="firstName"></label>
                            <input
                                type="text"
                                name="firstname"
                                placeholder="Prénom"
                                value={formValues.firstname}
                                onChange={handleChange}
                            />
                            <span>{formErrors.firstname}</span>
                        </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="mail"></label>
                            <input
                                type="mail"
                                name="email"
                                placeholder="Mail"
                                value={formValues.email}
                                onChange={handleChange}
                            />
                            <span>{formErrors.email}</span>
                        </div>
                        {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="birthdate"></label>
                            <input
                                type="birthdate"
                                name="birthdate"
                                placeholder="Date de Naissance"
                                value={formValues.birthdate}
                                onChange={handleChange}
                            />
                            <span>{formErrors.birthdate}</span>
                        </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                        <label htmlFor="password"></label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Mot de passe"
                                value={formValues.password}
                                onChange={handleChange}
                            />
                            <span>{formErrors.password}</span>
                        </div>
                        {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                        <label htmlFor="confirmPassword"></label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formValues.confirmPassword}
                                onChange={handleChange}
                            />
                            <span>{formErrors.confirmPassword}</span>
                        </div>
                        )}
                        {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                        <label htmlFor="status">
                            <select name="status"
                                onChange={handleChange}>
                                <option disabled={true} value="">
                                    --Status--
                                </option>
                                <option value="etudiant">Étudiant</option>
                                <option value="po">PO</option>
                                <option value="pedago">Pedago</option>
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
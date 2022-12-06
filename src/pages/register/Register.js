import React, { useState } from 'react';

const Register = () => {
    const [isSignup, setIsSignup] = useState(true);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        email: '',
        birthdate: '',
        status: ''
    });
     
    const [error, setError] = useState({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        email: '',
        birthdate: '',
        status: ''
    })
     
    const onInputChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({
          ...prev,
          [name]: value
    }));
        validateForm(e);
    }
     
    const validateForm = e => {
        let { name, value } = e.target;
        setError(prev => {
            const stateObj = { ...prev, [name]: "" };
     
        switch (name) {
            case "firstname":
                if (!value) {
                    stateObj[name] = "Veuillez entrer un votre nom";
                }
            break;

            case "lastname":
                if (!value) {
                    stateObj[name] = "Veuillez entrer votre prénom";
                }
            break;
     
            case "password":
                if (!value) {
                    stateObj[name] = "Veuillez entrer un mot de passe";
                } else if (form.confirmPassword && value !== form.confirmPassword) {
                    stateObj["confirmPassword"] = "Le mot de passe ne correspond pas";
                } else {
                    stateObj["confirmPassword"] = form.confirmPassword ? "" : error.confirmPassword;
                }
            break;
     
            case "confirmPassword":
                if (!value) {
                    stateObj[name] = "Confirmez le mot de passe ";
                } else if (form.password && value !== form.password) {
                    stateObj[name] = "Le mot de passe ne correspond pas";
                }
            break;

            case "email":
                if (!value) {
                    stateObj[name] = "Veuillez entrer un mail";
                } else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value.email)) {
                    stateObj[name] = "Adresse mail invalide";
                }
                // } else if(form.status == "etudiant" && value != /^[^\s@]+@edu\.itescia\.fr$/) {
                //     stateObj[name] = "Adresse mail étudiant invalide";
                // }
            break;

            case "birthdate":
                if (!value) {
                    stateObj[name] = "Veuillez entrer une date de naissance";
                }
            break;

            case "status":
                if (!value) {
                    stateObj[name] = "Veuillez choisir votre status";
                } else if(value === "etudiant" && form.email != /^[^\s@]+@edu\.itescia\.fr$/) {
                    stateObj.email = "Adresse mail étudiant invalide";
                }
            break;
     
            default:
              break;
          }
     
          return stateObj;
        });
      }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
    }

    // @edu.itescia.fr

    return(
        <div className="auth__form-container">
            <div className="auth__form-container_fields">
                <div className="auth__form-container_fields-content">
                    <p>{isSignup ? 'Inscription' : 'Connexion'}</p>
                    {/* <form onSubmit={handleSubmit}> */}
                    <form>
                    {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="lastName"></label>
                            <input 
                                type="text"
                                name="lastname" 
                                placeholder="Prénom"
                                value={form.lastname}
                                onChange={onInputChange}
                                onBlur={validateForm}
                                required
                            />
                            {error.lastName && <span className='err'>{error.lastName}</span>}
                        </div>
                    )}
                    {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="firstName"></label>
                            <input 
                                type="text"
                                name="firstname" 
                                placeholder="Nom"
                                value={form.firstname}
                                onChange={onInputChange}
                                onBlur={validateForm}
                                required
                            />
                            {error.firstname && <span className='err'>{error.firstname}</span>}
                        </div>
                    )}
                    <div className="auth__form-container_fields-content_input">
                        <label htmlFor="mail"></label>
                            <input 
                                type="mail"
                                name="email" 
                                placeholder="Mail"
                                value={form.email}
                                onChange={onInputChange}
                                onBlur={validateForm}
                                required
                            />
                            {error.email && <span className='err'>{error.email}</span>}
                    </div>
                    {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="birthdate"></label>
                            <input 
                                type="birthdate"
                                name="birthdate"
                                placeholder="Date de Naissance"
                                value={form.birthdate}
                                onChange={onInputChange}
                                onBlur={validateForm}
                                required
                            />
                            {error.birthdate && <span className='err'>{error.birthdate}</span>}
                        </div>
                    )}
                    <div className="auth__form-container_fields-content_input">
                        <label htmlFor="password"></label>
                            <input 
                                type="password"
                                name="password" 
                                placeholder="Mot de passe"
                                onChange={onInputChange}
                                onBlur={validateForm}
                                required
                            />
                            {error.password && <span className='err'>{error.password}</span>}
                    </div>
                    {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="confirmPassword"></label>
                            <input 
                                type="password"
                                name="confirmPassword" 
                                placeholder="Confirm Password"
                                onChange={onInputChange}
                                onBlur={validateForm}
                                required
                            />
                            {error.confirmPassword && <span className='err'>{error.confirmPassword}</span>}
                        </div>
                    )}
                    {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="status">
                                <select name="status" 
                                        onChange={onInputChange}
                                        onBlur={validateForm} required>
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
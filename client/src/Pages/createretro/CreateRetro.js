import React, {useEffect, useState} from "react";
import axios from "axios";

function CreateRetro() {

    const initialValues = {
        name: "",
        cours: "",
        type: ""
    };

    const categoriesCreation = () => {
        var newRetro;
        if (formValues.type === "gms") {
            newRetro = {...formValues,Glad:[],Mad:[],Sad:[]}
        }
        else if (initialValues.type === "pna") {
            newRetro = {...formValues,Positif:[],Negatif:[],Amelioration:[]}
        }
        else {
            newRetro = {...formValues,Like:[],Learned:[],Lacked:[],Longed:[]}
        }
        newRetroRequest(newRetro)
    }

    const newRetroRequest = async (newRetro) => {
        await axios.post("http://localhost:5050/newRetro", {
            retro:newRetro
        }).then((res) => {
            console.log(res.data)
            useNavigate().navigate("/");
        }).catch((err) => {
            console.log(err)
        })
    }

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
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            categoriesCreation();
        }
    });

    const validate = (values) => {
        const errors = {};

        if (!values.name) {
            errors.name = "Un titre est requis!";
        }
        if(!values.cours || values.cours === "") {
            errors.cours = "Choisissez le cours lié à cette rétrospective";
        }
        if(!values.type || values.type === ""){
            errors.type = "Choisissez un type";
        }

        return errors;
    };

    return(
        <div className="auth__form-container">
            <div className="auth__form-container_fields">
                <div className="auth__form-container_fields-content">
                    <p>Nouvelle rétrospective</p>
                    {Object.keys(formErrors).length === 0 && isSubmit ? (
                            <div className="ui message success">La rétrospective est créer</div>
                        )
                        : <div className="ui message"></div>
                        // : (<pre>{JSON.stringify(formValues, undefined, 2)}</pre>)
                    }
                    <form onSubmit={handleSubmit}>
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="Title"></label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Titre"
                                    value={formValues.Name}
                                    onChange={handleChange}
                                />
                                <span>{formErrors.name}</span>
                            </div>
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="cours">
                                    <select name="cours"
                                            onChange={handleChange}>
                                        <option value="">
                                            --Cours--
                                        </option>
                                        <option value="test">Test</option>
                                    </select>
                                </label>
                                <span>{formErrors.cours}</span>
                            </div>
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="type">
                                    <select name="type"
                                            onChange={handleChange}>
                                        <option value="">
                                            --Type--
                                        </option>
                                        <option value="gms">GMS</option>
                                        <option value="4l'">4L</option>
                                        <option value="pna">PNA</option>
                                    </select>
                                </label>
                                <span>{formErrors.type}</span>
                            </div>
                        <div className="auth__form-container_fields-content_button">
                            <button>Création</button>
                            <p>Lien vers la rétro : </p>
                            {Object.keys(formErrors).length === 0 && isSubmit ? (
                                <a href="http://localhost:3000/retrospective/0">
                                http://localhost:3000/retrospective/0
                                </a>
                            ) : <a></a>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateRetro;
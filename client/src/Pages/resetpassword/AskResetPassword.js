import React, { useRef } from 'react'
import "./AskResetPassword.scss"
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { Box } from "@mui/material";
import { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const options = {
    autoClose: 2000,
    className: '',
    position: toast.POSITION.TOP_RIGHT,
  };
  
 export const toastSuccess = message => {
    console.log("Hello0 success toast")
    toast.success(message, options);
  }

  export const toastFail = message => {
    console.log("Hello0 fail toast")
    toast.error(message, options);
  }

// if (localStorage.getItem("Status mail") == "mail not there"){     
//     toastFail("Mail non enregistré");
// } else {
//     toastSuccess("Mail enregistré");
// }

// const state = { };
// const url = "askresetpass?userExist";

// window.history.pushState(state, "", url);

function ResetPassword() {   
    
    const [mail, setMail] = useState(''); 

    async function sendEmailFromFront()  {
        console.log("call back");
        await axios.post("http://localhost:5050/sendemail", {
                email: mail
            }).then( (response) => {
                console.log(response.data);
                localStorage.setItem("Status mail",response.data);
            }).catch((err) => {
                console.warn("error : ", err);
            });
    };

    function f() {
            window.history.push('/askresetpass?variable=value');
    }

    const form = useRef();

    return (
        <div className="form-reset-with-mail-container">
            <Box sx={{ boxShadow: 5 }} style={{ width: "50%", padding: "15px" }} className="box-form-reset-with-mail">
                <h1 style={{ margin: 10, fontSize: "2vw" }}>Réinitialiser le mot de passe</h1>
                <Divider variant="middle" style={{ background: "#000", height: "1px", width: "50%" }} className="divider-form-reset-with-mail" />
                <form className='form-ask-reset' ref={form} onSubmit={() => sendEmailFromFront()}  style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <label>Email</label>
                    <input placeholder="Mail" required id="my-mail-id" type="email" name="user_email" onInput={e => setMail(e.target.value)} style={{ backgroundColor: "#fff", width: "80%", marginTop: "10%" }} />
                    <input id='submit-email' type="submit" variant="contained" style={{ backgroundColor: "#fff", color: "black", fontWeight: "bold", textTransform: 'none', margin: 10, marginTop: "10%" }}  value="Envoyer" />
                </form>
            </Box>
            <ToastContainer></ToastContainer>
        </div>

    );
}
export default ResetPassword;

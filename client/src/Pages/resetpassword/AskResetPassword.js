import React, { useRef } from 'react'
import "./AskResetPassword.scss"
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { Box } from "@mui/material";
import { useState } from 'react';

import { toast } from 'react-toastify';
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

function ResetPassword() {
    const [mail, setMail] = useState(''); 

    function makeid(nickname) {
        const length = 64;
        const linktoresetpage = `http://localhost:3000/askresetpass`;
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        var result = [];
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() *
                charactersLength)));
        }
        var token = result.join('');
        console.log(`${linktoresetpage}/?token=${token}&nickname=${nickname}`);
        toastSuccess("User successfully registered");

        return token;    
    }
    const sendEmailFromFront = async () => {
        const res = await axios
            .post("http://localhost:5050/sendemail", {
                email: mail
            }).then( (response) => {
                localStorage.setItem("f",response.data);
            }).catch((err) => {
                console.warn("error : ", err);
            });
            return false;

    };


    function onLinkClick(e) {
        e.preventDefault();
        // further processing happens here
     }

    

    const form = useRef();

    return (
        <>
             <div className="form-reset-with-mail-container">
            <Box sx={{ boxShadow: 5 }} style={{ width: "50%", padding: "15px" }} className="box-form-reset-with-mail">
                <h1 style={{ margin: 10, fontSize: "2vw" }}>Réinitialiser le mot de passe</h1>
                <Divider variant="middle" style={{ background: "#000", height: "1px", width: "50%" }} className="divider-form-reset-with-mail" />
                <form ref={form} onClick={onLinkClick} onSubmit={() => sendEmailFromFront()} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <label>Email</label>
                    <input placeholder="Mail" required id="my-mail-id" type="email" name="user_email" onInput={e => setMail(e.target.value)} style={{ backgroundColor: "#fff", width: "80%", marginTop: "10%" }} />
                    <input id='aa' type="submit" variant="contained" style={{ backgroundColor: "#fff", color: "black", fontWeight: "bold", textTransform: 'none', margin: 10, marginTop: "10%" }}  value="Envoyer" />
                </form>
                <button style={{ backgroundColor: "#fff", color: "black", fontWeight: "bold", textTransform: 'none', margin: 10, marginTop: "10%" }} onClick={() => { makeid("Killian"); }}>lalalaa</button>
            </Box>
        </div>
        
        </>
   
    );
}
export default ResetPassword;

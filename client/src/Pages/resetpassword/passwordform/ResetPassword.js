import * as React from "react";
import "./ResetPassword.scss"
import Divider from '@mui/material/Divider';

import {FormControl, Input, Button, Box} from "@mui/material";
function ResetPassword() {
    return (
        <div className="form-reset-with-mail-container">
            <Box sx={{ boxShadow: 5 }} style={{width:"50%", padding:"15px"}} className="box-form-reset-with-mail">
                <h1 style={{margin:10, fontSize: "2vw"}}>Réinitialiser le mot de passe</h1>
                <Divider variant="middle" style={{background: "#000", height: "1px", width: "50%"}} className="divider-form-reset-with-mail"/>
                <FormControl style={{width:"100%",display:"flex", flexDirection:"column", alignItems:"center"}}>
                     <FormControl style={{width:"100%",display:"flex", flexDirection:"column", alignItems:"center"}}> {/* width:"100%", textAlign:"center" */}
                        <Input type="password" placeholder="Nouveau mot de passe" id="my-new-password-id" style={{backgroundColor:"#fff", width:"80%", marginTop:"5%"}}/>
                    </FormControl>
                    <FormControl style={{width:"100%",display:"flex", flexDirection:"column", alignItems:"center"}}>
                        <Input type="password" placeholder="Confirmer le mot de passe" id="my-confirm-password-id" style={{backgroundColor:"#fff", width:"80%", marginTop:"5%"}}/>
                    </FormControl>
                    <Button type="submit" style={{backgroundColor: "#fff", color: "black", fontWeight:"bold", textTransform: 'none', margin:10, marginTop:"5%"}} variant="contained">Changer de mot de passe</Button>
                </FormControl>
            </Box>
        </div>
    );
}

export default ResetPassword;
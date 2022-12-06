import * as React from "react";
import './Login.scss';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { FormControl, InputLabel, Input, FormHelperText} from '@mui/material';

function Login(){
    return(
      <div className="Login">
        <header className="Login-header">
        <Box sx={{ boxShadow: 5}} style={{width:"50%", padding:"15px"}}>
            <h1 style={{margin:10}}>Connexion</h1>
            <Divider variant="middle" style={{background: "#fff", height: "1px"}}/>
            <FormControl onSubmit="">
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                padding={2}
              >
                <FormControl style={{margin:10, width:"300px"}}>
                  <InputLabel htmlFor="my-input" style={{color:"white", fontWeight:"bold"}}>Adresse mail</InputLabel>
                  <Input type="email" id="my-input" aria-describedby="my-helper-text" style={{color:"white"}} />
                </FormControl>
                <FormControl style={{margin:10, width:"300px"}}>
                  <InputLabel htmlFor="my-input" style={{color:"white", fontWeight:"bold"}}>Mot de passe</InputLabel>
                  <Input type="password" id="my-input" aria-describedby="my-helper-text" style={{color:"white"}} />
                  <FormHelperText id="my-helper-text"><Link href="#" underline="none" style={{color:"white"}}>Mot de passe oublie ?</Link></FormHelperText>
                </FormControl>
                <Button type="submit" style={{backgroundColor: "#fff", color: "black", fontWeight:"bold", textTransform: 'none', margin:10}} variant="contained">Connexion</Button>
              </Grid>
            </FormControl>
            <p style={{fontSize:"12px", marginTop:0}}>Pas encore de compte? Créez-en un <Link href="#" underline="none">ici</Link></p>
          </Box>
        </header>
      </div>
    )
}

export default Login;
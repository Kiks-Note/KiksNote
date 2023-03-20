import { FormControl } from '@mui/material';
import { Input } from '@mui/material';
import { InputLabel } from '@mui/material';
import { FormHelperText } from '@mui/material';
import './Profile.scss';
import TextField from '@mui/material/TextField';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, IconButton, Avatar, Box, Grid } from "@mui/material";
import React, { Component, useState } from 'react'
import { Form } from 'react-router-dom';
import { Container } from '@mui/system';
import axios from 'axios';


 class Profile extends Component{

  constructor(props){
    super(props);
    console.log("ffe")
    this.state = {
      data:[],
      isLoading:true,
      error: null
    }
  }

  componentDidMount(){
    axios.get("http://localhost:5050/profile/getUser").then(
      res => {
        console.log(res);
        this.setState({
        data : res.data,
        isLoading : false,
        error: null
        })
      }
    ).catch(error => 
     this.setState({
      data : null,
      isLoading: true,
      error : error
     }) )
  }


  
  render(){
const { data, isLoading, error } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }
   const today = new Date().toISOString().substring(0, 10);
  
    const [image, setImage] = this.useState(null);
    const [pictureToUpload, setPictureToUpload] = this.useState(null);
  
    const mustClass = ['L1 TP', 'L1 ALT', 'L2', 'L3']
    const mustLanguage = ['PHP', 'Java', 'Ruby', 'Javascript', 'Python']
    const mustJob = ['Intégrateur', 'Back-End', 'Front-end', 'FullStack']
    
    handleChange = (event) => {
      const { name, value } = event.target;
      console.log(name + value)
      setFormValue((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    };
   
    
  
    const [formValue, setFormValue] = this.useState({
      dateBirthday: today,
      job: "",
      linkedin: "",
      gitLink: "",
      compagny: "",
      classe: "",
      programmationLanguage: "",
      discordName: "",
      phoneNumber: "",
    });
  
  
  
   
  
    const { job, linkedin, gitLink, compagny, classe, programmationLanguage, discordName, phoneNumber, dateBirthday } = formValue;
  
    const sendData = () => {
      axios.put("http://localhost:5050/profile/user", formValue )
    }
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };
  
    const handleOnChange = async (event) => {
      const newImage = event.target?.files?.[0];
  
  
      if (newImage) {
        setImage(URL.createObjectURL(newImage));
        const base64 = await convertToBase64(newImage);
        setPictureToUpload(base64)
      }
    };
    return (
      
      <div className='userForms'>
        <Grid container spacing={1} columns={12} style={{width : 150, height : 150}}>
          <form >
            <Grid>
                <FormControl>
                  <input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={handleOnChange}
                  />
  
                  <IconButton>
                    <Avatar
                      src={image}
                      style={{
                        margin: "10px",
                        width: "160px",
                        height: "160px",
                      }}
                    />
                  </IconButton>
  
                </FormControl>
            
            </Grid>
            <Grid >
              
                <FormControl className='formControl' fullWidth>
                  <TextField
                    id="date"
                    type="date"
                    name="dateBirthday"
                    value={dateBirthday}
                    onChange={handleChange}
                    sx={{ width: 220 }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="select-class">Classe</InputLabel>
                  <Select
                    name="classe"
                    id="class"
                    value={classe}
                    onChange={handleChange}
                    sx={{ width: 320 }}
                  >
                    {mustClass.map((index) => (
                      <MenuItem key={index} value={index}>
                        {index}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
  
                </Grid>
                <Grid>
                <FormControl fullWidth>
                  <InputLabel id="select-language">Langage de Programmation Favori </InputLabel>
                  <Select
                    name="ProgrammationLanguage"
                    id="language"
                    value={programmationLanguage}
                    onChange={handleChange}
                    sx={{ width: 320 }}
                  >
                    {mustLanguage.map((index) => (
                      <MenuItem key={index} value={index}>
                        {index}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
  
                <FormControl fullWidth>
                  <InputLabel id="select-language"> Lien GitHub </InputLabel>
                  <Input id="github-link" type="text" name="gitLink" onChange={handleChange} value={gitLink} />
                </FormControl>
  
                <FormControl fullWidth>
                  <InputLabel id="discord-name"> Discord </InputLabel>
                  <Input id="discord-name" aria-describedby="discordName" onChange={handleChange} value={discordName} type="text" name="discordName" />
                </FormControl>
  
                <FormControl fullWidth>
                  <InputLabel id="discordLinkedin"> Linkedin </InputLabel>
                  <Input id="linkedin-name" aria-describedby="linkedin" onChange={handleChange} value={linkedin} type="text" name="linkedin" />
                </FormControl>
  
                <div>
                  <FormControl fullWidth>
                    <InputLabel id="select-language">Nom Entreprise </InputLabel>
                    <Input id="compagny-name" aria-describedby="CompagnyName" name="compagny" onChange={handleChange} value={compagny} />
                  </FormControl>
                  <FormControl>
                    <InputLabel id="select-language">Poste Pourvu </InputLabel>
                    <Select
                      id="job"
                      value={job}
                      onChange={handleChange}
                      sx={{ width: 220 }}
                      name="job"
                    >
                      {mustJob.map((index) => (
                        <MenuItem key={index} value={index}>
                          {index}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
  
                <FormControl fullWidth>
                  <InputLabel id="phonenumber"> Numéro de téléphone </InputLabel>
                  <Input id="phone-number" aria-describedby="phoneNumber" type="number" name="phoneNumber" onChange={handleChange} value={phoneNumber} />
                </FormControl>
  
                <Button
                  onClick={() => {
                    sendData()
                  }}
                >
                  Mettre à jour
                </Button>
              
            </Grid>
          </form>
  
        </Grid>
  
      </div>
  
    );
  }
  
}

export default Profile;

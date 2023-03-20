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
    this.state = {
      data: [],
      isLoading: true,
      error: null,
      formValue: {
        dateBirthday: new Date().toISOString().substring(0, 10),
        job: '',
        linkedin: '',
        gitLink: '',
        compagny: '',
        classe: '',
        programmationLanguage: '',
        discordName: '',
        phoneNumber: '',
      },
      image: null,
      pictureToUpload: null,
    };
  }

   componentDidMount(){
    axios.get("http://localhost:5050/profile/getUser").then(
      res => {
        console.log(res);
        this.setState({
        data : res.data,
        isLoading : false,
        error: null,
         formValue: {
        dateBirthday: new Date().toISOString().substring(0, 10),
        job: '',
        linkedin: '',
        gitLink: res.data.name,
        compagny: '',
        classe: '',
        programmationLanguage: '',
        discordName: '',
        phoneNumber: '',
      },
      image: null,
      pictureToUpload: null,
        })
      }
    ).catch(error => 
     this.setState({
      data : null,
      isLoading: true,
      error : error,
       formValue: {
        dateBirthday: new Date().toISOString().substring(0, 10),
        job: '',
        linkedin: '',
        gitLink: '',
        compagny: '',
        classe: '',
        programmationLanguage: '',
        discordName: '',
        phoneNumber: '',
      },
      image: null,
      pictureToUpload: null,
     }) )
  }

 handleChange (event){
  const { name, value } = event.target;
  console.log(name + value);
  this.setState((prevState) => {
    console.log(prevState);
    return {
      formData: {
        ...prevState.formData,
        [name]: value,
      }
    };
  });
};
  
  render(){
const { data, isLoading, error,formValue,image,pictureToUpload } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }  

  
   const mustClass = ['L1 TP', 'L1 ALT', 'L2', 'L3']
    const mustLanguage = ['PHP', 'Java', 'Ruby', 'Javascript', 'Python']
    const mustJob = ['Intégrateur', 'Back-End', 'Front-end', 'FullStack']
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
        this.setState(URL.createObjectURL(newImage));
        const base64 = await convertToBase64(newImage);
        this.setState(base64)
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
                    value={this.state.formValue.dateBirthday}
                    onChange={this.handleChange}
                    sx={{ width: 220 }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="select-class">Classe</InputLabel>
                  <Select
                    name="classe"
                    id="class"
                    value={this.state.formValue.classe}
                    onChange={this.handleChange}
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
                    value={this.state.formValue.programmationLanguage}
                    onChange={this.handleChange}
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
                  <Input id="github-link" type="text" name="gitLink" onChange={this.handleChange} value={this.state.formValue.gitLink} />
                </FormControl>
  
                <FormControl fullWidth>
                  <InputLabel id="discord-name"> Discord </InputLabel>
                  <Input id="discord-name" aria-describedby="discordName" onChange={this.handleChange} value={this.state.formValue.discordName} type="text" name="discordName" />
                </FormControl>
  
                <FormControl fullWidth>
                  <InputLabel id="discordLinkedin"> Linkedin </InputLabel>
                  <Input id="linkedin-name" aria-describedby="linkedin" onChange={this.handleChange} value={this.state.formValue.linkedin} type="text" name="linkedin" />
                </FormControl>
  
                <div>
                  <FormControl fullWidth>
                    <InputLabel id="select-language">Nom Entreprise </InputLabel>
                    <Input id="compagny-name" aria-describedby="CompagnyName" name="compagny" onChange={this.handleChange} value={this.state.formValue.compagny} />
                  </FormControl>
                  <FormControl>
                    <InputLabel id="select-language">Poste Pourvu </InputLabel>
                    <Select
                      id="job"
                      value={this.state.formValue.job}
                      onChange={this.handleChange}
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
                  <Input id="phone-number" aria-describedby="phoneNumber" type="number" name="phoneNumber" onChange={this.handleChange} value={this.state.formValue.phoneNumber} />
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

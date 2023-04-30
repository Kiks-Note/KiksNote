import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";

export default function CreateCard() {

  const current = new Date();
  const dateTime = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

  const [title, setTitle] = useState("React");
  const [desc, setDesc] = useState("");
  const [po, setPo] = useState("");
  const [date, setDate] = useState(dateTime);
  const [image, setImage] = useState("");
  // const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [pictureToUpload, setPictureToUpload] = useState(null);

  const schema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    po: yup.string().required(),
    image: yup.string().required(),
    date: yup.date().required()
  });

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  // GET all PO
  // useEffect(() => {
  //   const fetchInstructors = async () => {
  //     const response = await axios.get("http://localhost:5050/ressources/instructor")
  //     .then((response) => {
  //       setInstructors(response.data);
  //     });
  //   };
  //   fetchInstructors();
  // }, []);

  // Get all courses
  useEffect(() => {
    const fetchCourses = async () => {
      const response = await axios.get("http://localhost:5050/course")
        .then((response) => {
          setCourses(response.data);
        });
    };
    fetchCourses();
  }, []);

  let navigate = useNavigate();
  const Ressources = () => navigate("/cours");

  const onSubmit = async (e) => {
    // e.preventDefault();
    console.log(e);
    const formData = new FormData();
    formData.append("title", e.title);
    formData.append("description", e.description);
    formData.append("instructor", e.insctrutor);
    formData.append("date", e.date);
    formData.append("image", pictureToUpload);
    
    console.log(pictureToUpload);
    try{
      await axios
        .post("http://localhost:5050/ressources", 
        formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => console.log(res.data));
        Ressources();
    }catch(err){
      console.log(err);
    }

    setTitle("React");
    setDesc("");
    setPo("");
    setImage("");
    setDate(dateTime);

  };

  const handleOnChange = async (event) => {
    const newImage = event.target?.files?.[0];
    console.log("newImage" + newImage);

    if (newImage) {
      setImage(URL.createObjectURL(newImage));
      setPictureToUpload(newImage);
    }
  };


  return (
   
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Titre/Languages du cours
          </InputLabel>
          <NativeSelect
            inputProps={{
              name: 'title',
              id: 'uncontrolled-native',
            }}
            {...register("title")}
            type='text'
          >
           {courses.map((course) => (
              <option key={course.id} value={course.name}>{course.name}</option>
           ))}
          </NativeSelect>
        </FormControl>
         
        <TextField 
          id="standard-basic" 
          name='date' 
          label="Date de création" 
          variant="standard" 
          type='date' 
          {...register("date")} 
        />
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: " center",
              }}
            >
              {image && (
                <IconButton
                  color="indefined"
                  aria-label="upload picture"
                  component="label"
                >
                  <input
                    hidden
                    type="file"
                    onChange={handleOnChange}
                    name="image"
                    accept="image/png,image/jpeg"
                  />
                  <Avatar
                    src={image}
                    style={{
                      width: "160px",
                      height: "160px",
                    }}
                  />
                </IconButton>
              )}
              {!image && (
                <IconButton
                  color="indefined"
                  aria-label="upload picture"
                  component="label"
                >
                  <input
                    hidden
                    {...register("image", {
                      validate: {
                        lessThan10MB: (file) =>
                          file[0]?.size < 10000000 || "Max 10MB",
                      },
                    })}
                    type="file"
                    onChange={handleOnChange}
                    name="image"
                    accept="image/png,image/jpeg"
                  />
                  <Avatar
                    src={image}
                    style={{
                      width: "160px",
                      height: "160px",
                    }}
                  />
                </IconButton>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {errors.image && (
                <Typography variant="subtitle1" color="error" align="center">
                  {"Choisissez une photo"}
                </Typography>
              )}
            </Box>
        <TextField 
          id="standard-basic" 
          name='desc' 
          label="Description du cours" 
          variant="standard" 
          type='text' 
          {...register("description")} 
        />
        <TextField 
          id="standard-basic" 
          name='po' 
          label="PO" 
          variant="standard" 
          type='text' 
          {...register("po")} 
        />

        <Button type='submit' color='primary' >
          Submit
        </Button>
        {/* PO */}
        {/* {instructors.map((instructor) => (
          <MenuItem key={instructor.id} value={instructor}>
            {instructor.image && (
              <Avatar
                src={instructor.image}
                alt={`${instructor.firstname} ${instructor.lastname}`}
              />
            )}
            {instructor.firstname} {instructor.lastname}
          </MenuItem>
        ))} */}
      </form>
    </div>
    
  );
}
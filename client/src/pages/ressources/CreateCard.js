import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Avatar, Button, MenuItem } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

export default function CreateCard() {

  const current = new Date();
  const dateTime = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

  const [title, setTitle] = useState("React");
  const [desc, setDesc] = useState("");
  const [po, setPo] = useState("");
  const [date, setDate] = useState(dateTime);
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);

  const schema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    po: yup.string().required(),
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
    const newCard = {
      title: e.title,
      description: e.description,
      insctrutor: e.po,
      date: e.date,
    }
    console.log(newCard);

    try{
      await axios
        .post("http://localhost:5050/ressources", newCard)
        .then((res) => console.log(res.data));
        Ressources();
    }catch(err){
      console.log(err);
    }

    setTitle("React");
    setDesc("");
    setPo("");
    setDate(dateTime);

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
        <TextField 
          id="standard-basic" 
          name='image' 
          label="Image du cours" 
          variant="standard" 
        />
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
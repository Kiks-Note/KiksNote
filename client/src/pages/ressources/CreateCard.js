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

  // useEffect(() => {
  //   const fetchInstructors = async () => {
  //     const response = await axios.get("http://localhost:5050/ressources/instructor")
  //     .then((response) => {
  //       setInstructors(response.data);
  //     });
  //   };
  //   fetchInstructors();
  // }, []);

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
            <option value="Vue">VueJS</option>
            <option value="React">React</option>
            <option value="Angular">Angular</option>
            <option value="Node">Node</option>
            <option value="Express">Express</option>
            <option value="MongoDB">MongoDB</option>
            <option value="MySQL">MySQL</option>
            <option value="PHP">PHP</option>
            <option value="Symfony">Symfony</option>
            <option value="Laravel">Laravel</option>
            <option value="Java">Java</option>
            <option value="Spring">Spring</option>
            <option value="C#">C#</option>
            <option value="ASP.NET">ASP.NET</option>
            <option value="Python">Python</option>
            <option value="Django">Django</option>
            <option value="Flask">Flask</option>
            <option value="Ruby">Ruby</option>
            <option value="Ruby on Rails">Ruby on Rails</option>
            <option value="Swift">Swift</option>
            <option value="Kotlin">Kotlin</option>
            <option value="C++">C++</option>
            <option value="C">C</option>
            <option value="Go">Go</option>
            <option value="Rust">Rust</option>
            <option value="Elixir">Elixir</option>
            <option value="Erlang">Erlang</option>
            <option value="Haskell">Haskell</option>
            <option value="Scala">Scala</option>
            <option value="Clojure">Clojure</option>
            <option value="Perl">Perl</option>
            <option value="R">R</option>
            <option value="Lua">Lua</option>
            <option value="Dart">Dart</option>
            <option value="TypeScript">TypeScript</option>
            <option value="HTML">HTML</option>
            <option value="CSS">CSS</option>
            <option value="Sass">Sass</option>
            <option value="Less">Less</option>
            <option value="Stylus">Stylus</option>
            <option value="Bootstrap">Bootstrap</option>
            <option value="Tailwind">Tailwind</option>
            <option value="Bulma">Bulma</option>
            <option value="Material UI">Material UI</option>
            <option value="Ant Design">Ant Design</option>
            <option value="Semantic UI">Semantic UI</option>
            <option value="jQuery">jQuery</option>
            <option value="React Native">React Native</option>
            <option value="Flutter">Flutter</option>
            <option value="Ionic">Ionic</option>
            <option value="Cordova">Cordova</option>
            <option value="PhoneGap">PhoneGap</option>
            <option value="Electron">Electron</option>
            <option value="PWA">PWA</option>
            <option value="GraphQL">GraphQL</option>
            <option value="Apollo">Apollo</option>
            <option value="REST">REST</option>
            <option value="SOAP">SOAP</option>
            <option value="JSON">JSON</option>
            <option value="XML">XML</option>
            <option value="YAML">YAML</option>
            <option value="CSV">CSV</option>
            <option value="Markdown">Markdown</option>
            <option value="LaTeX">LaTeX</option>
            <option value="Bash">Bash</option>
          </NativeSelect>
        </FormControl>
         
        <TextField id="standard-basic" name='date' label="Date de création" variant="standard" type='date' {...register("date")} />
        <TextField id="standard-basic" name='image' label="Image du cours" variant="standard" />
        <TextField id="standard-basic" name='desc' label="Description du cours" variant="standard" type='text' {...register("description")} />
        <TextField id="standard-basic" name='po' label="PO" variant="standard" type='text' {...register("po")} />

        <Button type='submit' color='primary' >
          Submit
        </Button>
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
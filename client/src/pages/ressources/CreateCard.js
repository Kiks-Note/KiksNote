import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

export default function CreateCard() {

  let navigate = useNavigate();
  const Ressources = () => {
    let path = "/ressources";
    navigate(path);
  }
  
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState("");
  const onSubmit = data => console.log(data);

  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }}
      noValidate
      autoComplete="off"
    >
      <form onSubmit={handleSubmit((data) => setData(JSON.stringify(data)))}>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Age
          </InputLabel>
          <NativeSelect
            {...register("title", { required: true })}
            defaultValue="React"
            inputProps={{
              name: 'Titre/Language du cours',
              id: 'uncontrolled-native',
            }}
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
          </NativeSelect>
        </FormControl>
         
        <TextField id="standard-basic" label="Date de création" variant="standard" {...register("date", {required: true})} />
        <TextField id="standard-basic" label="Image du cours" variant="standard" {...register("image", {required: true})} />
        <TextField id="standard-basic" label="Description du cours" variant="standard" {...register("desc", {required: true})} />
        <TextField id="standard-basic" label="PO" variant="standard" {...register("po", {required: true})} />

        <Button type='submit' variant="contained" onClick={Ressources}>
          Submit
        </Button>
      </form>
    </Box>
  );
}
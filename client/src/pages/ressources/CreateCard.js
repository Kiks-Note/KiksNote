import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateCard() {

  const current = new Date();
  const dateTime = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

  const [title, setTitle] = useState("React");
  const [desc, setDesc] = useState("");
  const [po, setPo] = useState("");
  const [date, setDate] = useState(dateTime);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newCard = {
      title: title,
      description: desc,
      insctrutor: po,
      date: date,
    }
    console.log(newCard);

    try{
      await axios
        .post("http://localhost:5050/ressources", newCard)
        .then((res) => console.log(res.data));
    }catch(err){
      console.log(err);
    }

    setTitle("React");
    setDesc("");
    setPo("");
    setDate(dateTime);

    
  };

  let navigate = useNavigate();
  const Ressources = () =>{
      let path = "/ressources";
      navigate(path);
  }



  return (
   
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Titre/Languages du cours
          </InputLabel>
          <NativeSelect
            inputProps={{
              name: 'title',
              id: 'uncontrolled-native',
            }}
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
         
        <TextField id="standard-basic" name='date' label="Date de création" variant="standard" type='date' value={date} onChange={(e) => setDate(e.target.value)} />
        <TextField id="standard-basic" name='image' label="Image du cours" variant="standard" />
        <TextField id="standard-basic" name='desc' label="Description du cours" variant="standard" type='text' value={desc} onChange={(e) => setDesc(e.target.value)} />
        <TextField id="standard-basic" name='po' label="PO" variant="standard" type='text' value={po} onChange={(e) => setPo(e.target.value)} />

        <Button type='submit' color='primary' onClick={Ressources} >
          Submit
        </Button>
      </form>
    </div>
    
  );
}
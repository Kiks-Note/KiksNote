import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";

import { addImpactMappingActors, addImpactMappingDeliverables, addImpactMappingImpacts, addImpactMappingGoals, deleteImpactMappingActors, deleteImpactMappingDeliverables, deleteImpactMappingGoals, deleteImpactMappingImpacts } from "../../redux/slices/impactMappingSlice";

const BasicCard = ({title, type , column, texte, onCloseForm, index}) => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("type", index);
  }, []);

  const onHandleClick = () =>{

    //switch 
    switch (column) {
      case 0:
        dispatch(addImpactMappingGoals({goals:text}));
        break;
        
      case 1:
        dispatch(addImpactMappingActors({actors:text}));
        break;
      case 2:
        dispatch(addImpactMappingImpacts({impacts:text}));
        break;
      case 3:
        dispatch(addImpactMappingDeliverables({deliverables:text}));
        break;
      default:
        break;
    }
    console.log(text);
    onCloseForm();
  };

  const deleteButton = () =>{
    switch (column) {
      case 0:
        dispatch(deleteImpactMappingGoals({index:index}));
        break;
      case 1:
        dispatch(deleteImpactMappingActors({index:index}));
        break;
      case 2:
        dispatch(deleteImpactMappingImpacts({index:index}));
        break;
      case 3:
        dispatch(deleteImpactMappingDeliverables({index:index}));
        break;
      default:
        break;
    }
    console.log("delete", index)
  }

  return (
    <Card
      sx={{
        minWidth: 200,
        border: "1px solid black",
        m: 1,
      }}
    >
      {type == "form" && (
        <CardContent
          sx={{     padding:'1'     }}
        >
          <FormControl
            sx={{
              width: "100%",
            }}
          >
            <TextField sx={{
              width: '100%',
            }} label="Texte"
            aria-describedby="my-helper-text"
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            placeholder="Veuillez écrire votre texte ici"
            fullWidth
            onChange={(e) => setText(e.target.value)}
            wrap="true"/>
          </FormControl>
          <CardActions sx={{justifyContent:'flex-end'}}>
            <Button size="small" onClick={()=>onHandleClick()}>Confirmer</Button>
            <Button size="small" color="error" onClick={()=>onCloseForm()}>Annuler</Button>
          </CardActions>
        </CardContent>
      )}
      {type == "card" && (
        <CardContent>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {title} #{index+1}
          </Typography>
          <Typography variant="body2">
            {texte}
          </Typography>
          <CardActions sx={{justifyContent:'flex-end'}}>
            <Button size="small" color="error" onClick={()=>deleteButton()}>Supprimer</Button>
          </CardActions>
        </CardContent>
      )}
    </Card>
  );
};

export default BasicCard;

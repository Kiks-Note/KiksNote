import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";

const BasicCard = ({ title, type }) => {
  useEffect(() => {
    console.log("type", type);
  }, []);

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
          <Typography variant="h6" component="div">
            {title}
          </Typography>
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
            wrap="true"/>
          </FormControl>
          <CardActions sx={{justifyContent:'flex-end'}}>
            <Button size="small">Confirmer</Button>
          </CardActions>
        </CardContent>
      )}
      {type == "card" && (
        <CardContent>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            adjective
          </Typography>
          <Typography variant="body2">
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>
      )}
    </Card>
  );
};

export default BasicCard;

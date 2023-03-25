import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import vueimg from '../../pages/ressources/vue.png';
import { useNavigate } from 'react-router-dom';

export default function Dard() {

  let navigate = useNavigate();
  const PDFBacklog = () => {
    let path = "/pdfbacklog";
    navigate(path);
  } 

  const PDFSupport = () => {
    let path = "/pdfsupport";
    navigate(path);
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={vueimg}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Semaine VueJs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={PDFBacklog} >Backlog</Button>
        <Button size="small" onClick={PDFSupport} >Support PDF</Button>
      </CardActions>
    </Card>
  );
}
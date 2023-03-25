import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import vueimg from '../../pages/ressources/vue.png';
import { useNavigate } from 'react-router-dom';
import CreateCard from '../../pages/ressources/CreateCard';

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
    <Card sx={{ maxWidth: 300 }}>
    {/* Card Image */}
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={vueimg}
      />
      <CardContent>
      {/* Card Title */}
        <Typography gutterBottom variant="h5" component="div">
          {CreateCard.title}
        </Typography>
      {/* Card Description */}
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
        <br/>
      {/* Card PO Name */}
        <Typography variant="h7" color="text.secondary">
          -PO : Jean
        </Typography>
        <br/>
      {/* Card Creation Date */}
        <Typography variant="h7" color="text.secondary">
          -Date de création : 01/01/2021
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={PDFBacklog} >Backlog</Button>
        <Button size="small" onClick={PDFSupport} >Support PDF</Button>
      </CardActions>
    </Card>
  );
}
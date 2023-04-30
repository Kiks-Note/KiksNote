import AddIcon from "@mui/icons-material/Add";
import BackpackIcon from '@mui/icons-material/Backpack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { CardMedia, Tooltip } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from "@mui/material/IconButton";
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import imageUrl from "../ressources/vue.png";

export default function Ressources() {
  const [ressources, setRessources] = useState([]);

  useEffect(() => {
    const fetchRessources = async () => {
      try {
        const response = await axios.get("http://localhost:5050/ressources");
        setRessources(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRessources();
  }, []);

  const navigate = useNavigate();
  const createCardRoute = () => navigate("/createCard");
  const pdfBacklogRoute = () => navigate("/pdfBacklog");
  const pdfSupportRoute = () => navigate("/pdfSupport");

  if (ressources.length === 0) {
    return <div>Aucune carte à afficher</div>;
  }

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker />
      </LocalizationProvider>
      <br />
      <IconButton color="primary" aria-label="add" onClick={createCardRoute}>
        <AddIcon />
      </IconButton>
      <br />
      <div>
        {ressources.map((ressource) => (
          <Card
            key={ressource.id}
            style={{
              width: 250,
              margin: "auto",
              transition: "0.3s",
              boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
              "&:hover": {
                boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
              },
            }}
          >
            <CardMedia
              style={{resizeMode: "contain"}}
              src={ressource.image} // À Modifier pour afficher l'image Choisie par l'utilisateur
              height="140"
              title={ressource.title}
              component="img"
            />
            <CardContent
              style={{
                textAlign: "left",
                flexDirection: "column",
              }}
            >
              <Typography
                variant={"h6"}
                gutterBottom
                paragraph
                sx={{fontSize: 25}}
              >
                {ressource.title}
              </Typography>
              <Typography
                variant={"caption"}
                paragraph
                sx={{fontSize: 18}}
              >
                Description : {ressource.description}
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
              <Tooltip title="BackLog">
                <IconButton onClick={pdfBacklogRoute}>
                  <BackpackIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Support">
                <IconButton onClick={pdfSupportRoute}>
                  <PictureAsPdfIcon />
                </IconButton>
              </Tooltip>
            </div>
          </CardContent>
        </Card> 
        ))}
      </div>
    </div>
  );
}

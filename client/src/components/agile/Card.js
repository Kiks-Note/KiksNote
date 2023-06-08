import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";

import {
  addImpactMappingActors,
  addImpactMappingDeliverables,
  addImpactMappingImpacts,
  addImpactMappingGoals,
  deleteImpactMappingActors,
  deleteImpactMappingDeliverables,
  deleteImpactMappingGoals,
  deleteImpactMappingImpacts,
  editImpactMappingGoal,
  editImpactMappingActor,
  editImpactMappingImpact,
  editImpactMappingDeliverable,
} from "../../redux/slices/impactMappingSlice";
import { setActiveTab, addTab } from "../../redux/slices/tabBoardSlice";

const BasicCard = ({
  title,
  type,
  column,
  texte,
  onCloseForm,
  index,
  defineColor,
  dashboardId,
}) => {
  const { goals, actors, impacts, deliverables } = useSelector(
    (state) => state.impactMapping
  );
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const [color, setColor] = useState("");
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const uniqueId = uuidv4();

  useEffect(() => {
    console.log(actors)
    setColor(defineColor);
    setText(texte);
    console.log(dashboardId);
    setId(dashboardId);
  }, [defineColor, texte, goals, actors, impacts, deliverables, dashboardId]);


  const moveToPersona = () => {
    const personaTab = {
      id: "Persona" + id,
      label: "Persona ",
      closeable: true,
      component: "Personas",
      data: { dashboardId: id },
    };
    dispatch(addTab(personaTab));
    dispatch(setActiveTab(personaTab.id));
  };
  const moveToEmpathy = () => {
    console.log(id, actors[index].id)
    const empathyTab = {
      id: "Empathy" + id,
      label: "Empathy ",
      closeable: true,
      component: "Empathy",
      data: { dashboardId: id, actorId: actors[index].id},
    };
    dispatch(addTab(empathyTab));
    dispatch(setActiveTab(empathyTab.id));
  };

  const onHandleClick = async () => {
    if (text !== "" && text !== undefined && text !== null) {
      switch (column) {
        case 0:
          dispatch(
            addImpactMappingGoals({ text: text, color: color, id: uniqueId })
          );
          break;
        case 1:
          dispatch(
            addImpactMappingActors({ text: text, color: color, id: uniqueId })
          );
          break;
        case 2:
          dispatch(
            addImpactMappingImpacts({ text: text, color: color, id: uniqueId })
          );
          break;
        case 3:
          dispatch(
            addImpactMappingDeliverables({
              text: text,
              color: color,
              id: uniqueId,
            })
          );
          break;
        default:
          break;
      }
      console.log(text, color, uniqueId);
      onCloseForm();
    } else {
      setOpenSnackbar(true);
    }
  };

  const deleteButton = () => {
    switch (column) {
      case 0:
        dispatch(deleteImpactMappingGoals({ index: index }));
        break;
      case 1:
        dispatch(deleteImpactMappingActors({ index: index }));
        break;
      case 2:
        dispatch(deleteImpactMappingImpacts({ index: index }));
        break;
      case 3:
        dispatch(deleteImpactMappingDeliverables({ index: index }));
        break;
      default:
        break;
    }
    console.log("delete", index);
  };
  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const toggleEditForm = () => {
    if (isEditing) {
      setColor("");
      setText("");
    } else {
      setColor(defineColor);
      setText(texte);
    }
    setIsEditing((prev) => !prev);
  };

  const onHandleEdit = () => {
    console.log(index, text, color);
    switch (column) {
      case 0:
        dispatch(
          editImpactMappingGoal({ index: index, text: text, color: color })
        );
        break;
      case 1:
        dispatch(
          editImpactMappingActor({ index: index, text: text, color: color })
        );
        break;
      case 2:
        dispatch(
          editImpactMappingImpact({ index: index, text: text, color: color })
        );
        break;
      case 3:
        dispatch(
          editImpactMappingDeliverable({
            index: index,
            text: text,
            color: color,
          })
        );
        break;
      default:
        break;
    }
    console.log("edit", index);
    toggleEditForm();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  return (
    <Card
      sx={{
        minWidth: 200,
        border: "1px solid black",
        m: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          backgroundColor: color || defineColor,
        }}
      >
        &nbsp;
      </div>

      {type === "form" && (
        <CardContent sx={{ padding: "1" }}>
          <FormControl
            sx={{
              width: "100%",
            }}
          >
            <TextField
              sx={{
                width: "100%",
              }}
              aria-describedby="my-helper-text"
              multiline
              rows={4}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              placeholder="Veuillez écrire votre texte ici"
              fullWidth
              onChange={(e) => setText(e.target.value)}
              wrap="true"
            />
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={color || ''}
              onChange={handleColorChange}
              displayEmpty
            >
              <MenuItem value="" disabled style={{ display: 'flex' }}>Choississez une couleur</MenuItem>
              <MenuItem value="#FFC0CB" style={{ display: 'flex' }}>Rose</MenuItem>
              <MenuItem value="#ADD8E6" style={{ display: 'flex' }}>Bleu clair</MenuItem>
              <MenuItem value="#90EE90" style={{ display: 'flex' }}>Vert clair</MenuItem>
              <MenuItem value="#FFD700" style={{ display: 'flex' }}>Or</MenuItem>
              <MenuItem value="#FFA07A" style={{ display: 'flex' }}>Saumon</MenuItem>
            </Select>

          </FormControl>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button size="small" onClick={() => onHandleClick()} style={{ color: '#90caf9' }}>
              Confirmer
            </Button>
            <Button size="small" color="error" onClick={() => onCloseForm()} style={{ color: '#ff5252' }}>
              Annuler
            </Button>
          </CardActions>
        </CardContent>
      )}
      {type === "card" && (
        <CardContent>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {title} #{index + 1}
          </Typography>
          {isEditing ? (
            <FormControl sx={{ width: "100%" }}>
              <TextField
                sx={{
                  width: "100%",
                }}
                label="Texte"
                aria-describedby="my-helper-text"
                multiline
                rows={4}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                placeholder="Veuillez écrire votre texte ici"
                fullWidth
                value={text}
                onChange={(e) => setText(e.target.value)}
                wrap="true"
              />
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={color}
                placeholder="Choississez votre Couleur"
                onChange={handleColorChange}
                sx={{ width: "100%", mt: 1 }}
              >
                <MenuItem value="" disabled style={{ display: 'flex' }}>Choississez une couleur</MenuItem>
                <MenuItem value="#FFC0CB" style={{ display: 'flex' }}>Rose</MenuItem>
                <MenuItem value="#ADD8E6" style={{ display: 'flex' }}>Bleu clair</MenuItem>
                <MenuItem value="#90EE90" style={{ display: 'flex' }}>Vert clair</MenuItem>
                <MenuItem value="#FFD700" style={{ display: 'flex' }}>Or</MenuItem>
                <MenuItem value="#FFA07A" style={{ display: 'flex' }}>Saumon</MenuItem>
              </Select>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button size="small" onClick={() => onHandleEdit()} style={{ color: '#90caf9' }}>
                  Confirmer
                </Button>
                <Button size="small" onClick={() => toggleEditForm()} style={{ color: '#ff5252' }}>
                  Annuler
                </Button>
              </CardActions>
            </FormControl>
          ) : (
            <>
              <Typography variant="body2">{texte}</Typography>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                {column === 1 && (
                  <CardActions>
                    <Button
                      size="small"
                      color="success"
                      onClick={() => moveToEmpathy()}
                    >
                      {" "}
                      Allez vers Empathy Map{" "}
                    </Button>
                    <Button
                      size="small"
                      color="success"
                      onClick={() => moveToPersona()}
                    >
                      Allez vers Persona
                    </Button>
                  </CardActions>
                )}
                <Button size="small" onClick={() => toggleEditForm()} style={{ color: '#90caf9' }}>
                  Modifier
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => deleteButton()}
                  style={{ color: '#ff5252' }}
                >
                  Supprimer
                </Button>
              </CardActions>
            </>
          )}
        </CardContent>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Veuillez remplir le texte avant de confirmer.
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default BasicCard;

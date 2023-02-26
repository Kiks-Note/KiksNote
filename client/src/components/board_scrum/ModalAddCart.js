import React, { useEffect, useState } from "react";
//import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import { HexColorPicker } from "react-colorful";

function DialogAddCard(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const [etiquette, setEtiquette] = useState("");
  const [etiquettes, setEtiquettes] = useState([]);
  const [color, setColor] = useState("#000000"); // initial color is black

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    mode: "onTouched",
  });
  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        card_name: "",
        card_description: "",
        etiquettes: "",
        story: "",
      });
    }
  }, [formState, isSubmitSuccessful, reset]);
  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const radioGroupRef = React.useRef(null);
  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };
  const handleCancel = () => {
    // TO RESET FORM
    reset({
      card_name: "",
      card_description: "",
      etiquettes: "",
      story: "",
    });
    setEtiquette("");
    setEtiquettes([]);
    onClose();
  };
  const handleOk = () => {
    onClose(value);
  };
  const wait = function (duration = 1000) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, duration);
    });
  };

  //SUBMIT FONCTION
  const onSubmit = async (data) => {
    console.log(data);
    const formData = {
      card_name: data.card_name,
      card_description: data.card_description,
      etiquettes: etiquettes,
      story: data.story,
    };
    // try {
    //   axios.post(`http://localhost:5050/board`, { formData }).then((res) => {
    //     console.log(res);
    //     console.log(res.data);
    //   });
    // } catch (error) {
    //   console.log(error);
    // }

    console.log(formData);
    await wait(2000);
    handleOk();
  };

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          width: "80%",
          maxHeight: "calc(100% - 64px)",
          margin: "32px auto",
          overflowY: "visible",
          overflowX: "hidden",
          position: "fixed",
          top: "40%",
          left: "55%",
          transform: "translate(-50%, -50%)",
          "@media (max-width: 600px)": {
            width: "100%",
            maxHeight: "100%",
            margin: 0,
          },
        },
      }}
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogActions>
        <IconButton onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      </DialogActions>
      <DialogTitle>Création d'une carte</DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          noValidate
          sx={{ mt: 3 }}
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          {isSubmitSuccessful && (
            <Alert severity="success">Votre carte a été crée</Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InputLabel id="label_card_name">Nom*</InputLabel>
              <TextField
                fullWidth
                id="filled-required"
                name="card_name"
                {...register("card_name", {
                  required: "Choisissez un nom pour la carte",
                  minLength: {
                    value: 3,
                    message: "Entrez au moins 3 caractères",
                  },
                })}
              />
              {errors.card_name && (
                <Typography variant="subtitle1" color="error">
                  {errors.card_name.message}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="label_card_description">Description*</InputLabel>
              <TextField
                multiline
                maxRows={4}
                fullWidth
                id="filled-required"
                {...register("card_description", {
                  required: "Choisissez une description",
                })}
              />
              {errors.card_description && (
                <Typography variant="subtitle1" color="error">
                  {errors.card_description.message}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox {...register("story")} />}
                label="Story"
              />
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputLabel id="label_labels">Etiquettes</InputLabel>
                <TextField
                  fullWidth
                  id="filled-required"
                  value={etiquette}
                  onChange={(e) => setEtiquette(e.target.value)}
                />
                <Button
                  variant="text"
                  onClick={() => {
                    if (etiquette.trim() !== "" && !etiquettes.includes(etiquette)) {
                      setEtiquettes([...etiquettes, { etiquette, color }]);
                      setEtiquette("");
                      setColor("#000000"); // reset the color picker to black
                    }
                  }}
                >
                  Ajouter
                </Button>
                <Box sx={{ mt: 2 }}>
                  {etiquettes.map((label, index) => (
                    <Chip
                      key={index}
                      label={label.label}
                      style={{ backgroundColor: label.color }}
                      onDelete={() =>
                        setEtiquettes((prevLabels) =>
                          prevLabels.filter(
                            (prevLabel) => prevLabel.label !== label.label
                          )
                        )
                      }
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel id="label_color">Couleur de l'etiquette </InputLabel>
                <HexColorPicker color={color} onChange={setColor} />
              </Grid>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            type="submit"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            Sauvegarder
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

DialogAddCard.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

export default function ModalAddCart() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("Dione");

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue) => {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        background: "#e0dede",
        color: "#5e5e5e",
        padding: "5px 5px 5px 15px",
      }}
    >
      <Button
        onClick={handleClickListItem}
        variant="text"
        startIcon={<AddIcon />}
      >
        Ajouter une carte
      </Button>
      <DialogAddCard
        id="ringtone-menu"
        keepMounted
        open={open}
        onClose={handleClose}
        value={value}
      />
    </div>
  );
}

import React, { useEffect, useState } from "react";
//import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InputLabel from "@mui/material/InputLabel";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import Autocomplete from "@mui/material/Autocomplete";
import { Alert, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

function DialogDashbord(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const [personName, setPersonName] = React.useState([]);
  const [selectedFile, setSelectedFile] = React.useState();
  const [uploadedPhotos, setUploadedPhotos] = React.useState([]);
  const [preview, setPreview] = React.useState();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    mode: "onTouched",
  });
  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        end: "",
        start: "",
        sprint_name: "",
        sprint_group: "",
        image: "",
      });
      setPersonName([]);
    }
  }, [formState, isSubmitSuccessful, reset]);
  // create a preview as a side effect, whenever selected file is changed
  React.useEffect(() => {
    if (!selectedFile) {
      setPreview();
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
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
    reset({
      end: "",
      start: "",
      sprint_name: "",
      sprint_group: "",
      membres: "",
      image: "",
    });
    onClose();
  };
  const handleOk = () => {
    setSelectedFile();
    onClose(value);
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value);
    setPersonName(typeof value === "string" ? value.split(",") : value);
    console.log(personName);
  };
  const wait = function (duration = 1000) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, duration);
    });
  };
  const handleDelete = (chipToDelete) => () => {
    setPersonName((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };
  //SUBMIT FONCTION
  const onSubmit = async (data) => {
    console.log(data.membres);
    const formData = {
      sprint_name: data.sprint_name,
      sprint_group: data.sprint_group,
      start: data.start,
      end: data.end,
      favorite: false,
      favoriteDate: "",
      students: data.membres,
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

  const removeSelectedImage = () => {
    setSelectedFile();
  };

  const onSelectFile = (e) => {
    const files = e.target.files[0];
    setUploadedPhotos([...uploadedPhotos, files]);
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250,
      },
    },
  };

  const membres = [
    { student_id: 1, firstname: "Oliver ", lastname: "Hansen" },
    { student_id: 2, firstname: "Henry", lastname: "Van" },
    { student_id: 3, firstname: "April ", lastname: "Tucker" },
    { student_id: 4, firstname: "Ralph", lastname: "Hubbard" },
    { student_id: 5, firstname: "Omar", lastname: "Alexander" },
    { student_id: 6, firstname: "Carlos ", lastname: "Abbott" },
    { student_id: 7, firstname: "Miriam ", lastname: "Wagner" },
    { student_id: 8, firstname: "Bradley", lastname: "Wilkerson" },
    { student_id: 9, firstname: "Virginia ", lastname: "Andrews" },
    { student_id: 10, firstname: "Kelly", lastname: "Snyder" },
  ];

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
      <DialogTitle>Création d'un sprint</DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate sx={{ mt: 3 }} autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          {isSubmitSuccessful && <Alert severity="success">Votre sprint a été enregrister avec succés</Alert>}

          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {selectedFile && (
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: " center",
                  }}
                >
                  <IconButton
                    onClick={removeSelectedImage}
                    aria-label="nettoyer"
                    sx={{
                      cursor: "pointer",
                      color: "white",
                      backgroundColor: "black",
                      position: "absolute",
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                  <img src={preview} alt="" style={{ height: "150px", width: "345px" }} />
                </Box>
              )}
              {!selectedFile && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <IconButton color="primary" aria-label="upload picture" component="label">
                    <input
                      hidden
                      {...register("image", {
                        validate: {
                          lessThan10MB: (files) => files[0]?.size < 30000 || "Max 30kb",
                        },
                      })}
                      type="file"
                      onChange={onSelectFile}
                      name="image"
                      accept="image/png,image/jpeg"
                    />
                    <PhotoCamera />
                  </IconButton>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                {errors.image && (
                  <Typography variant="subtitle1" color="error" align="center">
                    {"Choisissez une photo"}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="membres"
                {...register("membres", {
                  required: true,
                  validate: {
                    valid: (event, item) => {
                      if (event.length < 2 || event.length > 4) {
                        return false;
                      }
                    },
                  },
                })}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    id="tags-outlined"
                    onChange={(event, item) => {
                      onChange(item);
                    }}
                    value={value}
                    options={membres}
                    getOptionLabel={(option) => `${option.firstname + option.lastname}`}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField {...params} label="Membres*" placeholder="Choissisez vos partenanires" />
                    )}
                  />
                )}
              />
              {errors.membres && (
                <Typography variant="subtitle1" color="error">
                  {"Choisissez entre 2 et 4 membres"}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="label_name_sprint">Nom du sprint*</InputLabel>
              <TextField
                fullWidth
                id="filled-required"
                name="sprint_name"
                {...register("sprint_name", {
                  required: "Choisissez un nom du sprint",
                  minLength: {
                    value: 3,
                    message: "Entrez au moins 3 caractères",
                  },
                })}
              />
              {errors.sprint_name && (
                <Typography variant="subtitle1" color="error">
                  {errors.sprint_name.message}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="label_name_sprint">Nom du group*</InputLabel>
              <TextField
                fullWidth
                id="filled-required"
                {...register("sprint_group", {
                  required: "Choisissez un nom de groupe",
                  minLength: {
                    value: 3,
                    message: "Entrez au moins 3 caractères",
                  },
                })}
              />
              {errors.sprint_group && (
                <Typography variant="subtitle1" color="error">
                  {errors.sprint_group.message}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={1}>
                  <InputLabel id="label_date_start">Date de début *</InputLabel>
                  <TextField
                    id="date-start"
                    type="date"
                    sx={{ width: 250 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("start", {
                      required: "Choisissez une date de début ",
                    })}
                  />
                </Stack>
                {errors.start && (
                  <Typography variant="subtitle1" color="error">
                    {errors.start.message}
                  </Typography>
                )}
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={1}>
                  <InputLabel id="label_date_end">Date de fin *</InputLabel>
                  <TextField
                    id="date-end"
                    type="date"
                    sx={{ width: 250 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("end", {
                      required: "Choisissez une date de fin ",
                    })}
                  />
                </Stack>
                {errors.end && (
                  <Typography variant="subtitle1" color="error">
                    {errors.end.message}
                  </Typography>
                )}
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Button variant="contained" type="submit" disabled={isSubmitting} sx={{ mt: 3, mb: 2 }}>
            Sauvegarder
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

DialogDashbord.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

export default function ModalCreateSprint() {
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
    <Box>
      <List component="div" role="group">
        <IconButton aria-label="delete" onClick={handleClickListItem} size="large" color="primary">
          <AddIcon />
        </IconButton>
        <DialogDashbord id="ringtone-menu" keepMounted open={open} onClose={handleClose} value={value} />
      </List>
    </Box>
  );
}

import * as React from "react";
import { useForm } from "react-hook-form";
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
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import { Alert, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

function ConfirmationDialogRaw(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const radioGroupRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

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
    onClose(value);
  };

  const [personName, setPersonName] = React.useState([]);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const [selectedFile, setSelectedFile] = React.useState();
  const [uploadedPhotos, setUploadedPhotos] = React.useState([]);
  const [preview, setPreview] = React.useState();

  const wait = function (duration = 1000) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, duration);
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    console.log(data);
    await wait(2000);
    handleOk();
  };
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
    { id: 1, name: "Oliver Hansen" },
    { id: 2, name: "Van Henry" },
    { id: 3, name: "April Tucker" },
    { id: 4, name: "Ralph Hubbard" },
    { id: 5, name: "Omar Alexander" },
    { id: 6, name: "Carlos Abbott" },
    { id: 7, name: "Miriam Wagner" },
    { id: 8, name: "Bradley Wilkerson" },
    { id: 9, name: "Virginia Andrews" },
    { id: 10, name: "Kelly Snyder" },
  ];

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 935 } }}
      maxWidth="xl"
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
        <Box
          component="form"
          noValidate
          sx={{ mt: 3 }}
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          {isSubmitSuccessful && (
            <Alert severity="success">
              Votre sprint a été enregrister avec succés
            </Alert>
          )}

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
                      position:"absolute",
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                  <img
                    src={preview}
                    alt=""
                    style={{ height: "150px", width: "345px" }}
                  />
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
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                  >
                    <input
                      hidden
                      {...register("image", {
                        validate: {
                          lessThan10MB: (files) =>
                            files[0]?.size < 30000 || "Max 30kb",
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
              <InputLabel id="demo-multiple-chip-label">Membres*</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                {...register("membres", {
                  required: true,
                  validate: {
                    valid() {
                      if (personName.length < 2 || personName.length > 4) {
                        return false;
                      }
                    },
                  },
                })}
                value={personName}
                onChange={handleChange}
                input={
                  <OutlinedInput
                    id="select-multiple-chip"
                    label="Chip"
                    fullWidth
                  />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {membres.map((name) => (
                  <MenuItem key={name.id} value={name.name}>
                    {name.name}
                  </MenuItem>
                ))}
              </Select>
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

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

export default function Modal() {
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
        <IconButton
          aria-label="delete"
          onClick={handleClickListItem}
          size="large"
          color="primary"
        >
          <AddIcon />
        </IconButton>
        <ConfirmationDialogRaw
          id="ringtone-menu"
          keepMounted
          open={open}
          onClose={handleClose}
          value={value}
        />
      </List>
    </Box>
  );
}

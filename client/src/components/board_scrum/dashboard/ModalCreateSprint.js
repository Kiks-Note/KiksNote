import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { format } from "date-fns";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import {
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  TextField,
  Avatar,
  OutlinedInput,
  Box,
  Chip,
} from "@mui/material";
import List from "@mui/material/List";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const schema = yup.object().shape({
  sprint_name: yup.string().required("Donnez un nom à votre sprint."),
  sprint_group: yup.string().required("Donnez un nom à votre groupe."),
  ending_date: yup
    .date()
    .min(new Date(), "La date de fin doit être postérieure à aujourd'hui")
    .when(
      "starting_date",
      (startingDate, schema) =>
        startingDate &&
        schema.min(
          startingDate,
          "La date de fin doit être postérieure à la date de début"
        )
    ),
  starting_date: yup.date(),
  students: yup.array().min(1, "Ajoutez au moins un membre."),
});

function DialogDashbord(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const [members, setMembers] = useState(props.members);
  const [valueMembers, setValueMembers] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const today = new Date();
  const defaultStartDate = format(today, "yyyy-MM-dd");
  //Function for the select to change member
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setValueMembers(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    setMembers(props.members);
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const radioGroupRef = useRef(null);
  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  //Function to close the dialog
  const handleClose = () => {
    reset();
    setValueMembers();
    onClose();
  };
  //SUBMIT FONCTION
  const onSubmit = async (data) => {
    const dataForm = {
      students: data.students,
      starting_date: data.starting_date,
      ending_date: data.ending_date,
      favorite: "false",
      group_name: data.group_name,
      sprint_name: data.group_name,
      image: "",
      pdf_link: "",
      release: {},
    };
    try {
      axios
        .post(`http://localhost:5050/dashboard-creation`, { dataForm })
        .then((res) => {
          handleClose();
        });
    } catch (error) {
      console.log(error);
    }
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
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogActions>
      <DialogTitle>Création d'un dashbaord</DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          noValidate
          sx={{ mt: 3 }}
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Membres *</InputLabel>
                <Select
                  {...register("students")}
                  multiple
                  value={valueMembers}
                  onChange={handleChange}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Chip" />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value.uid} label={value.firstname} />
                      ))}
                    </Box>
                  )}
                >
                  {members.map((member) => (
                    <MenuItem
                      key={member.uid}
                      value={member}
                      sx={{
                        width: "100%",
                      }}
                    >
                      {member.image && (
                        <Avatar
                          src={member.image}
                          alt={`${member.firstname} ${member.lastname}`}
                        />
                      )}
                      {member.firstname} {member.lastname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.students && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {errors.students.message}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="label_name_sprint">Nom du sprint*</InputLabel>
              <TextField
                fullWidth
                {...register("sprint_name")}
                error={!!errors.sprint_name}
                helperText={errors.sprint_name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="label_name_sprint">Nom du group*</InputLabel>
              <TextField
                fullWidth
                {...register("sprint_group")}
                error={!!errors.sprint_group}
                helperText={errors.sprint_group?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="label_date_start">Date de début *</InputLabel>
              <TextField
                id="date-start"
                type="date"
                sx={{ width: 250 }}
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={defaultStartDate}
                {...register("starting_date")}
              />

              {errors.starting_date && (
                <Typography variant="subtitle1" color="error">
                  {errors.starting_date.message}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="label_date_end">Date de fin *</InputLabel>
              <TextField
                id="date-end"
                type="date"
                sx={{ width: 250 }}
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={defaultStartDate}
                {...register("ending_date")}
              />

              {errors.ending_date && (
                <Typography variant="subtitle1" color="error">
                  {errors.ending_date.message}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Button variant="contained" type="submit" sx={{ mt: 3, mb: 2 }}>
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
  members: PropTypes.array.isRequired,
};

export default function ModalCreateSprint(props) {
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
        <DialogDashbord
          id="ringtone-menu"
          keepMounted
          open={open}
          onClose={handleClose}
          value={value}
          members={props.members}
        />
      </List>
    </Box>
  );
}

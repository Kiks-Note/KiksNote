import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Grid,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
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
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const schema = yup.object().shape({
  title: yup.string().required("Le titre est requis"),
  start: yup
    .date()
    .required("La date est requise")
    .typeError("La date et l'heure de début sont requises"),
  end: yup
    .date()
    .required("La date et l'heure de fin sont requises")
    .typeError("La date et l'heure de fin sont requises")
    .min(
      yup.ref("start"),
      "La date et l'heure de fin doivent être postérieures à la date et l'heure de début."
    ),
  instructors: yup.array().min(1, "Au moins un formateur est requis"),
  distanciel: yup.boolean(),
  commentaire: yup.string(),
  materiel: yup.string(),
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const CreateEventForm = () => {
  const [instructors, setInstructors] = useState([]);
  const [isDistanciel, setIsDistanciel] = useState(false);
  const [value, setValue] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setValue(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchInstructors = async () => {
      const response = await axios.get(
        "http://localhost:5050/calendar/instructor"
      );
      setInstructors(response.data);
    };
    fetchInstructors();
  }, []);

  const onSubmit = (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("start", data.start);
    formData.append("end", data.end);
    formData.append("comment", data.comment);
    formData.append("distanciel", isDistanciel);
    formData.append("materiel", data.materiel);
    formData.append("instructors", JSON.stringify(data.instructors));

    // axios
    //   .post("http://example.com/api/endpoint", formData)
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  const handleDistancielChange = (event) => {
    setIsDistanciel(event.target.checked);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    boxShadow: 24,
    margin: 0,
  };
  return (
    <Card sx={[style, { maxWidth: "50%", minWidth: "fit-content" }]}>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date de début"
                type="datetime-local"
                {...register("start")}
                error={!!errors.start}
                helperText={errors.start?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date de fin"
                type="datetime-local"
                {...register("end")}
                error={!!errors.end}
                helperText={errors.end?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ minWidth: 120 }}>
                <InputLabel>Formateur(s)</InputLabel>
                <Select
                  {...register("instructors")}
                  multiple
                  value={value}
                  onChange={handleChange}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Chip" />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value.firstname} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {instructors.map((instructor) => (
                    <MenuItem key={instructor.id} value={instructor}>
                      {instructor.image && (
                        <Avatar
                          src={instructor.image}
                          alt={`${instructor.firstname} ${instructor.lastname}`}
                        />
                      )}
                      {instructor.firstname} {instructor.lastname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.instructors && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {errors.instructors.message}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isDistanciel}
                      onChange={handleDistancielChange}
                    />
                  }
                  label="Distanciel"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Commentaires"
                {...register("comment")}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Matériel" {...register("material")} />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth type="submit">
                Créer
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateEventForm;

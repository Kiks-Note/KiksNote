import { useState } from "react";
import moment from "moment";
import {
  Button,
  Card,
  Grid,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputLabel,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const schema = yup.object().shape({
  title: yup.string().required("Le titre est requis"),
  localisation: yup.string().required(" La localisation est requis"),
  distanciel: yup.boolean(),
  commentaire: yup.string(),
  materiel: yup.string(),
});

export default function FormCourse(props) {
  const [isDistanciel, setIsDistanciel] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  function generateEvents(data) {
    const events = [];
    const startDate = moment(props.initData.start);
    const endDate = moment(props.initData.end);

    while (startDate <= endDate) {
      const startTime = moment(data.start).format("HH:mm");
      const endTime = moment(data.end).format("HH:mm");

      const eventStart = moment
        .utc(startDate.format("YYYY-MM-DD") + "T" + startTime)
        .utcOffset(startDate.utcOffset())
        .toISOString();
      const eventEnd = moment
        .utc(endDate.format("YYYY-MM-DD") + "T" + endTime)
        .utcOffset(endDate.utcOffset())
        .toISOString();

      const event = {
        title: data.title,
        start: eventStart,
        end: eventEnd,
        backgroundColor: "orange",
        borderColor: "orange",
        location: data.localisation,
        instructor: [],
        class: "",
      };

      events.push(event);

      startDate.add(1, "day");
    }

    return events;
  }

  const onSubmit = (data) => {
    console.log(data);
    const events = generateEvents(data);
    console.log(events);

    try {
      axios
        .post("http://localhost:5050/calendar", events)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
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
              <InputLabel>Titre *</InputLabel>
              <TextField
                fullWidth
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Localisation *</InputLabel>
              <TextField
                fullWidth
                {...register("localisation")}
                error={!!errors.localisation}
                helperText={errors.localisation?.message}
              />
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
              <InputLabel>Commentaires</InputLabel>
              <TextField
                fullWidth
                label="Commentaires"
                {...register("comment")}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Matériel</InputLabel>
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
}

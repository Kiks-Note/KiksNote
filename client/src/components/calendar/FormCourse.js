import { useState } from "react";
import moment from "moment";
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
import { FocusTrap } from "react-focus-trap";

const schema = yup.object().shape({
  title: yup.string().required("Le titre est requis"),
  instructors: yup.array().min(1, "Au moins un formateur est requis"),
  course: yup.array().min(1, " Le cours est requis"),
  localisation: yup.string().required(" La localisation est requis"),
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
export default function FormCourse(props) {
  const [instructors, setInstructors] = useState(props.initData.instructors);
  const [course, setCourse] = useState(props.initData.courses);
  const [holiday, setHoliday] = useState(props.initData.holidays);
  const [isDistanciel, setIsDistanciel] = useState(false);
  const [valueInstructor, setValueInstructor] = useState([]);
  const [valueCourse, setValueCourse] = useState([]);
  console.log(props);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setValueInstructor(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleChangeCourse = (event) => {
    const {
      target: { value },
    } = event;
    setValueCourse(
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
  function generateEvents(data) {
    const events = [];
    const startDate = moment(props.initData.start);
    const endDate = moment(props.initData.end);
    const instructorsChoice = data.instructors;
    while (startDate <= endDate) {
      if (isWeekend(startDate._d) || isHoliday(startDate._d)) {
        // ignore weekends and holidays
      } else {
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
          backgroundColor: "blue",
          borderColor: "blue",
          location: data.localisation,
          instructor:
            instructorsChoice[
              Math.floor(Math.random() * instructorsChoice.length)
            ],
          class: "",
        };

        events.push(event);
      }
      startDate.add(1, "day");
    }

    return events;
  }

  function isWeekend(date) {
    const day = date.getDay();
    return day === 6 || day === 0;
  }

  function isHoliday(date) {
    const dateString = moment(date).format("YYYY-MM-DD");
    for (let i = 0; i < holiday.length; i++) {
      const holidayDate = moment(holiday[i], "YYYY-MM-DD");
      if (holidayDate.format("YYYY-MM-DD") === dateString) {
        return true;
      }
    }
    return false;
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
              <FormControl fullWidth sx={{ minWidth: 120 }}>
                <InputLabel>Formateur(s) *</InputLabel>
                <Select
                  {...register("instructors")}
                  multiple
                  value={valueInstructor}
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
                  MenuProps={MenuProps}
                >
                  {instructors.map((instructor) => (
                    <MenuItem key={instructor.uid} value={instructor}>
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
              <FormControl fullWidth sx={{ minWidth: 120 }}>
                <InputLabel>Cours*</InputLabel>
                <Select
                  {...register("course")}
                  value={valueCourse}
                  onChange={handleChangeCourse}
                  // input={
                  //   <OutlinedInput id="select-multiple-chip" label="Chip" />
                  // }
                  // renderValue={(selected) => (
                  //   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  //     {selected.map((value) => (
                  //       <Chip key={value.uid} label={value.firstname} />
                  //     ))}
                  //   </Box>
                  // )}
                  MenuProps={MenuProps}
                >
                  {course.map((cours) => (
                    <MenuItem key={cours.uid} value={cours}>
                      {cours.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.course && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {errors.course.message}
                </Typography>
              )}
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

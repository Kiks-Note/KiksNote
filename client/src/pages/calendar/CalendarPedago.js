import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentPlugin from "@fullcalendar/moment";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import moment from "moment";
import { Grid, Typography, Box, Button } from "@material-ui/core";
import frLocale from "@fullcalendar/core/locales/fr";
import DetailCalendar from "../../components/calendar/DetailCalendar";
import FormCourse from "../../components/calendar/FormCourse";
import FormEvent from "../../components/calendar/FormEvent";
import axios from "axios";
import { Link } from "react-router-dom";
import { w3cwebsocket } from "websocket";
import { useParams } from "react-router-dom";
import EntrepriseDaysList from "../../components/calendar/EntrpriseDayList";
export default function CalendarPedago() {
  const { id } = useParams();
  const [value, setValue] = useState("Cours");
  const [statesDetail, setStatesDetail] = useState({
    open: false,
    expanded: false,
  });
  const [modalCourse, setModalCourse] = useState(false);
  const [modalEvent, setModalEvent] = useState(false);
  const [initData, setInitData] = useState({});
  const [instructors, setInstructors] = useState([]);
  const [course, setCourse] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [events, setEvents] = useState([]);
  const [entrepriseDay, setEntrepriseDay] = useState([]);

  const handleCloseDetail = () =>
    setStatesDetail({ open: false, expanded: false });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const handleEventClick = (event) => {
    const eventId = event.event.id; // Récupération de l'id de l'événement cliqué

    const selectedEvent = events.find((event) => event.id === eventId); // Recherche de l'événement correspondant à l'id

    setSelectedEvent(selectedEvent);
    setStatesDetail({ open: true, expanded: false });
  };
  const handleCloseModalCourse = () => {
    setModalCourse(false);
  };
  const handleCloseModalEvent = () => {
    setModalEvent(false);
  };
  //Formatting date for create event
  function countDaysBetweenDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = end.getTime() - start.getTime();
    const diffInDays = Math.round(diffInTime / oneDay);
    return diffInDays;
  }
  //When your select date on calendar
  function handleAddEvent(selectInfo) {
    let calendarApi = selectInfo.view.calendar;
    var result = countDaysBetweenDates(selectInfo.startStr, selectInfo.endStr);
    var end;
    if (result === 1 && selectInfo.allDay) {
      end = selectInfo.startStr;
    } else {
      end = selectInfo.endStr;
    }
    switch (value) {
      case "Cours":
        setInitData({
          start: selectInfo.startStr,
          end: end,
          instructors: instructors,
          courses: course,
          holidays: holidays,
          class: id,
        });
        setModalCourse(true);
        break;
      case "Entreprise":
        const events = [];
        const startDate = moment(selectInfo.startStr);
        const endDate = moment(end);

        while (startDate <= endDate) {
          const startTime = "09:00";
          const endTime = "17:00";

          const eventStart = moment(
            startDate.format("YYYY-MM-DD") + "T" + startTime
          );

          const eventEnd = moment(
            startDate.format("YYYY-MM-DD") + "T" + endTime
          );

          const event = {
            title: "Entreprise",
            start: eventStart._i,
            end: eventEnd._i,
            backgroundColor: "red",
            borderColor: "red",
            location: "",
            instructor: [],
            class: id,
            display: "background",
            color: "#ff9f89",
            allDay: true,
            constraint: "entreprise",
          };

          events.push(event);

          startDate.add(1, "day");
        }
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
        break;
      case "Autres":
        setInitData({
          start: selectInfo.startStr,
          end: end,
          class: id,
        });
        setModalEvent(true);
        break;
      default:
        break;
    }
    calendarApi.unselect();
  }
  //Setter for the value of RadioButton
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const wsComments = new w3cwebsocket(`ws://localhost:5050/calendar/student`);
  useEffect(() => {
    const fetchCourses = async () => {
      const response = await axios.get("http://localhost:5050/calendar/course");
      setCourse(response.data);
    };
    const fetchInstructors = async () => {
      const response = await axios.get(
        "http://localhost:5050/calendar/instructor"
      );
      setInstructors(response.data);
    };
    const fetchHolidays = async () => {
      const year = new Date().getFullYear();
      const response = await axios.get(
        `https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`
      );
      const holidays = response.data;
      const events = Object.keys(holidays).map((date) => ({
        title: holidays[date],
        start: `${date}T00:00:00`,
        end: `${date}T23:59:59`,
        display: "background",
        color: "#ff9f89",
        allDay: true,
        constraint: "holiday",
      }));
      setEvents(events);
    };
    const fetchSocket = async () => {
      wsComments.onopen = function (e) {
        wsComments.send(JSON.stringify(id));
      };

      wsComments.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setEvents((prevEvents) => [...prevEvents, ...data]);
        const entrepriseEvents = data.filter((event) => event.id);
        setEntrepriseDay(entrepriseEvents);
      };
    };
    fetchSocket();
    fetchHolidays();
    fetchInstructors();
    fetchCourses();
  }, []);
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3" align="center">
          Gestion du calendrier de formation
        </Typography>
        <Button
          component={Link}
          to={"/calendrier"}
          size="small"
          variant="contained"
        >
          Retour
        </Button>
      </Box>

      <Grid container spacing={2} style={{ padding: "20px" }}>
        <Grid item xs={12} md={5}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Type de votre événement</FormLabel>
            <RadioGroup
              aria-label="event-type"
              name="event-type"
              value={value}
              onChange={handleChange}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <FormControlLabel
                value="Cours"
                control={<Radio />}
                label="Cours"
              />
              <FormControlLabel
                value="Entreprise"
                control={<Radio />}
                label="Entreprise"
              />
              <FormControlLabel
                value="Autres"
                control={<Radio />}
                label="Autres"
              />
            </RadioGroup>
          </FormControl>
          <Typography variant="body1">
            Bienvenue dans la partie gestion du calendrier de formation. Trois
            choix s'offrent à vous. Pour entrer un événement, il suffit de
            choisir le type de votre événement, puis de sélectionner un ou
            plusieurs jours directement sur le calendrier. Selon le type choisi,
            un formulaire peut s'ouvrir pour compléter votre événement.
          </Typography>
          <EntrepriseDaysList entrepriseDaysList={entrepriseDay} />
        </Grid>

        <Grid item xs={12} md={7}>
          <FullCalendar
            plugins={[
              dayGridPlugin,
              interactionPlugin,
              timeGridPlugin,
              momentPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek,dayGridMonth",
            }}
            initialView="dayGridMonth"
            editable={false}
            businessHours={true}
            weekNumbers={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            nowIndicator={true}
            locale={frLocale}
            events={events}
            select={handleAddEvent}
            eventClick={handleEventClick}
          />
        </Grid>
        <Modal open={statesDetail.open} onClose={handleCloseDetail}>
          <DetailCalendar event={selectedEvent} />
        </Modal>
        <Modal open={modalCourse} onClose={handleCloseModalCourse}>
          <FormCourse initData={initData} onClose={handleCloseModalCourse} />
        </Modal>
        <Modal open={modalEvent} onClose={handleCloseModalEvent}>
          <FormEvent initData={initData} onClose={handleCloseModalEvent} />
        </Modal>
      </Grid>
    </>
  );
}

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
import { Grid, Typography } from "@material-ui/core";
import frLocale from "@fullcalendar/core/locales/fr";
import DetailCalendar from "../../components/calendar/DetailCalendar";
import FormCourse from "../../components/calendar/FormCourse";
import FormEvent from "../../components/calendar/FormEvent";
import axios from "axios";
export default function CalendarPedago() {
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
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Cours de php",
      start: "2023-04-10T09:00:00",
      end: "2023-04-10T17:00:00",
      backgroundColor: "green",
      borderColor: "green",
      location: {
        city: "Paris",
        room: "Salle 1",
      },
      instructor: {
        uid: "12345",
        name: "John Terry",
      },
    },
    {
      id: "2",
      title: "Cours de php",
      start: "2023-04-11T09:00:00",
      end: "2023-04-11T17:00:00",
      backgroundColor: "green",
      borderColor: "green",
      location: {
        city: "Paris",
        room: "Salle 1",
      },
      instructor: {
        uid: "12345",
        name: "John Terry",
      },
    },
    {
      id: "3",
      title: "Cours de php",
      start: "2023-04-12T09:00:00",
      end: "2023-04-12T17:00:00",
      backgroundColor: "green",
      borderColor: "green",
      location: {
        city: "Paris",
        room: "Salle 1",
      },
      instructor: {
        uid: "12345",
        name: "John Terry",
      },
    },
    {
      id: "4",
      title: "Cours de php",
      start: "2023-04-13T09:00:00",
      end: "2023-04-13T17:00:00",
      backgroundColor: "green",
      borderColor: "green",
      location: {
        city: "Paris",
        room: "Salle 1",
      },
      instructor: {
        uid: "12345",
        name: "John Terry",
      },
    },
    {
      id: "5",
      title: "Cours de php",
      start: "2023-04-14T09:00:00",
      end: "2023-04-14T17:00:00",
      backgroundColor: "green",
      borderColor: "green",
      location: {
        city: "Paris",
        room: "Salle 1",
      },
      instructor: {
        uid: "12345",
        name: "John Terry",
      },
    },
    {
      id: "6",
      title: "Event 2",
      start: "2023-04-17T14:00:00",
      end: "2023-04-17T16:00:00",
      backgroundColor: "green",
      borderColor: "green",
      location: {
        city: "Paris",
        room: "Salle 1",
      },
      instructor: {
        uid: "12345",
        name: "John Terry",
      },
    },
  ]);

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
        });
        setModalCourse(true);
        break;
      case "Entreprise":
        const events = [];
        const startDate = moment(selectInfo.startStr);
        const endDate = moment(end);

        while (startDate <= endDate) {
          const startTime = moment(selectInfo.startStr).format("HH:mm");
          const endTime = moment(end).format("HH:mm");

          const eventStart = moment
            .utc(startDate.format("YYYY-MM-DD") + "T" + startTime)
            .utcOffset(startDate.utcOffset())
            .toISOString();
          const eventEnd = moment
            .utc(endDate.format("YYYY-MM-DD") + "T" + endTime)
            .utcOffset(endDate.utcOffset())
            .toISOString();

          const event = {
            title: "Entreprise",
            start: eventStart,
            end: eventEnd,
            backgroundColor: "red",
            borderColor: "red",
            location: "",
            instructor: [],
            class: "",
            color: "#ff9f89",
            allDay: true,
            constraint: "holiday",
          };

          events.push(event);

          startDate.add(1, "day");
        }

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
      const holiday = Object.keys(response.data);
      setHolidays(holiday);
    };
    fetchHolidays();
    fetchInstructors();
    fetchCourses();
  }, []);
  return (
    <>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid
          item
          xs={12}
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <FormControl component="fieldset">
            <FormLabel component="legend">Type d'événement</FormLabel>
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
        </Grid>

        <Grid item xs={10} alignItems="center" justifyContent="center">
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
            slotDuration="00:30:00"
            slotMinTime="09:00:00"
            slotMaxTime="20:00:00"
            initialView="dayGridMonth"
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
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

import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentPlugin from "@fullcalendar/moment";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "@mui/material/Modal";
import { Button, Grid, Toolbar, Typography } from "@material-ui/core";
import frLocale from "@fullcalendar/core/locales/fr";
import DetailCalendar from "../../components/calendar/DetailCalendar";
import CreateEventForm from "../../components/calendar/CreateEventForm";
const Calendar = () => {
  const [statesDetail, setStatesDetail] = React.useState({
    open: false,
    expanded: false,
  });
  const [statesAddEvent, setStatesAddEvent] = React.useState({
    open: false,
    expanded: false,
  });

  const handleCloseDetail = () =>
    setStatesDetail({ open: false, expanded: false });
  const handleCloseAddEvent = () =>
    setStatesAddEvent({ open: false, expanded: false });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const handleEventClick = (event) => {
    const eventId = event.event.id; // Récupération de l'id de l'événement cliqué

    const selectedEvent = events.find((event) => event.id === eventId); // Recherche de l'événement correspondant à l'id

    setSelectedEvent(selectedEvent);
    setStatesDetail({ open: true, expanded: false });
  };

  const calendarRef = useRef(null);

  const handleAddEvent = () => {
     setStatesAddEvent({ open: true, expanded: false });
  };

  const events = [
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
  ];

  return (
    <>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h6" component="h2" align="center">
            Calendrier de formation de
          </Typography>
        </Grid>
        <Grid item xs={11}>
          <FullCalendar
            plugins={[
              dayGridPlugin,
              interactionPlugin,
              timeGridPlugin,
              momentPlugin,
              multiMonthPlugin,
            ]}
            customButtons={{
              myCustomButton: {
                text: "Ajouter un évenement",
                click: handleAddEvent,
              },
            }}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right:
                "myCustomButton timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear",
              addEvent: "addEventButton",
            }}
            initialView="multiMonthYear"
            editable={true}
            selectable={true}
            locale={frLocale}
            events={events}
            eventClick={handleEventClick}
          />
        </Grid>
      </Grid>
      <Modal open={statesDetail.open} onClose={handleCloseDetail}>
        <DetailCalendar event={selectedEvent} />
      </Modal>
      <Modal open={statesAddEvent.open} onClose={handleCloseAddEvent}>
        <CreateEventForm />
      </Modal>
    </>
  );
};

export default Calendar;

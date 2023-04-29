import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentPlugin from "@fullcalendar/moment";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "@mui/material/Modal";
import { Grid, Typography } from "@material-ui/core";
import frLocale from "@fullcalendar/core/locales/fr";
import DetailCalendar from "./DetailCalendar";
import { w3cwebsocket } from "websocket";
import axios from "axios";
import "./calendar.scss";

export default function CalendarPo() {
  const [statesDetail, setStatesDetail] = useState({
    open: false,
    expanded: false,
  });
  const handleCloseDetail = () =>
    setStatesDetail({ open: false, expanded: false });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const handleEventClick = (event) => {
    const eventId = event.event.id; // Récupération de l'id de l'événement cliqué
    if (event.event.constraint != "holiday") {
      const selectedEvent = events.find((event) => event.id === eventId); // Recherche de l'événement correspondant à l'id
      setSelectedEvent(selectedEvent);
      setStatesDetail({ open: true, expanded: false });
    }
  };
  
  var connectedStudent = "EIKH7D5LRpgpF7W0Ber60plHkK62";
  useEffect(() => {
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
      const wsComments = new w3cwebsocket(
        `ws://localhost:5050/calendar/instructor`
      );

      wsComments.onopen = function (e) {
        wsComments.send(JSON.stringify(connectedStudent));
      };

      wsComments.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setEvents((prevEvents) => [...prevEvents, ...data]);
      };
    };

    fetchHolidays();
    fetchSocket();
  }, []);

  return (
    <>
      <Grid container>
        <Grid item xs={10}>
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
            themeSystem={"bootstrap5"}
            selectable={false}
            selectMirror={true}
            dayMaxEvents={true}
            nowIndicator={true}
            locale={frLocale}
            events={events}
            eventClick={handleEventClick}
          />
        </Grid>
        <Modal open={statesDetail.open} onClose={handleCloseDetail}>
          <DetailCalendar event={selectedEvent} />
        </Modal>
      </Grid>
    </>
  );
}

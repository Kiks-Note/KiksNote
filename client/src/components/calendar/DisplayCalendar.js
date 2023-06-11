import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentPlugin from "@fullcalendar/moment";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "@mui/material/Modal";
import { Grid } from "@material-ui/core";
import frLocale from "@fullcalendar/core/locales/fr";
import DetailCalendar from "./DetailCalendar";
import { w3cwebsocket } from "websocket";
import axios from "axios";
import useFirebase from "../../hooks/useFirebase";
import timeConverter from "../../functions/TimeConverter";
import moment from "moment";
import "./calendar.scss";
import { Rings } from "react-loader-spinner";

export default function DisplayCalendar() {
  const [statesDetail, setStatesDetail] = useState({
    open: false,
    expanded: false,
  });
  const { user } = useFirebase();
  const handleCloseDetail = () =>
    setStatesDetail({ open: false, expanded: false });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState("");

  const handleEventClick = (event) => {
    const eventId = event.event.id; // Récupération de l'id de l'événement cliqué
    if (event.event.constraint != "holiday") {
      const selectedEvent = events.find((event) => event.id === eventId); // Recherche de l'événement correspondant à l'id
      setSelectedEvent(selectedEvent);
      setStatesDetail({ open: true, expanded: false });
    }
  };
  function formatDate(dateString) {
    const momentDate = moment(dateString, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    return momentDate.format("YYYY-MM-DD");
  }

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
      const wsComments = new w3cwebsocket(`ws://localhost:5050/calendar`);

      wsComments.onopen = function () {
        wsComments.send(
          JSON.stringify({
            class: user.class.id,
            status: user.status,
            id: user.id,
          })
        );
      };

      wsComments.onmessage = (message) => {
        try {
          const data = JSON.parse(message.data);
          const modifiedData = [];
          let idCounter = 1;
          data.forEach((item) => {
            const startDate = new Date(timeConverter(item.dateStartSprint));
            const endDate = new Date(timeConverter(item.dateEndSprint));

            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
              const formattedDate = formatDate(currentDate);
              modifiedData.push({
                id: `event_${idCounter}`, // ID unique pour chaque item
                title: item.title,
                start: `${formattedDate}T09:00:00`,
                end: `${formattedDate}T17:00:00`,
                color: "#CCCCFF",
                borderColor: "#ADD8E6",
                allDay: true,
                instructor: [item.owner],
                description: item.description,
                courseId: item.id,
                location: item.courseClass.site,
                courseClass: item.courseClass,
                imageCourseUrl: item.imageCourseUrl,
                campusNumerique: item.campus_numerique,
                private: item.private,
              });
              setClassName(item.courseClass.name);
              idCounter++; // Incrémenter le compteur d'IDs uniques
              currentDate.setDate(currentDate.getDate() + 1);
            }
          });

          setEvents((prevEvents) => [...prevEvents, ...modifiedData]);
          setLoading(false);
        } catch (error) {
          setLoading(true);
        }
      };
    };

    fetchHolidays();
    fetchSocket();
  }, []);

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Rings
            height="200"
            width="200"
            color="#00BFFF"
            radius="6"
            wrapperStyle={{}}
            wrapperClass="loader"
            visible={true}
            ariaLabel="rings-loading"
          />
        </div>
      ) : (
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
      )}
    </>
  );
}

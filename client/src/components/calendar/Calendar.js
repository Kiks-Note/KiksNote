import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';
import moment from 'moment';
import frLocale from '@fullcalendar/core/locales/fr';





const Calendar = () => {


    const calendarRef = useRef(null);



    const handleAddEvent = () => {
        const calendarApi = calendarRef.current.getApi();

        calendarApi.addEvent({
            title: 'New Event',
            start: '2023-04-16T10:00:00',
            end: '2023-04-16T12:00:00',
            allDay: false,
        });
    };

    const events = [
        {
            title: 'Event 1',
            start: '2023-04-14T10:00:00',
            end: '2023-04-14T12:00:00',
        },
        {
            title: 'Event 2',
            start: '2023-04-15T14:00:00',
            end: '2023-04-15T16:00:00',
        },
    ];

    return (
        <>
            <button onClick={handleAddEvent}>Add Event</button>
            <FullCalendar

                plugins={[dayGridPlugin, timeGridPlugin, momentPlugin]}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    addEvent: 'addEventButton',
                }}
                locale={frLocale}
                initialView="dayGridMonth"
                events={events}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                datesSet={(start, end) => {
                    console.log(start, end);
                }}

            />
        </>
    );
};

export default Calendar;
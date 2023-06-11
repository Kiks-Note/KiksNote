
import { Grid } from "@material-ui/core";
import DisplayCalendar from "../../components/calendar/DisplayCalendar";
import CalendarViewPedago from "../../components/calendar/CalendarViewPedago";
import useFirebase from "../../hooks/useFirebase";

export default function Calendar() {
  const { user } = useFirebase();
  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item xs={10}>
        {user.status !== "pedago" ? <DisplayCalendar /> :<CalendarViewPedago />}
      </Grid>
    </Grid>
  );
}

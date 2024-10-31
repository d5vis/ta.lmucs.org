import { TUTORING_EVENTS_SOURCES } from "./utils/events";
import Calendar from "./components/calendars/Calendar";

export default function Home() {
  return <Calendar eventSources={TUTORING_EVENTS_SOURCES} hiddenDays={[0]} />;
}

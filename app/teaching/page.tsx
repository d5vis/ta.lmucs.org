import { TEACHING_EVENTS_SOURCES } from "../utils/events";
import Calendar from "../components/calendars/Calendar";

export default function Teaching() {
  return (
    <Calendar eventSources={TEACHING_EVENTS_SOURCES} hiddenDays={[0, 5, 6]} />
  );
}

import { TEACHING_EVENTS_SOURCES } from '@/app/utils/events'
import Calendar from '@/components/calendars/Calendar'

export default function Teaching() {
  return (
    <Calendar
      title="Teaching"
      eventSources={TEACHING_EVENTS_SOURCES}
      hiddenDays={[0, 5, 6]}
    />
  )
}

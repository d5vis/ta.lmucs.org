import { TUTORING_EVENTS_SOURCES } from '@/app/utils/events'
import Calendar from '@/components/calendars/Calendar'

export default function Home() {
  return (
    <Calendar
      title="Tutoring"
      eventSources={TUTORING_EVENTS_SOURCES}
      hiddenDays={[0, 6]}
    />
  )
}

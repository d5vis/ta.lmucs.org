'use client'
import { useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import iCalendarPlugin from '@fullcalendar/icalendar'
import listPlugin from '@fullcalendar/list'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { CalendarEventSource } from '@/app/utils/events'
import { EventInfo } from '@/app/utils/types'
import { Dialog, DialogTitle, DialogContent } from '@/components/ui/dialog'
import { CheckIcon } from '../icons/CheckIcon'

import './calendar.css'

interface CalendarProps {
  title: string
  eventSources: CalendarEventSource[]
  hiddenDays?: number[]
}

export default function Calendar(props: CalendarProps) {
  const [eventInfo, setEventInfo] = useState<EventInfo>({})
  const [selected, setSelected] = useState(new Set<string>())
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleValueChange = (values: string[]) => {
    setSelected(new Set(values))
  }

  // One filter button per id, however many feeds share it.
  const filters = props.eventSources.filter(
    (source, index, sources) => sources.findIndex(other => other.id === source.id) === index
  )
  // FullCalendar wants each source's id to be its own, so the feed's URL stands in.
  // Memoized because FullCalendar refetches any source object it has not seen
  // before, so fresh ones on every render would reload the events on each click.
  const { eventSources } = props
  const visibleSources = useMemo(
    () =>
      eventSources
        .filter(source => selected.has(source.id) || selected.size === 0)
        .map(source => ({ ...source, id: source.url })),
    [eventSources, selected]
  )

  return (
    <div className="motion-preset-blur-up w-full h-full flex flex-col lg:flex-row items-start justify-center gap-4 rounded-2xl px-8 pt-6">
      <div className="flex flex-col gap-4 text-left text-lmublue font-[family-name:var(--font-metric-bold)]">
        <h1 className="text-4xl sm:text-5xl w-full md:w-48 transition-all">
          {props.title}
        </h1>
        <ToggleGroup
          type="multiple"
          onValueChange={handleValueChange}
          className="flex flex-row lg:flex-col items-start transition-all"
        >
          {filters.map(source => {
            const active = selected.has(source.id)
            return (
              <ToggleGroupItem
                variant="outline"
                key={source.id}
                value={source.id}
                className="text-xs sm:text-sm rounded-2xl transition-all"
                style={{ color: source.color, borderColor: source.color }}
              >
                {source.id}
                <div
                  className={`w-0 opacity-0 motion-preset-slide-right motion-duration-300 ${
                    active ? 'w-3 opacity-100' : null
                  } transition-all`}
                >
                  <CheckIcon />
                </div>
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>
      </div>
      <div className="motion-preset-fade motion-duration-1000 hidden sm:block">
        <Dialog
          modal={false}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogContent className="bg-background w-auto p-10 pb-4">
            <DialogTitle className="text-lmublue text-xl">
              {eventInfo.title}
            </DialogTitle>
            <p>
              <b>
                {eventInfo.startISO} - {eventInfo.endISO}
              </b>
            </p>
            <p>{eventInfo.location}</p>
            <p>{eventInfo.description}</p>
          </DialogContent>
        </Dialog>
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, iCalendarPlugin]}
          eventSources={visibleSources}
          nowIndicator={true}
          slotMinTime="08:00:00"
          slotMaxTime="22:00:00"
          hiddenDays={props.hiddenDays}
          contentHeight="auto"
          eventClick={info => {
            const details: EventInfo = {
              title: info.event.title,
              start: info.event.start,
              end: info.event.end,
              startISO: info.event.start?.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }),
              endISO: info.event.end?.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }),
              location: info.event.extendedProps.location,
              description: info.event.extendedProps.description,
            }
            setEventInfo(details)
            setIsDialogOpen(true)
          }}
          eventClassNames="motion-preset-slide-up"
        />
      </div>
      <div className="motion-preset-fade motion-duration-1000 w-full sm:hidden text-sm">
        <FullCalendar
          plugins={[listPlugin, iCalendarPlugin]}
          initialView="listWeek"
          eventSources={visibleSources}
          contentHeight="auto"
          eventClassNames="motion-preset-focus"
        />
      </div>
    </div>
  )
}

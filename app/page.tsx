"use client";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import iCalendarPlugin from "@fullcalendar/icalendar";
import listPlugin from "@fullcalendar/list";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { EventInfo } from "./utils/types";
import { TUTORING_EVENTS_SOURCES } from "./utils/events";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";

export default function Home() {
  const [eventInfo, setEventInfo] = useState<EventInfo>({});
  const [selected, setSelected] = useState(new Set<string>());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleValueChange = (values: string[]) => {
    setSelected(new Set(values));
  };

  return (
    <Card className="w-full h-full flex flex-col items-start justify-center gap-4 rounded-2xl p-8">
      <ToggleGroup type="multiple" onValueChange={handleValueChange}>
        {TUTORING_EVENTS_SOURCES.map((source) => (
          <ToggleGroupItem
            variant="outline"
            key={source.id}
            value={source.id}
            className="rounded-2xl"
            style={{ color: source.color, borderColor: source.color }}
          >
            {source.id}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="hidden sm:block">
        <Dialog
          modal={false}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogContent className="bg-card w-auto p-10">
            <DialogTitle>{eventInfo.title}</DialogTitle>
            <p>
              {eventInfo.startISO} - {eventInfo.endISO}
            </p>
            <p>{eventInfo.description}</p>
          </DialogContent>
        </Dialog>
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, iCalendarPlugin]}
          eventSources={TUTORING_EVENTS_SOURCES.filter(
            (source) => selected.has(source.id) || selected.size === 0
          )}
          nowIndicator={true}
          slotMinTime="08:00:00"
          slotMaxTime="22:00:00"
          contentHeight="auto"
          eventClick={(info) => {
            const details: EventInfo = {
              title: info.event.title,
              start: info.event.start,
              end: info.event.end,
              startISO: info.event.start?.toLocaleTimeString(),
              endISO: info.event.end?.toLocaleTimeString(),
              description: info.event.extendedProps.description,
            };
            setEventInfo(details);
            setIsDialogOpen(true);
          }}
        />
      </div>
      <div className="w-full sm:hidden">
        <FullCalendar
          plugins={[listPlugin, iCalendarPlugin]}
          initialView="listWeek"
          eventSources={TUTORING_EVENTS_SOURCES.filter(
            (source) => selected.has(source.id) || selected.size === 0
          )}
          contentHeight="auto"
        />
      </div>
    </Card>
  );
}

import { DateTime } from 'luxon'

/**
 * The in-lab tutoring schedule from TA Draft (draft.lmucs.org), turned into
 * FullCalendar events. Each shift there repeats weekly between its own first
 * and last date, so it becomes a weekly recurring event bounded by those; a
 * shift changed for one week, or from some week on, arrives as several shifts
 * with shorter runs. A single day the TA moved to other hours, or marked
 * Cancelled or Running late, is cut out of the weekly event and shown as an
 * event of its own. Semesters before Fall 2026 were kept in Google Calendar and still come from
 * the ICS feeds in ./events.ts.
 */

/** One shift as TA Draft's /api/tutoring-shifts serves it. */
export interface TutoringShift {
  nid: string
  /** "Cara B." */
  name: string
  /** Bare course numbers, e.g. ["1010"]. */
  courses: string[]
  /** ISO weekday: 1 = Monday. */
  weekday: number
  /** 24-hour "HH:mm". */
  start: string
  end: string
  /**
   * The first and last date (ISO) the shift happens on. Absent from a TA Draft
   * that predates them, where every shift ran the whole semester.
   */
  startDate?: string
  endDate?: string
  /** Dates the TA moved to other hours, that date only; absent when there are none. */
  changes?: { date: string; start: string; end: string }[]
  /** Dates the TA marked Cancelled or Running late (DELAYED); absent when there are none. */
  statuses?: { date: string; status: 'CANCELLED' | 'DELAYED' }[]
}

export interface SemesterShifts {
  semester: string
  /** ISO dates; null when TA Draft could not find the semester's dates. */
  startDate: string | null
  endDate: string | null
  shifts: TutoringShift[]
}

export interface TutoringShiftsResponse {
  generatedAt: string
  semesters: SemesterShifts[]
}

/** The calendar's course-level filters, as the route segment spells them. */
export const SHIFT_LEVELS = ['1000', '2000', '3000'] as const
export type ShiftLevel = (typeof SHIFT_LEVELS)[number]

export function isShiftLevel(value: string): value is ShiftLevel {
  return (SHIFT_LEVELS as readonly string[]).includes(value)
}

/**
 * Which filter a shift sits under, by the first course the TA tutors:
 * 1010 → 1000, 2120 → 2000, anything higher (or no course) → 3000, the
 * same split the three Google calendars used.
 */
export function levelOf(shift: Pick<TutoringShift, 'courses'>): ShiftLevel {
  const course = Number(shift.courses[0])
  if (course < 2000) return '1000'
  if (course < 3000) return '2000'
  return '3000'
}

/** A FullCalendar weekly recurring event. */
export interface RecurringEvent {
  id: string
  title: string
  daysOfWeek: number[]
  startTime: string
  endTime: string
  startRecur: string
  /** Exclusive, so the day after the shift's last day. */
  endRecur: string
  extendedProps: { description: string }
}

/** One day of a shift that differs from its week: moved, cancelled or running late. */
export interface SingleEvent {
  id: string
  title: string
  /** Local ISO date-times, like the recurring events' times. */
  start: string
  end: string
  classNames?: string[]
  extendedProps: { description: string }
}

export type CalendarEvent = RecurringEvent | SingleEvent

/** "3:30 PM" from "15:30". */
const clock = (time: string) => DateTime.fromFormat(time, 'HH:mm').toFormat('h:mm a')

/** The one-off event for a day that differs from the shift's week. */
function dayEvent(shift: TutoringShift, date: string, semester: string): SingleEvent {
  const moved = shift.changes?.find(change => change.date === date)
  const status = shift.statuses?.find(mark => mark.date === date)?.status
  const start = moved?.start ?? shift.start
  const end = moved?.end ?? shift.end
  const notes = [
    status === 'CANCELLED' && 'Cancelled for this day.',
    status === 'DELAYED' && 'Running late today.',
    moved && `Hours changed for this day only (usually ${clock(shift.start)} - ${clock(shift.end)}).`,
  ].filter(Boolean)
  const label = status === 'CANCELLED' ? 'Cancelled: ' : status === 'DELAYED' ? 'Running late: ' : ''
  return {
    id: `${shift.nid}@${date}`,
    title: `${label}${titleOf(shift)}`,
    start: `${date}T${start}`,
    end: `${date}T${end}`,
    // Important: FullCalendar's own link styles would otherwise clear the strike-through.
    ...(status === 'CANCELLED' && { classNames: ['!line-through', 'opacity-60'] }),
    extendedProps: { description: [`In-lab tutoring, ${semester}.`, ...notes].join(' ') },
  }
}

/** "Cara B. (3300)", the way the Google calendars titled shifts. */
function titleOf(shift: TutoringShift): string {
  return shift.courses.length > 0 ? `${shift.name} (${shift.courses.join(', ')})` : shift.name
}

/**
 * One level's shifts across every semester. A shift repeats over its own
 * dates, falling back to the semester's; one with neither is left off rather
 * than repeated forever. Days that differ from the week (moved, cancelled,
 * running late) split the weekly event and get an event of their own.
 */
export function toCalendarEvents(semesters: SemesterShifts[], level: ShiftLevel): CalendarEvent[] {
  return semesters.flatMap(({ semester, startDate, endDate, shifts }) =>
    shifts
      .filter(shift => levelOf(shift) === level)
      .flatMap((shift): CalendarEvent[] => {
        const startRecur = shift.startDate ?? startDate
        const lastDay = shift.endDate ?? endDate
        if (!startRecur || !lastDay) return []
        const dayAfter = (date: string) => DateTime.fromISO(date).plus({ days: 1 }).toISODate() ?? date

        const odd = [
          ...new Set([
            ...(shift.changes ?? []).map(change => change.date),
            ...(shift.statuses ?? []).map(mark => mark.date),
          ]),
        ]
          .filter(date => date >= startRecur && date <= lastDay)
          .sort()

        // The weekly event between the odd days: [from, until), until exclusive.
        const weekly = (from: string, until: string, part: number): RecurringEvent => ({
          id: part === 0 ? shift.nid : `${shift.nid}:${part}`,
          title: titleOf(shift),
          // ISO weekdays match FullCalendar's (0 = Sunday) for Monday to Saturday.
          daysOfWeek: [shift.weekday % 7],
          startTime: shift.start,
          endTime: shift.end,
          startRecur: from,
          endRecur: until,
          extendedProps: { description: `In-lab tutoring, ${semester}` },
        })

        const events: CalendarEvent[] = []
        let from = startRecur
        for (const date of odd) {
          if (from < date) events.push(weekly(from, date, events.length))
          events.push(dayEvent(shift, date, semester))
          from = dayAfter(date)
        }
        const endRecur = dayAfter(lastDay)
        if (from < endRecur) events.push(weekly(from, endRecur, events.length))
        return events
      })
  )
}

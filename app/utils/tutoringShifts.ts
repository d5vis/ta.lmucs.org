import { DateTime } from 'luxon'

/**
 * The in-lab tutoring schedule from TA Draft (draft.lmucs.org), turned into
 * FullCalendar events. TA Draft stores one week of shifts per semester, so
 * each shift becomes a weekly recurring event bounded by the semester's dates;
 * semesters before Fall 2026 were kept in Google Calendar and still come from
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
  /** Exclusive, so the day after the semester's last day. */
  endRecur: string
  extendedProps: { description: string }
}

/** "Cara B. (3300)", the way the Google calendars titled shifts. */
function titleOf(shift: TutoringShift): string {
  return shift.courses.length > 0 ? `${shift.name} (${shift.courses.join(', ')})` : shift.name
}

/** One level's shifts across every semester that has dates. */
export function toCalendarEvents(semesters: SemesterShifts[], level: ShiftLevel): RecurringEvent[] {
  return semesters.flatMap(({ semester, startDate, endDate, shifts }) => {
    if (!startDate || !endDate) return []
    const endRecur = DateTime.fromISO(endDate).plus({ days: 1 }).toISODate()
    if (!endRecur) return []
    return shifts
      .filter(shift => levelOf(shift) === level)
      .map(shift => ({
        id: shift.nid,
        title: titleOf(shift),
        // ISO weekdays match FullCalendar's (0 = Sunday) for Monday to Saturday.
        daysOfWeek: [shift.weekday % 7],
        startTime: shift.start,
        endTime: shift.end,
        startRecur: startDate,
        endRecur,
        extendedProps: { description: `In-lab tutoring, ${semester}` },
      }))
  })
}

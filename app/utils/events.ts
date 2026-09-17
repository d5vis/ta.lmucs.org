import {
  CLASS_1010_URL,
  CLASS_2120_URL,
  CLASS_GENERAL_URL,
  CORS_PROXY_BASE_URL,
  EVENTS_ICAL_URL,
  TEACHING_1010_URL,
  TEACHING_2000_URL,
  TEACHING_3000_URL,
  TEACHING_GRAD_URL,
} from './constants'

/**
 * A calendar feed. Sources that share an `id` sit under one filter button:
 * each tutoring level is its Google Calendar (through Spring 2026) plus the
 * TA Draft schedule (Fall 2026 on, a JSON feed from /api/tutoring-shifts).
 */
export interface CalendarEventSource {
  url: string
  /** Omitted for FullCalendar's default, a JSON feed. */
  format?: 'ics'
  color: string
  id: string
}

export const TUTORING_EVENTS_SOURCES: CalendarEventSource[] = [
  {
    url: CORS_PROXY_BASE_URL + encodeURIComponent(CLASS_1010_URL),
    format: 'ics',
    color: '#328A49',
    id: '1000',
  },
  {
    url: CORS_PROXY_BASE_URL + encodeURIComponent(CLASS_2120_URL),
    format: 'ics',
    color: '#832B94',
    id: '2000',
  },
  {
    url: CORS_PROXY_BASE_URL + encodeURIComponent(CLASS_GENERAL_URL),
    format: 'ics',
    color: '#5476D0',
    id: '3000+',
  },
  {
    url: CORS_PROXY_BASE_URL + encodeURIComponent(EVENTS_ICAL_URL),
    format: 'ics',
    color: '#F09300',
    id: 'Events/Recitations',
  },
  { url: '/api/tutoring-shifts/1000', color: '#328A49', id: '1000' },
  { url: '/api/tutoring-shifts/2000', color: '#832B94', id: '2000' },
  { url: '/api/tutoring-shifts/3000', color: '#5476D0', id: '3000+' },
]

export const TEACHING_EVENTS_SOURCES: CalendarEventSource[] = [
  {
    url: CORS_PROXY_BASE_URL + encodeURIComponent(TEACHING_1010_URL),
    format: 'ics',
    color: '#328A49',
    id: '1000',
  },
  {
    url: CORS_PROXY_BASE_URL + encodeURIComponent(TEACHING_2000_URL),
    format: 'ics',
    color: '#832B94',
    id: '2000',
  },
  {
    url: CORS_PROXY_BASE_URL + encodeURIComponent(TEACHING_3000_URL),
    format: 'ics',
    color: '#5476D0',
    id: '3000+',
  },
  {
    url: CORS_PROXY_BASE_URL + encodeURIComponent(TEACHING_GRAD_URL),
    format: 'ics',
    color: '#F09300',
    id: 'Graduate',
  },
]

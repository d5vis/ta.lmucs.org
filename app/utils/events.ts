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

export const TUTORING_EVENTS_SOURCES = [
  {
    url: CORS_PROXY_BASE_URL + encodeURIComponent(CLASS_1010_URL),
    format: 'ics',
    color: '#328A49',
    id: '1010',
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
]

export const TEACHING_EVENTS_SOURCES = [
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
    id: '3000',
  },
  {
    url: CORS_PROXY_BASE_URL + encodeURIComponent(TEACHING_GRAD_URL),
    format: 'ics',
    color: '#F09300',
    id: 'Graduate',
  },
]

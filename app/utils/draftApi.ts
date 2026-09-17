// Fails the build if a Client Component ever imports this module: the signing
// secret below must never reach a browser bundle.
import 'server-only'

import axios from 'axios'
import { createHmac } from 'crypto'
import { DateTime } from 'luxon'

import type { TutoringShiftsResponse } from './tutoringShifts'

/**
 * TA Draft's tutoring schedule feed. It is not public: each request is signed
 * with a shared secret (hex HMAC-SHA256) so TA Draft can tell this site from
 * anyone else who finds the URL. The matching entry lives in ta-draft-next at
 * src/config/api-keys.config.ts, and the scheme is documented there in
 * docs/tutoring-shifts-api.md. TA Draft fills in names and courses from
 * recruit-next itself, over its own signed connection, so this site talks to
 * one app only.
 */
const DRAFT_BASE_URL_PROD = 'https://draft.lmucs.org'
/**
 * `next dev` takes the first free port from 3000 up, so where TA Draft lands
 * depends on what else is running. Each is tried in turn, and the app header
 * below tells TA Draft from whatever else answers. With no TA Draft running
 * locally, dev falls back to the live one.
 */
const DRAFT_BASE_URLS_DEV = [3000, 3001, 3002, 3003].map(
  port => `http://localhost:${port}`
)
const DRAFT_BASE_URLS =
  process.env.NODE_ENV === 'development'
    ? [...DRAFT_BASE_URLS_DEV, DRAFT_BASE_URL_PROD]
    : [DRAFT_BASE_URL_PROD]

const TUTORING_SHIFTS_PATH = '/api/tutoring-shifts'

const API_KEY_ID = 'ta.lmucs.org'
const API_SECRET = '15933bc08eef05bea9dba4a3c1889cd3b413d519f76e944e04e4f6d6d792a475'

/** Every answer from TA Draft's signed endpoints carries this; another app on the dev port would not. */
const APP_HEADER = 'x-app'
const APP_NAME = 'ta-draft-next'

/** Sorted and re-encoded, so both sides sign the same bytes however a space was spelled. */
export function canonicalQuery(search: string): string {
  const params = new URLSearchParams(search)
  params.sort()
  return params.toString()
}

/** The three headers TA Draft verifies. A signature is good for five minutes on the other end. */
export function signedHeaders(
  method: string,
  pathname: string,
  search: string,
  timestamp: string = String(DateTime.now().toUnixInteger())
): Record<string, string> {
  const canonical = [
    API_KEY_ID,
    method.toUpperCase(),
    pathname,
    canonicalQuery(search),
    timestamp,
  ].join('\n')
  return {
    'x-api-key': API_KEY_ID,
    'x-timestamp': timestamp,
    'x-signature': createHmac('sha256', API_SECRET).update(canonical).digest('hex'),
  }
}

/**
 * The calendar asks for each course level separately, on both its desktop and
 * mobile views, so one page load is six requests here; a short cache turns
 * them into one upstream call while edits in TA Draft still show within a minute.
 */
const CACHE_SECONDS = 60
let cached: { at: DateTime; shifts: Promise<TutoringShiftsResponse> } | null = null

async function requestTutoringShiftsFrom(baseUrl: string): Promise<TutoringShiftsResponse> {
  const url = `${baseUrl}${TUTORING_SHIFTS_PATH}`
  const response = await axios.get<TutoringShiftsResponse>(url, {
    headers: signedHeaders('GET', TUTORING_SHIFTS_PATH, ''),
    timeout: 15_000,
  })
  if (response.headers[APP_HEADER] !== APP_NAME) {
    throw new Error(`${url} was not answered by ${APP_NAME}`)
  }
  return response.data
}

/** The base URL that last answered as TA Draft, tried first from then on. */
let draftBaseUrl: string | null = null

async function requestTutoringShifts(): Promise<TutoringShiftsResponse> {
  const known = draftBaseUrl
  const baseUrls = known ? [known, ...DRAFT_BASE_URLS.filter(url => url !== known)] : DRAFT_BASE_URLS
  let lastError: unknown = new Error('No TA Draft base URL to try')
  for (const baseUrl of baseUrls) {
    try {
      const shifts = await requestTutoringShiftsFrom(baseUrl)
      draftBaseUrl = baseUrl
      return shifts
    } catch (error) {
      lastError = error
    }
  }
  draftBaseUrl = null
  throw lastError
}

export async function fetchTutoringShifts(): Promise<TutoringShiftsResponse> {
  const now = DateTime.now()
  if (cached && now.diff(cached.at).as('seconds') <= CACHE_SECONDS) return cached.shifts

  // Stored before it settles, so requests arriving together share the one call.
  const entry = { at: now, shifts: requestTutoringShifts() }
  cached = entry
  try {
    return await entry.shifts
  } catch (error) {
    // A failure is not worth remembering; the next request tries again.
    if (cached === entry) cached = null
    throw error
  }
}

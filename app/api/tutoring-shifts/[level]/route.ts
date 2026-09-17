import { fetchTutoringShifts } from '../../../utils/draftApi'
import { SHIFT_LEVELS, isShiftLevel, toCalendarEvents } from '../../../utils/tutoringShifts'

/**
 * One course level's in-lab tutoring shifts as a FullCalendar JSON feed:
 * weekly recurring events for every semester TA Draft schedules. The browser
 * calls this; the signed request to TA Draft happens here on the server, so
 * the secret never leaves it.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ level: string }> }) {
  const { level } = await params
  if (!isShiftLevel(level)) {
    return Response.json(
      { error: `Unknown level "${level}". Valid levels: ${SHIFT_LEVELS.join(', ')}` },
      { status: 404 }
    )
  }

  try {
    const { semesters } = await fetchTutoringShifts()
    return Response.json(toCalendarEvents(semesters, level), {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('Could not load the tutoring shifts from TA Draft:', error)
    return Response.json({ error: 'Could not load the tutoring shifts' }, { status: 502 })
  }
}

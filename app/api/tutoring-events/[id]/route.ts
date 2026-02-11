import {
  CLASS_1010_URL,
  CLASS_2120_URL,
  CLASS_GENERAL_URL,
  EVENTS_ICAL_URL,
} from '../../../utils/constants'

const SOURCES: Record<string, { url: string; color: string }> = {
  '1000': { url: CLASS_1010_URL, color: '#328A49' },
  '2000': { url: CLASS_2120_URL, color: '#832B94' },
  '3000': { url: CLASS_GENERAL_URL, color: '#5476D0' },
  'events': { url: EVENTS_ICAL_URL, color: '#F09300' },
}

function parseICS(ics: string) {
  const events: Record<string, string>[] = []
  const blocks = ics.split('BEGIN:VEVENT')

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].split('END:VEVENT')[0]
    // Unfold lines (RFC 5545: lines starting with space/tab are continuations)
    const unfolded = block.replace(/\r?\n[ \t]/g, '')
    const lines = unfolded.split(/\r?\n/).filter(Boolean)

    const event: Record<string, string> = {}
    for (const line of lines) {
      const colonIdx = line.indexOf(':')
      if (colonIdx === -1) continue
      const key = line.slice(0, colonIdx).split(';')[0].trim()
      const value = line.slice(colonIdx + 1).trim()
      if (key && value) event[key] = value
    }

    if (Object.keys(event).length > 0) events.push(event)
  }

  return events
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const source = SOURCES[id]

  if (!source) {
    return Response.json(
      { error: `Unknown source "${id}". Valid IDs: ${Object.keys(SOURCES).join(', ')}` },
      { status: 404 }
    )
  }

  try {
    const res = await fetch(source.url)
    const ics = await res.text()
    const events = parseICS(ics)
    return Response.json({ id, color: source.color, events })
  } catch (error) {
    return Response.json({ id, color: source.color, events: [], error: String(error) }, { status: 500 })
  }
}

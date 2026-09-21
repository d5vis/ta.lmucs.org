import {
  isShiftLevel,
  levelOf,
  toCalendarEvents,
  type RecurringEvent,
  type SemesterShifts,
} from '../tutoringShifts'

const shift = (courses: string[], weekday = 1) => ({
  nid: `n${courses.join('')}${weekday}`,
  name: 'Cara B.',
  courses,
  weekday,
  start: '09:30',
  end: '11:00',
})

const fall: SemesterShifts = {
  semester: 'Fall 2026',
  startDate: '2026-08-31',
  endDate: '2026-12-18',
  shifts: [shift(['1010']), shift(['2120', '3300'], 3), shift(['3300'], 5), shift([], 2)],
}

describe('levelOf', () => {
  it('files a shift under the level of the first course', () => {
    expect(levelOf({ courses: ['1010'] })).toBe('1000')
    expect(levelOf({ courses: ['1900'] })).toBe('1000')
    expect(levelOf({ courses: ['2120', '3300'] })).toBe('2000')
    expect(levelOf({ courses: ['3801'] })).toBe('3000')
  })

  it('files a shift with no course under the general 3000 filter', () => {
    expect(levelOf({ courses: [] })).toBe('3000')
  })
})

describe('isShiftLevel', () => {
  it('knows the three route segments', () => {
    expect(isShiftLevel('1000')).toBe(true)
    expect(isShiftLevel('3000+')).toBe(false)
  })
})

describe('toCalendarEvents', () => {
  it('bounds a shift without dates of its own by the semester, the end made exclusive', () => {
    expect(toCalendarEvents([fall], '1000')).toEqual([
      {
        id: 'n10101',
        title: 'Cara B. (1010)',
        daysOfWeek: [1],
        startTime: '09:30',
        endTime: '11:00',
        startRecur: '2026-08-31',
        endRecur: '2026-12-19',
        extendedProps: { description: 'In-lab tutoring, Fall 2026' },
      },
    ])
  })

  it('returns only the level asked for, every shift landing in exactly one', () => {
    const counts = (['1000', '2000', '3000'] as const).map(
      level => toCalendarEvents([fall], level).length
    )
    expect(counts).toEqual([1, 1, 2])
  })

  it('titles a shift without a course by name alone', () => {
    const titles = toCalendarEvents([fall], '3000').map(event => event.title)
    expect(titles).toEqual(['Cara B. (3300)', 'Cara B.'])
  })

  it("repeats a shift over its own dates, not the semester's", () => {
    // Moved for one week in TA Draft: three runs of the same weekly shift.
    const split = {
      ...fall,
      shifts: [
        { ...shift(['1010']), nid: 'before', startDate: '2026-08-31', endDate: '2026-09-07' },
        { ...shift(['1010'], 2), nid: 'moved', startDate: '2026-09-15', endDate: '2026-09-15' },
        { ...shift(['1010']), nid: 'after', startDate: '2026-09-21', endDate: '2026-12-14' },
      ],
    }
    expect(
      (toCalendarEvents([split], '1000') as RecurringEvent[]).map(event => [
        event.id,
        event.startRecur,
        event.endRecur,
      ])
    ).toEqual([
      ['before', '2026-08-31', '2026-09-08'],
      ['moved', '2026-09-15', '2026-09-16'],
      ['after', '2026-09-21', '2026-12-15'],
    ])
  })

  it('skips a shift with no dates at all rather than repeating it forever', () => {
    expect(toCalendarEvents([{ ...fall, startDate: null }], '1000')).toEqual([])
    expect(toCalendarEvents([{ ...fall, endDate: null }], '1000')).toEqual([])
  })

  it('places a dated shift even when the semester has no dates', () => {
    const dated = { ...shift(['1010']), startDate: '2026-08-31', endDate: '2026-12-14' }
    const events = toCalendarEvents([{ ...fall, startDate: null, endDate: null, shifts: [dated] }], '1000')
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({ startRecur: '2026-08-31', endRecur: '2026-12-15' })
  })
})

describe('days that differ from the week', () => {
  // Carter's Tuesdays, 3:30 to 5:30, from Sep 1 to Dec 15.
  const carter = {
    nid: 'carter01',
    name: 'Carter G.',
    courses: ['1010'],
    weekday: 2,
    start: '15:30',
    end: '17:30',
    startDate: '2026-09-01',
    endDate: '2026-12-15',
  }
  const eventsFor = (extra: object) =>
    toCalendarEvents([{ ...fall, shifts: [{ ...carter, ...extra }] }], '1000')

  it('cuts a moved day out of the week and shows it at its own hours', () => {
    const events = eventsFor({ changes: [{ date: '2026-09-22', start: '15:30', end: '18:00' }] })
    expect(events).toEqual([
      expect.objectContaining({ id: 'carter01', startRecur: '2026-09-01', endRecur: '2026-09-22' }),
      {
        id: 'carter01@2026-09-22',
        title: 'Carter G. (1010)',
        start: '2026-09-22T15:30',
        end: '2026-09-22T18:00',
        extendedProps: {
          description:
            'In-lab tutoring, Fall 2026. Hours changed for this day only (usually 3:30 PM - 5:30 PM).',
        },
      },
      expect.objectContaining({ startRecur: '2026-09-23', endRecur: '2026-12-16' }),
    ])
  })

  it('strikes through a cancelled day and titles a late one', () => {
    const events = eventsFor({
      statuses: [
        { date: '2026-09-29', status: 'CANCELLED' },
        { date: '2026-09-22', status: 'DELAYED' },
      ],
    })
    const days = events.filter(event => 'start' in event)
    expect(days.map(event => event.title)).toEqual([
      'Running late: Carter G. (1010)',
      'Cancelled: Carter G. (1010)',
    ])
    expect(days[1]).toMatchObject({ classNames: ['!line-through', 'opacity-60'] })
    // The weeks around them still repeat: before, between and after.
    expect(events.filter(event => 'startRecur' in event)).toHaveLength(3)
  })

  it('leaves a shift with nothing odd as one weekly event', () => {
    expect(eventsFor({})).toHaveLength(1)
  })
})


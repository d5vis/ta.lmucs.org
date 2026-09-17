import { isShiftLevel, levelOf, toCalendarEvents, type SemesterShifts } from '../tutoringShifts'

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
  it('makes a weekly event bounded by the semester, the end made exclusive', () => {
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

  it('skips a semester whose dates are unknown rather than repeating it forever', () => {
    expect(toCalendarEvents([{ ...fall, startDate: null }], '1000')).toEqual([])
  })
})

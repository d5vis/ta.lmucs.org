import { createHmac } from 'crypto'

import { canonicalQuery, signedHeaders } from '../draftApi'

jest.mock('server-only', () => ({}))

/**
 * Pins the wire format shared with ta-draft-next, which verifies these
 * signatures in src/lib/api-auth.ts; its own test signs the same way.
 */
const SECRET = '15933bc08eef05bea9dba4a3c1889cd3b413d519f76e944e04e4f6d6d792a475'

describe('canonicalQuery', () => {
  it('collapses the two spellings of a space and ignores parameter order', () => {
    expect(canonicalQuery('?semester=Fall%202026')).toBe('semester=Fall+2026')
    expect(canonicalQuery('?b=2&a=1')).toBe('a=1&b=2')
    expect(canonicalQuery('')).toBe('')
  })
})

describe('signedHeaders', () => {
  it('signs key id, method, path, canonical query and timestamp joined by newlines', () => {
    const headers = signedHeaders('get', '/api/tutoring-shifts', '?semester=Fall%202026', '1787836800')
    const canonical = 'ta.lmucs.org\nGET\n/api/tutoring-shifts\nsemester=Fall+2026\n1787836800'
    expect(headers).toEqual({
      'x-api-key': 'ta.lmucs.org',
      'x-timestamp': '1787836800',
      'x-signature': createHmac('sha256', SECRET).update(canonical).digest('hex'),
    })
  })

  it('stamps the current unix time when none is given', () => {
    const stamped = Number(signedHeaders('GET', '/api/tutoring-shifts', '')['x-timestamp'])
    expect(Math.abs(stamped - Date.now() / 1000)).toBeLessThan(5)
  })
})

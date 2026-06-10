import { describe, expect, it } from 'vitest'

import { profileDotTone } from './profile-dot'

describe('profileDotTone', () => {
  it('green for an open socket, pinned or not', () => {
    expect(profileDotTone('open', false)).toBe('green')
    expect(profileDotTone('open', true)).toBe('green')
  })

  it('amber while connecting', () => {
    expect(profileDotTone('connecting', false)).toBe('amber')
    expect(profileDotTone('connecting', true)).toBe('amber')
  })

  it('amber for a pinned profile that is down', () => {
    expect(profileDotTone('closed', true)).toBe('amber')
    expect(profileDotTone('error', true)).toBe('amber')
    expect(profileDotTone(undefined, true)).toBe('amber')
  })

  it('no dot for an unpinned profile without an open socket', () => {
    expect(profileDotTone('closed', false)).toBe(null)
    expect(profileDotTone('error', false)).toBe(null)
    expect(profileDotTone('idle', false)).toBe(null)
    expect(profileDotTone(undefined, false)).toBe(null)
  })
})

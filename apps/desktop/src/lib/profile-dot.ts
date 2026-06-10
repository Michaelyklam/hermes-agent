import type { ConnectionState } from '@hermes/shared'

// Dot color for a profile square on the rail. Only pinned (keepConnected)
// profiles and profiles with a live background socket show a dot at all —
// single-profile / unpinned users see zero new chrome:
//   green  — socket open (agent reachable now)
//   amber  — connecting / reconnecting, or a pinned profile currently down
//   none   — no socket and not pinned
export type ProfileDotTone = 'amber' | 'green' | null

export function profileDotTone(state: ConnectionState | undefined, pinned: boolean): ProfileDotTone {
  if (state === 'open') {
    return 'green'
  }

  if (state === 'connecting') {
    return 'amber'
  }

  // closed / error / idle / no socket: a pinned profile signals "should be
  // connected but isn't" (its reconnect backoff is running); an unpinned one
  // simply shows nothing.
  return pinned ? 'amber' : null
}

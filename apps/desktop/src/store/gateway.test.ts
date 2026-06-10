/**
 * Tests for the multi-profile gateway registry: secondary-socket pruning and
 * the keepConnected pin exemption.
 *
 * Secondaries are created through ensureGatewayForProfile(). In this jsdom
 * environment `window.hermesDesktop` is undefined, so openSecondary() early-outs
 * before any real WS connect — entries exist in the registry with wantOpen=true
 * but never dial, which is exactly what prune logic operates on.
 */
import { beforeEach, describe, expect, it } from 'vitest'

import {
  closeSecondaryGateways,
  ensureGatewayForProfile,
  hasSecondaryGateway,
  pruneSecondaryGateways,
  setPinnedProfiles
} from './gateway'

describe('pruneSecondaryGateways', () => {
  beforeEach(() => {
    closeSecondaryGateways()
    setPinnedProfiles([])
  })

  it('closes idle secondaries that are neither active nor kept', async () => {
    await ensureGatewayForProfile('a')
    await ensureGatewayForProfile('b')
    // 'b' is now active; prune with an empty keep-set drops 'a'.
    pruneSecondaryGateways(new Set())
    expect(hasSecondaryGateway('a')).toBe(false)
    expect(hasSecondaryGateway('b')).toBe(true)
  })

  it('spares secondaries in the keep set', async () => {
    await ensureGatewayForProfile('a')
    await ensureGatewayForProfile('b')
    pruneSecondaryGateways(new Set(['a']))
    expect(hasSecondaryGateway('a')).toBe(true)
  })

  it('spares pinned (keepConnected) secondaries with no live work', async () => {
    await ensureGatewayForProfile('a')
    await ensureGatewayForProfile('b')
    setPinnedProfiles(['a'])
    pruneSecondaryGateways(new Set())
    expect(hasSecondaryGateway('a')).toBe(true)
    expect(hasSecondaryGateway('b')).toBe(true) // active
  })

  it('prunes a formerly pinned secondary once unpinned', async () => {
    await ensureGatewayForProfile('a')
    await ensureGatewayForProfile('b')
    setPinnedProfiles(['a'])
    pruneSecondaryGateways(new Set())
    expect(hasSecondaryGateway('a')).toBe(true)

    setPinnedProfiles([])
    pruneSecondaryGateways(new Set())
    expect(hasSecondaryGateway('a')).toBe(false)
  })

  it('normalizes pinned profile keys like the registry does', async () => {
    await ensureGatewayForProfile('a')
    await ensureGatewayForProfile('b')
    setPinnedProfiles(['  a  '])
    pruneSecondaryGateways(new Set())
    expect(hasSecondaryGateway('a')).toBe(true)
  })
})

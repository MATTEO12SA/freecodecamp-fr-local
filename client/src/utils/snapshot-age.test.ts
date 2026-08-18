import { describe, expect, it } from 'vitest';

import { formatSnapshotAge } from './snapshot-age';

const now = new Date('2026-07-26T12:00:00.000Z').getTime();

describe('snapshot age', () => {
  it('formats recent, hourly and daily snapshots', () => {
    expect(formatSnapshotAge('2026-07-26T11:59:45.000Z', now)).toBe(
      "moins d'une minute"
    );
    expect(formatSnapshotAge('2026-07-26T11:42:00.000Z', now)).toBe('18 min');
    expect(formatSnapshotAge('2026-07-26T08:00:00.000Z', now)).toBe('4 h');
    expect(formatSnapshotAge('2026-07-24T12:00:00.000Z', now)).toBe('2 j');
  });

  it('handles invalid dates', () => {
    expect(formatSnapshotAge('invalid', now)).toBe('inconnu');
  });
});

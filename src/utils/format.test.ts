import { describe, expect, it } from 'vitest';
import { formatDuration } from './format';

describe('formatDuration', () => {
  it.each([
    [0, '0:00'],
    [65, '1:05'],
    [300, '5:00'],
  ])('định dạng %i giây thành %s', (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });
});

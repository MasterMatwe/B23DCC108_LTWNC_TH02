import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('giữ giá trị cũ trước 300ms và cập nhật khi đủ 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: '' } },
    );

    rerender({ value: 'mưa' });

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe('');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe('mưa');
  });
});

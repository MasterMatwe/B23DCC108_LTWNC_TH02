import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SONGS } from '../../data/songs';
import PlayerBar from './PlayerBar';
import { usePlayerStore } from './usePlayerStore';

describe('PlayerBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    usePlayerStore.setState({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      position: 0,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('hiển thị trạng thái chưa phát và khóa điều khiển khi hàng đợi rỗng', () => {
    render(<PlayerBar />);

    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 0 bài')).toBeInTheDocument();
    expect(screen.getByText('0:00 / 0:00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Phát' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Trước' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Sau' })).toBeDisabled();
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cập nhật thời gian, tiến trình và dừng đồng hồ khi tạm dừng', () => {
    usePlayerStore.getState().playQueue(SONGS.slice(0, 2), 0);
    const view = render(<PlayerBar />);

    expect(screen.getByText('Đang phát: Mưa tháng Sáu 1 – Lê Minh')).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 2 bài')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('0:05 / 2:30')).toBeInTheDocument();
    expect(Number(screen.getByRole('progressbar').getAttribute('value')))
      .toBeCloseTo((5 / 150) * 100);

    fireEvent.click(screen.getByRole('button', { name: 'Tạm dừng' }));
    expect(vi.getTimerCount()).toBe(0);

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('0:05 / 2:30')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Phát' }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('0:06 / 2:30')).toBeInTheDocument();

    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('chuyển bài bằng nút Sau và Trước, tua về đầu khi đã phát quá 3 giây', () => {
    usePlayerStore.getState().playQueue(SONGS.slice(0, 2), 0);
    render(<PlayerBar />);

    fireEvent.click(screen.getByRole('button', { name: 'Sau' }));
    expect(screen.getByText('Đang phát: Nắng tháng Sáu 1 – Quang Huy')).toBeInTheDocument();
    expect(screen.getByText('0:00 / 3:07')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Trước' }));
    expect(usePlayerStore.getState().currentIndex).toBe(0);

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Trước' }));
    expect(usePlayerStore.getState().currentIndex).toBe(0);
    expect(screen.getByText('0:00 / 2:30')).toBeInTheDocument();
  });
});

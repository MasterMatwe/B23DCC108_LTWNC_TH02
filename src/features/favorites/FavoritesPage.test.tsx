import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { usePlayerStore } from '../player/usePlayerStore';
import FavoritesPage from './FavoritesPage';
import { useFavoritesStore } from './useFavoritesStore';

describe('FavoritesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.setState({ ids: [] });
    usePlayerStore.setState({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      position: 0,
    });
  });

  it('thông báo khi chưa có bài hát yêu thích', () => {
    render(<FavoritesPage />);

    expect(screen.getByText('Bạn chưa có bài hát yêu thích.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Phát tất cả' })).not.toBeInTheDocument();
  });

  it('hiển thị và phát tất cả các bài đã thích', async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ ids: ['s1', 's3'] });
    render(<FavoritesPage />);

    expect(screen.getByText('2 bài hát yêu thích')).toBeInTheDocument();
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Gió tháng Sáu 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Phát tất cả' }));
    const state = usePlayerStore.getState();
    expect(state.queue.map((song) => song.id)).toEqual(['s1', 's3']);
    expect(state.currentIndex).toBe(0);
    expect(state.isPlaying).toBe(true);
  });

  it('thêm hàng đợi, phát từ bài được chọn và bỏ yêu thích', async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ ids: ['s1', 's3'] });
    render(<FavoritesPage />);

    await user.click(screen.getAllByRole('button', { name: '+ Hàng đợi' })[1]);
    expect(usePlayerStore.getState().queue.map((song) => song.id)).toEqual(['s3']);

    await user.click(screen.getAllByRole('button', { name: 'Phát' })[1]);
    expect(usePlayerStore.getState().queue.map((song) => song.id)).toEqual(['s1', 's3']);
    expect(usePlayerStore.getState().currentIndex).toBe(1);

    await user.click(screen.getAllByRole('button', { name: 'Bỏ yêu thích' })[0]);
    expect(screen.queryByText('Mưa tháng Sáu 1')).not.toBeInTheDocument();
    expect(screen.getByText('1 bài hát yêu thích')).toBeInTheDocument();
    expect(useFavoritesStore.getState().ids).toEqual(['s3']);
  });

  it('ghi yêu thích vào localStorage và khôi phục lại dữ liệu đã lưu', async () => {
    useFavoritesStore.getState().toggle('s1');
    const saved = localStorage.getItem('music-favorites');
    expect(saved).not.toBeNull();
    const parsed: unknown = JSON.parse(saved ?? '{}');
    expect(parsed).toMatchObject({ state: { ids: ['s1'] } });

    useFavoritesStore.setState({ ids: [] });
    render(<FavoritesPage />);
    expect(screen.getByText('Bạn chưa có bài hát yêu thích.')).toBeInTheDocument();

    localStorage.setItem('music-favorites', saved ?? '{}');
    await act(async () => {
      await useFavoritesStore.persist.rehydrate();
    });

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('1 bài hát yêu thích')).toBeInTheDocument();
  });
});

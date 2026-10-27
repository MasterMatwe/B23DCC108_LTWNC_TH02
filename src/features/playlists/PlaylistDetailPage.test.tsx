import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlayerStore } from '../player/usePlayerStore';
import { PlaylistProvider } from './PlaylistContext';
import PlaylistDetailPage from './PlaylistDetailPage';

function renderDetail(id = 'p1') {
  return render(
    <MemoryRouter initialEntries={[`/playlists/${id}`]}>
      <PlaylistProvider>
        <Routes>
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
        </Routes>
      </PlaylistProvider>
    </MemoryRouter>,
  );
}

describe('PlaylistDetailPage', () => {
  beforeEach(() => {
    localStorage.clear();
    usePlayerStore.setState({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      position: 0,
    });
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('thông báo khi playlist không tồn tại', () => {
    renderDetail('khong-ton-tai');
    expect(screen.getByText('Không tìm thấy playlist.')).toBeInTheDocument();
  });

  it('khóa nút Phát tất cả khi playlist chưa có bài hát', () => {
    localStorage.setItem('music-playlists', JSON.stringify([
      { id: 'p1', name: 'Chạy bộ', songIds: [] },
    ]));
    renderDetail();

    expect(screen.getByRole('heading', { name: 'Chạy bộ' })).toBeInTheDocument();
    expect(screen.getByText('Playlist chưa có bài hát.')).toBeInTheDocument();
    expect(screen.getByText('Tổng thời lượng: 0 phút 0 giây')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Phát tất cả' })).toBeDisabled();
  });

  it('tính tổng thời lượng, phát tất cả và ghi nhớ thao tác bỏ bài khi mở lại', async () => {
    const user = userEvent.setup();
    localStorage.setItem('music-playlists', JSON.stringify([
      { id: 'p1', name: 'Chạy bộ', songIds: ['s1', 's2'] },
    ]));
    const view = renderDetail();

    expect(screen.getByText('Tổng thời lượng: 5 phút 37 giây')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Phát tất cả' }));
    expect(usePlayerStore.getState().queue.map((song) => song.id)).toEqual(['s1', 's2']);
    expect(usePlayerStore.getState().isPlaying).toBe(true);

    await user.click(screen.getAllByRole('button', { name: 'Bỏ' })[0]);
    expect(screen.getByText('Tổng thời lượng: 3 phút 7 giây')).toBeInTheDocument();
    expect(screen.queryByText('Mưa tháng Sáu 1 – Lê Minh')).not.toBeInTheDocument();

    view.unmount();
    renderDetail();
    expect(screen.getByRole('heading', { name: 'Chạy bộ' })).toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1 – Quang Huy')).toBeInTheDocument();
    expect(screen.getByText('Tổng thời lượng: 3 phút 7 giây')).toBeInTheDocument();
  });
});

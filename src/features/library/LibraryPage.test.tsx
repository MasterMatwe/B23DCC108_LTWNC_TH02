import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';
import { PlaylistProvider } from '../playlists/PlaylistContext';
import LibraryPage from './LibraryPage';

function renderLibrary() {
  return render(
    <PlaylistProvider>
      <LibraryPage />
    </PlaylistProvider>,
  );
}

describe('LibraryPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.setState({ ids: [] });
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

  it('ảo hóa 10000 bài và phát đúng danh sách sau khi tìm kiếm, lọc thể loại', async () => {
    const user = userEvent.setup();
    const { container } = renderLibrary();

    expect(screen.getByRole('status')).toHaveTextContent('Tìm thấy 10000 bài hát');
    const rowCount = container.querySelectorAll('.song-row').length;
    expect(rowCount).toBeGreaterThan(0);
    expect(rowCount).toBeLessThanOrEqual(15);
    expect(screen.getByRole('combobox', { name: 'Playlist đang chọn' })).toBeDisabled();
    expect(screen.getAllByRole('button', { name: '+ Playlist' })[0]).toBeDisabled();

    await user.type(screen.getByRole('searchbox', { name: 'Tìm kiếm' }), 'MƯA');
    expect(await screen.findByText('Tìm thấy 1250 bài hát')).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Thể loại' }), 'Rock');
    expect(screen.getByRole('status')).toHaveTextContent('Tìm thấy 250 bài hát');

    await user.click(screen.getAllByRole('button', { name: 'Phát' })[0]);
    const state = usePlayerStore.getState();
    expect(state.queue).toHaveLength(250);
    expect(state.currentIndex).toBe(0);
    expect(state.isPlaying).toBe(true);
    expect(state.queue.every((song) =>
      song.genre === 'Rock' && song.title.toLowerCase().includes('mưa'),
    )).toBe(true);
  });

  it('tìm theo ca sĩ và thông báo khi không có kết quả', async () => {
    const user = userEvent.setup();
    renderLibrary();
    const search = screen.getByRole('searchbox', { name: 'Tìm kiếm' });

    await user.type(search, 'thu hà');
    expect(await screen.findByText('Tìm thấy 1000 bài hát')).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'xyz');
    expect(await screen.findByText('Không tìm thấy bài hát nào.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Phát' })).not.toBeInTheDocument();
  });

  it('phát hàng đợi theo thứ tự tên hoặc thời lượng đã chọn', async () => {
    const user = userEvent.setup();
    renderLibrary();
    const sort = screen.getByRole('combobox', { name: 'Sắp xếp' });

    await user.selectOptions(sort, 'title');
    await user.click(screen.getAllByRole('button', { name: 'Phát' })[0]);
    expect(usePlayerStore.getState().queue[0].title).toBe('Biển bình yên 1');

    await user.selectOptions(sort, 'duration');
    await user.click(screen.getAllByRole('button', { name: 'Phát' })[0]);
    const queue = usePlayerStore.getState().queue;
    expect(queue).toHaveLength(10000);
    expect(queue.every((song, index) =>
      index === 0 || queue[index - 1].duration <= song.duration,
    )).toBe(true);
  });

  it('thêm bài vào hàng đợi và playlist đang chọn, không thêm trùng bài', async () => {
    const user = userEvent.setup();
    localStorage.setItem('music-playlists', JSON.stringify([
      { id: 'p1', name: 'Chạy bộ', songIds: [] },
      { id: 'p2', name: 'Thư giãn', songIds: [] },
    ]));
    renderLibrary();

    await user.click(screen.getAllByRole('button', { name: '+ Hàng đợi' })[0]);
    expect(usePlayerStore.getState().queue.map((song) => song.id)).toEqual(['s1']);

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Playlist đang chọn' }),
      'p2',
    );
    await user.click(screen.getAllByRole('button', { name: '+ Playlist' })[0]);
    await user.click(screen.getAllByRole('button', { name: '+ Playlist' })[0]);

    const saved: unknown = JSON.parse(localStorage.getItem('music-playlists') ?? '[]');
    expect(saved).toEqual([
      { id: 'p1', name: 'Chạy bộ', songIds: [] },
      { id: 'p2', name: 'Thư giãn', songIds: ['s1'] },
    ]);
  });
});

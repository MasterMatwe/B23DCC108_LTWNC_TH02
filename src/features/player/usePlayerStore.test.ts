import { beforeEach, describe, expect, it } from 'vitest';
import { SONGS } from '../../data/songs';
import { usePlayerStore } from './usePlayerStore';

const songs = SONGS.slice(0, 3);

describe('usePlayerStore', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      position: 0,
    });
  });

  it('phát đúng bài được chọn và đặt vị trí về 0', () => {
    usePlayerStore.setState({ position: 20 });
    usePlayerStore.getState().playQueue(songs, 1);

    const state = usePlayerStore.getState();

    expect(state.queue).toEqual(songs);
    expect(state.currentIndex).toBe(1);
    expect(state.queue[state.currentIndex].id).toBe('s2');
    expect(state.position).toBe(0);
    expect(state.isPlaying).toBe(true);
  });

  it('tự chuyển sang bài sau khi tick ở giây cuối', () => {
    usePlayerStore.getState().playQueue(songs, 0);
    usePlayerStore.setState({ position: songs[0].duration - 1 });

    usePlayerStore.getState().tick();

    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 1,
      position: 0,
      isPlaying: true,
    });
  });

  it('dừng phát khi gọi next ở bài cuối', () => {
    usePlayerStore.getState().playQueue(songs, 2);
    usePlayerStore.getState().next();

    expect(usePlayerStore.getState().isPlaying).toBe(false);
    expect(usePlayerStore.getState().currentIndex).toBe(2);
  });

  it('không phát khi hàng đợi đang rỗng', () => {
    usePlayerStore.getState().togglePlay();

    expect(usePlayerStore.getState().isPlaying).toBe(false);
    expect(usePlayerStore.getState().currentIndex).toBe(-1);
  });

  it('tiếp tục phát từ vị trí cũ sau khi tạm dừng', () => {
    usePlayerStore.getState().playQueue(songs, 0);
    usePlayerStore.setState({ position: 5 });
    usePlayerStore.getState().togglePlay();

    expect(usePlayerStore.getState().isPlaying).toBe(false);
    expect(usePlayerStore.getState().position).toBe(5);

    usePlayerStore.getState().togglePlay();

    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(usePlayerStore.getState().position).toBe(5);
  });
});

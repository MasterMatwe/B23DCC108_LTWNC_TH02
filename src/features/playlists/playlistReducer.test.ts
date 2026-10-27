import { describe, expect, it } from 'vitest';
import { playlistReducer } from './playlistReducer';
import type { Playlist } from './playlistReducer';

const initialState: Playlist[] = [
  { id: 'p1', name: 'Chạy bộ', songIds: [] },
];

describe('playlistReducer', () => {
  it('tạo playlist mới', () => {
    expect(
      playlistReducer([], { type: 'create', id: 'p1', name: 'Chạy bộ' }),
    ).toEqual(initialState);
  });

  it('không thêm trùng một bài hát', () => {
    const state = playlistReducer(initialState, {
      type: 'addSong',
      id: 'p1',
      songId: 's1',
    });

    const result = playlistReducer(state, {
      type: 'addSong',
      id: 'p1',
      songId: 's1',
    });

    expect(result[0].songIds).toEqual(['s1']);
    expect(initialState[0].songIds).toEqual([]);
  });

  it('bỏ bài hát khỏi playlist', () => {
    const state: Playlist[] = [
      { id: 'p1', name: 'Chạy bộ', songIds: ['s1', 's2'] },
    ];

    const result = playlistReducer(state, {
      type: 'removeSong',
      id: 'p1',
      songId: 's1',
    });

    expect(result[0].songIds).toEqual(['s2']);
    expect(state[0].songIds).toEqual(['s1', 's2']);
  });

  it('giữ nguyên nội dung state khi xóa playlist không tồn tại', () => {
    expect(
      playlistReducer(initialState, {
        type: 'remove',
        id: 'khong-ton-tai',
      }),
    ).toEqual(initialState);
  });

  it('không đổi tên playlist thành tên trống', () => {
    expect(
      playlistReducer(initialState, {
        type: 'rename',
        id: 'p1',
        name: '   ',
      }),
    ).toEqual(initialState);
  });

  it('không đổi tên thành tên của playlist khác', () => {
    const state: Playlist[] = [
      { id: 'p1', name: 'Chạy bộ', songIds: [] },
      { id: 'p2', name: 'Thư giãn', songIds: [] },
    ];

    expect(
      playlistReducer(state, {
        type: 'rename',
        id: 'p1',
        name: 'thư giãn',
      }),
    ).toEqual(state);
  });
});

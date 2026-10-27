import { describe, expect, it } from 'vitest';
import { generateSongs } from './songs';

const songs = generateSongs(10000);

describe('generateSongs', () => {
  it('sinh đúng 10000 bài hát', () => {
    expect(songs).toHaveLength(10000);
  });

  it('không sinh ID trùng nhau', () => {
    expect(new Set(songs.map((song) => song.id)).size).toBe(10000);
  });

  it('mọi bài hát có thời lượng từ 150 đến 300 giây', () => {
    expect(
      songs.every((song) => song.duration >= 150 && song.duration <= 300),
    ).toBe(true);
  });

  it('trả về danh sách rỗng khi yêu cầu sinh 0 bài hát', () => {
    expect(generateSongs(0)).toEqual([]);
  });

  it('sinh cùng dữ liệu khi gọi với cùng số lượng', () => {
    expect(generateSongs(10)).toEqual(generateSongs(10));
  });
});

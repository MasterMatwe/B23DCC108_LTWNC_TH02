import { memo } from 'react';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';

interface SongRowProps {
  song: Song;
  index: number;
  onPlay: (song: Song) => void;
}

function SongRow({ song, index, onPlay }: SongRowProps) {
  return (
    <div className="song-row">
      <span>{index + 1}</span>

      <span title={song.title}>{song.title}</span>

      <span title={song.artist}>{song.artist}</span>

      <span>{song.genre}</span>

      <span>{formatDuration(song.duration)}</span>

      <div className="song-actions">
        <button type="button" onClick={() => onPlay(song)}>
          Phát
        </button>

        <button
          type="button"
          aria-label="Thêm vào yêu thích"
          title="Chức năng ở Phần 2"
          disabled
        >
          ♡
        </button>

        <button
          type="button"
          title="Chức năng ở Phần 2"
          disabled
        >
          + Hàng đợi
        </button>
      </div>
    </div>
  );
}

export default memo(SongRow);
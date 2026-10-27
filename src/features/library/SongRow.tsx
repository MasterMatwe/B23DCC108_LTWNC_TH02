import { memo } from 'react';

import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';
import { useFavoritesStore } from '../favorites/useFavoritesStore';

interface SongRowProps {
  song: Song;
  index: number;
  onPlay: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  canAddToPlaylist?: boolean;
}

function SongRow({
  song,
  index,
  onPlay,
  onAddToQueue,
  onAddToPlaylist,
  canAddToPlaylist = false,
}: SongRowProps) {
  const isFavorite = useFavoritesStore(
    (state) => state.ids.includes(song.id),
  );

  const toggleFavorite = useFavoritesStore((state) => state.toggle);

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
          onClick={() => toggleFavorite(song.id)}
          aria-label={
            isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'
          }
          aria-pressed={isFavorite}
        >
          {isFavorite ? '♥' : '♡'}
        </button>

        <button
          type="button"
          onClick={() => onAddToQueue(song)}
        >
          + Hàng đợi
        </button>

        {onAddToPlaylist && (
          <button
            type="button"
            disabled={!canAddToPlaylist}
            onClick={() => onAddToPlaylist(song)}
          >
            + Playlist
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(SongRow);
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { SONGS } from '../../data/songs';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';
import { usePlayerStore } from '../player/usePlayerStore';
import {
  usePlaylistDispatch,
  usePlaylists,
} from './PlaylistContext';

const songsById = new Map(
  SONGS.map((song) => [song.id, song]),
);

export default function PlaylistDetailPage() {
  const { id } = useParams();

  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const playQueue = usePlayerStore((state) => state.playQueue);

  const playlist = playlists.find((item) => item.id === id);

  const songs = useMemo(
    () =>
      playlist
        ? playlist.songIds
            .map((songId) => songsById.get(songId))
            .filter((song): song is Song => song !== undefined)
        : [],
    [playlist],
  );

  const totalDuration = songs.reduce(
    (total, song) => total + song.duration,
    0,
  );

  if (!playlist) {
    return <p>Không tìm thấy playlist.</p>;
  }

  return (
    <section>
      <h1>{playlist.name}</h1>

      <p>
        Tổng thời lượng: {Math.floor(totalDuration / 60)} phút{' '}
        {totalDuration % 60} giây
      </p>

      <button
        type="button"
        disabled={songs.length === 0}
        onClick={() => playQueue(songs, 0)}
      >
        Phát tất cả
      </button>

      {songs.length === 0 ? (
        <p>Playlist chưa có bài hát.</p>
      ) : (
        <ul className="playlist-list">
          {songs.map((song) => (
            <li key={song.id}>
              <span>
                {song.title} – {song.artist}
              </span>

              <span>{formatDuration(song.duration)}</span>

              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: 'removeSong',
                    id: playlist.id,
                    songId: song.id,
                  })
                }
              >
                Bỏ
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
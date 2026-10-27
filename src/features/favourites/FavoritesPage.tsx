import { useCallback, useMemo } from 'react';
import { SONGS } from '../../data/songs';
import type { Song } from '../../types';
import SongRow from '../library/SongRow';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from './useFavoritesStore';

export default function FavoritesPage() {
  const ids = useFavoritesStore((state) => state.ids);

  const playQueue = usePlayerStore((state) => state.playQueue);
  const addToQueue = usePlayerStore((state) => state.addToQueue);

  const favoriteSongs = useMemo(() => {
    const favoriteIds = new Set(ids);

    return SONGS.filter((song) => favoriteIds.has(song.id));
  }, [ids]);

  const handlePlay = useCallback(
    (song: Song) => {
      const startIndex = favoriteSongs.findIndex(
        (item) => item.id === song.id,
      );

      playQueue(favoriteSongs, startIndex);
    },
    [favoriteSongs, playQueue],
  );

  const handleAddToQueue = useCallback(
    (song: Song) => {
      addToQueue(song);
    },
    [addToQueue],
  );

  const handlePlayAll = useCallback(() => {
    playQueue(favoriteSongs, 0);
  }, [favoriteSongs, playQueue]);

  return (
    <section>
      <h1>Bài hát yêu thích</h1>

      {favoriteSongs.length === 0 ? (
        <p>Bạn chưa có bài hát yêu thích.</p>
      ) : (
        <>
          <button type="button" onClick={handlePlayAll}>
            Phát tất cả
          </button>

          <p>{favoriteSongs.length} bài hát yêu thích</p>

          <div className="list-container">
            <div className="list-content">
              {favoriteSongs.map((song, index) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={index}
                  onPlay={handlePlay}
                  onAddToQueue={handleAddToQueue}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
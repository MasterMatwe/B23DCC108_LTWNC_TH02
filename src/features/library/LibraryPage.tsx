import { useCallback, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { FixedSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';

import { GENRES, SONGS } from '../../data/songs';
import { useDebounce } from '../../hooks/useDebounce';
import type { Genre, Song } from '../../types';
import { usePlayerStore } from '../player/usePlayerStore';
import {
  usePlaylistDispatch,
  usePlaylists,
} from '../playlists/PlaylistContext';
import SongRow from './SongRow';

type GenreFilter = Genre | 'all';
type SortOption = 'default' | 'title' | 'duration';

interface RowData {
  songs: Song[];
  onPlay: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
  canAddToPlaylist: boolean;
}

function VirtualRow({
  index,
  style,
  data,
}: ListChildComponentProps<RowData>) {
  return (
    <div style={style}>
      <SongRow
        song={data.songs[index]}
        index={index}
        onPlay={data.onPlay}
        onAddToQueue={data.onAddToQueue}
        onAddToPlaylist={data.onAddToPlaylist}
        canAddToPlaylist={data.canAddToPlaylist}
      />
    </div>
  );
}

function getItemKey(index: number, data: RowData): string {
  return data.songs[index].id;
}

export default function LibraryPage() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<GenreFilter>('all');
  const [sort, setSort] = useState<SortOption>('default');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');

  const debouncedQuery = useDebounce(query, 300);

  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();

  const playQueue = usePlayerStore((state) => state.playQueue);
  const addToQueue = usePlayerStore((state) => state.addToQueue);

  const activePlaylistId = playlists.some(
    (playlist) => playlist.id === selectedPlaylistId,
  )
    ? selectedPlaylistId
    : playlists[0]?.id ?? '';

  const handleQueryChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    },
    [],
  );

  const filteredSongs = useMemo(() => {
    const keyword = debouncedQuery.trim().toLowerCase();

    const result = SONGS.filter((song) => {
      const matchesQuery =
        song.title.toLowerCase().includes(keyword) ||
        song.artist.toLowerCase().includes(keyword);

      const matchesGenre =
        genre === 'all' || song.genre === genre;

      return matchesQuery && matchesGenre;
    });

    if (sort === 'title') {
      return [...result].sort((a, b) =>
        a.title.localeCompare(b.title, 'vi'),
      );
    }

    if (sort === 'duration') {
      return [...result].sort((a, b) => a.duration - b.duration);
    }

    return result;
  }, [debouncedQuery, genre, sort]);

  const handlePlay = useCallback(
    (song: Song) => {
      const startIndex = filteredSongs.findIndex(
        (item) => item.id === song.id,
      );

      playQueue(filteredSongs, startIndex);
    },
    [filteredSongs, playQueue],
  );

  const handleAddToQueue = useCallback(
    (song: Song) => {
      addToQueue(song);
    },
    [addToQueue],
  );

  const handleAddToPlaylist = useCallback(
    (song: Song) => {
      if (!activePlaylistId) {
        return;
      }

      dispatch({
        type: 'addSong',
        id: activePlaylistId,
        songId: song.id,
      });
    },
    [activePlaylistId, dispatch],
  );

  const itemData = useMemo<RowData>(
    () => ({
      songs: filteredSongs,
      onPlay: handlePlay,
      onAddToQueue: handleAddToQueue,
      onAddToPlaylist: handleAddToPlaylist,
      canAddToPlaylist: activePlaylistId !== '',
    }),
    [
      filteredSongs,
      handlePlay,
      handleAddToQueue,
      handleAddToPlaylist,
      activePlaylistId,
    ],
  );

  return (
    <section>
      <h1>Thư viện bài hát</h1>

      <div className="filters">
        <label>
          Tìm kiếm
          <input
            type="search"
            value={query}
            onChange={handleQueryChange}
            placeholder="Tên bài hát hoặc ca sĩ"
          />
        </label>

        <label>
          Thể loại
          <select
            value={genre}
            onChange={(event) =>
              setGenre(event.target.value as GenreFilter)
            }
          >
            <option value="all">Tất cả</option>

            {GENRES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sắp xếp
          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as SortOption)
            }
          >
            <option value="default">Mặc định</option>
            <option value="title">Tên A–Z</option>
            <option value="duration">Thời lượng tăng dần</option>
          </select>
        </label>

        <label>
          Playlist đang chọn
          <select
            value={activePlaylistId}
            disabled={playlists.length === 0}
            onChange={(event) =>
              setSelectedPlaylistId(event.target.value)
            }
          >
            {playlists.length === 0 && (
              <option value="">Chưa có playlist</option>
            )}

            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p role="status">
        Tìm thấy {filteredSongs.length} bài hát
      </p>

      {filteredSongs.length === 0 ? (
        <p>Không tìm thấy bài hát nào.</p>
      ) : (
        <div className="list-container">
          <div className="list-content">
            <div className="song-header" aria-hidden="true">
              <span>#</span>
              <span>Tên bài hát</span>
              <span>Ca sĩ</span>
              <span>Thể loại</span>
              <span>Thời lượng</span>
              <span>Thao tác</span>
            </div>

            <FixedSizeList<RowData>
              height={560}
              width="100%"
              itemCount={filteredSongs.length}
              itemSize={56}
              itemData={itemData}
              itemKey={getItemKey}
              overscanCount={2}
            >
              {VirtualRow}
            </FixedSizeList>
          </div>
        </div>
      )}
    </section>
  );
}
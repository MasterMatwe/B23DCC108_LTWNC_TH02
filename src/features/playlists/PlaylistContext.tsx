import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import type { Dispatch, ReactNode } from 'react';
import {
  playlistReducer,
} from './playlistReducer';
import type {
  Playlist,
  PlaylistAction,
} from './playlistReducer';
import { withLogger } from './withLogger';

export const PlaylistStateContext =
  createContext<Playlist[] | undefined>(undefined);

export const PlaylistDispatchContext =
  createContext<Dispatch<PlaylistAction> | undefined>(undefined);

function isPlaylist(value: unknown): value is Playlist {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (
    !('id' in value) ||
    !('name' in value) ||
    !('songIds' in value)
  ) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    Array.isArray(value.songIds) &&
    value.songIds.every((id: unknown) => typeof id === 'string')
  );
}

function loadPlaylists(): Playlist[] {
  try {
    const stored = localStorage.getItem('music-playlists');

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (Array.isArray(parsed) && parsed.every(isPlaylist)) {
      return parsed;
    }

    return [];
  } catch {
    return [];
  }
}

const reducerWithLogger = withLogger(playlistReducer);

export function PlaylistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [playlists, dispatch] = useReducer(
    reducerWithLogger,
    [],
    loadPlaylists,
  );

  useEffect(() => {
    localStorage.setItem('music-playlists', JSON.stringify(playlists));
  }, [playlists]);

  return (
    <PlaylistDispatchContext.Provider value={dispatch}>
      <PlaylistStateContext.Provider value={playlists}>
        {children}
      </PlaylistStateContext.Provider>
    </PlaylistDispatchContext.Provider>
  );
}

export function usePlaylists(): Playlist[] {
  const context = useContext(PlaylistStateContext);

  if (context === undefined) {
    throw new Error(
      'usePlaylists phải được dùng trong PlaylistProvider.',
    );
  }

  return context;
}

export function usePlaylistDispatch(): Dispatch<PlaylistAction> {
  const context = useContext(PlaylistDispatchContext);

  if (context === undefined) {
    throw new Error(
      'usePlaylistDispatch phải được dùng trong PlaylistProvider.',
    );
  }

  return context;
}
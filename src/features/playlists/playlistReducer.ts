export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

export type PlaylistAction =
  | { type: 'create'; id: string; name: string }
  | { type: 'rename'; id: string; name: string }
  | { type: 'remove'; id: string }
  | { type: 'addSong'; id: string; songId: string }
  | { type: 'removeSong'; id: string; songId: string };

export function playlistReducer(
  state: Playlist[],
  action: PlaylistAction,
): Playlist[] {
  switch (action.type) {
    case 'create': {
      const name = action.name.trim();

      const exists = state.some(
        (playlist) =>
          playlist.name.toLowerCase() === name.toLowerCase(),
      );

      if (
        !name ||
        exists ||
        state.some((playlist) => playlist.id === action.id)
      ) {
        return state;
      }

      return [
        ...state,
        {
          id: action.id,
          name,
          songIds: [],
        },
      ];
    }

    case 'rename': {
      const name = action.name.trim();

      const exists = state.some(
        (playlist) =>
          playlist.id !== action.id &&
          playlist.name.toLowerCase() === name.toLowerCase(),
      );

      if (!name || exists) {
        return state;
      }

      return state.map((playlist) =>
        playlist.id === action.id
          ? { ...playlist, name }
          : playlist,
      );
    }

    case 'remove':
      return state.filter((playlist) => playlist.id !== action.id);

    case 'addSong':
      return state.map((playlist) => {
        if (
          playlist.id !== action.id ||
          playlist.songIds.includes(action.songId)
        ) {
          return playlist;
        }

        return {
          ...playlist,
          songIds: [...playlist.songIds, action.songId],
        };
      });

    case 'removeSong':
      return state.map((playlist) =>
        playlist.id === action.id
          ? {
              ...playlist,
              songIds: playlist.songIds.filter(
                (songId) => songId !== action.songId,
              ),
            }
          : playlist,
      );
  }
}
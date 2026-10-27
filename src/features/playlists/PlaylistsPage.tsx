import { memo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';

import {
  usePlaylistDispatch,
  usePlaylists,
} from './PlaylistContext';

const DeletePlaylistButton = memo(function DeletePlaylistButton({
  id,
}: {
  id: string;
}) {
  const dispatch = usePlaylistDispatch();

  return (
    <button
      type="button"
      onClick={() => dispatch({ type: 'remove', id })}
    >
      Xóa
    </button>
  );
});

export default function PlaylistsPage() {
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Tên playlist không được để trống');
      return;
    }

    const exists = playlists.some(
      (playlist) =>
        playlist.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (exists) {
      setError('Tên playlist đã tồn tại');
      return;
    }

    dispatch({
      type: 'create',
      id: crypto.randomUUID(),
      name: trimmedName,
    });

    setName('');
    setError('');
  }

  return (
    <section>
      <h1>Danh sách playlist</h1>

      <form className="playlist-form" onSubmit={handleCreate}>
        <label>
          Tên playlist
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError('');
            }}
          />
        </label>

        <button type="submit">Tạo</button>
      </form>

      {error && <p role="alert">{error}</p>}

      {playlists.length === 0 ? (
        <p>Bạn chưa có playlist nào.</p>
      ) : (
        <ul className="playlist-list">
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <Link to={`/playlists/${playlist.id}`}>
                {playlist.name}
              </Link>

              <span>{playlist.songIds.length} bài</span>

              <DeletePlaylistButton id={playlist.id} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
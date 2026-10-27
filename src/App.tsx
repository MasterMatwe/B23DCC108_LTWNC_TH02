import { NavLink, Route, Routes } from 'react-router-dom';
import FavoritesPage from './features/favourites/FavoritesPage';
import LibraryPage from './features/library/LibraryPage';
import PlayerBar from './features/player/PlayerBar';

export default function App() {
  return (
    <>
      <nav aria-label="Điều hướng chính">
        <NavLink to="/" end>
          Thư viện
        </NavLink>

        <NavLink to="/favorites">
          Yêu thích
        </NavLink>

        <NavLink to="/playlists">
          Playlist
        </NavLink>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<LibraryPage />} />

          <Route
            path="/favorites"
            element={<FavoritesPage />}
          />

          <Route
            path="/playlists"
            element={<h1>Danh sách playlist</h1>}
          />

          <Route
            path="/playlists/:id"
            element={<h1>Chi tiết playlist</h1>}
          />
        </Routes>
      </main>

      <PlayerBar />
    </>
  );
}
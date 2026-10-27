import { NavLink, Route, Routes } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';

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
            element={<h1>Bài hát yêu thích</h1>}
          />

          <Route
            path="/playlists"
            element={<h1>Danh sách playlist</h1>}
          />

          <Route
            path="/playlists/:id"
            element={<h1>Chi tiết playlist — Phần 3</h1>}
          />
        </Routes>
      </main>
    </>
  );
}
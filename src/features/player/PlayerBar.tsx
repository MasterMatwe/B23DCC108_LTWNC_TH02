import { useEffect } from 'react';
import ProgressBar from './ProgressBar';
import { usePlayerStore } from './usePlayerStore';

export default function PlayerBar() {
  const currentSong = usePlayerStore(
    (state) => state.queue[state.currentIndex],
  );

  const queueLength = usePlayerStore((state) => state.queue.length);
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const next = usePlayerStore((state) => state.next);
  const prev = usePlayerStore((state) => state.prev);
  const tick = usePlayerStore((state) => state.tick);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const intervalId = window.setInterval(() => {
      tick();
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPlaying, tick]);

  return (
    <footer className="player-bar" aria-label="Trình phát nhạc">
      <div>
        <p>
          {currentSong
            ? `Đang phát: ${currentSong.title} – ${currentSong.artist}`
            : 'Chưa phát bài nào'}
        </p>

        <span>Hàng đợi: {queueLength} bài</span>
      </div>

      <div className="player-controls">
        <button
          type="button"
          onClick={prev}
          disabled={!currentSong}
        >
          Trước
        </button>

        <button
          type="button"
          onClick={togglePlay}
          disabled={queueLength === 0}
        >
          {isPlaying ? 'Tạm dừng' : 'Phát'}
        </button>

        <button
          type="button"
          onClick={next}
          disabled={!currentSong}
        >
          Sau
        </button>
      </div>

      <ProgressBar />
    </footer>
  );
}
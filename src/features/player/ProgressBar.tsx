import { formatDuration } from '../../utils/format';
import { usePlayerStore } from './usePlayerStore';

export default function ProgressBar() {
  const position = usePlayerStore((state) => state.position);

  const duration = usePlayerStore(
    (state) => state.queue[state.currentIndex]?.duration ?? 0,
  );

  const percent =
    duration === 0 ? 0 : Math.min(100, (position / duration) * 100);

  return (
    <div className="player-progress">
      <span>
        {formatDuration(position)} / {formatDuration(duration)}
      </span>

      <progress
        aria-label="Tiến trình phát nhạc"
        value={percent}
        max={100}
      />
    </div>
  );
}
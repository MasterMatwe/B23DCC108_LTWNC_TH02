import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SONGS } from '../../data/songs';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import SongRow from './SongRow';

describe('SongRow', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.setState({ ids: [] });
  });

  it('hiển thị tên bài hát và thời lượng 2:30', () => {
    render(
      <SongRow
        song={SONGS[0]}
        index={0}
        onPlay={vi.fn()}
        onAddToQueue={vi.fn()}
      />,
    );

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();
  });

  it('gọi callback Phát với đúng bài hát', async () => {
    const user = userEvent.setup();
    const onPlay = vi.fn();

    render(
      <SongRow
        song={SONGS[0]}
        index={0}
        onPlay={onPlay}
        onAddToQueue={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Phát' }));

    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onPlay).toHaveBeenCalledWith(SONGS[0]);
  });
});

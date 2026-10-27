import { create } from 'zustand';
import type { Song } from '../../types';

interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  position: number;

  playQueue: (songs: Song[], startIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  addToQueue: (song: Song) => void;
  tick: () => void;
}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  position: 0,

  playQueue: (songs, startIndex) => {
    if (songs.length === 0) {
      set({
        queue: [],
        currentIndex: -1,
        isPlaying: false,
        position: 0,
      });

      return;
    }

    if (startIndex < 0 || startIndex >= songs.length) {
      return;
    }

    set({
      queue: [...songs],
      currentIndex: startIndex,
      isPlaying: true,
      position: 0,
    });
  },

  togglePlay: () => {
    const { queue, currentIndex, isPlaying, position } = get();

    if (queue.length === 0) {
      return;
    }

    // Cho phép phát khi trước đó chỉ thêm bài vào hàng đợi.
    if (currentIndex === -1) {
      set({
        currentIndex: 0,
        position: 0,
        isPlaying: true,
      });

      return;
    }

    // Bấm Phát sau khi hàng đợi kết thúc sẽ phát lại bài cuối.
    if (!isPlaying && position >= queue[currentIndex].duration) {
      set({
        position: 0,
        isPlaying: true,
      });

      return;
    }

    set({ isPlaying: !isPlaying });
  },

  next: () => {
    const { queue, currentIndex } = get();
    const currentSong = queue[currentIndex];

    if (!currentSong) {
      return;
    }

    if (currentIndex === queue.length - 1) {
      set({
        isPlaying: false,
        position: currentSong.duration,
      });

      return;
    }

    set({
      currentIndex: currentIndex + 1,
      position: 0,
    });
  },

  prev: () => {
    const { currentIndex, position } = get();

    if (currentIndex === -1) {
      return;
    }

    if (position > 3) {
      set({ position: 0 });
      return;
    }

    set({
      currentIndex: Math.max(0, currentIndex - 1),
      position: 0,
    });
  },

  addToQueue: (song) => {
    const { queue } = get();

    if (queue.some((item) => item.id === song.id)) {
      return;
    }

    set({ queue: [...queue, song] });
  },

  tick: () => {
    const { queue, currentIndex, isPlaying, position } = get();
    const currentSong = queue[currentIndex];

    if (!isPlaying || !currentSong) {
      return;
    }

    if (position + 1 >= currentSong.duration) {
      get().next();
      return;
    }

    set({ position: position + 1 });
  },
}));
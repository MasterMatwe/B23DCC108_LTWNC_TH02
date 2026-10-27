import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PlaylistProvider } from './PlaylistContext';
import PlaylistsPage from './PlaylistsPage';

function renderWithProviders() {
  return render(
    <MemoryRouter>
      <PlaylistProvider>
        <PlaylistsPage />
      </PlaylistProvider>
    </MemoryRouter>,
  );
}

describe('PlaylistsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('báo lỗi khi bấm Tạo với tên playlist trống', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.click(screen.getByRole('button', { name: 'Tạo' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Tên playlist không được để trống',
    );
  });

  it('hiển thị playlist sau khi nhập tên và bấm Tạo', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.type(
      screen.getByRole('textbox', { name: 'Tên playlist' }),
      'Chạy bộ',
    );
    await user.click(screen.getByRole('button', { name: 'Tạo' }));

    expect(screen.getByRole('link', { name: 'Chạy bộ' })).toBeInTheDocument();
    expect(screen.getByText('0 bài')).toBeInTheDocument();
  });
});

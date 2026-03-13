import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import { useUser } from '../contexts/UserContext';

vi.mock('../contexts/UserContext');

describe('DashboardPage', () => {
  const mockLogout = vi.fn();

  function renderWithRouter() {
    return render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>,
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
    (useUser as vi.Mock).mockReturnValue({
      user: { name: 'Thomas' },
      logout: mockLogout,
    });
  });

  it('renders the dashboard title and user name', () => {
    renderWithRouter();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Hello, Thomas')).toBeInTheDocument();
  });

  it('calls logout() when clicking the Logout button', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('navigates back to home when clicking Back to Shop', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const backLink = screen.getByRole('link', { name: /back to shop/i });
    await user.click(backLink);

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});

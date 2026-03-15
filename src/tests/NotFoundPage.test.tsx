import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage';

describe('NotFoundPage', () => {
  function renderWithRouter() {
    return render(
      <MemoryRouter initialEntries={['/does-not-exist']}>
        <Routes>
          <Route path="/does-not-exist" element={<NotFoundPage />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>,
    );
  }

  it('renders the 404 image', () => {
    renderWithRouter();
    const lottie = screen.getByTestId("mock-lottie");
    expect(lottie).toBeInTheDocument();

  });

  it('renders the not found message', () => {
    renderWithRouter();

    expect(
      screen.getByText("Oops… This page doesn't exist."),
    ).toBeInTheDocument();
  });

  it('renders Back to Shop link', () => {
    renderWithRouter();

    const link = screen.getByRole('link', { name: /back to shop/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('navigates back to home when clicking Back to Shop', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const link = screen.getByRole('link', { name: /back to shop/i });
    await user.click(link);

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});

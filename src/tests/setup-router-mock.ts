import { vi } from 'vitest';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    createBrowserRouter: (routes, opts) => {
      return actual.createMemoryRouter(routes, {
        initialEntries: ['/'],
        ...opts,
      });
    },
  };
});

export {};

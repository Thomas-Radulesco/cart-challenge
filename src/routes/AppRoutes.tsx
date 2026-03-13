import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import HomePage from '../pages/HomePage';
import CartPage from '../pages/CartPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import { BottomNav } from '../components/navbar/BottomNav';
import { PageContainer } from '../components/layout/Layout.styles';
import { ProductPage } from '../pages/ProductPage';
import { NotFoundPage } from '../pages/NotFoundPage';

function Layout() {
  return (
    <>
      <Navbar />
      <BottomNav />
      <PageContainer>
        <Outlet />
      </PageContainer>
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: 'category/:name',
        element: <HomePage />,
      },
      { path: '/cart', element: <CartPage /> },
      { path: '/login', element: <LoginPage /> },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/search',
        element: <HomePage />,
      },
      {
        path: '/product/:id',
        element: <ProductPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}

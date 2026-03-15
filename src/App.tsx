import AppRoutes from './routes/AppRoutes';
import { ProductsProvider } from './contexts/ProductsContext';
import { CategoriesProvider } from './contexts/CategoriesContext';

export default function App() {
  return (  
    <ProductsProvider>
      <CategoriesProvider>
        <AppRoutes />
      </CategoriesProvider>
    </ProductsProvider>
  );
}

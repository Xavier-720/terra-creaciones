import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAdmin from './components/RequireAdmin';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/admin/AdminPage';

// Muestra la página que corresponde a la dirección del navegador.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="categoria/:slug" element={<CategoryPage />} />
        <Route path="producto/:slug" element={<ProductPage />} />
        <Route path="ingresar" element={<LoginPage />} />
        <Route path="admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
        <Route path="*" element={<p className="status">No encontramos esa página.</p>} />
      </Route>
    </Routes>
  );
}

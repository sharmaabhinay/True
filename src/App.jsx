import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setProducts } from './store/slices/productsSlice';
import StorePage   from './pages/StorePage';
import AdminPage   from './pages/AdminPage';
import ProductPage from './pages/ProductPage';

function AppRoutes() {
  const dispatch = useDispatch();

  // Keep Redux products in sync if admin edits in another tab
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'tf_products' && e.newValue) {
        try { dispatch(setProducts(JSON.parse(e.newValue))); } catch {}
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/"            element={<StorePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/admin"       element={<AdminPage />} />
      <Route path="*"            element={<StorePage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

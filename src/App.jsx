import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setProducts } from './store/slices/productsSlice';
import StorePage   from './pages/StorePage';
import AdminPage   from './pages/AdminPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankYouPage';
import StaticPage from './pages/StaticPage';
import TrackOrderPage from './pages/TrackOrderPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';

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
      <Route path="/checkout"    element={<CheckoutPage />} />
      <Route path="/thank-you"   element={<ThankYouPage />} />
      <Route path="/about-us"    element={<StaticPage pageKey="about" />} />
      <Route path="/track-order" element={<TrackOrderPage />} />
      <Route path="/careers"     element={<StaticPage pageKey="careers" />} />
      <Route path="/privacy-policy" element={<StaticPage pageKey="privacy" />} />
      <Route path="/terms-and-conditions" element={<StaticPage pageKey="terms" />} />
      <Route path="/wishlist"    element={<WishlistPage />} />
      <Route path="/my-orders"   element={<OrdersPage />} />
      <Route path="/profile"     element={<ProfilePage />} />
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

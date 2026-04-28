import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setProducts } from './store/slices/productsSlice';

// Pages
import StorePage    from './pages/StorePage';
import ProductPage  from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankYouPage';
import WishlistPage from './pages/WishlistPage';
import TrackOrder   from './pages/static/TrackOrder';
import AboutUs      from './pages/static/AboutUs';
import Careers      from './pages/static/Careers';
import Privacy      from './pages/static/Privacy';
import Terms        from './pages/static/Terms';
import AdminPage    from './pages/AdminPage';
import AdminCustomerDetail from './pages/admin/AdminCustomerDetail';
import AdminOrderDetail    from './pages/admin/AdminOrderDetail';

// Auth modal (global)
import AuthModal from './components/common/AuthModal';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
}

function AppRoutes() {
  const dispatch = useDispatch();

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
    <>
      <ScrollToTop />
      <AuthModal />
      <Routes>
        {/* Store */}
        <Route path="/"               element={<StorePage />} />
        <Route path="/product/:id"    element={<ProductPage />} />
        <Route path="/checkout"       element={<CheckoutPage />} />
        <Route path="/thank-you"      element={<ThankYouPage />} />
        <Route path="/wishlist"       element={<WishlistPage />} />

        {/* Static pages */}
        <Route path="/about"          element={<AboutUs />} />
        <Route path="/track-order"    element={<TrackOrder />} />
        <Route path="/careers"        element={<Careers />} />
        <Route path="/privacy"        element={<Privacy />} />
        <Route path="/terms"          element={<Terms />} />

        {/* Admin */}
        <Route path="/admin"                          element={<AdminPage />} />
        <Route path="/admin/customers/:id"            element={<AdminCustomerDetail />} />
        <Route path="/admin/orders/:id"               element={<AdminOrderDetail />} />

        <Route path="*"               element={<StorePage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

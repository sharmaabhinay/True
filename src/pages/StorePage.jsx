import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { hideLoader } from '../store/slices/uiSlice';
import { pushEvent } from '../store/slices/visitorSlice';
import { FETCH_LOCATION } from '../store/sagas/locationSaga';
import { openAuthModal, selectIsCustomerAuthenticated } from '../store/slices/customerSlice';

// Layout
import Navbar         from '../components/layout/Navbar';
import Footer         from '../components/layout/Footer';
import Loader         from '../components/layout/Loader';
import Toast          from '../components/layout/Toast';

// Common
import LocationStrip  from '../components/common/LocationStrip';
import ContactBar     from '../components/common/ContactBar';
import AuthModal      from '../components/common/AuthModal';
import CartDrawer     from '../components/common/CartDrawer';
import QuoteModal     from '../components/common/QuoteModal';
import QuotePopup     from '../components/common/QuotePopup';

// Store sections
import Hero           from '../components/store/Hero';
import Categories     from '../components/store/Categories';
import ModelViewer    from '../components/store/ModelViewer';
import Products       from '../components/store/Products';
import WhyUs          from '../components/store/WhyUs';
import Testimonials   from '../components/store/Testimonials';
import RoomPlanner    from '../components/store/RoomPlanner';
import EMICalculator  from '../components/store/EMICalculator';
import Newsletter     from '../components/store/Newsletter';

export default function StorePage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsCustomerAuthenticated);

  useEffect(() => {
    // Hide loader after 2.4s
    const t = setTimeout(() => dispatch(hideLoader()), 2400);

    // Kick off location saga
    dispatch(FETCH_LOCATION);

    // Track session
    dispatch(pushEvent({
      type: 'session',
      ua:   navigator.userAgent,
      screen: `${window.screen.width}x${window.screen.height}`,
      ref:  document.referrer || 'direct',
      page: '/',
    }));

    return () => clearTimeout(t);
  }, [dispatch]);

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    const target = document.getElementById(id);
    if (!target) return;

    const timer = window.setTimeout(() => {
      const top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [location.hash]);

  useEffect(() => {
    if (isAuthenticated || sessionStorage.getItem('tf_auth_prompt_seen') === 'true') return;
    const timer = window.setTimeout(() => {
      dispatch(openAuthModal({ mode: 'signup' }));
      sessionStorage.setItem('tf_auth_prompt_seen', 'true');
    }, 900);
    return () => window.clearTimeout(timer);
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <Loader />
      <Toast />
      <AuthModal />
      <QuotePopup />
      <CartDrawer />
      <QuoteModal />

      <LocationStrip />
      <Navbar />

      <main>
        <Hero />
        <ContactBar />
        <Categories />
        <ModelViewer />
        <Products />
        <WhyUs />
        <Testimonials />
        <RoomPlanner />
        <EMICalculator />
        <Newsletter />
      </main>

      <Footer />
    </>
  );
}

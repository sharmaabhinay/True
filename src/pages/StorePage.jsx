import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideLoader } from '../store/slices/uiSlice';
import { pushEvent } from '../store/slices/visitorSlice';
import { FETCH_LOCATION } from '../store/sagas/locationSaga';

// Layout
import Navbar         from '../components/layout/Navbar';
import Footer         from '../components/layout/Footer';
import Loader         from '../components/layout/Loader';
import Toast          from '../components/layout/Toast';

// Common
import LocationStrip  from '../components/common/LocationStrip';
import ContactBar     from '../components/common/ContactBar';
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

  return (
    <>
      <Loader />
      <Toast />
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

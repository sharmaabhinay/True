import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AuthModal from '../components/common/AuthModal';
import ProductCard from '../components/store/ProductCard';
import { openAuthModal, selectCustomerWishlist, selectIsCustomerAuthenticated } from '../store/slices/customerSlice';
import { selectAllProducts } from '../store/slices/productsSlice';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlistIds = useSelector(selectCustomerWishlist);
  const products = useSelector(selectAllProducts);
  const isAuthenticated = useSelector(selectIsCustomerAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) dispatch(openAuthModal({ mode: 'login', redirectTo: '/wishlist' }));
  }, [dispatch, isAuthenticated]);

  const wishlistProducts = useMemo(() => products.filter((product) => wishlistIds.includes(product.id)), [products, wishlistIds]);

  return (
    <>
      <Navbar />
      <AuthModal />
      <main className="pt-[84px] min-h-screen bg-cream px-6 md:px-12 lg:px-16 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-bark text-[0.72rem] tracking-[0.22em] uppercase mb-3">Wishlist</p>
            <h1 className="font-cormorant text-4xl md:text-5xl text-deep font-light">Saved furniture picks</h1>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="rounded-[2rem] border border-warm bg-white px-8 py-12 text-center text-muted text-sm">
              Your wishlist is empty right now. Save your favorite pieces to compare them later.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

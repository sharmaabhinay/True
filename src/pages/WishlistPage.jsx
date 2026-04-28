import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { selectAllProducts, toggleWishlist, selectWishlist } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { inr } from '../utils/formatters';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const wishlist   = useSelector(selectWishlist);
  const allProducts= useSelector(selectAllProducts);
  const wished     = allProducts.filter(p => wishlist.includes(p.id));

  const handleRemove = (id) => { dispatch(toggleWishlist(id)); toast.success('Removed from wishlist'); };
  const handleAdd    = (p)  => { dispatch(addToCart(p)); toast.success(`${p.name} added to cart!`); };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ivory pt-[68px] font-dm">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
          <div className="mb-8">
            <p className="text-bark text-[0.7rem] tracking-[0.15em] uppercase mb-1">My Account</p>
            <h1 className="font-cormorant font-light text-deep text-3xl md:text-4xl flex items-center gap-3">
              <FiHeart className="text-red-500 fill-red-500" size={28}/> My Wishlist
            </h1>
            <p className="text-muted text-sm mt-1">{wished.length} item{wished.length !== 1 ? 's' : ''} saved</p>
          </div>

          {wished.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <FiHeart size={48} className="text-warm" />
              <h2 className="font-cormorant text-2xl text-deep">Your wishlist is empty</h2>
              <p className="text-muted text-sm">Save items you love and come back to them later.</p>
              <button onClick={() => navigate('/')}
                      className="mt-2 bg-deep text-cream px-6 py-3 rounded-xl text-sm hover:bg-wood transition-colors border-none cursor-pointer">
                Explore Collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wished.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl border border-warm overflow-hidden group hover:-translate-y-1 hover:shadow-warm-md transition-all duration-300"
                >
                  <div className="relative h-52 overflow-hidden bg-warm cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                    <img src={p.img} alt={p.name}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                         onError={e=>e.target.style.display='none'} />
                    <button
                      onClick={e => { e.stopPropagation(); handleRemove(p.id); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center
                                 shadow-warm-sm hover:bg-red-50 hover:text-red-500 transition-all border-none cursor-pointer text-muted"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-muted text-[0.7rem] mb-0.5">{p.cat}</p>
                    <p className="font-cormorant font-semibold text-deep text-lg cursor-pointer hover:text-bark transition-colors"
                       onClick={() => navigate(`/product/${p.id}`)}>{p.name}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-cormorant font-semibold text-bark text-xl">{inr(p.price)}</span>
                      <button
                        onClick={() => handleAdd(p)}
                        className="flex items-center gap-1.5 bg-deep text-cream text-xs px-3 py-2 rounded-lg hover:bg-wood transition-colors border-none cursor-pointer"
                      >
                        <FiShoppingCart size={13}/> Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

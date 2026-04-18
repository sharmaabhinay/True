import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { addToCart } from '../../store/slices/cartSlice';
import { showToast } from '../../store/slices/uiSlice';
import { openAuthModal, selectCustomerWishlist, selectIsCustomerAuthenticated, toggleWishlist } from '../../store/slices/customerSlice';
import { inr, stars } from '../../utils/formatters';
import Badge from '../ui/Badge';

export default function ProductCard({ product }) {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const wishlist  = useSelector(selectCustomerWishlist);
  const isAuthenticated = useSelector(selectIsCustomerAuthenticated);
  const [added, setAdded] = useState(false);
  const isWished  = wishlist.includes(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWish = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      dispatch(openAuthModal({ mode: 'login', redirectTo: `/product/${product.id}` }));
      dispatch(showToast('Login to save items to your wishlist.'));
      return;
    }
    dispatch(toggleWishlist(product.id));
    dispatch(showToast(isWished ? 'Removed from wishlist' : 'Added to wishlist.'));
  };

  const handleClick = () => navigate(`/product/${product.id}`);

  return (
    <article
      onClick={handleClick}
      className="bg-white rounded-[20px] overflow-hidden cursor-pointer
                 border border-warm/60 transition-all duration-300
                 hover:-translate-y-2 hover:shadow-warm-lg group"
      role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      aria-label={`${product.name} — ${inr(product.price)}`}
    >
      {/* Image */}
      <div className="relative h-[280px] bg-warm overflow-hidden">
        <img
          src={product.img}
          alt={`${product.name} – True Furnitures Indore`}
          loading="lazy"
          onError={e => e.target.style.display='none'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge type={product.badgeType}>{product.badge}</Badge>
          </div>
        )}
        {/* 3D model indicator */}
        {product.modelData && (
          <div className="absolute bottom-3 left-3 bg-deep/70 text-cream text-[0.6rem] px-2 py-0.5 rounded-full backdrop-blur-sm">
            3D
          </div>
        )}
        <button
          onClick={handleWish}
          aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center
                     shadow-warm-sm hover:scale-110 transition-transform border-none cursor-pointer text-base"
        >
          <FiHeart className={isWished ? 'text-red-500 fill-current' : ''} />
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-muted text-[0.72rem] mb-1">{product.cat}</p>
        <h3 className="font-cormorant font-semibold text-deep text-xl leading-snug mb-2">{product.name}</h3>
        <div className="text-muted text-[0.75rem] mb-4">
          {stars(product.rating)} <span className="ml-1">({product.reviews} reviews)</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-cormorant font-semibold text-bark text-2xl">{inr(product.price)}</span>
            {product.oldPrice && (
              <span className="text-muted text-[0.8rem] line-through">{inr(product.oldPrice)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={`text-[0.78rem] font-dm font-medium px-4 py-2.5 rounded-lg border-none cursor-pointer
                        transition-all active:scale-95 whitespace-nowrap
                        ${added ? 'bg-sage text-white' : 'bg-deep text-cream hover:bg-wood'}`}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}

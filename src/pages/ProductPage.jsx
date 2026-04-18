import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiCalendar, FiCheckCircle, FiHeart, FiImage, FiLayers, FiMessageSquare, FiShoppingBag, FiTruck, FiTool } from 'react-icons/fi';
import { selectAllProducts } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { openQuoteModal, showToast } from '../store/slices/uiSlice';
import { pushEvent } from '../store/slices/visitorSlice';
import { openAuthModal, selectCustomerWishlist, selectIsCustomerAuthenticated, toggleWishlist } from '../store/slices/customerSlice';
import { use3DCanvas } from '../hooks/use3DCanvas';
import { drawSofa, drawAlmirah, drawBed, drawChair, drawOBJModel, parseOBJ } from '../utils/engine3d';
import { PRODUCT_REVIEWS } from '../data/products';
import { COLOUR_OPTIONS } from '../data/constants';
import { inr } from '../utils/formatters';
import Navbar     from '../components/layout/Navbar';
import Footer     from '../components/layout/Footer';
import Toast      from '../components/layout/Toast';
import CartDrawer from '../components/common/CartDrawer';
import QuoteModal from '../components/common/QuoteModal';
import AuthModal  from '../components/common/AuthModal';
import Badge      from '../components/ui/Badge';

/* ─── map modelType → draw function ─────────────────────────── */
const DRAW = {
  sofa:    (ctx,cx,cy,rx,ry,c) => drawSofa(ctx,cx,cy,rx,ry,c),
  almirah: (ctx,cx,cy,rx,ry,c) => drawAlmirah(ctx,cx,cy,rx,ry,c),
  bed:     (ctx,cx,cy,rx,ry,c) => drawBed(ctx,cx,cy,rx,ry,c),
  chair:   (ctx,cx,cy,rx,ry,c) => drawChair(ctx,cx,cy,rx,ry,c),
  table:   (ctx,cx,cy,rx,ry,c) => drawSofa(ctx,cx,cy,rx,ry,c),
  shelf:   (ctx,cx,cy,rx,ry,c) => drawAlmirah(ctx,cx,cy,rx,ry,c),
  desk:    (ctx,cx,cy,rx,ry,c) => drawBed(ctx,cx,cy,rx,ry,c),
};

/* ─── useSEO : update <title> + meta description per product ── */
function useSEO(product, price) {
  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} | True Furnitures Indore`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name = 'description'; document.head.appendChild(metaDesc); }
    metaDesc.content = `${product.desc} Buy ${product.name} at True Furnitures Indore. Starting ₹${price?.toLocaleString('en-IN')}. Free delivery. Call 7773896496.`;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) { canonicalLink = document.createElement('link'); canonicalLink.rel = 'canonical'; document.head.appendChild(canonicalLink); }
    canonicalLink.href = `https://truefurnitures.in/product/${product.id}`;

    // Product structured data (JSON-LD)
    let ldScript = document.getElementById('product-ld');
    if (!ldScript) { ldScript = document.createElement('script'); ldScript.id = 'product-ld'; ldScript.type = 'application/ld+json'; document.head.appendChild(ldScript); }
    ldScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.desc,
      image: product.gallery?.[0] || product.img,
      sku: product.sku,
      brand: { '@type': 'Brand', name: 'True Furnitures' },
      offers: { '@type': 'Offer', priceCurrency: 'INR', price, availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: 'True Furnitures Indore' } },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviews },
    });

    return () => {
      document.title = 'True Furnitures Indore | Best Furniture Shop | Sofa, Almirah, Bed';
      if (ldScript) ldScript.remove();
    };
  }, [product, price]);
}

/* ─── StarRating ─────────────────────────────────────────────── */
function StarRating({ rating, size = 'text-sm' }) {
  return (
    <span className={`${size} text-gold`}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </span>
  );
}

/* ─── ImageGallery ───────────────────────────────────────────── */
function ImageGallery({ images = [], name }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom]     = useState(false);

  const prev = (e) => { e?.stopPropagation(); setActive(a => (a - 1 + images.length) % images.length); };
  const next = (e) => { e?.stopPropagation(); setActive(a => (a + 1) % images.length); };

  // Keyboard navigation inside lightbox
  useEffect(() => {
    if (!zoom) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     setZoom(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [zoom, images.length]);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative overflow-hidden rounded-2xl bg-warm cursor-zoom-in group"
        style={{ aspectRatio: '4/3' }}
        onClick={() => setZoom(true)}
      >
        <img
          src={images[active]}
          alt={`${name} — view ${active + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="eager"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85'; }}
        />
        {/* Counter */}
        <div className="absolute bottom-3 right-3 bg-deep/60 text-cream text-xs px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
          {active + 1} / {images.length}
        </div>
        {/* Zoom hint */}
        <div className="absolute top-3 right-3 bg-white/80 text-deep text-xs px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          🔍 Click to zoom
        </div>
        {/* Prev / Next arrows on hover */}
        {images.length > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); prev(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-deep text-lg border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-all shadow-warm-sm">
              ‹
            </button>
            <button onClick={e => { e.stopPropagation(); next(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-deep text-lg border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-all shadow-warm-sm">
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer
                        ${active === i ? 'border-bark scale-[1.05]' : 'border-transparent opacity-60 hover:opacity-100 hover:border-warm'}`}
          >
            <img src={src} alt={`${name} thumbnail ${i + 1}`} className="w-full h-full object-cover"
                 onError={e => e.target.style.display = 'none'} />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {zoom && (
        <div
          className="fixed inset-0 z-[950] bg-black/92 flex items-center justify-center p-4"
          onClick={() => setZoom(false)}
        >
          <button className="absolute top-4 right-5 text-white text-4xl bg-transparent border-none cursor-pointer z-10 leading-none hover:text-gold transition-colors">
            ×
          </button>
          <button onClick={prev}
                  className="absolute left-4 md:left-8 text-white text-4xl bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center border-none cursor-pointer transition-colors flex-shrink-0">
            ‹
          </button>
          <img
            src={images[active]}
            alt={`${name} zoomed`}
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-warm-lg"
            onClick={e => e.stopPropagation()}
            onError={e => e.target.style.display = 'none'}
          />
          <button onClick={next}
                  className="absolute right-4 md:right-8 text-white text-4xl bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center border-none cursor-pointer transition-colors flex-shrink-0">
            ›
          </button>
          {/* Thumbnail strip inside lightbox */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setActive(i); }}
                className={`w-2 h-2 rounded-full border-none cursor-pointer transition-all
                            ${i === active ? 'bg-gold scale-125' : 'bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Model3DPanel ───────────────────────────────────────────── */
function Model3DPanel({ product, selectedColor }) {
  const drawFn = DRAW[product.modelType] || DRAW.sofa;
  const { canvasRef } = use3DCanvas(
    (ctx, cx, cy, rx, ry) => {
      if (product.modelData) drawOBJModel(ctx, cx, cy, rx, ry, parseOBJ(product.modelData), selectedColor);
      else drawFn(ctx, cx, cy, rx, ry, selectedColor);
    },
    [product.id, selectedColor, product.modelData]
  );

  return (
    <div className="bg-cream rounded-2xl p-4 relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
      <div
        className="absolute bottom-0 left-[15%] right-[15%] h-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(44,31,18,0.08) 0%, transparent 70%)' }}
      />
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 text-muted text-[0.65rem] px-3 py-1 rounded-full whitespace-nowrap pointer-events-none">
        ↺ Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}

/* ─── ReviewCard ─────────────────────────────────────────────── */
function ReviewCard({ review }) {
  return (
    <div className="bg-cream rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bark flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            {review.initials}
          </div>
          <div>
            <p className="text-deep text-sm font-medium">{review.name}</p>
            <p className="text-muted text-[0.7rem]">📍 {review.city} · {review.date}</p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-deep/80 text-sm leading-relaxed">{review.text}</p>
    </div>
  );
}

/* ─── RelatedCard ────────────────────────────────────────────── */
function RelatedCard({ product, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl overflow-hidden border border-warm/60 hover:-translate-y-1 hover:shadow-warm-md transition-all duration-300 cursor-pointer group w-full"
    >
      <div className="overflow-hidden bg-warm" style={{ aspectRatio: '4/3' }}>
        <img src={product.img} alt={product.name}
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
             loading="lazy" onError={e => e.target.style.display = 'none'} />
      </div>
      <div className="p-4">
        <p className="text-muted text-[0.7rem] mb-1">{product.cat}</p>
        <p className="font-cormorant font-semibold text-deep text-lg leading-snug mb-1">{product.name}</p>
        <p className="font-cormorant font-semibold text-bark text-xl">{inr(product.price)}</p>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PRODUCT PAGE
══════════════════════════════════════════════════════════════ */
export default function ProductPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const allProducts = useSelector(selectAllProducts);
  const wishlist    = useSelector(selectCustomerWishlist);
  const isAuthenticated = useSelector(selectIsCustomerAuthenticated);

  const product = useMemo(
    () => allProducts.find(p => String(p.id) === String(id)),
    [allProducts, id]
  );

  const [selectedSize,  setSelectedSize]  = useState(null);
  const [selectedColor, setSelectedColor] = useState('#8B6B4A');
  const [activeTab,     setActiveTab]     = useState('description');
  const [viewMode,      setViewMode]      = useState('image'); // 'image' | '3d'
  const [added,         setAdded]         = useState(false);
  const isWished = wishlist.includes(Number(id)) || wishlist.includes(product?.id);

  // Resolved price based on selected size
  const price = useMemo(() => {
    if (selectedSize && product?.sizes?.[selectedSize]) return product.sizes[selectedSize];
    return product?.price ?? 0;
  }, [selectedSize, product]);

  // SEO (no external dependency)
  useSEO(product, price);

  // Set default size when product loads
  useEffect(() => {
    if (product?.sizes) {
      const firstSize = Object.keys(product.sizes)[0];
      setSelectedSize(firstSize);
    }
    setViewMode('image');
    setActiveTab('description');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, product?.id]);

  // Track page view
  useEffect(() => {
    if (product) {
      dispatch(pushEvent({ type: 'view_3d', item: product.name, page: `/product/${id}` }));
    }
  }, [id, product, dispatch]);

  // Related products (same category, exclude current, max 4)
  const related = useMemo(
    () => allProducts.filter(p => p.active !== false && p.id !== product?.id && p.cat === product?.cat).slice(0, 4),
    [allProducts, product]
  );

  /* ── 404 ── */
  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-ivory flex flex-col items-center justify-center gap-4 pt-[68px]">
          <p className="text-6xl">🛋️</p>
          <h2 className="font-cormorant text-2xl text-deep">Product not found</h2>
          <p className="text-muted text-sm">The product you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')}
                  className="text-bark underline text-sm cursor-pointer bg-transparent border-none mt-2 hover:text-wood transition-colors">
            ← Back to store
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const sizes = product.sizes ? Object.entries(product.sizes) : [];

  const handleAddToCart = () => {
    dispatch(addToCart({
      id:    product.id,
      cartKey: `${product.id}-${selectedSize || 'base'}`,
      name:  selectedSize ? `${product.name} (${selectedSize})` : product.name,
      img:   product.img,
      price,
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal({ mode: 'login', redirectTo: `/product/${product.id}` }));
      dispatch(showToast('Login to save this item to your wishlist.'));
      return;
    }
    dispatch(toggleWishlist(product.id));
    dispatch(showToast(isWished ? 'Removed from wishlist.' : 'Added to wishlist.'));
  };

  /* ── RENDER ── */
  return (
    <>
      <Toast />
      <CartDrawer />
      <QuoteModal />
      <AuthModal />
      <Navbar />

      <main className="pt-[68px] bg-ivory min-h-screen font-dm">

        {/* ── Breadcrumb ── */}
        <nav className="px-6 md:px-12 lg:px-16 py-4 text-sm text-muted flex items-center gap-2 flex-wrap"
             aria-label="Breadcrumb">
          <button onClick={() => navigate('/')}
                  className="hover:text-bark transition-colors bg-transparent border-none cursor-pointer">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('/')}
                  className="hover:text-bark transition-colors bg-transparent border-none cursor-pointer">
            {product.cat}
          </button>
          <span>/</span>
          <span className="text-deep font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="px-6 md:px-12 lg:px-16 pb-20">

          {/* ══════════ TOP: Media + Info ══════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

            {/* LEFT — Media */}
            <div>
              {/* View toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setViewMode('image')}
                  className={`px-4 py-2 rounded-xl text-sm border-2 transition-all cursor-pointer font-dm
                              ${viewMode === 'image'
                                ? 'bg-deep text-cream border-deep'
                                : 'bg-transparent border-warm text-muted hover:border-deep hover:text-deep'}`}
                >
                  <span className="inline-flex items-center gap-2"><FiImage /> Photos</span>
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-4 py-2 rounded-xl text-sm border-2 transition-all cursor-pointer font-dm
                              ${viewMode === '3d'
                                ? 'bg-deep text-cream border-deep'
                                : 'bg-transparent border-warm text-muted hover:border-deep hover:text-deep'}`}
                >
                  <span className="inline-flex items-center gap-2"><FiLayers /> 3D View</span>
                </button>
              </div>

              {viewMode === 'image'
                ? <ImageGallery images={product.gallery || [product.img]} name={product.name} />
                : <Model3DPanel product={product} selectedColor={selectedColor} />
              }
            </div>

            {/* RIGHT — Info */}
            <div className="flex flex-col gap-5">

              {/* Badge + Title + Rating */}
              <div>
                {product.badge && (
                  <div className="mb-3">
                    <Badge type={product.badgeType}>{product.badge}</Badge>
                  </div>
                )}
                <h1 className="font-cormorant font-light text-deep leading-tight mb-3
                               text-3xl md:text-4xl xl:text-[2.8rem]">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <StarRating rating={product.rating} size="text-base" />
                  <span className="text-muted text-sm">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                  <span className="text-muted text-xs">|</span>
                  <span className="text-sage text-xs font-medium bg-sage/10 px-2 py-0.5 rounded-full">
                    ✓ In Stock
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-cormorant font-semibold text-bark text-4xl">{inr(price)}</span>
                {product.oldPrice && (
                  <>
                    <span className="text-muted line-through text-lg font-cormorant">{inr(product.oldPrice)}</span>
                    <span className="text-sage text-sm font-medium bg-sage/10 px-2.5 py-0.5 rounded-full">
                      Save {inr(product.oldPrice - price)}
                    </span>
                  </>
                )}
              </div>

              {/* Short description */}
              <p className="text-muted text-sm leading-relaxed border-t border-warm pt-4">
                {product.desc}
              </p>

              {/* Size selector */}
              {sizes.length > 0 && (
                <div>
                  <h3 className="text-muted text-[0.72rem] uppercase tracking-[0.1em] mb-2">
                    Size — <span className="text-bark normal-case font-medium">{selectedSize}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(([s, p]) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 rounded-xl text-sm border-2 transition-all cursor-pointer font-dm
                                    ${selectedSize === s
                                      ? 'border-bark bg-bark text-white'
                                      : 'border-warm text-deep hover:border-bark'}`}
                      >
                        {s}
                        <span className={`ml-1 text-xs ${selectedSize === s ? 'text-white/70' : 'text-muted'}`}>
                          {inr(p)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colour selector */}
              <div>
                <h3 className="text-muted text-[0.72rem] uppercase tracking-[0.1em] mb-2">
                  Colour — <span className="text-deep normal-case font-medium">
                    {COLOUR_OPTIONS.find(c => c.hex === selectedColor)?.label || 'Walnut'}
                  </span>
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {COLOUR_OPTIONS.map(c => (
                    <button
                      key={c.hex}
                      title={c.label}
                      aria-label={`Select colour ${c.label}`}
                      onClick={() => setSelectedColor(c.hex)}
                      className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer
                                  ${selectedColor === c.hex
                                    ? 'border-bark scale-110 shadow-warm-sm'
                                    : 'border-transparent hover:border-bark hover:scale-105'}`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 rounded-xl text-sm font-dm font-medium transition-all border-none cursor-pointer
                              ${added
                                ? 'bg-sage text-white'
                                : 'bg-deep text-cream hover:bg-wood active:scale-[0.98]'}`}
                >
                  <span className="inline-flex items-center gap-2 justify-center">{added ? <FiCheckCircle /> : <FiShoppingBag />}{added ? 'Added to Cart' : 'Add to Cart'}</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 rounded-xl text-sm font-dm font-medium border-2 border-bark text-bark
                             hover:bg-bark hover:text-white transition-all cursor-pointer bg-transparent active:scale-[0.98]"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleWishlist}
                  title="Save to wishlist"
                  className={`sm:w-auto px-5 py-4 rounded-xl text-sm font-dm font-medium border-2 transition-all cursor-pointer bg-transparent ${isWished ? 'border-bark text-bark' : 'border-warm text-muted hover:border-bark hover:text-bark'}`}
                >
                  <FiHeart className={isWished ? 'fill-current' : ''} />
                </button>
                <button
                  onClick={() => dispatch(openQuoteModal())}
                  title="Get a custom quote"
                  className="sm:w-auto px-5 py-4 rounded-xl text-sm font-dm font-medium border-2 border-warm text-muted
                             hover:border-bark hover:text-bark transition-all cursor-pointer bg-transparent"
                >
                  <FiMessageSquare />
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-1 border-t border-warm">
                {[
                  [<FiTruck />, 'Free Delivery', 'In Indore & MP'],
                  [<FiTool />, 'Free Assembly', 'By our team'],
                  [<FiCheckCircle />, product.specs?.Warranty || '5-Year Warranty', 'Structural coverage'],
                ].map(([icon, title, sub]) => (
                  <div key={title} className="text-center p-3 bg-cream rounded-xl">
                    <span className="text-xl inline-flex justify-center mb-1">{icon}</span>
                    <p className="text-deep text-[0.72rem] font-medium leading-tight">{title}</p>
                    <p className="text-muted text-[0.65rem] mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Delivery estimate + SKU */}
              <div className="flex items-center gap-2 text-sm text-muted">
                <span><FiCalendar /></span>
                <span>
                  Estimated delivery: <strong className="text-deep">{product.deliveryDays || '7–12 working days'}</strong>
                </span>
              </div>
              {product.sku && (
                <p className="text-muted text-xs">SKU: {product.sku}</p>
              )}
            </div>
          </div>

          {/* ══════════ TABS: Description / Specs / Features / Delivery ══════════ */}
          <div className="mt-16">
            <div className="flex border-b-2 border-warm mb-8 overflow-x-auto gap-0" role="tablist">
              {[
                { id: 'description',    label: 'Description'       },
                { id: 'specifications', label: 'Specifications'    },
                { id: 'features',       label: 'Features'          },
                { id: 'delivery',       label: 'Delivery & Returns'},
              ].map(t => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={activeTab === t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-5 py-3 text-sm font-dm whitespace-nowrap border-none cursor-pointer bg-transparent
                              border-b-2 -mb-0.5 transition-all
                              ${activeTab === t.id
                                ? 'text-bark border-bark'
                                : 'text-muted border-transparent hover:text-deep'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Description */}
            {activeTab === 'description' && (
              <div className="max-w-3xl">
                <p className="text-deep/80 text-base leading-relaxed">
                  {product.longDesc || product.desc}
                </p>
              </div>
            )}

            {/* Specifications */}
            {activeTab === 'specifications' && product.specs && (
              <div className="max-w-2xl">
                <div className="rounded-2xl overflow-hidden border border-warm">
                  {Object.entries(product.specs).map(([k, v], i) => (
                    <div
                      key={k}
                      className={`flex justify-between gap-4 px-6 py-3.5
                                  ${i % 2 === 0 ? 'bg-ivory' : 'bg-cream'}`}
                    >
                      <span className="text-muted text-sm">{k}</span>
                      <span className="text-deep text-sm font-medium text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {activeTab === 'features' && product.features && (
              <div className="max-w-2xl">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map(f => (
                    <li key={f} className="flex items-start gap-3 bg-cream rounded-xl px-4 py-3">
                      <span className="text-bark mt-0.5 flex-shrink-0">✦</span>
                      <span className="text-deep text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Delivery & Returns */}
            {activeTab === 'delivery' && (
              <div className="max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon:'🚚', title:'Free Delivery',      desc:'Complimentary delivery to your home in Indore, Bhopal, and Ujjain. Outlying areas at nominal charge.' },
                  { icon:'🔧', title:'Free Assembly',      desc:'Our trained team assembles your furniture in your room. All packaging is removed and recycled.' },
                  { icon:'📅', title:'Estimated Delivery', desc:`${product.deliveryDays || '7–12 working days'} from order confirmation. Express delivery available on request.` },
                  { icon:'↩️', title:'7-Day Easy Returns', desc:'Not satisfied? We will collect the item and process a full refund within 7 working days.' },
                ].map(item => (
                  <div key={item.title} className="bg-cream rounded-2xl p-5">
                    <span className="text-3xl block mb-3">{item.icon}</span>
                    <h4 className="font-cormorant font-semibold text-deep text-lg mb-1">{item.title}</h4>
                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ══════════ REVIEWS ══════════ */}
          <div className="mt-16">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
              <div>
                <h2 className="font-cormorant font-light text-deep text-3xl">Customer Reviews</h2>
                <div className="flex items-center gap-3 mt-2">
                  <StarRating rating={product.rating} size="text-xl" />
                  <span className="font-cormorant text-3xl font-semibold text-bark">{product.rating}</span>
                  <span className="text-muted text-sm">/ 5 · {product.reviews} reviews</span>
                </div>
              </div>
              <button
                onClick={() => dispatch(openQuoteModal())}
                className="border-2 border-bark text-bark px-5 py-2.5 rounded-xl text-sm font-dm hover:bg-bark hover:text-white transition-all cursor-pointer bg-transparent"
              >
                Write a Review
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {PRODUCT_REVIEWS.map((r, i) => <ReviewCard key={i} review={r} />)}
            </div>
          </div>

          {/* ══════════ RELATED PRODUCTS ══════════ */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="font-cormorant font-light text-deep text-3xl mb-8">
                More from <em className="text-bark">{product.cat}</em>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {related.map(p => (
                  <RelatedCard
                    key={p.id}
                    product={p}
                    onClick={() => navigate(`/product/${p.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ══════════ BOTTOM CTA ══════════ */}
          <div className="mt-16 bg-deep rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-cormorant text-cream font-light text-2xl md:text-3xl mb-1">
                Need help choosing?
              </h3>
              <p className="text-cream/60 text-sm">Our Indore design experts are available 7 days a week.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:7773896496"
                className="bg-gold text-deep px-6 py-3 rounded-xl text-sm font-dm font-semibold hover:opacity-85 transition-opacity"
              >
                📞 Call 7773896496
              </a>
              <button
                onClick={() => dispatch(openQuoteModal())}
                className="border-2 border-white/30 text-cream px-6 py-3 rounded-xl text-sm font-dm hover:border-gold hover:text-gold transition-all cursor-pointer bg-transparent"
              >
                Get Free Quote
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

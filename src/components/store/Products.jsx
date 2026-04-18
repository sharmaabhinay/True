import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilteredProducts, setFilter, setSearch, setSortBy, selectFilter } from '../../store/slices/productsSlice';
import { useReveal } from '../../hooks/useReveal';
import ProductCard from './ProductCard';

const filters = [
  { id:'all', label:'All' },
  { id:'bestseller', label:'Bestsellers' },
  { id:'new', label:'New Arrivals' },
  { id:'sale', label:'On Sale' },
];

export default function Products() {
  const dispatch  = useDispatch();
  const products  = useSelector(selectFilteredProducts);
  const filter    = useSelector(selectFilter);
  const revealRef = useReveal();

  return (
    <section id="products" ref={revealRef} className="reveal py-20 px-6 md:px-12 lg:px-16 bg-cream">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-bark text-[0.7rem] tracking-[0.15em] uppercase mb-2">Our Collection</p>
        <h2 className="font-cormorant font-light text-deep text-3xl md:text-4xl lg:text-5xl">
          Crafted with <em className="text-bark">intention</em>
        </h2>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter products">
          {filters.map(f => (
            <button key={f.id} onClick={() => dispatch(setFilter(f.id))}
                    className={`px-4 py-1.5 rounded-full text-[0.76rem] font-dm border transition-all cursor-pointer
                                ${filter === f.id
                                  ? 'bg-bark border-bark text-white'
                                  : 'bg-ivory border-warm text-muted hover:bg-bark hover:border-bark hover:text-white'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <select aria-label="Sort products" onChange={e => dispatch(setSortBy(e.target.value))}
                className="border border-warm bg-ivory text-deep text-[0.78rem] rounded-lg px-3 py-2 outline-none cursor-pointer font-dm">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-4xl mb-3">🔍</p>
          <p>No products found. Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
}

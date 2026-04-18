import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, selectFilter } from '../../store/slices/productsSlice';
import { useReveal } from '../../hooks/useReveal';
import { CATEGORIES } from '../../data/constants';

export default function Categories() {
  const dispatch   = useDispatch();
  const filter     = useSelector(selectFilter);
  const revealRef  = useReveal();

  const handleClick = (id) => {
    dispatch(setFilter(id));
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categories" ref={revealRef} className="reveal py-20 px-6 md:px-12 lg:px-16 bg-cream">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-bark text-[0.7rem] tracking-[0.15em] uppercase mb-2">Shop by Room</p>
        <h2 className="font-cormorant font-light text-deep text-3xl md:text-4xl lg:text-5xl">
          Every room, <em className="text-bark">perfected</em>
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => handleClick(cat.id)}
                  className={`bg-ivory rounded-2xl py-7 px-3 text-center cursor-pointer
                               border transition-all duration-300 group
                               ${filter === cat.id
                                 ? 'bg-white -translate-y-1.5 shadow-warm-md border-bark/20'
                                 : 'border-transparent hover:bg-white hover:-translate-y-1.5 hover:shadow-warm-md hover:border-bark/20'}`}>
            <span className="text-3xl md:text-4xl block mb-2 group-hover:scale-110 transition-transform duration-300">
              {cat.icon}
            </span>
            <div className="font-cormorant font-semibold text-deep text-base">{cat.label}</div>
            <div className="text-muted text-[0.7rem] mt-0.5">{cat.count} items</div>
          </button>
        ))}
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit2, FiEye, FiEyeOff, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import {
  selectAllProducts, deleteProduct, toggleProductActive,
} from '../../store/slices/productsSlice';
import {
  selectPMSearch, selectPMCatFilter,
  setPMSearch, setPMCatFilter, setEditingProduct, showAdminToast,
} from '../../store/slices/adminSlice';
import ProductModal from './ProductModal';

export default function AdminProducts() {
  const dispatch   = useDispatch();
  const products   = useSelector(selectAllProducts);
  const search     = useSelector(selectPMSearch);
  const catFilter  = useSelector(selectPMCatFilter);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = products.filter(p => {
    const mq = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.cat.toLowerCase().includes(search.toLowerCase());
    const mc = !catFilter || p.cat === catFilter;
    return mq && mc;
  });

  const handleEdit = (id) => {
    dispatch(setEditingProduct(id));
    setModalOpen(true);
  };
  const handleAdd = () => {
    dispatch(setEditingProduct(null));
    setModalOpen(true);
  };
  const handleDelete = (id) => {
    if (!window.confirm('Delete this product?')) return;
    dispatch(deleteProduct(id));
    dispatch(showAdminToast({ msg:'Product deleted.' }));
  };
  const handleToggle = (id) => {
    dispatch(toggleProductActive(id));
    const p = products.find(x => x.id === id);
    dispatch(showAdminToast({ msg: p?.active ? 'Product hidden' : 'Product visible' }));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-admin-text text-base font-semibold">Product Manager</h2>
        <button onClick={handleAdd}
                className="bg-gold text-deep text-sm font-semibold px-5 py-2 rounded-lg cursor-pointer border-none hover:opacity-85 font-dm">
          <span className="inline-flex items-center gap-2"><FiPlus /> Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input type="search" value={search} onChange={e => dispatch(setPMSearch(e.target.value))}
               placeholder="Search products…"
               className="flex-1 min-w-[180px] bg-admin-surface border border-admin-border rounded-lg px-3 py-2.5 text-sm text-admin-text outline-none focus:border-gold transition-colors font-dm placeholder:text-admin-muted" />
        <select value={catFilter} onChange={e => dispatch(setPMCatFilter(e.target.value))}
                className="bg-admin-surface border border-admin-border rounded-lg px-3 py-2.5 text-sm text-admin-text outline-none focus:border-gold transition-colors font-dm cursor-pointer">
          <option value="">All Categories</option>
          {['Living Room','Bedroom','Dining','Office','Outdoor'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-admin-muted">
          <p className="text-3xl mb-3 inline-flex"><FiSearch /></p>
          <p className="text-sm">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(p => (
            <div key={p.id}
                 className="bg-admin-card border border-admin-border rounded-xl overflow-hidden hover:border-gold transition-colors">
              {/* Image */}
              <div className="h-32 bg-[#1a1a22] relative overflow-hidden">
                {p.img && <img src={p.img} alt={p.name} className="w-full h-full object-cover" onError={e=>e.target.style.display='none'} />}
                {p.modelData && (
                  <span className="absolute bottom-1.5 right-1.5 bg-gold/90 text-deep text-[0.58rem] px-1.5 py-0.5 rounded font-semibold">
                    3D ✓
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-3">
                <p className="text-admin-text text-[0.82rem] font-medium leading-snug mb-0.5 truncate">{p.name}</p>
                <p className="text-admin-muted text-[0.65rem] mb-1.5">
                  {p.cat}{p.badge && <span className="text-gold"> · {p.badge}</span>}
                </p>
                <p className="text-gold text-[0.8rem] mb-3">
                  ₹{p.price.toLocaleString('en-IN')}
                  {p.oldPrice && <span className="text-admin-muted line-through text-[0.7rem] ml-1">₹{p.oldPrice.toLocaleString('en-IN')}</span>}
                </p>

                {/* Action row */}
                <div className="flex gap-1.5 mb-2">
                  <button onClick={() => handleEdit(p.id)}
                    className="flex-1 border border-admin-border text-admin-muted text-[0.7rem] py-1.5 rounded-md
                                     hover:border-gold hover:text-gold transition-colors cursor-pointer bg-transparent font-dm">
                    <span className="inline-flex items-center gap-1.5"><FiEdit2 /> Edit</span>
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                          className="border border-admin-border text-admin-muted text-[0.7rem] px-2.5 py-1.5 rounded-md
                                     hover:border-admin-red hover:text-admin-red transition-colors cursor-pointer bg-transparent font-dm">
                    <FiTrash2 />
                  </button>
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggle(p.id)}
                          className={`relative w-8 h-4 rounded-full transition-colors cursor-pointer border-none
                                      ${p.active!==false ? 'bg-admin-green' : 'bg-admin-border'}`}>
                    <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all
                                      ${p.active!==false ? 'left-4' : 'left-0.5'}`} />
                  </button>
                  <span className="text-admin-muted text-[0.68rem] inline-flex items-center gap-1.5">{p.active!==false ? <FiEye /> : <FiEyeOff />}{p.active!==false ? 'Active' : 'Hidden'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

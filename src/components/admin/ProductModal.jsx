import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateProduct, selectAllProducts } from '../../store/slices/productsSlice';
import { selectEditingProductId, clearEditing, showAdminToast } from '../../store/slices/adminSlice';
import { use3DCanvas } from '../../hooks/use3DCanvas';
import { parseOBJ, drawOBJModel } from '../../utils/engine3d';

const CATS = ['Living Room','Bedroom','Dining','Office','Outdoor'];
const BADGES = ['','Bestseller','New','Sale'];

const blank = { name:'', cat:'Living Room', badge:'', price:'', oldPrice:'', rating:'4.8', img:'', desc:'' };

export default function ProductModal({ open, onClose }) {
  const dispatch   = useDispatch();
  const editId     = useSelector(selectEditingProductId);
  const products   = useSelector(selectAllProducts);
  const [form, setForm] = useState(blank);
  const [objGeo,  setObjGeo]  = useState(null);
  const [objName, setObjName] = useState('');
  const fileRef    = useRef(null);
  const objRef     = useRef(null);

  // Load product into form when editing
  useEffect(() => {
    if (editId !== null) {
      const p = products.find(x => x.id === editId);
      if (p) {
        setForm({ name:p.name, cat:p.cat, badge:p.badge||'', price:String(p.price),
                  oldPrice:p.oldPrice?String(p.oldPrice):'', rating:String(p.rating), img:p.img||'', desc:p.desc||'' });
        if (p.modelData) { setObjGeo(parseOBJ(p.modelData)); setObjName('Saved model'); }
      }
    } else {
      setForm(blank); setObjGeo(null); setObjName('');
    }
  }, [editId, products, open]);

  // 3D preview canvas (only renders when OBJ is loaded)
  const { canvasRef: previewCanvasRef } = use3DCanvas(
    (ctx, cx, cy, rx, ry) => objGeo && drawOBJModel(ctx, cx, cy, rx, ry, objGeo, '#8B6B4A'),
    [objGeo]
  );

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImgFile = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set('img', ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleOBJ = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (!file.name.toLowerCase().endsWith('.obj')) {
      dispatch(showAdminToast({ msg:'Only .obj files supported', type:'error' })); return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target.result;
      const geo  = parseOBJ(text);
      if (!geo.positions.length) { dispatch(showAdminToast({ msg:'Invalid OBJ file', type:'error' })); return; }
      setObjGeo(geo);
      setObjName(`${file.name} (${Math.round(text.length/1024)}KB)`);
      // Store raw text in form for persistence
      setForm(f => ({ ...f, _objData: text }));
      dispatch(showAdminToast({ msg:'✅ 3D model loaded!' }));
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) {
      dispatch(showAdminToast({ msg:'Name and price required.', type:'error' })); return;
    }
    const badge = form.badge;
    const prod  = {
      name:      form.name.trim(),
      cat:       form.cat,
      badge:     badge || null,
      badgeType: (badge||'').toLowerCase(),
      img:       form.img || '',
      price:     +form.price,
      oldPrice:  form.oldPrice ? +form.oldPrice : null,
      rating:    +form.rating || 4.5,
      reviews:   Math.floor(Math.random()*200+20),
      desc:      form.desc,
      active:    true,
      tags:      ['all', (badge||'').toLowerCase()].filter(Boolean),
      modelData: form._objData || null,
    };
    if (editId !== null) {
      dispatch(updateProduct({ ...prod, id: editId }));
      dispatch(showAdminToast({ msg:'✅ Product updated!' }));
    } else {
      dispatch(addProduct(prod));
      dispatch(showAdminToast({ msg:'✅ Product added!' }));
    }
    dispatch(clearEditing());
    onClose();
  };

  if (!open) return null;

  const inputCls = "w-full bg-admin-surface border border-admin-border rounded-lg px-3 py-2.5 text-sm text-admin-text outline-none font-dm focus:border-gold transition-colors placeholder:text-admin-muted";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/65">
      <div className="bg-admin-card border border-admin-border rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto admin-scroll">
        <div className="flex items-center justify-between p-6 pb-4">
          <h3 className="text-admin-text font-semibold text-base">{editId!==null ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="text-admin-muted hover:text-admin-text text-xl bg-transparent border-none cursor-pointer transition-colors">×</button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Name + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Product Name</label>
              <input className={inputCls} placeholder="e.g. Royale Sectional Sofa" value={form.name} onChange={e=>set('name',e.target.value)} />
            </div>
            <div>
              <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Category</label>
              <select className={inputCls} value={form.cat} onChange={e=>set('cat',e.target.value)} style={{background:'var(--tw-bg-admin-surface)'}}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Price + Old Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Price (₹)</label>
              <input type="number" className={inputCls} placeholder="48500" value={form.price} onChange={e=>set('price',e.target.value)} />
            </div>
            <div>
              <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Old Price <span className="opacity-40 normal-case">optional</span></label>
              <input type="number" className={inputCls} placeholder="Leave blank if no discount" value={form.oldPrice} onChange={e=>set('oldPrice',e.target.value)} />
            </div>
          </div>

          {/* Badge + Rating */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Badge</label>
              <select className={inputCls} value={form.badge} onChange={e=>set('badge',e.target.value)}>
                {BADGES.map(b => <option key={b} value={b}>{b||'None'}</option>)}
              </select>
            </div>
            <div>
              <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Rating (1–5)</label>
              <input type="number" min="1" max="5" step="0.1" className={inputCls} placeholder="4.8" value={form.rating} onChange={e=>set('rating',e.target.value)} />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Image URL</label>
            <input type="url" className={inputCls} placeholder="https://images.unsplash.com/…" value={form.img} onChange={e=>set('img',e.target.value)} />
          </div>

          {/* Image upload */}
          <div>
            <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleImgFile} />
            <button onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-admin-border rounded-lg p-4 text-center cursor-pointer
                               hover:border-gold transition-colors bg-transparent text-admin-muted text-sm">
              📷 Or upload from device (JPG, PNG, WebP)
            </button>
            {form.img && <img src={form.img} alt="Preview" className="mt-2 w-full h-28 object-cover rounded-lg" onError={e=>e.target.style.display='none'} />}
          </div>

          {/* ── 3D MODEL UPLOAD ── */}
          <div>
            <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">
              3D Model <span className="opacity-40 normal-case text-[0.65rem]">.obj format · optional</span>
            </label>
            <input type="file" ref={objRef} accept=".obj" className="hidden" onChange={handleOBJ} />
            <button onClick={() => objRef.current?.click()}
                    className="w-full border-2 border-dashed border-admin-border rounded-lg p-4 text-center cursor-pointer
                               hover:border-gold transition-colors bg-transparent text-admin-muted text-sm">
              🧊 Upload .OBJ 3D Model
              <span className="block text-[0.68rem] mt-0.5 opacity-60">Customers will see it in the interactive 3D viewer</span>
            </button>

            {objName && (
              <div className="mt-2 text-admin-green text-xs font-dm">✓ {objName}</div>
            )}

            {/* Live 3D Preview */}
            {objGeo && (
              <canvas ref={previewCanvasRef}
                      className="mt-2 w-full h-36 rounded-lg bg-[#1a1a22] cursor-grab active:cursor-grabbing" />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Description</label>
            <textarea rows={3} className={`${inputCls} resize-none`} placeholder="Describe the product…" value={form.desc} onChange={e=>set('desc',e.target.value)} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
                    className="flex-1 bg-white/[0.05] border border-admin-border text-admin-muted py-2.5 rounded-lg text-sm font-dm cursor-pointer hover:text-admin-text transition-colors">
              Cancel
            </button>
            <button onClick={handleSave}
                    className="flex-1 bg-gold text-deep py-2.5 rounded-lg text-sm font-dm font-semibold cursor-pointer hover:opacity-85 transition-opacity border-none">
              Save Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

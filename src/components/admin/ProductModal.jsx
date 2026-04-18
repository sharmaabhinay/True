import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiImage, FiLayers, FiPlus, FiTrash2, FiUploadCloud, FiX } from 'react-icons/fi';
import { addProduct, selectAllProducts, updateProduct } from '../../store/slices/productsSlice';
import { clearEditing, selectEditingProductId, showAdminToast } from '../../store/slices/adminSlice';
import { use3DCanvas } from '../../hooks/use3DCanvas';
import { drawOBJModel, parseOBJ } from '../../utils/engine3d';

const CATS = ['Living Room', 'Bedroom', 'Dining', 'Office', 'Outdoor'];
const BADGES = ['', 'Bestseller', 'New', 'Sale'];
const MODEL_TYPES = ['sofa', 'almirah', 'bed', 'chair', 'table', 'shelf', 'desk'];

const blank = {
  name: '',
  cat: 'Living Room',
  badge: '',
  price: '',
  oldPrice: '',
  rating: '4.8',
  img: '',
  galleryText: '',
  desc: '',
  longDesc: '',
  specsText: '',
  featuresText: '',
  sizesText: '',
  availableColoursText: '',
  variantsText: '',
  fabric: '',
  material: '',
  finish: '',
  sku: '',
  deliveryDays: '',
  modelType: 'sofa',
  reviews: '48',
};

const inputCls = 'w-full bg-admin-surface border border-admin-border rounded-lg px-3 py-2.5 text-sm text-admin-text outline-none font-dm focus:border-gold transition-colors placeholder:text-admin-muted';
const labelCls = 'text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5';

const parseLines = (text) => text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
const parsePairs = (text) => parseLines(text).reduce((acc, line) => {
  const [key, ...rest] = line.split(':');
  if (!key || !rest.length) return acc;
  acc[key.trim()] = rest.join(':').trim();
  return acc;
}, {});

export default function ProductModal({ open, onClose }) {
  const dispatch = useDispatch();
  const editId = useSelector(selectEditingProductId);
  const products = useSelector(selectAllProducts);
  const [form, setForm] = useState(blank);
  const [gallery, setGallery] = useState([]);
  const [objGeo, setObjGeo] = useState(null);
  const [objName, setObjName] = useState('');
  const imageFileRef = useRef(null);
  const imageMultiRef = useRef(null);
  const objRef = useRef(null);

  useEffect(() => {
    if (editId !== null) {
      const product = products.find((entry) => entry.id === editId);
      if (product) {
        setForm({
          name: product.name || '',
          cat: product.cat || 'Living Room',
          badge: product.badge || '',
          price: String(product.price || ''),
          oldPrice: product.oldPrice ? String(product.oldPrice) : '',
          rating: String(product.rating || 4.8),
          img: product.img || '',
          galleryText: (product.gallery || []).join('\n'),
          desc: product.desc || '',
          longDesc: product.longDesc || '',
          specsText: Object.entries(product.specs || {}).map(([key, value]) => `${key}: ${value}`).join('\n'),
          featuresText: (product.features || []).join('\n'),
          sizesText: Object.entries(product.sizes || {}).map(([key, value]) => `${key}: ${value}`).join('\n'),
          availableColoursText: (product.availableColours || []).map((item) => item.label || item).join('\n'),
          variantsText: Object.entries(product.variants || {}).map(([key, value]) => `${key}: ${value}`).join('\n'),
          fabric: product.fabric || '',
          material: product.material || '',
          finish: product.finish || '',
          sku: product.sku || '',
          deliveryDays: product.deliveryDays || '',
          modelType: product.modelType || 'sofa',
          reviews: String(product.reviews || 48),
          _objData: product.modelData || '',
        });
        setGallery(product.gallery || []);
        if (product.modelData) {
          setObjGeo(parseOBJ(product.modelData));
          setObjName('Saved model');
        } else {
          setObjGeo(null);
          setObjName('');
        }
      }
    } else {
      setForm(blank);
      setGallery([]);
      setObjGeo(null);
      setObjName('');
    }
  }, [editId, open, products]);

  const { canvasRef: previewCanvasRef } = use3DCanvas(
    (ctx, cx, cy, rx, ry) => objGeo && drawOBJModel(ctx, cx, cy, rx, ry, objGeo, '#8B6B4A'),
    [objGeo]
  );

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const syncGallery = (items) => {
    setGallery(items);
    set('galleryText', items.join('\n'));
    if (!form.img && items[0]) set('img', items[0]);
  };

  const handleSingleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target.result;
      set('img', src);
      syncGallery([src, ...gallery.filter((item) => item !== src)]);
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleImages = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    Promise.all(files.map((file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target.result);
      reader.readAsDataURL(file);
    }))).then((images) => {
      const nextGallery = [...gallery, ...images];
      syncGallery(nextGallery);
      if (!form.img && images[0]) set('img', images[0]);
      dispatch(showAdminToast({ msg: `${images.length} gallery image(s) added.` }));
    });
  };

  const handleGalleryText = (value) => {
    set('galleryText', value);
    const lines = parseLines(value);
    setGallery(lines);
    if (lines[0]) set('img', lines[0]);
  };

  const removeGalleryItem = (index) => {
    const nextGallery = gallery.filter((_, current) => current !== index);
    syncGallery(nextGallery);
    if (form.img === gallery[index]) set('img', nextGallery[0] || '');
  };

  const handleOBJ = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.obj')) {
      dispatch(showAdminToast({ msg: 'Only .obj files supported', type: 'error' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const geometry = parseOBJ(text);
      if (!geometry.positions.length) {
        dispatch(showAdminToast({ msg: 'Invalid OBJ file', type: 'error' }));
        return;
      }
      setObjGeo(geometry);
      setObjName(file.name);
      set('_objData', text);
      dispatch(showAdminToast({ msg: '3D model loaded.' }));
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) {
      dispatch(showAdminToast({ msg: 'Name and price are required.', type: 'error' }));
      return;
    }

    const galleryImages = gallery.length ? gallery : parseLines(form.galleryText);
    const sizes = parsePairs(form.sizesText);
    const features = parseLines(form.featuresText);
    const specs = {
      ...parsePairs(form.specsText),
      ...(form.material ? { Material: form.material } : {}),
      ...(form.fabric ? { Fabric: form.fabric } : {}),
      ...(form.finish ? { Finish: form.finish } : {}),
    };

    const existing = editId !== null ? products.find((entry) => entry.id === editId) : null;
    const product = {
      id: editId ?? undefined,
      name: form.name.trim(),
      cat: form.cat,
      badge: form.badge || null,
      badgeType: (form.badge || '').toLowerCase(),
      img: form.img || galleryImages[0] || '',
      gallery: galleryImages,
      modelType: form.modelType,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      rating: Number(form.rating) || 4.8,
      reviews: Number(form.reviews) || existing?.reviews || 48,
      active: existing?.active ?? true,
      tags: ['all', (form.badge || '').toLowerCase()].filter(Boolean),
      sku: form.sku || `TF-${Date.now().toString().slice(-6)}`,
      deliveryDays: form.deliveryDays || '7-12 working days',
      desc: form.desc,
      longDesc: form.longDesc || form.desc,
      specs,
      features,
      sizes,
      availableColours: parseLines(form.availableColoursText).map((label) => ({ label })),
      variants: parsePairs(form.variantsText),
      fabric: form.fabric || '',
      material: form.material || '',
      finish: form.finish || '',
      modelData: form._objData || null,
    };

    if (editId !== null) {
      dispatch(updateProduct(product));
      dispatch(showAdminToast({ msg: 'Product updated.' }));
    } else {
      dispatch(addProduct(product));
      dispatch(showAdminToast({ msg: 'Product added.' }));
    }

    dispatch(clearEditing());
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/65">
      <div className="bg-admin-card border border-admin-border rounded-2xl w-full max-w-5xl max-h-[94vh] overflow-y-auto admin-scroll">
        <div className="flex items-center justify-between p-6 pb-4 sticky top-0 bg-admin-card border-b border-admin-border z-10">
          <h3 className="text-admin-text font-semibold text-base">{editId !== null ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="text-admin-muted hover:text-admin-text text-xl bg-transparent border-none cursor-pointer transition-colors">
            <FiX />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Field label="Product Name"><input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} /></Field>
            <Field label="Category">
              <select className={inputCls} value={form.cat} onChange={(e) => set('cat', e.target.value)}>{CATS.map((cat) => <option key={cat}>{cat}</option>)}</select>
            </Field>
            <Field label="Model Type">
              <select className={inputCls} value={form.modelType} onChange={(e) => set('modelType', e.target.value)}>{MODEL_TYPES.map((type) => <option key={type}>{type}</option>)}</select>
            </Field>
            <Field label="Price (₹)"><input type="number" className={inputCls} value={form.price} onChange={(e) => set('price', e.target.value)} /></Field>
            <Field label="Old Price"><input type="number" className={inputCls} value={form.oldPrice} onChange={(e) => set('oldPrice', e.target.value)} /></Field>
            <Field label="Rating"><input type="number" min="1" max="5" step="0.1" className={inputCls} value={form.rating} onChange={(e) => set('rating', e.target.value)} /></Field>
            <Field label="Badge">
              <select className={inputCls} value={form.badge} onChange={(e) => set('badge', e.target.value)}>{BADGES.map((badge) => <option key={badge} value={badge}>{badge || 'None'}</option>)}</select>
            </Field>
            <Field label="SKU"><input className={inputCls} value={form.sku} onChange={(e) => set('sku', e.target.value)} /></Field>
            <Field label="Delivery Days"><input className={inputCls} value={form.deliveryDays} onChange={(e) => set('deliveryDays', e.target.value)} placeholder="10-15 working days" /></Field>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-5">
            <div className="space-y-4">
              <Field label="Short Description"><textarea rows={3} className={`${inputCls} resize-none`} value={form.desc} onChange={(e) => set('desc', e.target.value)} /></Field>
              <Field label="Long Description"><textarea rows={5} className={`${inputCls} resize-none`} value={form.longDesc} onChange={(e) => set('longDesc', e.target.value)} /></Field>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Material"><input className={inputCls} value={form.material} onChange={(e) => set('material', e.target.value)} /></Field>
                <Field label="Fabric"><input className={inputCls} value={form.fabric} onChange={(e) => set('fabric', e.target.value)} placeholder="Optional" /></Field>
                <Field label="Finish"><input className={inputCls} value={form.finish} onChange={(e) => set('finish', e.target.value)} /></Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Features (one per line)">
                  <textarea rows={5} className={`${inputCls} resize-none`} value={form.featuresText} onChange={(e) => set('featuresText', e.target.value)} placeholder={'Mortise-and-tenon joinery\nHydraulic storage drawers'} />
                </Field>
                <Field label="Specifications (Key: Value)">
                  <textarea rows={5} className={`${inputCls} resize-none`} value={form.specsText} onChange={(e) => set('specsText', e.target.value)} placeholder={'Warranty: 5 Years\nDimensions: W:120 × D:55 × H:200 cm'} />
                </Field>
                <Field label="Sizes / pricing (Key: Price)">
                  <textarea rows={5} className={`${inputCls} resize-none`} value={form.sizesText} onChange={(e) => set('sizesText', e.target.value)} placeholder={'2-Seater: 38500\n3-Seater: 48500'} />
                </Field>
                <Field label="Colours (one per line)">
                  <textarea rows={5} className={`${inputCls} resize-none`} value={form.availableColoursText} onChange={(e) => set('availableColoursText', e.target.value)} placeholder={'Walnut\nCream\nOlive'} />
                </Field>
              </div>

              <Field label="Additional Variants (Key: Value)">
                <textarea rows={4} className={`${inputCls} resize-none`} value={form.variantsText} onChange={(e) => set('variantsText', e.target.value)} placeholder={'Storage: Hydraulic\nLeg style: Brass tip\nSeat feel: Medium plush'} />
              </Field>
            </div>

            <div className="space-y-4">
              <section className="rounded-xl border border-admin-border p-4 bg-admin-surface">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h4 className="text-admin-text text-sm font-medium flex items-center gap-2"><FiImage /> Product Images</h4>
                  <span className="text-admin-muted text-[0.68rem]">{gallery.length} selected</span>
                </div>

                <Field label="Primary Image URL"><input type="url" className={inputCls} value={form.img} onChange={(e) => set('img', e.target.value)} /></Field>
                <Field label="Gallery URLs (one per line)">
                  <textarea rows={5} className={`${inputCls} resize-none`} value={form.galleryText} onChange={(e) => handleGalleryText(e.target.value)} placeholder={'https://...\nhttps://...'} />
                </Field>

                <input type="file" ref={imageFileRef} accept="image/*" className="hidden" onChange={handleSingleImage} />
                <input type="file" ref={imageMultiRef} accept="image/*" multiple className="hidden" onChange={handleMultipleImages} />

                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => imageFileRef.current?.click()} className="border border-admin-border text-admin-muted rounded-lg py-2 text-sm hover:border-gold hover:text-gold transition-colors bg-transparent cursor-pointer flex items-center justify-center gap-2">
                    <FiUploadCloud /> Upload Cover
                  </button>
                  <button onClick={() => imageMultiRef.current?.click()} className="border border-admin-border text-admin-muted rounded-lg py-2 text-sm hover:border-gold hover:text-gold transition-colors bg-transparent cursor-pointer flex items-center justify-center gap-2">
                    <FiPlus /> Upload Gallery
                  </button>
                </div>

                {gallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {gallery.map((src, index) => (
                      <div key={`${src}-${index}`} className="relative rounded-lg overflow-hidden bg-[#1a1a22] border border-admin-border">
                        <img src={src} alt={`Gallery ${index + 1}`} className="w-full h-20 object-cover" />
                        <button onClick={() => removeGalleryItem(index)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer border-none">
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-xl border border-admin-border p-4 bg-admin-surface">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h4 className="text-admin-text text-sm font-medium flex items-center gap-2"><FiLayers /> 3D Model</h4>
                  {objName && <span className="text-admin-green text-[0.68rem]">{objName}</span>}
                </div>
                <input type="file" ref={objRef} accept=".obj" className="hidden" onChange={handleOBJ} />
                <button onClick={() => objRef.current?.click()} className="w-full border-2 border-dashed border-admin-border rounded-lg p-4 text-center cursor-pointer hover:border-gold transition-colors bg-transparent text-admin-muted text-sm">
                  Upload .OBJ 3D Model
                </button>
                {objGeo && <canvas ref={previewCanvasRef} className="mt-3 w-full h-36 rounded-lg bg-[#1a1a22] cursor-grab active:cursor-grabbing" />}
              </section>
            </div>
          </section>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 bg-white/[0.05] border border-admin-border text-admin-muted py-2.5 rounded-lg text-sm font-dm cursor-pointer hover:text-admin-text transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="flex-1 bg-gold text-deep py-2.5 rounded-lg text-sm font-dm font-semibold cursor-pointer hover:opacity-85 transition-opacity border-none">
              Save Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ children, label }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

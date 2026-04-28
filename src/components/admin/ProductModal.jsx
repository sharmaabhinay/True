import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiX, FiPlus, FiTrash2, FiUpload, FiLink } from 'react-icons/fi';
import { addProduct, updateProduct, selectAllProducts } from '../../store/slices/productsSlice';
import { selectEditingProductId, clearEditing, showAdminToast } from '../../store/slices/adminSlice';
import { use3DCanvas } from '../../hooks/use3DCanvas';
import { parseOBJ, drawOBJModel } from '../../utils/engine3d';

const CATS   = ['Living Room','Bedroom','Dining','Office','Outdoor'];
const BADGES = ['','Bestseller','New','Sale'];
const MODEL_TYPES = ['sofa','almirah','bed','chair','table','shelf','desk'];
const FABRIC_OPTIONS = ['Premium Polyester','Cotton Velvet','Linen Blend','Leather','Boucle','Microfibre','Jute Blend'];
const COLOUR_PRESETS = [
  {label:'Walnut',   hex:'#8B6B4A'}, {label:'Teak',    hex:'#6B4C2A'},
  {label:'Navy',     hex:'#4A6B8B'}, {label:'Olive',   hex:'#6B8B4A'},
  {label:'Maroon',   hex:'#8B4A4A'}, {label:'Cream',   hex:'#D3C5B0'},
  {label:'Charcoal', hex:'#3A3A3A'}, {label:'Ivory',   hex:'#FAF7F2'},
  {label:'Sage',     hex:'#7A8C6E'}, {label:'Gold',    hex:'#C8A86B'},
];

const blank = {
  name:'', cat:'Living Room', badge:'', modelType:'sofa', price:'', oldPrice:'',
  rating:'4.8', desc:'', longDesc:'', sku:'', deliveryDays:'7–12 working days',
  // Arrays
  images:[], features:[], fabrics:[], colours:[],
  // Sizes as key:price pairs
  sizes:[{label:'Standard', price:''}],
  // Specs as key:value pairs
  specs:[{key:'Material', value:''},{key:'Dimensions', value:''},{key:'Warranty', value:''}],
};

export default function ProductModal({ open, onClose }) {
  const dispatch  = useDispatch();
  const editId    = useSelector(selectEditingProductId);
  const products  = useSelector(selectAllProducts);

  const [form, setForm]       = useState(blank);
  const [objGeo, setObjGeo]   = useState(null);
  const [objName, setObjName] = useState('');
  const [imgUrl, setImgUrl]   = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [previewStop, setPreviewStop] = useState(false);

  const fileRef  = useRef(null);
  const objRef   = useRef(null);

  const { canvasRef } = use3DCanvas(
    (ctx, cx, cy, rx, ry) => objGeo && !previewStop && drawOBJModel(ctx, cx, cy, rx, ry, objGeo, '#8B6B4A'),
    [objGeo, previewStop]
  );

  // Load product into form when editing
  useEffect(() => {
    if (!open) return;
    if (editId !== null) {
      const p = products.find(x => x.id === editId);
      if (p) {
        setForm({
          name:p.name||'', cat:p.cat||'Living Room', badge:p.badge||'', modelType:p.modelType||'sofa',
          price:String(p.price||''), oldPrice:p.oldPrice?String(p.oldPrice):'',
          rating:String(p.rating||4.8), desc:p.desc||'', longDesc:p.longDesc||'',
          sku:p.sku||'', deliveryDays:p.deliveryDays||'7–12 working days',
          images: p.gallery?.length ? p.gallery.map(u=>({url:u,type:'url'})) : p.img ? [{url:p.img,type:'url'}] : [],
          features: p.features?.length ? p.features.map(f=>({val:f})) : [],
          fabrics:  p.fabrics?.length  ? p.fabrics  : [],
          colours:  p.colours?.length  ? p.colours  : [],
          sizes:    p.sizes ? Object.entries(p.sizes).map(([label,price])=>({label,price:String(price)})) : [{label:'Standard',price:''}],
          specs:    p.specs ? Object.entries(p.specs).map(([key,value])=>({key,value})) : [{key:'Material',value:''},{key:'Dimensions',value:''},{key:'Warranty',value:''}],
        });
        if (p.modelData) { setObjGeo(parseOBJ(p.modelData)); setObjName('Saved 3D model'); }
        else { setObjGeo(null); setObjName(''); }
      }
    } else {
      setForm(blank); setObjGeo(null); setObjName(''); setImgUrl('');
    }
    setActiveTab('basic');
    setPreviewStop(false);
  }, [editId, open]);

  useEffect(() => { if (!open) setPreviewStop(true); else setPreviewStop(false); }, [open]);

  if (!open) return null;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ── Image helpers ──
  const addImageUrl = () => {
    if (!imgUrl.trim()) return;
    set('images', [...form.images, { url: imgUrl.trim(), type: 'url' }]);
    setImgUrl('');
  };
  const addImageFile = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => set('images', prev => [...(prev.images||[]), { url: ev.target.result, type: 'file' }]);
      reader.readAsDataURL(f);
    });
  };
  const removeImage = (i) => set('images', form.images.filter((_, idx) => idx !== i));

  // ── OBJ upload ──
  const handleOBJ = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (!file.name.toLowerCase().endsWith('.obj')) { dispatch(showAdminToast({ msg:'Only .obj files supported', type:'error' })); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const geo = parseOBJ(ev.target.result);
      if (!geo.positions.length) { dispatch(showAdminToast({ msg:'Invalid OBJ file', type:'error' })); return; }
      setObjGeo(geo); setObjName(`${file.name} (${Math.round(ev.target.result.length/1024)}KB)`);
      setForm(f => ({ ...f, _objData: ev.target.result }));
      dispatch(showAdminToast({ msg:'3D model loaded!' }));
    };
    reader.readAsText(file);
  };

  // ── Dynamic list helpers ──
  const addRow    = (key, blank) => set(key, [...form[key], blank]);
  const removeRow = (key, i)    => set(key, form[key].filter((_, idx) => idx !== i));
  const updateRow = (key, i, field, val) => {
    const arr = [...form[key]]; arr[i] = { ...arr[i], [field]: val }; set(key, arr);
  };

  // ── Save ──
  const handleSave = () => {
    if (!form.name.trim() || !form.price) {
      dispatch(showAdminToast({ msg:'Name and price required.', type:'error' })); return;
    }
    const badge   = form.badge;
    const bType   = (badge||'').toLowerCase();
    const imgs    = form.images.map(i => i.url);
    const sizesObj = {};
    form.sizes.forEach(s => { if (s.label && s.price) sizesObj[s.label] = +s.price; });
    const specsObj = {};
    form.specs.forEach(s => { if (s.key && s.value) specsObj[s.key] = s.value; });

    const prod = {
      name: form.name.trim(), cat: form.cat, badge: badge||null, badgeType: bType,
      modelType: form.modelType,
      img:  imgs[0] || '',
      gallery: imgs,
      price: +form.price, oldPrice: form.oldPrice ? +form.oldPrice : null,
      rating: +form.rating || 4.5, reviews: Math.floor(Math.random()*200+20),
      desc: form.desc, longDesc: form.longDesc,
      sku: form.sku, deliveryDays: form.deliveryDays,
      active: true,
      tags: ['all', bType].filter(Boolean),
      sizes: Object.keys(sizesObj).length ? sizesObj : undefined,
      specs: Object.keys(specsObj).length ? specsObj : undefined,
      features: form.features.map(f => f.val).filter(Boolean),
      fabrics:  form.fabrics.filter(Boolean),
      colours:  form.colours,
      modelData: form._objData || null,
    };

    if (editId !== null) {
      dispatch(updateProduct({ ...prod, id: editId }));
      dispatch(showAdminToast({ msg:'Product updated!' }));
    } else {
      dispatch(addProduct(prod));
      dispatch(showAdminToast({ msg:'Product added!' }));
    }
    dispatch(clearEditing());
    onClose();
  };

  const inputCls = "w-full bg-admin-surface border border-admin-border rounded-lg px-3 py-2.5 text-sm text-admin-text outline-none font-dm focus:border-gold transition-colors placeholder:text-admin-muted";
  const TABS = ['basic','images','specs','variants','3d'];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/65">
      <div className="bg-admin-card border border-admin-border rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border flex-shrink-0">
          <h3 className="text-admin-text font-semibold">{editId !== null ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="text-admin-muted hover:text-admin-text bg-transparent border-none cursor-pointer">
            <FiX size={20}/>
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-admin-border flex-shrink-0 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
                    className={`px-5 py-3 text-xs font-dm whitespace-nowrap border-none cursor-pointer capitalize bg-transparent border-b-2 -mb-px transition-all
                                ${activeTab===t ? 'text-gold border-gold' : 'text-admin-muted border-transparent hover:text-admin-text'}`}>
              {t === '3d' ? '3D Model' : t === 'specs' ? 'Specs & Desc' : t === 'variants' ? 'Variants' : t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 admin-scroll px-6 py-5 space-y-4">

          {/* ── BASIC TAB ── */}
          {activeTab === 'basic' && (<>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Product Name *</label>
                <input className={inputCls} placeholder="e.g. Royale Sectional Sofa" value={form.name} onChange={e=>set('name',e.target.value)} />
              </div>
              <div>
                <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Category</label>
                <select className={inputCls} value={form.cat} onChange={e=>set('cat',e.target.value)}>
                  {CATS.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">3D Model Type</label>
                <select className={inputCls} value={form.modelType} onChange={e=>set('modelType',e.target.value)}>
                  {MODEL_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Price (₹) *</label>
                <input type="number" className={inputCls} placeholder="48500" value={form.price} onChange={e=>set('price',e.target.value)} />
              </div>
              <div>
                <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Old Price (₹)</label>
                <input type="number" className={inputCls} placeholder="Optional — shows discount" value={form.oldPrice} onChange={e=>set('oldPrice',e.target.value)} />
              </div>
              <div>
                <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Badge</label>
                <select className={inputCls} value={form.badge} onChange={e=>set('badge',e.target.value)}>
                  {BADGES.map(b=><option key={b} value={b}>{b||'None'}</option>)}
                </select>
              </div>
              <div>
                <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Rating</label>
                <input type="number" min="1" max="5" step="0.1" className={inputCls} placeholder="4.8" value={form.rating} onChange={e=>set('rating',e.target.value)} />
              </div>
              <div>
                <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">SKU</label>
                <input className={inputCls} placeholder="TF-SS-001" value={form.sku} onChange={e=>set('sku',e.target.value)} />
              </div>
              <div>
                <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Delivery Days</label>
                <input className={inputCls} placeholder="7–12 working days" value={form.deliveryDays} onChange={e=>set('deliveryDays',e.target.value)} />
              </div>
            </div>
          </>)}

          {/* ── IMAGES TAB ── */}
          {activeTab === 'images' && (<>
            {/* Add by URL */}
            <div>
              <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Add Image via URL</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <FiLink size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted"/>
                  <input className={`${inputCls} pl-8`} placeholder="https://images.unsplash.com/…"
                         value={imgUrl} onChange={e=>setImgUrl(e.target.value)}
                         onKeyDown={e=>e.key==='Enter'&&addImageUrl()} />
                </div>
                <button onClick={addImageUrl} className="bg-gold text-deep px-4 rounded-lg text-sm font-semibold border-none cursor-pointer hover:opacity-85 flex-shrink-0">Add</button>
              </div>
            </div>

            {/* Upload from device */}
            <div>
              <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Upload from Device (multiple)</label>
              <input type="file" ref={fileRef} accept="image/*" multiple className="hidden" onChange={addImageFile} />
              <button onClick={()=>fileRef.current?.click()}
                      className="w-full border-2 border-dashed border-admin-border rounded-lg p-4 text-center cursor-pointer hover:border-gold transition-colors bg-transparent flex items-center justify-center gap-2 text-admin-muted text-sm">
                <FiUpload size={16}/> Click to upload images (select multiple)
              </button>
            </div>

            {/* Image grid */}
            {form.images.length > 0 && (
              <div>
                <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-2">
                  Gallery ({form.images.length} image{form.images.length!==1?'s':''}) — first image is the main product image
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-admin-surface">
                        <img src={img.url} alt={`Product ${i+1}`} className="w-full h-full object-cover"
                             onError={e=>e.target.style.display='none'} />
                      </div>
                      {i===0 && <span className="absolute top-1 left-1 bg-gold text-deep text-[0.55rem] px-1.5 py-0.5 rounded font-semibold">MAIN</span>}
                      <button onClick={()=>removeImage(i)}
                              className="absolute top-1 right-1 w-6 h-6 bg-admin-red rounded-full flex items-center justify-center
                                         opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer text-white">
                        <FiX size={11}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>)}

          {/* ── SPECS & DESC TAB ── */}
          {activeTab === 'specs' && (<>
            <div>
              <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Short Description (product card)</label>
              <textarea rows={2} className={`${inputCls} resize-none`} placeholder="Brief description shown on product cards and listing pages…"
                        value={form.desc} onChange={e=>set('desc',e.target.value)} />
            </div>
            <div>
              <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Full Description (product page)</label>
              <textarea rows={4} className={`${inputCls} resize-none`} placeholder="Detailed description shown on the product detail page…"
                        value={form.longDesc} onChange={e=>set('longDesc',e.target.value)} />
            </div>

            {/* Specs key-value */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider">Specifications</label>
                <button onClick={()=>addRow('specs',{key:'',value:''})} className="text-gold text-xs flex items-center gap-1 bg-transparent border-none cursor-pointer hover:opacity-80">
                  <FiPlus size={12}/> Add Row
                </button>
              </div>
              {form.specs.map((s,i)=>(
                <div key={i} className="flex gap-2 mb-2">
                  <input className={`${inputCls} flex-1`} placeholder="Key (e.g. Material)" value={s.key} onChange={e=>updateRow('specs',i,'key',e.target.value)} />
                  <input className={`${inputCls} flex-1`} placeholder="Value (e.g. Sheesham Wood)" value={s.value} onChange={e=>updateRow('specs',i,'value',e.target.value)} />
                  <button onClick={()=>removeRow('specs',i)} className="text-admin-red bg-transparent border-none cursor-pointer hover:opacity-80 flex-shrink-0"><FiTrash2 size={15}/></button>
                </div>
              ))}
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider">Key Features</label>
                <button onClick={()=>addRow('features',{val:''})} className="text-gold text-xs flex items-center gap-1 bg-transparent border-none cursor-pointer hover:opacity-80">
                  <FiPlus size={12}/> Add Feature
                </button>
              </div>
              {form.features.map((f,i)=>(
                <div key={i} className="flex gap-2 mb-2">
                  <input className={`${inputCls} flex-1`} placeholder="e.g. Mortise-and-tenon joinery" value={f.val} onChange={e=>updateRow('features',i,'val',e.target.value)} />
                  <button onClick={()=>removeRow('features',i)} className="text-admin-red bg-transparent border-none cursor-pointer hover:opacity-80 flex-shrink-0"><FiTrash2 size={15}/></button>
                </div>
              ))}
            </div>
          </>)}

          {/* ── VARIANTS TAB ── */}
          {activeTab === 'variants' && (<>
            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider">Sizes &amp; Prices</label>
                <button onClick={()=>addRow('sizes',{label:'',price:''})} className="text-gold text-xs flex items-center gap-1 bg-transparent border-none cursor-pointer hover:opacity-80">
                  <FiPlus size={12}/> Add Size
                </button>
              </div>
              {form.sizes.map((s,i)=>(
                <div key={i} className="flex gap-2 mb-2">
                  <input className={`${inputCls} flex-1`} placeholder="Size label (e.g. 2-Seater)" value={s.label} onChange={e=>updateRow('sizes',i,'label',e.target.value)} />
                  <input type="number" className={`${inputCls} w-32`} placeholder="Price ₹" value={s.price} onChange={e=>updateRow('sizes',i,'price',e.target.value)} />
                  <button onClick={()=>removeRow('sizes',i)} className="text-admin-red bg-transparent border-none cursor-pointer hover:opacity-80 flex-shrink-0"><FiTrash2 size={15}/></button>
                </div>
              ))}
            </div>

            {/* Colours */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider">Available Colours (optional)</label>
                <button onClick={()=>set('colours',[])} className="text-admin-muted text-xs bg-transparent border-none cursor-pointer">Reset</button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {COLOUR_PRESETS.map(c=>(
                  <button key={c.hex} onClick={()=>{ const exists=form.colours.find(x=>x.hex===c.hex); if(exists) set('colours',form.colours.filter(x=>x.hex!==c.hex)); else set('colours',[...form.colours,c]); }}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border cursor-pointer transition-all font-dm
                                      ${form.colours.find(x=>x.hex===c.hex) ? 'border-gold text-gold bg-gold/10' : 'border-admin-border text-admin-muted hover:border-gold'}`}>
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{background:c.hex}}/>
                    {c.label}
                  </button>
                ))}
              </div>
              {form.colours.length>0 && (
                <p className="text-admin-muted text-xs">Selected: {form.colours.map(c=>c.label).join(', ')}</p>
              )}
            </div>

            {/* Fabric */}
            <div>
              <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-2">Fabric / Material Options (optional)</label>
              <div className="flex flex-wrap gap-2">
                {FABRIC_OPTIONS.map(f=>(
                  <button key={f} onClick={()=>{ const exists=form.fabrics.includes(f); set('fabrics', exists ? form.fabrics.filter(x=>x!==f) : [...form.fabrics,f]); }}
                          className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer transition-all font-dm
                                      ${form.fabrics.includes(f) ? 'border-gold text-gold bg-gold/10' : 'border-admin-border text-admin-muted hover:border-gold'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </>)}

          {/* ── 3D MODEL TAB ── */}
          {activeTab === '3d' && (<>
            <div>
              <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-2">
                Upload .OBJ 3D Model <span className="normal-case opacity-50 text-[0.65rem]">optional</span>
              </label>
              <input type="file" ref={objRef} accept=".obj" className="hidden" onChange={handleOBJ} />
              <button onClick={()=>objRef.current?.click()}
                      className="w-full border-2 border-dashed border-admin-border rounded-lg p-5 text-center cursor-pointer hover:border-gold transition-colors bg-transparent text-admin-muted">
                <div className="text-2xl mb-2">🧊</div>
                <p className="text-sm">Click to upload .OBJ file</p>
                <p className="text-[0.68rem] mt-1 opacity-60">Customers will see this model in the interactive 3D viewer on the product page</p>
              </button>

              {objName && (
                <div className="mt-3 bg-admin-surface rounded-lg px-4 py-2 text-admin-green text-xs flex items-center gap-2">
                  <span>✓</span> {objName}
                </div>
              )}

              {objGeo && (
                <div className="mt-3">
                  <p className="text-admin-muted text-[0.68rem] mb-2">3D Preview (drag to rotate):</p>
                  <canvas ref={canvasRef} className="w-full h-48 rounded-xl bg-[#1a1a22] cursor-grab active:cursor-grabbing" />
                </div>
              )}

              <div className="mt-4 bg-admin-surface rounded-xl p-4">
                <p className="text-admin-muted text-xs leading-relaxed">
                  <strong className="text-admin-text">No .OBJ file?</strong> That's fine — the 3D viewer will use the built-in model
                  based on the "3D Model Type" you selected in the Basic tab. Custom .OBJ models give customers a more accurate
                  preview of the exact product.
                </p>
              </div>
            </div>
          </>)}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-admin-border flex-shrink-0">
          <button onClick={onClose} className="flex-1 bg-white/[0.05] border border-admin-border text-admin-muted py-2.5 rounded-lg text-sm font-dm cursor-pointer hover:text-admin-text transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 bg-gold text-deep py-2.5 rounded-lg text-sm font-dm font-semibold cursor-pointer hover:opacity-85 transition-opacity border-none">
            {editId !== null ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

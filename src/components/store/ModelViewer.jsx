import toast from 'react-hot-toast';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectModelState, setCurrentModel, setSelectedColor, setSelectedSize, setModelTab, setCustomOBJ,
  openQuoteModal, showToast,
} from '../../store/slices/uiSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { use3DCanvas } from '../../hooks/use3DCanvas';
import { drawSofa, drawAlmirah, drawBed, drawChair, drawOBJModel, parseOBJ } from '../../utils/engine3d';
import { useReveal } from '../../hooks/useReveal';
import { MODEL_META, COLOUR_OPTIONS } from '../../data/constants';
import { inr } from '../../utils/formatters';

const MODEL_TABS = { details:'Details', specs:'Specs', delivery:'Delivery' };
const TAB_CONTENT = {
  details:  'Premium sheesham wood frame · High-density foam · Removable covers · 5-year warranty',
  specs:    'L: 220cm × D: 90cm × H: 85cm · Weight: 62kg · Fabric: 100% polyester',
  delivery: 'Free delivery in Indore · Assembly included · 7-day easy returns · Ships in 7–14 days',
};

export default function ModelViewer() {
  const dispatch     = useDispatch();
  const { model, color, size, price, tab, customGeo } = useSelector(selectModelState);
  const revealRef    = useReveal();
  const fileInputRef = useRef(null);

  const { canvasRef } = use3DCanvas(
    (ctx, cx, cy, rx, ry) => {
      if (customGeo)         drawOBJModel(ctx, cx, cy, rx, ry, customGeo, color);
      else if (model==='sofa')    drawSofa(ctx, cx, cy, rx, ry, color);
      else if (model==='almirah') drawAlmirah(ctx, cx, cy, rx, ry, color);
      else if (model==='bed')     drawBed(ctx, cx, cy, rx, ry, color);
      else if (model==='chair')   drawChair(ctx, cx, cy, rx, ry, color);
    },
    [model, color, customGeo]
  );

  const meta = MODEL_META[model] || MODEL_META.sofa;
  const sizes = Object.keys(meta.prices);

  const handleAddToCart = () => {
    dispatch(addToCart({ id: 200 + Date.now() % 1000, name: `${meta.name} (${size})`, img: '', price }));
  };

  const handleOBJUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.obj')) { dispatch(showToast('⚠️ Only .obj files supported')); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const geo = parseOBJ(ev.target.result);
      if (!geo.positions.length) { dispatch(showToast('⚠️ Invalid OBJ file')); return; }
      dispatch(setCustomOBJ(geo));
      dispatch(showToast('✅ Custom 3D model loaded!'));
    };
    reader.readAsText(file);
  };

  return (
    <section id="model-viewer" ref={revealRef} className="reveal py-20 px-6 md:px-12 lg:px-16 bg-ivory">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-bark text-[0.7rem] tracking-[0.15em] uppercase mb-2">Interactive 3D Explorer</p>
        <h2 className="font-cormorant font-light text-deep text-3xl md:text-4xl lg:text-5xl">
          See it before you <em className="text-bark">buy it</em>
        </h2>
      </div>

      {/* Model switcher */}
      <div className="flex flex-wrap justify-center gap-2 mb-10" role="group" aria-label="Choose furniture type">
        {Object.entries(MODEL_META).map(([key, m]) => {
          const icons = { sofa:'🛋️', almirah:'🗄️', bed:'🛏️', chair:'🪑' };
          return (
            <button key={key} onClick={() => dispatch(setCurrentModel(key))}
                    className={`px-5 py-2 rounded-xl text-sm font-dm border-2 transition-all cursor-pointer
                                ${model===key ? 'bg-deep text-cream border-deep' : 'bg-cream border-warm text-muted hover:border-deep hover:text-deep'}`}>
              {icons[key]} {m.name.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-center">

        {/* Canvas */}
        <div className="bg-cream rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute bottom-0 left-[15%] right-[15%] h-10 bg-[radial-gradient(ellipse_at_center,rgba(44,31,18,0.08),transparent_70%)]" aria-hidden="true" />
          <canvas ref={canvasRef} className="w-full h-[300px] md:h-[380px] cursor-grab active:cursor-grabbing" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-muted text-[0.68rem] bg-white/85 px-3 py-1 rounded-full whitespace-nowrap">
            ↺ Drag to rotate · Scroll to zoom
          </div>
        </div>

        {/* Controls */}
        <div>
          <h3 className="font-cormorant font-light text-deep text-3xl mb-1">{meta.name}</h3>
          <div className="font-cormorant font-semibold text-bark text-2xl mb-3">{inr(price)}</div>
          <p className="text-muted text-sm leading-relaxed mb-5">{meta.desc}</p>

          {/* Size selector */}
          <div className="mb-4">
            <h4 className="text-muted text-[0.72rem] uppercase tracking-[0.1em] mb-2">Size</h4>
            <div className="flex flex-wrap gap-2">
              {sizes.map(s => (
                <button key={s} onClick={() => dispatch(setSelectedSize({ size:s, price: meta.prices[s] }))}
                        className={`px-4 py-2 rounded-lg text-sm font-dm border-[1.5px] cursor-pointer transition-all
                                    ${size===s ? 'border-bark bg-bark text-white' : 'border-warm text-deep hover:border-bark hover:bg-bark hover:text-white'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Colour selector */}
          <div className="mb-5">
            <h4 className="text-muted text-[0.72rem] uppercase tracking-[0.1em] mb-2">Colour</h4>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Select colour">
              {COLOUR_OPTIONS.map(c => (
                <button key={c.hex} title={c.label} aria-label={c.label}
                        onClick={() => dispatch(setSelectedColor(c.hex))}
                        className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer
                                    ${color===c.hex ? 'border-bark scale-110' : 'border-transparent hover:border-bark hover:scale-110'}`}
                        style={{ background: c.hex }} />
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-warm flex mb-4" role="tablist">
            {Object.entries(MODEL_TABS).map(([key, label]) => (
              <button key={key} role="tab" aria-selected={tab===key} onClick={() => dispatch(setModelTab(key))}
                      className={`px-3 py-2 text-sm font-dm border-none cursor-pointer bg-transparent
                                  border-b-2 -mb-px transition-all
                                  ${tab===key ? 'text-bark border-bark' : 'text-muted border-transparent hover:text-deep'}`}>
                {label}
              </button>
            ))}
          </div>
          <p role="tabpanel" className="text-muted text-sm leading-relaxed mb-5">{TAB_CONTENT[tab]}</p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button onClick={handleAddToCart}
                    className="flex-1 min-w-[120px] bg-deep text-cream py-3 rounded-xl text-sm font-dm font-medium
                               hover:bg-wood transition-all active:scale-95 cursor-pointer border-none">
              Add to Cart
            </button>
            <button onClick={() => dispatch(openQuoteModal())}
                    className="flex-1 min-w-[120px] border-2 border-bark text-bark py-3 rounded-xl text-sm font-dm font-medium
                               hover:bg-bark hover:text-white transition-all active:scale-95 cursor-pointer bg-transparent">
              Get Quote
            </button>
          </div>

          {/* OBJ upload */}
          <div className="mt-4">
            <input type="file" ref={fileInputRef} accept=".obj" className="hidden" onChange={handleOBJUpload} />
            <button onClick={() => fileInputRef.current?.click()}
                    className="text-muted text-xs hover:text-bark transition-colors cursor-pointer bg-transparent border-none underline">
              🧊 Upload custom .OBJ 3D model
            </button>
            {customGeo && <span className="ml-2 text-sage text-xs">✓ Custom model loaded</span>}
          </div>
        </div>
      </div>
    </section>
  );
}

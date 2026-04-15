import { useEffect, useMemo, useRef, useState } from "react";
import {
  drawAlmirah,
  drawBed,
  drawChair,
  drawOBJModel,
  drawSofa,
  parseOBJ,
  renderCanvas,
  RotController,
} from "../../lib/engine3d";
import { formatCurrency } from "../../utils/format";

const palette = ["#8b6b4a", "#4a6b8b", "#6b8b4a", "#8b4a4a", "#d3c5b0", "#3a3a3a"];

export default function ModelViewerSection({ meta, products, onAddToCart, onOpenQuote, onTrack }) {
  const [modelKey, setModelKey] = useState("sofa");
  const [color, setColor] = useState("#8b6b4a");
  const [size, setSize] = useState(meta.sofa.sizes[1]);
  const [tab, setTab] = useState("details");
  const canvasRef = useRef(null);

  const currentProduct = useMemo(
    () => products.find((product) => product.modelType === modelKey && product.active !== false),
    [modelKey, products]
  );

  useEffect(() => {
    const controller = new RotController();
    controller.autoSpeed = 0.003;
    const cleanup = controller.attach(canvasRef.current);
    let frameId = 0;
    const geometry = currentProduct?.modelData ? parseOBJ(currentProduct.modelData) : null;

    const loop = () => {
      renderCanvas(canvasRef.current, controller, (ctx, cx, cy, rx, ry) => {
        if (geometry) {
          drawOBJModel(ctx, cx, cy, rx, ry, geometry, color);
          return;
        }
        if (modelKey === "sofa") drawSofa(ctx, cx, cy, rx, ry, color);
        if (modelKey === "almirah") drawAlmirah(ctx, cx, cy, rx, ry, color);
        if (modelKey === "bed") drawBed(ctx, cx, cy, rx, ry, color);
        if (modelKey === "chair") drawChair(ctx, cx, cy, rx, ry, color);
      });
      frameId = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      cleanup();
      cancelAnimationFrame(frameId);
    };
  }, [color, currentProduct?.modelData, modelKey]);

  useEffect(() => {
    setSize(meta[modelKey].sizes[0]);
  }, [meta, modelKey]);

  const model = meta[modelKey];

  return (
    <section id="model-viewer" className="section-shell alt-shell">
      <div className="section-head">
        <span>Interactive 3D Explorer</span>
        <h2>See form, scale, and color before you commit</h2>
      </div>
      <div className="switch-row">
        {Object.keys(meta).map((key) => (
          <button
            key={key}
            type="button"
            className={`switch-btn ${key === modelKey ? "active" : ""}`}
            onClick={() => {
              setModelKey(key);
              onTrack("view_3d", { item: meta[key].name });
            }}
          >
            {meta[key].name.split(" ")[0]}
          </button>
        ))}
      </div>
      <div className="viewer-layout">
        <div className="viewer-canvas-card">
          <canvas ref={canvasRef} className="model-canvas" />
          <div className="canvas-note">Drag to rotate. Scroll to zoom.</div>
        </div>
        <div className="viewer-info-card">
          <h3>{model.name}</h3>
          <div className="price-line">{formatCurrency(size[1])}</div>
          <p>{currentProduct?.desc || model.desc}</p>
          <div className="selector-block">
            <div className="selector-title">Size</div>
            <div className="chip-row">
              {model.sizes.map((entry) => (
                <button
                  key={entry[0]}
                  type="button"
                  className={`chip ${entry[0] === size[0] ? "active" : ""}`}
                  onClick={() => setSize(entry)}
                >
                  {entry[0]}
                </button>
              ))}
            </div>
          </div>
          <div className="selector-block">
            <div className="selector-title">Colour</div>
            <div className="color-row">
              {palette.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`color-dot ${value === color ? "active" : ""}`}
                  style={{ background: value }}
                  onClick={() => setColor(value)}
                  aria-label={`Select ${value}`}
                />
              ))}
            </div>
          </div>
          <div className="tab-row">
            {["details", "specs", "delivery"].map((value) => (
              <button
                key={value}
                type="button"
                className={`tab-btn ${tab === value ? "active" : ""}`}
                onClick={() => setTab(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="tab-panel">
            {tab === "details" && (
              <p>Premium timber frame, high-density cushioning, handcrafted assembly, and made-for-home customization.</p>
            )}
            {tab === "specs" && (
              <p>Dimensions vary by size. Finish, fabric, and accessory combinations can be finalized with the design team.</p>
            )}
            {tab === "delivery" && (
              <p>Free delivery in Indore on qualifying orders, assembly included, and delivery scheduling support included.</p>
            )}
          </div>
          <div className="action-row">
            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                onAddToCart({
                  id: `custom-${modelKey}-${size[0]}`,
                  name: `${model.name} (${size[0]})`,
                  price: size[1],
                  qty: 1,
                  img: currentProduct?.img || "",
                })
              }
            >
              Add to Cart
            </button>
            <button type="button" className="secondary-btn" onClick={onOpenQuote}>
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

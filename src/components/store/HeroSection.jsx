import { useEffect, useRef } from "react";
import { drawSofa, renderCanvas, RotController } from "../../lib/engine3d";

export default function HeroSection() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const controller = new RotController();
    const cleanup = controller.attach(canvasRef.current);
    let frameId = 0;

    const loop = () => {
      renderCanvas(canvasRef.current, controller, (ctx, cx, cy, rx, ry) =>
        drawSofa(ctx, cx, cy, rx, ry, "#8b6b4a")
      );
      frameId = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      cleanup();
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section id="hero" className="hero-section">
      <div className="hero-copy">
        <div className="eyebrow">Indore's trusted handcrafted furniture studio</div>
        <h1>
          Furniture that makes a home feel
          <em> intentional</em>
        </h1>
        <p>
          Premium sofas, wardrobes, beds, dining sets, and custom planning support for homes across
          Indore, Bhopal, and Ujjain.
        </p>
        <div className="hero-cta">
          <a className="primary-btn" href="#products">
            Explore Collection
          </a>
          <a className="secondary-btn" href="#model-viewer">
            View in 3D
          </a>
        </div>
        <div className="hero-stats">
          <div>
            <strong>12K+</strong>
            <span>happy homes</span>
          </div>
          <div>
            <strong>500+</strong>
            <span>designs</span>
          </div>
          <div>
            <strong>18</strong>
            <span>years of trust</span>
          </div>
        </div>
      </div>
      <div className="hero-stage">
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="canvas-note">Drag to rotate. Scroll to zoom.</div>
      </div>
    </section>
  );
}

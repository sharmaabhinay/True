import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "../../utils/format";

function drawRoom(canvas, items) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const pixelRatio = window.devicePixelRatio || 1;
  const width = canvas.offsetWidth * pixelRatio;
  const height = canvas.offsetHeight * pixelRatio;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const displayWidth = canvas.offsetWidth;
  const displayHeight = canvas.offsetHeight;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.clearRect(0, 0, displayWidth, displayHeight);
  ctx.fillStyle = "#fbf5ed";
  ctx.fillRect(0, 0, displayWidth, displayHeight);
  ctx.strokeStyle = "#eadbca";

  for (let x = 0; x < displayWidth; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, displayHeight);
    ctx.stroke();
  }
  for (let y = 0; y < displayHeight; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(displayWidth, y);
    ctx.stroke();
  }

  items.forEach((item) => {
    const x = item.px - item.w / 2;
    const y = item.py - item.h / 2;
    ctx.fillStyle = `${item.color}cc`;
    ctx.strokeStyle = item.color;
    ctx.lineWidth = 1.4;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x, y, item.w, item.h, 8);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(x, y, item.w, item.h);
      ctx.strokeRect(x, y, item.w, item.h);
    }
    ctx.fillStyle = "#2c1f12";
    ctx.textAlign = "center";
    ctx.font = "16px sans-serif";
    ctx.fillText(item.emoji, item.px, item.py + 4);
    ctx.font = "12px sans-serif";
    ctx.fillText(item.name, item.px, item.py + item.h / 2 + 16);
  });
}

export default function RoomPlannerSection({ items, onToast }) {
  const canvasRef = useRef(null);
  const dragRef = useRef({ itemId: null, offsetX: 0, offsetY: 0 });
  const [placed, setPlaced] = useState([]);

  useEffect(() => {
    drawRoom(canvasRef.current, placed);
  }, [placed]);

  useEffect(() => {
    const onResize = () => drawRoom(canvasRef.current, placed);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [placed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const point = (event) => {
      const rect = canvas.getBoundingClientRect();
      const source = event.touches?.[0] ?? event;
      return { x: source.clientX - rect.left, y: source.clientY - rect.top };
    };

    const start = (event) => {
      const { x, y } = point(event);
      const hit = [...placed].reverse().find(
        (item) => Math.abs(item.px - x) < item.w / 2 + 8 && Math.abs(item.py - y) < item.h / 2 + 8
      );
      if (!hit) return;
      dragRef.current = { itemId: hit.id, offsetX: x - hit.px, offsetY: y - hit.py };
    };

    const move = (event) => {
      if (!dragRef.current.itemId) return;
      const { x, y } = point(event);
      setPlaced((current) =>
        current.map((item) =>
          item.id === dragRef.current.itemId
            ? { ...item, px: x - dragRef.current.offsetX, py: y - dragRef.current.offsetY }
            : item
        )
      );
    };

    const end = () => {
      dragRef.current = { itemId: null, offsetX: 0, offsetY: 0 };
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("mouseup", end);
    window.addEventListener("touchend", end);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("touchstart", start);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", end);
      window.removeEventListener("touchend", end);
    };
  }, [placed]);

  const addItem = (item) => {
    if (placed.some((entry) => entry.name === item.name)) return;
    setPlaced((current) => [
      ...current,
      {
        ...item,
        id: `${item.name}-${Date.now()}`,
        px: 90 + Math.random() * 180,
        py: 90 + Math.random() * 140,
      },
    ]);
  };

  return (
    <section id="room-planner" className="section-shell">
      <div className="section-head">
        <span>Room Planner</span>
        <h2>Place furniture, test layouts, and plan with confidence</h2>
      </div>
      <div className="planner-layout">
        <div className="planner-stage">
          <canvas ref={canvasRef} className="room-canvas" />
        </div>
        <div className="planner-panel">
          <h3>Add furniture</h3>
          <p>Click to place items. Drag on the canvas to rearrange them.</p>
          <div className="planner-list">
            {items.map((item) => (
              <button key={item.name} type="button" className="planner-item" onClick={() => addItem(item)}>
                <span>{item.emoji}</span>
                <div>
                  <strong>{item.name}</strong>
                  <small>{formatCurrency(item.price)}</small>
                </div>
              </button>
            ))}
          </div>
          <button type="button" className="secondary-btn full-btn" onClick={() => setPlaced([])}>
            Clear Room
          </button>
          <button
            type="button"
            className="primary-btn full-btn"
            onClick={() => onToast("Design idea saved for your session.")}
          >
            Save Design
          </button>
        </div>
      </div>
    </section>
  );
}

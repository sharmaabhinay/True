function project(x, y, z, rX, rY, cx, cy) {
  const x1 = x * Math.cos(rY) - z * Math.sin(rY);
  const z1 = x * Math.sin(rY) + z * Math.cos(rY);
  const y2 = y * Math.cos(rX) - z1 * Math.sin(rX);
  const z2 = y * Math.sin(rX) + z1 * Math.cos(rX);
  const s = 600 / (600 + z2 + 300);
  return { x: cx + x1 * s, y: cy + y2 * s, z: z2 };
}

function hexShift(hex, amount) {
  if (!hex || hex.length < 7) return hex;
  const clamp = (value) => Math.min(255, Math.max(0, value + amount));
  const rgb = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
  return `#${rgb.map((value) => clamp(value).toString(16).padStart(2, "0")).join("")}`;
}

function makeFaces(color) {
  return [
    hexShift(color, 30),
    hexShift(color, -30),
    hexShift(color, -20),
    hexShift(color, 20),
    hexShift(color, -40),
    hexShift(color, 50),
  ];
}

function drawCuboid(ctx, cx, cy, rX, rY, ox, oy, oz, w, h, d, colors) {
  const verts = [
    [ox - w / 2, oy - h / 2, oz - d / 2],
    [ox + w / 2, oy - h / 2, oz - d / 2],
    [ox + w / 2, oy + h / 2, oz - d / 2],
    [ox - w / 2, oy + h / 2, oz - d / 2],
    [ox - w / 2, oy - h / 2, oz + d / 2],
    [ox + w / 2, oy - h / 2, oz + d / 2],
    [ox + w / 2, oy + h / 2, oz + d / 2],
    [ox - w / 2, oy + h / 2, oz + d / 2],
  ].map(([x, y, z]) => project(x, y, z, rX, rY, cx, cy));

  const faces = [
    { idx: [4, 5, 6, 7], color: colors[0] },
    { idx: [0, 1, 2, 3], color: colors[1] },
    { idx: [0, 4, 7, 3], color: colors[2] },
    { idx: [1, 5, 6, 2], color: colors[3] },
    { idx: [3, 2, 6, 7], color: colors[4] },
    { idx: [0, 1, 5, 4], color: colors[5] },
  ];

  faces.sort(
    (a, b) =>
      a.idx.reduce((sum, i) => sum + verts[i].z, 0) -
      b.idx.reduce((sum, i) => sum + verts[i].z, 0)
  );

  faces.forEach((face) => {
    ctx.beginPath();
    face.idx.forEach((i, index) => {
      const point = verts[i];
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.fillStyle = face.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  });
}

export function drawSofa(ctx, cx, cy, rX, rY, color = "#8b6b4a") {
  const frame = makeFaces("#5c3d1e");
  const gold = ["#c8a86b", "#a8882b", "#b8982b", "#d8b87b", "#a0800b", "#e0c08b"];
  [[-60, 40, 0], [60, 40, 0], [-60, 40, -40], [60, 40, -40]].forEach(([x, y, z]) =>
    drawCuboid(ctx, cx, cy, rX, rY, x, y, z, 18, 8, 18, frame)
  );
  drawCuboid(ctx, cx, cy, rX, rY, 0, 20, -10, 180, 30, 80, makeFaces(color));
  drawCuboid(ctx, cx, cy, rX, rY, 0, -28, -45, 180, 70, 18, makeFaces(hexShift(color, -15)));
  drawCuboid(ctx, cx, cy, rX, rY, -100, 10, -10, 22, 50, 80, makeFaces(hexShift(color, -10)));
  drawCuboid(ctx, cx, cy, rX, rY, 100, 10, -10, 22, 50, 80, makeFaces(hexShift(color, -10)));
  drawCuboid(ctx, cx, cy, rX, rY, -40, -22, -43, 55, 58, 14, makeFaces(hexShift(color, 10)));
  drawCuboid(ctx, cx, cy, rX, rY, 40, -22, -43, 55, 58, 14, makeFaces(hexShift(color, 10)));
  drawCuboid(ctx, cx, cy, rX, rY, 0, 18, 25, 180, 6, 3, makeFaces(hexShift(color, -25)));
  drawCuboid(ctx, cx, cy, rX, rY, -100, 10, -10, 4, 52, 4, gold);
  drawCuboid(ctx, cx, cy, rX, rY, 100, 10, -10, 4, 52, 4, gold);
}

export function drawAlmirah(ctx, cx, cy, rX, rY, color = "#6b4c2a") {
  const gold = ["#c8a86b", "#a8882b", "#b8982b", "#d8b87b", "#a0800b", "#e0c08b"];
  drawCuboid(ctx, cx, cy, rX, rY, 0, 0, 0, 160, 240, 60, makeFaces(color));
  drawCuboid(ctx, cx, cy, rX, rY, -42, 5, 31, 72, 220, 4, makeFaces(hexShift(color, 25)));
  drawCuboid(ctx, cx, cy, rX, rY, 42, 5, 31, 72, 220, 4, makeFaces(hexShift(color, 25)));
  drawCuboid(ctx, cx, cy, rX, rY, -12, 5, 34, 6, 18, 4, gold);
  drawCuboid(ctx, cx, cy, rX, rY, 12, 5, 34, 6, 18, 4, gold);
}

export function drawBed(ctx, cx, cy, rX, rY, color = "#7a6a5a") {
  const frame = makeFaces("#5c3d1e");
  drawCuboid(ctx, cx, cy, rX, rY, 0, 10, 10, 200, 25, 130, makeFaces("#e8ddd0"));
  drawCuboid(ctx, cx, cy, rX, rY, 0, 28, 10, 205, 10, 135, frame);
  drawCuboid(ctx, cx, cy, rX, rY, 0, -35, -54, 200, 90, 20, makeFaces(color));
  [[-95, -50], [-95, 60], [95, -50], [95, 60]].forEach(([x, z]) =>
    drawCuboid(ctx, cx, cy, rX, rY, x, 40, z, 12, 18, 12, frame)
  );
}

export function drawChair(ctx, cx, cy, rX, rY, color = "#c8a86b") {
  const frame = makeFaces("#5c3d1e");
  drawCuboid(ctx, cx, cy, rX, rY, 0, 0, 0, 100, 18, 90, makeFaces(color));
  drawCuboid(ctx, cx, cy, rX, rY, 0, -45, -36, 100, 80, 14, makeFaces(hexShift(color, -20)));
  [[-42, 35], [-42, -35], [42, 35], [42, -35]].forEach(([x, z]) =>
    drawCuboid(ctx, cx, cy, rX, rY, x, 45, z, 10, 80, 10, frame)
  );
}

export function parseOBJ(text) {
  const positions = [];
  const faces = [];
  text.split("\n").forEach((line) => {
    const parts = line.trim().split(/\s+/);
    if (parts[0] === "v") positions.push([+parts[1], +parts[2], +parts[3]]);
    if (parts[0] === "f") {
      const ids = parts.slice(1).map((value) => parseInt(value.split("/")[0], 10) - 1);
      for (let i = 1; i < ids.length - 1; i += 1) faces.push([ids[0], ids[i], ids[i + 1]]);
    }
  });
  return { positions, faces };
}

export function drawOBJModel(ctx, cx, cy, rX, rY, geo, color = "#8b6b4a") {
  if (!geo?.positions?.length) return;
  const pts = geo.positions.map(([x, y, z]) => project(x * 80, y * 80, z * 80, rX, rY, cx, cy));
  const tris = geo.faces
    .map(([a, b, c]) => ({ a, b, c, z: (pts[a].z + pts[b].z + pts[c].z) / 3 }))
    .sort((a, b) => a.z - b.z);

  ctx.globalAlpha = 0.88;
  tris.forEach(({ a, b, c }) => {
    ctx.beginPath();
    ctx.moveTo(pts[a].x, pts[a].y);
    ctx.lineTo(pts[b].x, pts[b].y);
    ctx.lineTo(pts[c].x, pts[c].y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.04)";
    ctx.lineWidth = 0.3;
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
}

export class RotController {
  constructor() {
    this.x = 0.25;
    this.y = 0.4;
    this.autoAngle = 0;
    this.autoSpeed = 0.004;
    this.zoomScale = 1;
    this.isDragging = false;
    this.lastX = 0;
    this.lastY = 0;
  }

  attach(canvas) {
    if (!canvas) return () => {};

    const start = (event) => {
      this.isDragging = true;
      const point = event.touches?.[0] ?? event;
      this.lastX = point.clientX;
      this.lastY = point.clientY;
    };

    const move = (event) => {
      if (!this.isDragging) return;
      const point = event.touches?.[0] ?? event;
      this.y += (point.clientX - this.lastX) * 0.012;
      this.x += (point.clientY - this.lastY) * 0.007;
      this.x = Math.max(-0.6, Math.min(0.9, this.x));
      this.lastX = point.clientX;
      this.lastY = point.clientY;
    };

    const end = () => {
      this.isDragging = false;
    };

    const wheel = (event) => {
      event.preventDefault();
      this.zoomScale = Math.min(1.8, Math.max(0.4, this.zoomScale - event.deltaY * 0.001));
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("mouseup", end);
    window.addEventListener("touchend", end);
    canvas.addEventListener("wheel", wheel, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("touchstart", start);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", end);
      window.removeEventListener("touchend", end);
      canvas.removeEventListener("wheel", wheel);
    };
  }

  tick() {
    if (!this.isDragging) this.autoAngle += this.autoSpeed;
  }

  get rotY() {
    return this.y + this.autoAngle;
  }
}

export function renderCanvas(canvas, controller, drawFn) {
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
  controller.tick();
  ctx.save();
  ctx.translate(displayWidth / 2, displayHeight / 2);
  ctx.scale(controller.zoomScale, controller.zoomScale);
  ctx.translate(-displayWidth / 2, -displayHeight / 2);
  drawFn(ctx, displayWidth / 2, displayHeight / 2 + 20, controller.x, controller.rotY);
  ctx.restore();
}

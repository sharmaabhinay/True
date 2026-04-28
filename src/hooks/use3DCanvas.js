import { useEffect, useRef } from 'react';
import { RotController, renderCanvas } from '../utils/engine3d';

export function use3DCanvas(drawFn, deps = []) {
  const canvasRef = useRef(null);
  const rotRef    = useRef(new RotController());
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cleanup = rotRef.current.attach(canvas);

    const loop = () => {
      renderCanvas(canvas, rotRef.current, drawFn);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (cleanup) cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { canvasRef, rotRef };
}

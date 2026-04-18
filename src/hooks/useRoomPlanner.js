import { useState, useRef, useCallback, useEffect } from 'react';
import { ROOM_ITEMS } from '../data/constants';

export function useRoomPlanner(canvasRef) {
  const [placed, setPlaced] = useState([]);
  const dragRef = useRef({ item: null, offX: 0, offY: 0 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pr  = window.devicePixelRatio || 1;
    const nw  = canvas.offsetWidth * pr, nh = canvas.offsetHeight * pr;
    if (canvas.width !== nw || canvas.height !== nh) { canvas.width = nw; canvas.height = nh; }
    ctx.setTransform(pr,0,0,pr,0,0);
    const W = canvas.offsetWidth, H = canvas.offsetHeight;

    ctx.fillStyle='#FAF7F2'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E8DDD0'; ctx.lineWidth=1;
    for (let x=0;x<W;x+=40){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y=0;y<H;y+=40){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    ctx.fillStyle='#E8DDD0'; ctx.fillRect(0,0,W,8); ctx.fillRect(0,0,8,H);
    ctx.fillStyle='#B0C8D8'; ctx.fillRect(W/2-40,0,80,8);

    placed.forEach(item => {
      ctx.save();
      ctx.fillStyle=item.color+'cc';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(item.px-item.w/2,item.py-item.h/2,item.w,item.h,6);
      else ctx.rect(item.px-item.w/2,item.py-item.h/2,item.w,item.h);
      ctx.fill();
      ctx.strokeStyle=item.color; ctx.lineWidth=1.5; ctx.stroke();
      ctx.font='16px sans-serif'; ctx.textAlign='center';
      ctx.fillStyle=item.color; ctx.fillText(item.emoji,item.px,item.py+6);
      ctx.font=`${Math.min(10,item.w/8)}px DM Sans,sans-serif`;
      ctx.fillStyle='#2C1F12'; ctx.fillText(item.name,item.px,item.py+item.h/2+14);
      ctx.restore();
    });
  }, [canvasRef, placed]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => { const onResize = () => draw(); window.addEventListener('resize',onResize); return()=>window.removeEventListener('resize',onResize); },[draw]);

  const getXY = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onDown = e => {
      const { x, y } = getXY(e, canvas);
      const hit = placed.find(i => Math.abs(i.px-x)<i.w/2+8 && Math.abs(i.py-y)<i.h/2+8);
      if (hit) { dragRef.current = { item: hit, offX: x-hit.px, offY: y-hit.py }; }
    };
    const onMove = e => {
      if (!dragRef.current.item) return;
      const { x, y } = getXY(e, canvas);
      dragRef.current.item.px = x - dragRef.current.offX;
      dragRef.current.item.py = y - dragRef.current.offY;
      draw();
    };
    const onUp = () => { dragRef.current.item = null; };

    canvas.addEventListener('mousedown',  onDown);
    canvas.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mousemove',  onMove);
    window.addEventListener('touchmove',  onMove, { passive: true });
    window.addEventListener('mouseup',    onUp);
    window.addEventListener('touchend',   onUp);
    return () => {
      canvas.removeEventListener('mousedown',  onDown);
      canvas.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('touchmove',  onMove);
      window.removeEventListener('mouseup',    onUp);
      window.removeEventListener('touchend',   onUp);
    };
  }, [canvasRef, placed, draw]);

  const addItem = (idx) => {
    const f = ROOM_ITEMS[idx];
    if (!placed.find(r => r.name === f.name)) {
      setPlaced(prev => [...prev, { ...f, px: 80+Math.random()*180, py: 80+Math.random()*140 }]);
    }
  };
  const clearRoom = () => setPlaced([]);

  return { placed, addItem, clearRoom };
}

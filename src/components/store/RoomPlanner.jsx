import toast from 'react-hot-toast';
import React, { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { useRoomPlanner } from '../../hooks/useRoomPlanner';
import { useDispatch } from 'react-redux';
import { showToast } from '../../store/slices/uiSlice';
import { ROOM_ITEMS } from '../../data/constants';
import { inr } from '../../utils/formatters';

export default function RoomPlanner() {
  const revealRef = useReveal();
  const canvasRef = useRef(null);
  const dispatch  = useDispatch();
  const { placed, addItem, clearRoom } = useRoomPlanner(canvasRef);

  return (
    <section id="room-viz" ref={revealRef} className="reveal py-20 px-6 md:px-12 lg:px-16 bg-cream">
      <div className="text-center mb-12">
        <p className="text-bark text-[0.7rem] tracking-[0.15em] uppercase mb-2">Room Planner</p>
        <h2 className="font-cormorant font-light text-deep text-3xl md:text-4xl lg:text-5xl">
          Plan your <em className="text-bark">space</em>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
        {/* Canvas */}
        <div className="bg-ivory rounded-2xl overflow-hidden border border-warm">
          <canvas ref={canvasRef} className="w-full h-[320px] md:h-[420px] block"
                  aria-label="Room planner — click items to place, drag to move" />
        </div>

        {/* Controls */}
        <div>
          <h4 className="font-cormorant text-xl text-deep mb-1">Add furniture</h4>
          <p className="text-muted text-xs mb-4">Click to place · Drag to rearrange</p>

          <div className="flex flex-col gap-2">
            {ROOM_ITEMS.map((item, i) => (
              <button key={item.name} onClick={() => addItem(i)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-left
                                  transition-all duration-200 bg-transparent
                                  ${placed.find(p => p.name===item.name)
                                    ? 'border-bark bg-bark/[0.04]'
                                    : 'border-warm hover:border-bark hover:bg-bark/[0.04]'}`}>
                <div className="w-11 h-10 rounded-lg bg-warm flex items-center justify-center text-xl flex-shrink-0">
                  {item.emoji}
                </div>
                <div>
                  <div className="text-sm font-medium text-deep">{item.name}</div>
                  <div className="text-bark text-xs">{inr(item.price)}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button onClick={clearRoom}
                    className="w-full bg-deep text-cream py-3 rounded-xl text-sm font-dm font-medium
                               hover:bg-wood transition-colors cursor-pointer border-none">
              Clear Room
            </button>
            <button onClick={() => toast('💾 Design saved!')}
                    className="w-full border-2 border-bark text-bark py-3 rounded-xl text-sm font-dm font-medium
                               hover:bg-bark hover:text-white transition-all cursor-pointer bg-transparent">
              Save Design
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

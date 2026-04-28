import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiTruck, FiHome, FiArrowRight } from 'react-icons/fi';

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
    color: ['#C8A86B','#8B6B4A','#2C1F12','#7A8C6E','#F5F0E8'][i % 5],
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: 720 }}
          transition={{ duration: 2.5 + Math.random(), delay: p.delay, ease: 'easeIn' }}
          className="absolute rounded-sm"
          style={{ width: p.size, height: p.size, background: p.color, top: 0 }}
        />
      ))}
    </div>
  );
}

const STEPS = [
  { icon: <FiCheckCircle size={18}/>, label: 'Order Placed',         done: true },
  { icon: <FiPackage     size={18}/>, label: 'Crafting Starts Soon', done: false },
  { icon: <FiTruck       size={18}/>, label: 'Delivery',             done: false },
  { icon: <FiHome        size={18}/>, label: 'At Your Door',         done: false },
];

export default function ThankYouPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6 relative overflow-hidden font-dm">
      <Confetti />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={show ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.2 }}
        className="relative z-10 text-center max-w-lg w-full bg-white rounded-3xl p-10 shadow-warm-lg"
      >
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.5 }}
          className="w-20 h-20 bg-sage/10 border-4 border-sage rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <FiCheckCircle size={36} className="text-sage" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        >
          <h1 className="font-cormorant font-light text-deep text-4xl mb-2">Order Confirmed!</h1>
          <p className="text-muted text-sm mb-2">🎉 Thank you for choosing True Furnitures, Indore</p>
          <p className="text-muted text-xs leading-relaxed mb-6">
            Our master craftsmen will begin building your furniture shortly.
            You'll receive a confirmation call at your registered number within 24 hours.
          </p>
        </motion.div>

        {/* Mini timeline */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="flex items-center justify-between mb-8"
        >
          {STEPS.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all
                                  ${s.done ? 'bg-sage border-sage text-white' : 'bg-white border-warm text-muted'}`}>
                  {s.icon}
                </div>
                <span className="text-[0.6rem] text-muted text-center max-w-[60px] leading-tight">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px bg-warm mx-1" />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Crafting note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
          className="bg-gold/10 border border-gold/30 rounded-2xl p-4 mb-6 text-left"
        >
          <p className="text-deep text-sm font-medium mb-1">✦ Handcrafted, Just For You</p>
          <p className="text-muted text-xs leading-relaxed">
            We start building your furniture only after your order is confirmed — this ensures every detail,
            finish, and dimension is tailored precisely to your requirements.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={() => navigate('/track-order')}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-bark text-bark py-3 rounded-xl text-sm hover:bg-bark hover:text-white transition-all cursor-pointer bg-transparent"
          >
            <FiPackage size={15}/> Track Order
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 bg-deep text-cream py-3 rounded-xl text-sm hover:bg-wood transition-colors border-none cursor-pointer"
          >
            Continue Shopping <FiArrowRight size={15}/>
          </button>
        </motion.div>
      </motion.div>

      {/* Brand footer */}
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        className="relative z-10 text-muted text-xs mt-6"
      >
        Questions? Call us at{' '}
        <a href="tel:7773896496" className="text-bark font-medium">7773896496</a>
      </motion.p>
    </div>
  );
}

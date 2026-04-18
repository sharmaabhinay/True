import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiShoppingBag, FiTrash2, FiX } from 'react-icons/fi';
import { selectCartOpen, closeCart } from '../../store/slices/uiSlice';
import { selectCartItems, selectCartTotal, removeFromCart, changeQty } from '../../store/slices/cartSlice';
import { inr } from '../../utils/formatters';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open     = useSelector(selectCartOpen);
  const items    = useSelector(selectCartItems);
  const total    = useSelector(selectCartTotal);

  return (
    <>
      {/* Overlay */}
      <div onClick={() => dispatch(closeCart())}
           className={`fixed inset-0 bg-deep/40 z-[799] transition-all duration-300
                       ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />

      {/* Drawer */}
      <div role="dialog" aria-label="Shopping cart" aria-modal="true"
           className={`fixed top-0 right-0 bottom-0 w-full max-w-sm md:max-w-[380px] bg-ivory z-[800]
                       flex flex-col shadow-[-16px_0_50px_rgba(0,0,0,0.12)]
                       transition-transform duration-400 ease-[cubic-bezier(.4,0,.2,1)]
                       ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-warm">
          <h3 className="font-cormorant text-2xl font-semibold text-deep">Your Cart</h3>
          <button onClick={() => dispatch(closeCart())} aria-label="Close cart"
                  className="text-muted hover:text-deep text-2xl leading-none bg-transparent border-none cursor-pointer transition-colors">
            <FiX />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted text-sm gap-3 py-16">
              <span className="text-4xl"><FiShoppingBag /></span>
              <p>Your cart is empty</p>
              <button onClick={() => dispatch(closeCart())}
                      className="text-bark text-sm underline bg-transparent border-none cursor-pointer">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-3 items-start py-4 border-b border-warm last:border-0">
                {/* Image */}
                <div className="w-14 h-14 rounded-xl bg-warm flex-shrink-0 overflow-hidden">
                  {item.img
                    ? <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    : <span className="w-full h-full flex items-center justify-center text-2xl">🛋️</span>}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-deep leading-snug truncate">{item.name}</p>
                  <p className="text-bark text-sm mt-0.5">{inr(item.price)}</p>
                  {/* Qty */}
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => dispatch(changeQty({ cartKey: item.cartKey || String(item.id), delta: -1 }))}
                            className="w-6 h-6 rounded-full border border-warm flex items-center justify-center text-sm
                                       hover:bg-warm transition-colors bg-transparent cursor-pointer"><FiMinus /></button>
                    <span className="text-sm w-5 text-center font-medium">{item.qty}</span>
                    <button onClick={() => dispatch(changeQty({ cartKey: item.cartKey || String(item.id), delta: 1 }))}
                            className="w-6 h-6 rounded-full border border-warm flex items-center justify-center text-sm
                                       hover:bg-warm transition-colors bg-transparent cursor-pointer"><FiPlus /></button>
                  </div>
                </div>

                {/* Remove */}
                <button onClick={() => dispatch(removeFromCart(item.cartKey || String(item.id)))} aria-label="Remove item"
                        className="text-muted hover:text-red-500 text-sm transition-colors bg-transparent border-none cursor-pointer mt-1">
                  <FiTrash2 />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-warm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted text-sm">Total</span>
              <span className="font-cormorant text-2xl font-semibold text-bark">{inr(total)}</span>
            </div>
            <button
              onClick={() => { dispatch(closeCart()); navigate('/checkout'); }}
              className="w-full bg-deep text-cream py-4 rounded-xl text-sm font-medium font-dm
                         hover:bg-wood transition-colors active:scale-[0.98] cursor-pointer border-none">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

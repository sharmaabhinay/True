import { formatCurrency } from "../../utils/format";

export default function CartDrawer({ open, items, onClose, onChangeQty, onRemove }) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <div className={`drawer-overlay ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`cart-drawer ${open ? "open" : ""}`} aria-label="Shopping cart">
        <div className="drawer-head">
          <h3>Your Cart</h3>
          <button type="button" className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="drawer-body">
          {items.length === 0 ? (
            <p className="empty-state">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <article key={item.id} className="cart-item">
                <img src={item.img || "https://placehold.co/120x120/f0e4d7/6b4c2a?text=TF"} alt={item.name} />
                <div className="cart-copy">
                  <strong>{item.name}</strong>
                  <span>{formatCurrency(item.price)}</span>
                  <div className="qty-row">
                    <button type="button" onClick={() => onChangeQty(item.id, -1)}>
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => onChangeQty(item.id, 1)}>
                      +
                    </button>
                    <button type="button" className="remove-btn" onClick={() => onRemove(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
        <div className="drawer-foot">
          <div className="total-line">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          <button type="button" className="primary-btn full-btn">
            Proceed to Checkout
          </button>
        </div>
      </aside>
    </>
  );
}

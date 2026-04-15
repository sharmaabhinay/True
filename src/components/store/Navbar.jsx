export default function Navbar({
  cartCount,
  search,
  onSearch,
  onOpenCart,
  onOpenQuote,
  mobileOpen,
  onToggleMobile,
}) {
  return (
    <>
      <nav className="store-nav">
        <a className="brand" href="#hero">
          True<span>Furnitures</span>
        </a>
        <div className="nav-links">
          <a href="#products">Shop</a>
          <a href="#model-viewer">3D View</a>
          <a href="#room-planner">Planner</a>
          <a href="#emi-calculator">EMI</a>
          <a href="#testimonials">Reviews</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-actions">
          <div className="search-shell">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search furniture"
              aria-label="Search furniture"
            />
          </div>
          <a className="phone-link" href="tel:7773896496">
            7773896496
          </a>
          <button className="icon-btn" type="button" onClick={onOpenCart}>
            Cart <span className="cart-pill">{cartCount}</span>
          </button>
          <button className="primary-btn" type="button" onClick={onOpenQuote}>
            Get Quote
          </button>
          <button
            className={`hamburger ${mobileOpen ? "open" : ""}`}
            type="button"
            onClick={onToggleMobile}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      <div className={`mobile-nav ${mobileOpen ? "open" : ""}`}>
        <a href="#products" onClick={onToggleMobile}>
          Shop
        </a>
        <a href="#model-viewer" onClick={onToggleMobile}>
          3D View
        </a>
        <a href="#room-planner" onClick={onToggleMobile}>
          Planner
        </a>
        <a href="#emi-calculator" onClick={onToggleMobile}>
          EMI
        </a>
        <a href="#contact" onClick={onToggleMobile}>
          Contact
        </a>
      </div>
    </>
  );
}

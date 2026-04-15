import { formatCurrency } from "../../utils/format";

export default function ProductGrid({
  products,
  filter,
  setFilter,
  sort,
  setSort,
  onAddToCart,
  onView3D,
}) {
  return (
    <section id="products" className="section-shell">
      <div className="section-head">
        <span>Our Collection</span>
        <h2>Crafted with structure, warmth, and longevity</h2>
      </div>
      <div className="toolbar">
        <div className="chip-row">
          {["all", "bestseller", "new", "sale"].map((value) => (
            <button
              key={value}
              type="button"
              className={`chip ${filter === value ? "active" : ""}`}
              onClick={() => setFilter(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <article key={product.id} className="product-card">
            <button type="button" className="product-media" onClick={() => onView3D(product)}>
              {product.badge && <span className={`badge ${product.badgeType}`}>{product.badge}</span>}
              <img src={product.img} alt={product.name} loading="lazy" />
            </button>
            <div className="product-body">
              <div className="product-meta">{product.cat}</div>
              <h3>{product.name}</h3>
              <p>{product.desc}</p>
              <div className="rating-line">
                {"★".repeat(Math.floor(product.rating))}
                {"☆".repeat(5 - Math.floor(product.rating))}
                <span>({product.reviews})</span>
              </div>
              <div className="product-footer">
                <div>
                  <strong>{formatCurrency(product.price)}</strong>
                  {product.oldPrice ? <span>{formatCurrency(product.oldPrice)}</span> : null}
                </div>
                <button type="button" className="primary-btn small-btn" onClick={() => onAddToCart(product)}>
                  Add
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

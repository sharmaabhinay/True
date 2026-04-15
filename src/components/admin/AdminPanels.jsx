import { adminDemoOrders } from "../../data/catalog";
import { formatCurrency, formatDateTime } from "../../utils/format";

export function DashboardPanel({ products, visitors }) {
  const visits = visitors.filter((item) => item.type === "visit");
  const quotes = visitors.filter((item) => item.type === "quote");
  const cities = [...new Set(visits.map((item) => item.city || item.loc).filter(Boolean))];

  return (
    <div className="admin-panel-grid">
      <div className="stat-card">
        <span>Total activity</span>
        <strong>{visitors.length}</strong>
      </div>
      <div className="stat-card">
        <span>Quote requests</span>
        <strong>{quotes.length}</strong>
      </div>
      <div className="stat-card">
        <span>Active products</span>
        <strong>{products.filter((item) => item.active !== false).length}</strong>
      </div>
      <div className="stat-card">
        <span>Cities reached</span>
        <strong>{cities.length}</strong>
      </div>
      <div className="panel-card wide">
        <h3>Recent activity</h3>
        <div className="table-like">
          {visitors.length === 0 ? (
            <p className="empty-state">No visitor activity yet.</p>
          ) : (
            [...visitors]
              .reverse()
              .slice(0, 10)
              .map((item) => (
                <div key={`${item.time}-${item.type}`} className="row-line">
                  <span>{item.type.replaceAll("_", " ")}</span>
                  <span>{item.item || item.name || item.city || item.loc || "—"}</span>
                  <span>{formatDateTime(item.time)}</span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}

export function VisitorsPanel({ visitors, onClear }) {
  return (
    <div className="panel-card">
      <div className="panel-head">
        <h3>Visitor Analytics</h3>
        <button type="button" className="secondary-btn" onClick={onClear}>
          Clear Log
        </button>
      </div>
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Event</th>
              <th>Item / Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {visitors.length === 0 ? (
              <tr>
                <td colSpan="4">No visitor data available.</td>
              </tr>
            ) : (
              [...visitors].reverse().map((item) => (
                <tr key={`${item.time}-${item.type}`}>
                  <td>{formatDateTime(item.time)}</td>
                  <td>{item.type}</td>
                  <td>{item.item || item.name || "—"}</td>
                  <td>{item.city || item.loc || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ProductsPanel({ products, setProducts }) {
  const updateProduct = (id, field, value) => {
    setProducts((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addProduct = () => {
    setProducts((current) => [
      {
        id: Date.now(),
        name: "New Product",
        cat: "Living Room",
        badge: null,
        badgeType: "",
        img: "https://placehold.co/600x480/f0e4d7/6b4c2a?text=New+Product",
        modelType: "sofa",
        modelData: null,
        price: 10000,
        oldPrice: null,
        rating: 4.5,
        reviews: 0,
        active: true,
        tags: ["all"],
        desc: "Newly added product.",
      },
      ...current,
    ]);
  };

  return (
    <div className="panel-card">
      <div className="panel-head">
        <h3>Products</h3>
        <button type="button" className="primary-btn" onClick={addProduct}>
          Add Product
        </button>
      </div>
      <div className="product-admin-grid">
        {products.map((product) => (
          <article key={product.id} className="admin-product-card">
            <img src={product.img} alt={product.name} />
            <input value={product.name} onChange={(event) => updateProduct(product.id, "name", event.target.value)} />
            <textarea value={product.desc} onChange={(event) => updateProduct(product.id, "desc", event.target.value)} />
            <div className="inline-fields">
              <input
                type="number"
                value={product.price}
                onChange={(event) => updateProduct(product.id, "price", Number(event.target.value))}
              />
              <select value={product.cat} onChange={(event) => updateProduct(product.id, "cat", event.target.value)}>
                <option>Living Room</option>
                <option>Bedroom</option>
                <option>Dining</option>
                <option>Office</option>
              </select>
            </div>
            <label className="toggle-line">
              <input
                type="checkbox"
                checked={product.active !== false}
                onChange={(event) => updateProduct(product.id, "active", event.target.checked)}
              />
              Visible on storefront
            </label>
          </article>
        ))}
      </div>
    </div>
  );
}

export function QuotesPanel({ visitors }) {
  const quotes = visitors.filter((item) => item.type === "quote").reverse();

  return (
    <div className="panel-card">
      <h3>Quote Requests</h3>
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {quotes.length === 0 ? (
              <tr>
                <td colSpan="5">No quote requests yet.</td>
              </tr>
            ) : (
              quotes.map((quote) => (
                <tr key={`${quote.time}-${quote.phone}`}>
                  <td>{formatDateTime(quote.time)}</td>
                  <td>{quote.name}</td>
                  <td>{quote.phone || "—"}</td>
                  <td>{quote.loc || "—"}</td>
                  <td>{quote.cat || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OrdersPanel() {
  return (
    <div className="panel-card">
      <h3>Orders</h3>
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {adminDemoOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.items}</td>
                <td>{formatCurrency(order.amount)}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SettingsPanel() {
  return (
    <div className="admin-panel-grid">
      <div className="panel-card">
        <h3>Store Information</h3>
        <div className="settings-list">
          <label>
            Store Name
            <input defaultValue="True Furnitures" />
          </label>
          <label>
            Phone
            <input defaultValue="7773896496" />
          </label>
          <label>
            Email
            <input defaultValue="info@truefurnitures.in" />
          </label>
        </div>
      </div>
      <div className="panel-card">
        <h3>Feature Status</h3>
        <div className="settings-list">
          <label className="toggle-line">
            <input type="checkbox" defaultChecked />
            3D viewer enabled
          </label>
          <label className="toggle-line">
            <input type="checkbox" defaultChecked />
            EMI calculator enabled
          </label>
          <label className="toggle-line">
            <input type="checkbox" defaultChecked />
            Room planner enabled
          </label>
        </div>
      </div>
    </div>
  );
}

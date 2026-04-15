const items = [
  ["dashboard", "Dashboard"],
  ["visitors", "Visitor Analytics"],
  ["products", "Products"],
  ["quotes", "Quote Requests"],
  ["orders", "Orders"],
  ["settings", "Settings"],
];

export default function AdminSidebar({ active, setActive, onLogout }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <h2>True Furnitures</h2>
        <p>Admin Panel</p>
      </div>
      <nav>
        {items.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`admin-nav-btn ${active === key ? "active" : ""}`}
            onClick={() => setActive(key)}
          >
            {label}
          </button>
        ))}
      </nav>
      <button type="button" className="secondary-btn full-btn" onClick={onLogout}>
        Sign Out
      </button>
    </aside>
  );
}

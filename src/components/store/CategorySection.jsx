const categories = [
  { key: "all", label: "Living Room", count: "124 items" },
  { key: "Bedroom", label: "Bedroom", count: "98 items" },
  { key: "Dining", label: "Dining", count: "67 items" },
  { key: "Office", label: "Office", count: "45 items" },
];

export default function CategorySection({ active, onSelect }) {
  return (
    <section className="section-shell">
      <div className="section-head">
        <span>Shop by Room</span>
        <h2>Every room, refined for real life</h2>
      </div>
      <div className="category-grid">
        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            className={`category-card ${active === category.key ? "active" : ""}`}
            onClick={() => onSelect(category.key)}
          >
            <strong>{category.label}</strong>
            <span>{category.count}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

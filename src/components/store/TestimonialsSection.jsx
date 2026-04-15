export default function TestimonialsSection({ items }) {
  return (
    <section id="testimonials" className="section-shell">
      <div className="section-head">
        <span>Real Customers</span>
        <h2>Homes across Madhya Pradesh, redesigned with trust</h2>
      </div>
      <div className="testimonial-grid">
        {items.map((item) => (
          <article key={`${item.name}-${item.loc}`} className="testimonial-card">
            <div className="rating-line">{"★".repeat(item.stars)}</div>
            <p>{item.text}</p>
            <div className="testimonial-foot">
              <div className="avatar">{item.initials}</div>
              <div>
                <strong>{item.name}</strong>
                <span>{item.loc}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

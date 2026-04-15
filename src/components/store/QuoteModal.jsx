import { useState } from "react";

export default function QuoteModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    loc: "Indore",
    cat: "Sofa & Seating",
    msg: "",
  });

  if (!open) return null;

  return (
    <div className="overlay-shell" role="dialog" aria-modal="true" aria-label="Request a quote">
      <div className="overlay-backdrop" onClick={onClose} />
      <div className="quote-modal-card">
        <button type="button" className="close-btn" onClick={onClose}>
          ×
        </button>
        <h3>Get a Free Quote</h3>
        <p>Our Indore team will contact you within 24 hours.</p>
        <div className="form-grid">
          <input
            value={form.name}
            placeholder="Full Name"
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <input
            value={form.phone}
            placeholder="Phone Number"
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
          <input
            value={form.loc}
            placeholder="Area / Locality"
            onChange={(event) => setForm({ ...form, loc: event.target.value })}
          />
          <select value={form.cat} onChange={(event) => setForm({ ...form, cat: event.target.value })}>
            <option>Sofa & Seating</option>
            <option>Bedroom & Almirahs</option>
            <option>Dining Sets</option>
            <option>Office Furniture</option>
            <option>Complete Home Setup</option>
          </select>
          <textarea
            rows="4"
            value={form.msg}
            placeholder="Describe your requirement"
            onChange={(event) => setForm({ ...form, msg: event.target.value })}
          />
          <button
            type="button"
            className="primary-btn full-btn"
            onClick={() => {
              onSubmit(form);
              setForm({ name: "", phone: "", loc: "Indore", cat: "Sofa & Seating", msg: "" });
            }}
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
}

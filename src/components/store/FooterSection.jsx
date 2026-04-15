export default function FooterSection() {
  return (
    <>
      <section className="newsletter-band">
        <div>
          <span>Stay inspired</span>
          <h2>New collections, offers, and design tips</h2>
        </div>
        <div className="newsletter-note">
          Visit the admin panel to manage products, quotes, and storefront activity from the same app.
        </div>
      </section>
      <footer id="contact" className="store-footer">
        <div>
          <h3>True Furnitures</h3>
          <p>Crafting warm, durable, modern furniture for homes in Indore since 2007.</p>
        </div>
        <div>
          <h4>Contact</h4>
          <a href="tel:7773896496">7773896496</a>
          <a href="mailto:info@truefurnitures.in">info@truefurnitures.in</a>
          <p>Vijay Nagar Square, Indore, MP</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <a href="#products">Products</a>
          <a href="#room-planner">Room Planner</a>
          <a href="/admin">Admin Panel</a>
        </div>
      </footer>
    </>
  );
}

import { useMemo, useState } from "react";
import CategorySection from "../components/store/CategorySection";
import CartDrawer from "../components/store/CartDrawer";
import EmiCalculatorSection from "../components/store/EmiCalculatorSection";
import FooterSection from "../components/store/FooterSection";
import HeroSection from "../components/store/HeroSection";
import ModelViewerSection from "../components/store/ModelViewerSection";
import Navbar from "../components/store/Navbar";
import ProductGrid from "../components/store/ProductGrid";
import QuoteModal from "../components/store/QuoteModal";
import RoomPlannerSection from "../components/store/RoomPlannerSection";
import TestimonialsSection from "../components/store/TestimonialsSection";
import Toast from "../components/common/Toast";
import { modelMeta, roomFurniture, testimonials } from "../data/catalog";
import { useStoreData } from "../hooks/useStoreData";

function sortProducts(products, sortBy) {
  const clone = [...products];
  if (sortBy === "price-asc") clone.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") clone.sort((a, b) => b.price - a.price);
  if (sortBy === "rating") clone.sort((a, b) => b.rating - a.rating);
  return clone;
}

export default function StorePage() {
  const { products, logEvent } = useStoreData();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(""), 2600);
  };

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (product.active === false) return false;
      if (category !== "all" && product.cat !== category) return false;
      if (filter !== "all" && !product.tags?.includes(filter)) return false;
      if (
        search &&
        !`${product.name} ${product.cat} ${product.desc}`.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
    return sortProducts(filtered, sort);
  }, [category, filter, products, search, sort]);

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...current, { ...product, qty: product.qty || 1 }];
    });
    setCartOpen(true);
    showToast(`${product.name} added to cart.`);
    logEvent({ type: "add_to_cart", item: product.name });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="store-app">
      <div className="top-strip">Delivering to Indore and nearby cities. Free delivery above ₹15,000.</div>
      <Navbar
        cartCount={cartCount}
        search={search}
        onSearch={setSearch}
        onOpenCart={() => setCartOpen(true)}
        onOpenQuote={() => setQuoteOpen(true)}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen((value) => !value)}
      />
      <HeroSection />
      <section className="contact-band">
        <div>Vijay Nagar Square, Indore</div>
        <div>Mon-Sat: 10 AM - 8 PM</div>
        <div>Free delivery in Indore, Bhopal, Ujjain</div>
      </section>
      <CategorySection active={category} onSelect={setCategory} />
      <ModelViewerSection
        meta={modelMeta}
        products={products}
        onAddToCart={addToCart}
        onOpenQuote={() => setQuoteOpen(true)}
        onTrack={(type, detail) => logEvent({ type, ...detail })}
      />
      <ProductGrid
        products={visibleProducts}
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
        onAddToCart={addToCart}
        onView3D={(product) => {
          document.getElementById("model-viewer")?.scrollIntoView({ behavior: "smooth" });
          logEvent({ type: "view_3d", item: product.name });
          showToast(`Opening 3D view for ${product.name}.`);
        }}
      />
      <TestimonialsSection items={testimonials} />
      <RoomPlannerSection items={roomFurniture} onToast={showToast} />
      <EmiCalculatorSection />
      <FooterSection />
      <QuoteModal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        onSubmit={(form) => {
          if (!form.name.trim()) {
            showToast("Please enter your name.");
            return;
          }
          logEvent({ type: "quote", ...form });
          setQuoteOpen(false);
          showToast("Quote request sent. We will call you within 24 hours.");
        }}
      />
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onChangeQty={(id, delta) =>
          setCart((current) =>
            current
              .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
              .filter((item) => item.qty > 0)
          )
        }
        onRemove={(id) => setCart((current) => current.filter((item) => item.id !== id))}
      />
      <Toast message={toast} />
    </div>
  );
}

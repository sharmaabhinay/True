/* store.js — True Furnitures Store Logic */
'use strict';

// ── DATA ───────────────────────────────────────
const DEFAULT_PRODUCTS = [
  {id:1,name:'Royale Sectional Sofa',cat:'Living Room',badge:'Bestseller',badgeType:'bestseller',img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=85',price:48500,oldPrice:62000,rating:4.8,reviews:214,tags:['all','bestseller'],active:true},
  {id:2,name:'Empress Almirah',cat:'Bedroom',badge:'New',badgeType:'new',img:'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=700&q=85',price:32000,oldPrice:null,rating:4.9,reviews:87,tags:['all','new'],active:true},
  {id:3,name:'Nordic Dining Set',cat:'Dining',badge:'Sale',badgeType:'sale',img:'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=700&q=85',price:28500,oldPrice:38000,rating:4.7,reviews:156,tags:['all','sale'],active:true},
  {id:4,name:'Zen Study Desk',cat:'Office',badge:null,badgeType:'',img:'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=700&q=85',price:18000,oldPrice:null,rating:4.6,reviews:43,tags:['all'],active:true},
  {id:5,name:'Ottoman Luxury Chair',cat:'Living Room',badge:'Bestseller',badgeType:'bestseller',img:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=85',price:12500,oldPrice:16000,rating:4.8,reviews:312,tags:['all','bestseller','sale'],active:true},
  {id:6,name:'King Sleigh Bed',cat:'Bedroom',badge:'New',badgeType:'new',img:'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=700&q=85',price:55000,oldPrice:null,rating:4.9,reviews:67,tags:['all','new'],active:true},
  {id:7,name:'Tuscan Coffee Table',cat:'Living Room',badge:null,badgeType:'',img:'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=700&q=85',price:9800,oldPrice:12500,rating:4.5,reviews:188,tags:['all','sale'],active:true},
  {id:8,name:'Heritage Wardrobe',cat:'Bedroom',badge:'Sale',badgeType:'sale',img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85',price:42000,oldPrice:58000,rating:4.8,reviews:94,tags:['all','bestseller','sale'],active:true},
  {id:9,name:'Accent Armchair',cat:'Living Room',badge:null,badgeType:'',img:'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=700&q=85',price:14500,oldPrice:null,rating:4.7,reviews:52,tags:['all'],active:true},
  {id:10,name:'Solid Wood Bookshelf',cat:'Office',badge:'New',badgeType:'new',img:'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=700&q=85',price:22000,oldPrice:null,rating:4.6,reviews:38,tags:['all','new'],active:true},
  {id:11,name:'Teak Dining Chairs ×4',cat:'Dining',badge:'Sale',badgeType:'sale',img:'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=700&q=85',price:18000,oldPrice:24000,rating:4.7,reviews:72,tags:['all','sale'],active:true},
  {id:12,name:'Modern TV Unit',cat:'Living Room',badge:'Bestseller',badgeType:'bestseller',img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=85',price:26000,oldPrice:32000,rating:4.8,reviews:143,tags:['all','bestseller','sale'],active:true},
];

const TESTIMONIALS = [
  {name:'Priya Sharma',loc:'Vijay Nagar, Indore',stars:5,text:'"The Royale Sectional transformed our living room. The quality is extraordinary."',initials:'PS'},
  {name:'Arjun Mehta',loc:'Scheme 54, Indore',stars:5,text:'"White-glove delivery, spotless assembly. Five years on, still looks brand new."',initials:'AM'},
  {name:'Deepika Rao',loc:'Bhopal',stars:5,text:'"The 3D viewer helped me visualise exactly how it\'d look. No surprises!"',initials:'DR'},
  {name:'Rohan Gupta',loc:'Palasia, Indore',stars:4,text:'"Excellent quality. EMI option made it very convenient."',initials:'RG'},
  {name:'Ananya Joshi',loc:'Ujjain',stars:5,text:'"Museum-quality craftsmanship. Every joint, every detail is absolutely perfect."',initials:'AJ'},
  {name:'Vikram Singh',loc:'MR-10, Indore',stars:5,text:'"True Furnitures lives up to its name. Will be a lifelong customer."',initials:'VS'},
];

const ROOM_ITEMS = [
  {name:'Sofa',emoji:'🛋️',price:48500,w:110,h:60,color:'#8B6B4A'},
  {name:'Coffee Table',emoji:'☕',price:9800,w:65,h:40,color:'#C8A86B'},
  {name:'Wardrobe',emoji:'🗄️',price:42000,w:85,h:50,color:'#6B4C2A'},
  {name:'Bed',emoji:'🛏️',price:55000,w:105,h:80,color:'#7A6A5A'},
  {name:'Dining Table',emoji:'🍽️',price:28500,w:95,h:70,color:'#8B6B4A'},
  {name:'Chair',emoji:'🪑',price:12500,w:48,h:50,color:'#C8A86B'},
  {name:'Bookshelf',emoji:'📚',price:22000,w:45,h:80,color:'#6B4C2A'},
];

const MODEL_META = {
  sofa:    {name:'Royale Sectional Sofa',price:'₹48,500',desc:'Hand-finished teak frame with premium foam seating. Multiple fabric options available.'},
  almirah: {name:'Empress Almirah',price:'₹32,000',desc:'Solid sheesham wood. Spacious interiors with full-length mirror and cedar drawer lining.'},
  bed:     {name:'King Sleigh Bed',price:'₹55,000',desc:'Majestic headboard with premium upholstery. Includes storage drawers and orthopedic base.'},
  chair:   {name:'Accent Armchair',price:'₹14,500',desc:'Ergonomically designed with plush cushioning. A statement piece for any living space.'},
};

// ── STATE ──────────────────────────────────────
let PRODUCTS = JSON.parse(localStorage.getItem('tf_products') || 'null') || DEFAULT_PRODUCTS;
let cart = [], activeFilter = 'all', searchQuery = '';
let currentModel = 'sofa', selectedColor = '#8B6B4A', selectedSize = '2-Seater', selectedPrice = 38500;
let roomPlaced = [], roomDragItem = null, roomDragOffX = 0, roomDragOffY = 0;

const heroRot   = new Engine3D.RotController();
const modelRot  = new Engine3D.RotController();
modelRot.autoSpeed = 0.003;

// custom OBJ loaded from admin
let customGeo = null, customGeoColor = '#8B6B4A';

// ── UTILITY ────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

function trackEvent(type, detail) {
  const log = JSON.parse(localStorage.getItem('tf_visitors') || '[]');
  log.push({ type, ...detail, time: new Date().toISOString() });
  localStorage.setItem('tf_visitors', JSON.stringify(log));
}

// ── INIT ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Loader
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
      fetchLocation();
      trackEvent('session', { ua: navigator.userAgent, screen: `${screen.width}x${screen.height}`, ref: document.referrer || 'direct' });
    }, 2400);
  });

  // Quote popup auto-dismiss
  setTimeout(() => {
    const p = document.getElementById('quote-popup');
    if (p) { p.style.display = 'block'; setTimeout(() => p.classList.add('hide'), 7000); }
  }, 3000);

  // Reveal on scroll
  const ro = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  renderProducts();
  renderTestimonials();
  renderRoomList();
  calcEMI();
  renderOrderHistory();

  // 3D setup
  heroRot.attach(document.getElementById('hero-canvas'));
  modelRot.attach(document.getElementById('model-canvas'));

  setTimeout(() => {
    setupRoomDrag();
    drawRoom();
    startAnimLoop();
  }, 200);

  // Nav scroll
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', scrollY > 50);
  });

  // Mobile hamburger
  document.getElementById('hamburger')?.addEventListener('click', toggleMobileNav);

  // Listen for product updates from admin
  window.addEventListener('storage', e => {
    if (e.key === 'tf_products') {
      PRODUCTS = JSON.parse(e.newValue || '[]');
      renderProducts();
    }
  });
});

// ── LOCATION ───────────────────────────────────
function fetchLocation() {
  if (!navigator.geolocation) { showLocDefault(); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`)
      .then(r => r.json()).then(d => {
        const city = d.city || d.locality || d.principalSubdivision || 'Indore';
        document.getElementById('loc-city').textContent = city;
        const strip = document.getElementById('loc-strip');
        if (strip) strip.style.display = 'flex';
        const qLoc = document.getElementById('q-loc');
        if (qLoc) qLoc.value = city;
        trackEvent('visit', { city, lat: pos.coords.latitude, lon: pos.coords.longitude, ref: document.referrer || 'direct' });
      }).catch(showLocDefault);
  }, showLocDefault);
}
function showLocDefault() {
  const strip = document.getElementById('loc-strip');
  if (strip) strip.style.display = 'flex';
}

// ── MOBILE NAV ─────────────────────────────────
function toggleMobileNav() {
  const ham = document.getElementById('hamburger');
  const mn = document.getElementById('mobile-nav');
  ham.classList.toggle('open');
  mn.classList.toggle('open');
}
function closeMobileNav() {
  document.getElementById('hamburger')?.classList.remove('open');
  document.getElementById('mobile-nav')?.classList.remove('open');
}

// ── QUOTE MODAL ────────────────────────────────
function dismissQuote() { document.getElementById('quote-popup').classList.add('hide'); }
function openQuoteModal() { document.getElementById('quote-modal').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeQuoteModal() { document.getElementById('quote-modal').classList.remove('open'); document.body.style.overflow = ''; }
function submitQuote() {
  const name = document.getElementById('q-name').value.trim();
  if (!name) { showToast('Please enter your name'); return; }
  const log = JSON.parse(localStorage.getItem('tf_visitors') || '[]');
  log.push({ type: 'quote', name, phone: document.getElementById('q-phone').value, loc: document.getElementById('q-loc')?.value, cat: document.getElementById('q-cat').value, msg: document.getElementById('q-msg').value, time: new Date().toISOString() });
  localStorage.setItem('tf_visitors', JSON.stringify(log));
  closeQuoteModal();
  showToast('✅ Quote sent! We\'ll call you within 24 hours.');
  document.getElementById('q-name').value = '';
  document.getElementById('q-phone').value = '';
}

// ── CART ───────────────────────────────────────
function openCart() { document.getElementById('cart-drawer').classList.add('open'); document.getElementById('cart-overlay').classList.add('show'); document.body.style.overflow = 'hidden'; }
function closeCart() { document.getElementById('cart-drawer').classList.remove('open'); document.getElementById('cart-overlay').classList.remove('show'); document.body.style.overflow = ''; }
function addToCart(p) {
  const ex = cart.find(i => i.id === p.id);
  if (ex) ex.qty++; else cart.push({ ...p, qty: 1 });
  updateCartUI();
  showToast(`🛒 ${p.name} added!`);
  trackEvent('add_to_cart', { item: p.name });
}
function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cart-total-val').textContent = '₹' + total.toLocaleString('en-IN');
  document.getElementById('cart-badge').textContent = cart.reduce((s, i) => s + i.qty, 0);
  const wrap = document.getElementById('cart-items-wrap');
  wrap.innerHTML = cart.length === 0
    ? '<p style="color:var(--muted);text-align:center;padding:2rem;font-size:0.85rem">Your cart is empty</p>'
    : cart.map(item => `<div class="cart-item">
        <div class="cart-item-img"><img src="${item.img||''}" onerror="this.style.display='none'" alt="${item.name}"></div>
        <div style="flex:1"><div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="chQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="chQty(${item.id},1)">+</button>
        </div></div>
        <button class="cart-rm" onclick="rmCart(${item.id})">✕</button></div>`).join('');
}
function chQty(id, d) { const i = cart.find(x => x.id === id); if (!i) return; i.qty += d; if (i.qty <= 0) cart = cart.filter(x => x.id !== id); updateCartUI(); }
function rmCart(id) { cart = cart.filter(x => x.id !== id); updateCartUI(); }

// ── PRODUCTS ───────────────────────────────────
function renderProducts() {
  PRODUCTS = JSON.parse(localStorage.getItem('tf_products') || 'null') || DEFAULT_PRODUCTS;
  const list = PRODUCTS.filter(p => {
    if (!p.active) return false;
    const mf = activeFilter === 'all' || p.tags?.includes(activeFilter);
    const ms = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.cat.toLowerCase().includes(searchQuery.toLowerCase());
    return mf && ms;
  });
  const grid = document.getElementById('products-grid');
  grid.innerHTML = list.length === 0
    ? '<p style="color:var(--muted);padding:2rem;grid-column:1/-1">No products found.</p>'
    : list.map(p => `
    <article class="product-card" onclick="viewProduct3D(${p.id})">
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name} – True Furnitures Indore" loading="lazy" onerror="this.style.display='none'">
        ${p.badge ? `<div class="product-badge ${p.badgeType}">${p.badge}</div>` : ''}
        <button class="product-wishlist" id="w${p.id}" onclick="toggleWish(event,${p.id})" aria-label="Wishlist">♡</button>
      </div>
      <div class="product-body">
        <div class="product-cat">${p.cat}</div>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))} <span>(${p.reviews})</span></div>
        <div class="product-footer">
          <div><span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>${p.oldPrice?`<span class="product-old">₹${p.oldPrice.toLocaleString('en-IN')}</span>`:''}</div>
          <button class="add-btn" id="ab${p.id}" onclick="qAddCart(event,${p.id})">Add to Cart</button>
        </div>
      </div>
    </article>`).join('');
}
function qAddCart(e, id) {
  e.stopPropagation();
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  addToCart(p);
  const btn = document.getElementById('ab' + id);
  btn.textContent = '✓ Added'; btn.classList.add('added');
  setTimeout(() => { btn.textContent = 'Add to Cart'; btn.classList.remove('added'); }, 2000);
}
function toggleWish(e, id) {
  e.stopPropagation();
  const btn = document.getElementById('w' + id);
  btn.classList.toggle('liked');
  btn.textContent = btn.classList.contains('liked') ? '♥' : '♡';
  showToast(btn.classList.contains('liked') ? '♥ Added to wishlist!' : 'Removed from wishlist');
}
function viewProduct3D(id) {
  document.getElementById('model-viewer').scrollIntoView({ behavior: 'smooth' });
  trackEvent('view_3d', { item: PRODUCTS.find(x => x.id === id)?.name });
}
function setFilter(f, el) {
  activeFilter = f;
  document.querySelectorAll('.fp').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderProducts();
}
function filterProducts(q) { searchQuery = q; renderProducts(); }
function sortProducts(v) {
  if (v === 'price-asc') PRODUCTS.sort((a,b) => a.price - b.price);
  else if (v === 'price-desc') PRODUCTS.sort((a,b) => b.price - a.price);
  else if (v === 'rating') PRODUCTS.sort((a,b) => b.rating - a.rating);
  renderProducts();
}
function filterByCategory(cat, el) {
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  closeMobileNav();
}

// ── TESTIMONIALS ───────────────────────────────
function renderTestimonials() {
  document.getElementById('testi-track').innerHTML = TESTIMONIALS.map(t => `
    <div class="testi-card">
      <div class="testi-stars">${'★'.repeat(t.stars)}</div>
      <div class="testi-text">${t.text}</div>
      <div class="testi-author">
        <div class="testi-avatar">${t.initials}</div>
        <div><div class="testi-name">${t.name}</div><div class="testi-loc">📍 ${t.loc}</div></div>
      </div>
    </div>`).join('');
}

// ── 3D MODEL VIEWER ────────────────────────────
function switchModel(type, btn) {
  currentModel = type;
  customGeo = null;
  document.querySelectorAll('.msw-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const d = MODEL_META[type];
  document.getElementById('m-name').textContent = d.name;
  document.getElementById('m-price').textContent = d.price;
  document.getElementById('m-desc').textContent = d.desc;
}
function selectSize(btn, size, price) {
  document.querySelectorAll('#size-sel .sel-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedSize = size; selectedPrice = price;
  document.getElementById('m-price').textContent = '₹' + price.toLocaleString('en-IN');
}
function selectColor(dot, color) {
  document.querySelectorAll('.cdot').forEach(d => d.classList.remove('active'));
  dot.classList.add('active');
  selectedColor = color;
  customGeoColor = color;
}
function switchTab(btn, tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
  document.getElementById('tab-' + tab).style.display = 'block';
}
function addCurrentModelToCart() {
  const d = MODEL_META[currentModel];
  addToCart({ id: 200 + Date.now() % 1000, name: d.name + ' (' + selectedSize + ')', img: '', price: selectedPrice });
}

// ── EMI CALCULATOR ─────────────────────────────
function calcEMI() {
  const P = +document.getElementById('emi-amt').value;
  const N = +document.getElementById('emi-ten').value;
  const R = +document.getElementById('emi-rate').value / 100 / 12;
  const emi = R === 0 ? P/N : P * R * Math.pow(1+R,N) / (Math.pow(1+R,N)-1);
  const total = emi * N, interest = total - P;
  document.getElementById('emi-amt-v').textContent = '₹' + P.toLocaleString('en-IN');
  document.getElementById('emi-ten-v').textContent = N + ' months';
  document.getElementById('emi-rate-v').textContent = (+document.getElementById('emi-rate').value).toFixed(1) + '%';
  document.getElementById('emi-monthly').textContent = '₹' + Math.round(emi).toLocaleString('en-IN');
  document.getElementById('emi-sub-label').textContent = 'per month for ' + N + ' months';
  document.getElementById('emi-principal').textContent = '₹' + P.toLocaleString('en-IN');
  document.getElementById('emi-interest').textContent = '₹' + Math.round(interest).toLocaleString('en-IN');
  document.getElementById('emi-total').textContent = '₹' + Math.round(total).toLocaleString('en-IN');
  document.getElementById('emi-save').textContent = 'Save ₹' + Math.round(Math.min(interest*0.3, 5000)).toLocaleString('en-IN');
}

// ── ORDER HISTORY ──────────────────────────────
function renderOrderHistory() {
  const oh = document.getElementById('order-history');
  if (!oh) return;
  oh.innerHTML = cart.length === 0
    ? '<p style="color:var(--muted);font-size:0.85rem">No orders yet.</p>'
    : '<p style="color:var(--muted);font-size:0.85rem">Order tracking coming soon.</p>';
}

// ── NEWSLETTER ─────────────────────────────────
function subscribeNL() {
  const e = document.getElementById('nl-email').value;
  if (!e || !e.includes('@')) { showToast('Enter a valid email'); return; }
  document.getElementById('nl-email').value = '';
  showToast('🎉 Subscribed! Check inbox for 10% discount.');
  trackEvent('newsletter', { email: e });
}

// ── ROOM PLANNER ───────────────────────────────
function renderRoomList() {
  document.getElementById('room-list').innerHTML = ROOM_ITEMS.map((f, i) => `
    <div class="room-opt ${roomPlaced.find(r => r.name===f.name)?'active':''}" onclick="addToRoom(${i})">
      <div class="room-opt-icon">${f.emoji}</div>
      <div><div class="room-opt-name">${f.name}</div><div class="room-opt-price">₹${f.price.toLocaleString('en-IN')}</div></div>
    </div>`).join('');
}
function addToRoom(i) {
  const f = ROOM_ITEMS[i];
  if (!roomPlaced.find(r => r.name===f.name)) {
    roomPlaced.push({ ...f, px: 80 + Math.random()*180, py: 80 + Math.random()*140 });
    renderRoomList(); drawRoom();
  }
}
function clearRoom() { roomPlaced = []; renderRoomList(); drawRoom(); }
function drawRoom() {
  const canvas = document.getElementById('room-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const pr = window.devicePixelRatio || 1;
  const nw = canvas.offsetWidth * pr, nh = canvas.offsetHeight * pr;
  if (canvas.width !== nw || canvas.height !== nh) { canvas.width = nw; canvas.height = nh; }
  ctx.setTransform(pr, 0, 0, pr, 0, 0);
  const W = canvas.offsetWidth, H = canvas.offsetHeight;
  ctx.fillStyle = '#FAF7F2'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#E8DDD0'; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  ctx.fillStyle = '#E8DDD0'; ctx.fillRect(0,0,W,8); ctx.fillRect(0,0,8,H);
  ctx.fillStyle = '#B0C8D8'; ctx.fillRect(W/2-40,0,80,8);
  roomPlaced.forEach(item => {
    ctx.save();
    ctx.fillStyle = item.color + 'cc';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(item.px-item.w/2, item.py-item.h/2, item.w, item.h, 6)
                  : ctx.rect(item.px-item.w/2, item.py-item.h/2, item.w, item.h);
    ctx.fill();
    ctx.strokeStyle = item.color; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.font = '16px sans-serif'; ctx.textAlign = 'center';
    ctx.fillStyle = item.color; ctx.fillText(item.emoji, item.px, item.py + 6);
    ctx.font = `${Math.min(10, item.w/8)}px DM Sans,sans-serif`;
    ctx.fillStyle = '#2C1F12'; ctx.fillText(item.name, item.px, item.py + item.h/2 + 14);
    ctx.restore();
  });
}
function setupRoomDrag() {
  const canvas = document.getElementById('room-canvas');
  if (!canvas) return;
  const getXY = e => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };
  canvas.addEventListener('mousedown', e => {
    const { x, y } = getXY(e);
    roomDragItem = roomPlaced.find(i => Math.abs(i.px-x)<i.w/2+8 && Math.abs(i.py-y)<i.h/2+8);
    if (roomDragItem) { roomDragOffX = x - roomDragItem.px; roomDragOffY = y - roomDragItem.py; }
  });
  canvas.addEventListener('touchstart', e => {
    const { x, y } = getXY(e);
    roomDragItem = roomPlaced.find(i => Math.abs(i.px-x)<i.w/2+8 && Math.abs(i.py-y)<i.h/2+8);
    if (roomDragItem) { roomDragOffX = x - roomDragItem.px; roomDragOffY = y - roomDragItem.py; }
  }, { passive: true });
  const move = e => {
    if (!roomDragItem) return;
    const { x, y } = getXY(e);
    roomDragItem.px = x - roomDragOffX; roomDragItem.py = y - roomDragOffY;
    drawRoom();
  };
  window.addEventListener('mousemove', move);
  window.addEventListener('touchmove', move, { passive: true });
  window.addEventListener('mouseup', () => roomDragItem = null);
  window.addEventListener('touchend', () => roomDragItem = null);
}

// ── 3D ANIMATION LOOP ──────────────────────────
function startAnimLoop() {
  const { drawSofa, drawAlmirah, drawBed, drawChair, drawOBJModel, renderCanvas } = Engine3D;
  function loop() {
    renderCanvas(document.getElementById('hero-canvas'), heroRot,
      (ctx, cx, cy, rx, ry) => drawSofa(ctx, cx, cy, rx, ry, '#8B6B4A'));
    renderCanvas(document.getElementById('model-canvas'), modelRot, (ctx, cx, cy, rx, ry) => {
      if (customGeo) drawOBJModel(ctx, cx, cy, rx, ry, customGeo, customGeoColor);
      else if (currentModel === 'sofa')    drawSofa(ctx, cx, cy, rx, ry, selectedColor);
      else if (currentModel === 'almirah') drawAlmirah(ctx, cx, cy, rx, ry, selectedColor);
      else if (currentModel === 'bed')     drawBed(ctx, cx, cy, rx, ry, selectedColor);
      else if (currentModel === 'chair')   drawChair(ctx, cx, cy, rx, ry, selectedColor);
    });
    requestAnimationFrame(loop);
  }
  loop();
}

window.addEventListener('resize', () => { drawRoom(); });

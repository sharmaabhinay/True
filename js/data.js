/* ═══════════════════════════════════════════
   TRUE FURNITURES — SHARED DATA
   Products, testimonials, room furniture
═══════════════════════════════════════════ */

const TF = window.TF || {};

TF.DEFAULT_PRODUCTS = [
  { id:1,  name:'Royale Sectional Sofa',      cat:'Living Room', badge:'Bestseller', badgeType:'bestseller',
    img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80',
    modelType:'sofa',  modelFile:null, price:48500, oldPrice:62000, rating:4.8, reviews:214, active:true,
    tags:['all','bestseller'],
    desc:'Hand-finished teak frame with premium foam seating. Available in multiple fabric options and configurations.' },

  { id:2,  name:'Empress Almirah',             cat:'Bedroom',     badge:'New',        badgeType:'new',
    img:'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=700&q=80',
    modelType:'almirah', modelFile:null, price:32000, oldPrice:null, rating:4.9, reviews:87, active:true,
    tags:['all','new'],
    desc:'Solid sheesham wood with hand-carved details. Spacious interiors with full-length mirror.' },

  { id:3,  name:'Nordic Dining Set',           cat:'Dining',      badge:'Sale',       badgeType:'sale',
    img:'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=700&q=80',
    modelType:'table', modelFile:null, price:28500, oldPrice:38000, rating:4.7, reviews:156, active:true,
    tags:['all','sale'],
    desc:'Solid sheesham with 6 chairs. Seats 6–8 comfortably. Timeless Scandinavian-inspired design.' },

  { id:4,  name:'Zen Study Desk',              cat:'Office',      badge:null,         badgeType:'',
    img:'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=700&q=80',
    modelType:'desk',  modelFile:null, price:18000, oldPrice:null, rating:4.6, reviews:43, active:true,
    tags:['all'],
    desc:'Minimalist teak desk with cable management and solid drawer storage. Ideal for home offices.' },

  { id:5,  name:'Ottoman Luxury Chair',        cat:'Living Room', badge:'Bestseller', badgeType:'bestseller',
    img:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=80',
    modelType:'chair', modelFile:null, price:12500, oldPrice:16000, rating:4.8, reviews:312, active:true,
    tags:['all','bestseller','sale'],
    desc:'Plush velvet upholstery with solid wood legs. A statement accent piece for any room.' },

  { id:6,  name:'King Sleigh Bed',             cat:'Bedroom',     badge:'New',        badgeType:'new',
    img:'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=700&q=80',
    modelType:'bed',   modelFile:null, price:55000, oldPrice:null, rating:4.9, reviews:67, active:true,
    tags:['all','new'],
    desc:'Majestic headboard with premium upholstery. Includes storage drawers and orthopedic base.' },

  { id:7,  name:'Tuscan Coffee Table',         cat:'Living Room', badge:null,         badgeType:'',
    img:'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=700&q=80',
    modelType:'table', modelFile:null, price:9800,  oldPrice:12500, rating:4.5, reviews:188, active:true,
    tags:['all','sale'],
    desc:'Hand-distressed solid mango wood top with forged iron base. Every piece is uniquely grained.' },

  { id:8,  name:'Heritage Wardrobe',           cat:'Bedroom',     badge:'Sale',       badgeType:'sale',
    img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80',
    modelType:'almirah', modelFile:null, price:42000, oldPrice:58000, rating:4.8, reviews:94, active:true,
    tags:['all','bestseller','sale'],
    desc:'Four-door wardrobe in antique sheesham. Full-length mirror, cedar-lined drawers, 10-year guarantee.' },

  { id:9,  name:'Accent Armchair',             cat:'Living Room', badge:null,         badgeType:'',
    img:'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=700&q=80',
    modelType:'chair', modelFile:null, price:14500, oldPrice:null, rating:4.7, reviews:52, active:true,
    tags:['all'],
    desc:'Ergonomically designed with deep-button tufting. A sculptural statement for any living space.' },

  { id:10, name:'Solid Wood Bookshelf',        cat:'Office',      badge:'New',        badgeType:'new',
    img:'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=700&q=80',
    modelType:'shelf', modelFile:null, price:22000, oldPrice:null, rating:4.6, reviews:38, active:true,
    tags:['all','new'],
    desc:'Five-tier open bookshelf in natural teak. Adjustable shelf heights. Ideal for home libraries.' },

  { id:11, name:'Teak Dining Chairs (×4)',     cat:'Dining',      badge:'Sale',       badgeType:'sale',
    img:'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=700&q=80',
    modelType:'chair', modelFile:null, price:18000, oldPrice:24000, rating:4.7, reviews:72, active:true,
    tags:['all','sale'],
    desc:'Set of four solid teak dining chairs with cushioned seats. Stacks for easy storage.' },

  { id:12, name:'Modern TV Unit',              cat:'Living Room', badge:'Bestseller', badgeType:'bestseller',
    img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80',
    modelType:'shelf', modelFile:null, price:26000, oldPrice:32000, rating:4.8, reviews:143, active:true,
    tags:['all','bestseller','sale'],
    desc:'Walnut-finish floating TV unit with LED backlight groove. Fits screens up to 75".' },
];

TF.TESTIMONIALS = [
  { name:'Priya Sharma',   loc:'Vijay Nagar, Indore', stars:5, initials:'PS',
    text:'"The Royale Sectional transformed our living room. You can truly feel the craftsmanship in every stitch."' },
  { name:'Arjun Mehta',    loc:'Scheme 54, Indore',   stars:5, initials:'AM',
    text:'"Ordered the Heritage Wardrobe. White-glove delivery, spotless assembly. Five years on, still looks brand new."' },
  { name:'Deepika Rao',    loc:'Bhopal',              stars:5, initials:'DR',
    text:'"The 3D viewer helped me visualise exactly how it\'d look. No surprises — perfect in person!"' },
  { name:'Rohan Gupta',    loc:'Palasia, Indore',     stars:4, initials:'RG',
    text:'"Excellent quality at fair prices. EMI option was very convenient. Customer service responded within an hour."' },
  { name:'Ananya Joshi',   loc:'Ujjain',              stars:5, initials:'AJ',
    text:'"Got a complete bedroom setup. Museum-quality craftsmanship. Every joint, every detail is perfect."' },
  { name:'Vikram Singh',   loc:'MR-10, Indore',       stars:5, initials:'VS',
    text:'"True Furnitures lives up to its name. True quality, true service. Will be a lifelong customer."' },
];

TF.ROOM_FURNITURE = [
  { name:'Sofa',         emoji:'🛋️', price:48500, w:110, h:62, color:'#8B6B4A' },
  { name:'Coffee Table', emoji:'☕', price:9800,  w:65,  h:42, color:'#C8A86B' },
  { name:'Wardrobe',     emoji:'🗄️', price:42000, w:85,  h:52, color:'#6B4C2A' },
  { name:'Bed',          emoji:'🛏️', price:55000, w:105, h:82, color:'#7A6A5A' },
  { name:'Dining Table', emoji:'🍽️', price:28500, w:95,  h:72, color:'#8B6B4A' },
  { name:'Chair',        emoji:'🪑', price:12500, w:48,  h:50, color:'#C8A86B' },
  { name:'Bookshelf',    emoji:'📚', price:22000, w:44,  h:80, color:'#6B4C2A' },
];

/* Load products – admin-saved overrides defaults */
TF.getProducts = function() {
  const saved = localStorage.getItem('tf_products');
  return saved ? JSON.parse(saved) : TF.DEFAULT_PRODUCTS;
};

TF.saveProducts = function(arr) {
  localStorage.setItem('tf_products', JSON.stringify(arr));
};

/* Visitor tracking */
TF.getVisitors = function() {
  return JSON.parse(localStorage.getItem('tf_visitors') || '[]');
};

TF.pushVisitor = function(entry) {
  const v = TF.getVisitors();
  v.push({ ...entry, time: new Date().toISOString() });
  localStorage.setItem('tf_visitors', JSON.stringify(v));
};

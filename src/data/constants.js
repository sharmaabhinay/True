export const TESTIMONIALS = [
  { name:'Priya Sharma',  loc:'Vijay Nagar, Indore', stars:5, initials:'PS', text:'"The Royale Sectional transformed our living room. You can truly feel the craftsmanship in every stitch."' },
  { name:'Arjun Mehta',   loc:'Scheme 54, Indore',   stars:5, initials:'AM', text:'"Ordered the Heritage Wardrobe. White-glove delivery, spotless assembly. Five years on, still looks brand new."' },
  { name:'Deepika Rao',   loc:'Bhopal',              stars:5, initials:'DR', text:"\"The 3D viewer helped me visualise exactly how it'd look. No surprises — perfect in person!\"" },
  { name:'Rohan Gupta',   loc:'Palasia, Indore',     stars:4, initials:'RG', text:'"Excellent quality at fair prices. EMI option was very convenient. Customer service responded within an hour."' },
  { name:'Ananya Joshi',  loc:'Ujjain',              stars:5, initials:'AJ', text:'"Got a complete bedroom setup. Museum-quality craftsmanship. Every joint, every detail is perfect."' },
  { name:'Vikram Singh',  loc:'MR-10, Indore',       stars:5, initials:'VS', text:'"True Furnitures lives up to its name. True quality, true service. Will be a lifelong customer."' },
];

export const ROOM_ITEMS = [
  { name:'Sofa',         emoji:'🛋️', price:48500, w:110, h:62, color:'#8B6B4A' },
  { name:'Coffee Table', emoji:'☕', price:9800,  w:65,  h:42, color:'#C8A86B' },
  { name:'Wardrobe',     emoji:'🗄️', price:42000, w:85,  h:52, color:'#6B4C2A' },
  { name:'Bed',          emoji:'🛏️', price:55000, w:105, h:82, color:'#7A6A5A' },
  { name:'Dining Table', emoji:'🍽️', price:28500, w:95,  h:72, color:'#8B6B4A' },
  { name:'Chair',        emoji:'🪑', price:12500, w:48,  h:50, color:'#C8A86B' },
  { name:'Bookshelf',    emoji:'📚', price:22000, w:44,  h:80, color:'#6B4C2A' },
];

export const MODEL_META = {
  sofa:    { name:'Royale Sectional Sofa', basePrice: 38500, prices: { '2-Seater':38500,'3-Seater':48500,'L-Shape':68000,'U-Shape':92000 }, desc:'Hand-finished teak frame with premium foam seating. Multiple fabric options available.' },
  almirah: { name:'Empress Almirah',       basePrice: 32000, prices: { 'Standard':32000,'Large':42000,'XL':55000 },                          desc:'Solid sheesham wood. Spacious interiors with full-length mirror and cedar drawer lining.' },
  bed:     { name:'King Sleigh Bed',        basePrice: 55000, prices: { 'Single':35000,'Double':45000,'Queen':55000,'King':72000 },            desc:'Majestic headboard with premium upholstery. Includes storage drawers and orthopedic base.' },
  chair:   { name:'Accent Armchair',        basePrice: 14500, prices: { 'Standard':14500,'XL':18000 },                                         desc:'Ergonomically designed with plush cushioning. A statement piece for any living space.' },
};

export const CATEGORIES = [
  { id:'all',     label:'Living Room', icon:'🛋️', count:124 },
  { id:'bedroom', label:'Bedroom',     icon:'🛏️', count:98  },
  { id:'dining',  label:'Dining',      icon:'🍽️', count:67  },
  { id:'office',  label:'Office',      icon:'💼', count:45  },
  { id:'outdoor', label:'Outdoor',     icon:'🌿', count:33  },
];

export const DEMO_ORDERS = [
  { id:'TF-1042', customer:'Rahul Malhotra', items:'Royale Sofa, Coffee Table', amount:58300, city:'Vijay Nagar, Indore', date:'2025-06-14', status:'delivered'  },
  { id:'TF-1041', customer:'Priya Sharma',   items:'King Sleigh Bed',           amount:55000, city:'Scheme 54, Indore',   date:'2025-06-13', status:'processing' },
  { id:'TF-1040', customer:'Arun Patel',     items:'Heritage Wardrobe ×2',      amount:84000, city:'Bhopal',              date:'2025-06-12', status:'shipped'    },
  { id:'TF-1039', customer:'Neha Singh',     items:'Nordic Dining Set',         amount:28500, city:'Ujjain',              date:'2025-06-11', status:'delivered'  },
  { id:'TF-1038', customer:'Vikas Gupta',    items:'Ottoman Chair ×3',          amount:37500, city:'Palasia, Indore',     date:'2025-06-10', status:'processing' },
  { id:'TF-1037', customer:'Sonal Jain',     items:'Zen Study Desk',            amount:18000, city:'MR-10, Indore',       date:'2025-06-09', status:'cancelled'  },
];

export const COLOUR_OPTIONS = [
  { hex:'#8B6B4A', label:'Walnut'   },
  { hex:'#4A6B8B', label:'Navy'     },
  { hex:'#6B8B4A', label:'Olive'    },
  { hex:'#8B4A4A', label:'Maroon'   },
  { hex:'#D3C5B0', label:'Cream'    },
  { hex:'#3A3A3A', label:'Charcoal' },
];

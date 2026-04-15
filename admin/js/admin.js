/* admin.js — True Furnitures Admin Panel */
'use strict';
const AU='admin',AP='admin123';
let isLoggedIn=sessionStorage.getItem('tf_admin')==='true';
let editId=null,logFilter='all';
const DP=[{id:1,name:'Royale Sectional Sofa',cat:'Living Room',badge:'Bestseller',badgeType:'bestseller',img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=85',price:48500,oldPrice:62000,rating:4.8,reviews:214,active:true,tags:['all','bestseller']},{id:2,name:'Empress Almirah',cat:'Bedroom',badge:'New',badgeType:'new',img:'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=700&q=85',price:32000,oldPrice:null,rating:4.9,reviews:87,active:true,tags:['all','new']},{id:3,name:'Nordic Dining Set',cat:'Dining',badge:'Sale',badgeType:'sale',img:'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=700&q=85',price:28500,oldPrice:38000,rating:4.7,reviews:156,active:true,tags:['all','sale']},{id:4,name:'Zen Study Desk',cat:'Office',badge:null,badgeType:'',img:'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=700&q=85',price:18000,oldPrice:null,rating:4.6,reviews:43,active:true,tags:['all']},{id:5,name:'Ottoman Luxury Chair',cat:'Living Room',badge:'Bestseller',badgeType:'bestseller',img:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=85',price:12500,oldPrice:16000,rating:4.8,reviews:312,active:true,tags:['all','bestseller']},{id:6,name:'King Sleigh Bed',cat:'Bedroom',badge:'New',badgeType:'new',img:'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=700&q=85',price:55000,oldPrice:null,rating:4.9,reviews:67,active:true,tags:['all','new']},{id:7,name:'Tuscan Coffee Table',cat:'Living Room',badge:null,badgeType:'',img:'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=700&q=85',price:9800,oldPrice:12500,rating:4.5,reviews:188,active:true,tags:['all']},{id:8,name:'Heritage Wardrobe',cat:'Bedroom',badge:'Sale',badgeType:'sale',img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85',price:42000,oldPrice:58000,rating:4.8,reviews:94,active:true,tags:['all','sale']},{id:9,name:'Accent Armchair',cat:'Living Room',badge:null,badgeType:'',img:'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=700&q=85',price:14500,oldPrice:null,rating:4.7,reviews:52,active:true,tags:['all']},{id:10,name:'Solid Wood Bookshelf',cat:'Office',badge:'New',badgeType:'new',img:'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=700&q=85',price:22000,oldPrice:null,rating:4.6,reviews:38,active:true,tags:['all','new']},{id:11,name:'Teak Dining Chairs x4',cat:'Dining',badge:'Sale',badgeType:'sale',img:'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=700&q=85',price:18000,oldPrice:24000,rating:4.7,reviews:72,active:true,tags:['all','sale']},{id:12,name:'Modern TV Unit',cat:'Living Room',badge:'Bestseller',badgeType:'bestseller',img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=85',price:26000,oldPrice:32000,rating:4.8,reviews:143,active:true,tags:['all','bestseller']}];
const DEMO_ORDERS=[{id:'TF-1042',customer:'Rahul Malhotra',items:'Royale Sofa',amount:58300,city:'Vijay Nagar, Indore',date:'2025-06-14',status:'delivered'},{id:'TF-1041',customer:'Priya Sharma',items:'King Sleigh Bed',amount:55000,city:'Scheme 54, Indore',date:'2025-06-13',status:'processing'},{id:'TF-1040',customer:'Arun Patel',items:'Heritage Wardrobe x2',amount:84000,city:'Bhopal',date:'2025-06-12',status:'shipped'},{id:'TF-1039',customer:'Neha Singh',items:'Nordic Dining Set',amount:28500,city:'Ujjain',date:'2025-06-11',status:'delivered'},{id:'TF-1038',customer:'Vikas Gupta',items:'Ottoman Chair x3',amount:37500,city:'Palasia, Indore',date:'2025-06-10',status:'processing'},{id:'TF-1037',customer:'Sonal Jain',items:'Zen Study Desk',amount:18000,city:'MR-10, Indore',date:'2025-06-09',status:'cancelled'}];
let PRODS=JSON.parse(localStorage.getItem('tf_products')||'null')||DP;
function se(id,h){const e=document.getElementById(id);if(e)e.innerHTML=h;}
function gv(){return JSON.parse(localStorage.getItem('tf_visitors')||'[]');}
function ft(iso){if(!iso)return'—';try{return new Date(iso).toLocaleString('en-IN',{dateStyle:'short',timeStyle:'short'});}catch{return'—';}}
function gdi(ua){if(!ua)return'💻';const u=ua.toLowerCase();if(/mobile|android|iphone/.test(u))return'📱';if(/tablet|ipad/.test(u))return'📲';return'💻';}
function gbr(ua){if(!ua)return'—';const u=ua.toLowerCase();if(u.includes('chrome')&&!u.includes('edg'))return'Chrome';if(u.includes('firefox'))return'Firefox';if(u.includes('safari')&&!u.includes('chrome'))return'Safari';if(u.includes('edg'))return'Edge';return'Browser';}
document.addEventListener('DOMContentLoaded',()=>{
  if(isLoggedIn){document.getElementById('login-screen').style.display='none';initAdmin();}
  updateClock();setInterval(updateClock,1000);
});
function initAdmin(){loadDashboard();renderPMGrid();renderOrders();}
function doLogin(){const u=document.getElementById('login-user').value,p=document.getElementById('login-pass').value;if(u===AU&&p===AP){sessionStorage.setItem('tf_admin','true');document.getElementById('login-screen').style.display='none';initAdmin();}else{const e=document.getElementById('login-err');e.style.display='block';setTimeout(()=>e.style.display='none',2500);}}
function doLogout(){sessionStorage.removeItem('tf_admin');location.reload();}
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open');document.getElementById('sb-overlay').classList.toggle('show');}
function closeSidebar(){document.getElementById('sidebar').classList.remove('open');document.getElementById('sb-overlay').classList.remove('show');}
function showPanel(n,el){document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));document.getElementById('panel-'+n).classList.add('active');if(el)el.classList.add('active');const T={dashboard:'Dashboard',visitors:'Visitor Analytics',products:'Product Manager',quotes:'Quote Requests',orders:'Orders',settings:'Settings'};document.getElementById('page-title').textContent=T[n]||n;if(n==='products')renderPMGrid();if(n==='visitors')renderVisitorPanel();if(n==='quotes')renderQuotes();if(n==='orders')renderOrders();if(n==='dashboard')loadDashboard();closeSidebar();}
function updateClock(){const e=document.getElementById('live-time-el');if(e)e.textContent=new Date().toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'});}
function adminToast(m,isErr){const t=document.getElementById('admin-toast');t.textContent=m;t.style.background=isErr?'var(--red)':'var(--green)';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);}
function refreshAll(){loadDashboard();renderVisitorPanel();renderPMGrid();renderQuotes();adminToast('Refreshed!');}
function loadDashboard(){
  const vs=gv(),visits=vs.filter(v=>v.type==='visit'),quotes=vs.filter(v=>v.type==='quote'),sessions=vs.filter(v=>v.type==='session');
  const cities=[...new Set(visits.map(v=>v.city).filter(Boolean))];
  se('m-visitors',(visits.length+sessions.length)||0);se('m-quotes',quotes.length||0);se('m-products',PRODS.length);se('m-cities',cities.length||0);
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],vals=[12,8,15,22,18,30,25].map(v=>v+Math.floor(Math.random()*3)),mx=Math.max(...vals);
  se('bar-chart',vals.map(v=>`<div class="bar" style="height:${Math.round(v/mx*100)}%"></div>`).join(''));
  se('chart-labels',days.map(d=>`<div class="chart-label">${d}</div>`).join(''));
  const cc={};visits.forEach(v=>{if(v.city)cc[v.city]=(cc[v.city]||0)+1;});
  if(!Object.keys(cc).length){cc['Indore']=18;cc['Bhopal']=7;cc['Ujjain']=4;cc['Dewas']=2;}
  const sc=Object.entries(cc).sort((a,b)=>b[1]-a[1]).slice(0,6),mxC=sc[0]?.[1]||1;
  se('top-locations',sc.map(([c,n])=>`<div class="vis-row"><span class="vis-city">📍 ${c}</span><div class="vis-bar"><div class="vis-fill" style="width:${Math.round(n/mxC*100)}%"></div></div><span class="vis-pct">${Math.round(n/mxC*100)}%</span><span class="vis-n">${n}</span></div>`).join(''));
  const refs={};vs.forEach(v=>{const r=(v.ref||'Direct').replace(/^https?:\/\//,'').split('/')[0]||'Direct';refs[r]=(refs[r]||0)+1;});
  if(!Object.keys(refs).length){refs['Direct']=22;refs['Google']=15;refs['Facebook']=8;}
  const sr=Object.entries(refs).sort((a,b)=>b[1]-a[1]).slice(0,5),mxR=sr[0]?.[1]||1;
  se('top-sources',sr.map(([s,n])=>`<div class="vis-row"><span class="vis-city" style="font-size:0.75rem">${s}</span><div class="vis-bar"><div class="vis-fill" style="width:${Math.round(n/mxR*100)}%;background:var(--blue)"></div></div><span class="vis-n">${n}</span></div>`).join(''));
  const ti={visit:'📍',session:'🌐',add_to_cart:'🛒',quote:'💬',newsletter:'📧',view_3d:'🔮'};
  const rec=[...vs].reverse().slice(0,8);
  se('recent-activity',rec.length===0?'<p style="color:var(--muted);font-size:0.78rem;text-align:center;padding:1rem">No activity. Open the store first.</p>':rec.map(v=>`<div class="vis-row"><span style="font-size:0.85rem">${ti[v.type]||'•'}</span><span style="flex:1;font-size:0.74rem">${v.type.replace(/_/g,' ')} ${v.item?'— '+v.item:v.city?'from '+v.city:''}</span><span style="font-size:0.62rem;color:var(--muted)">${ft(v.time)}</span></div>`).join(''));
  se('visitor-count-label',`${vs.length} total`);
  const lat=[...vs].reverse().slice(0,20);
  se('visitor-mini-body',lat.length===0?'<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:1.5rem;font-size:0.78rem">No visitors yet.</td></tr>':lat.map(v=>`<tr><td>${ft(v.time)}</td><td><span class="pill ${v.type==='visit'?'active':v.type==='quote'?'pending':v.type==='session'?'new':'view'}">${v.type.replace(/_/g,' ')}</span></td><td>${v.city||v.loc||'—'}</td><td>${gdi(v.ua)}</td><td style="font-size:0.68rem;color:var(--muted)">${(v.ref||'Direct').replace(/^https?:\/\//,'').split('/')[0]||'Direct'}</td></tr>`).join(''));
}
function renderVisitorPanel(){
  const vs=gv(),visits=vs.filter(v=>v.type==='visit'),carts=vs.filter(v=>v.type==='add_to_cart'),quotes=vs.filter(v=>v.type==='quote');
  const cities=[...new Set(visits.map(v=>v.city).filter(Boolean))];
  se('v-pageviews',vs.length||0);se('v-cities',cities.length||0);se('v-carts',carts.length||0);se('v-quotes2',quotes.length||0);
  const cc={};visits.forEach(v=>{if(v.city)cc[v.city]=(cc[v.city]||0)+1;});
  if(!Object.keys(cc).length){cc['Indore']=18;cc['Bhopal']=7;cc['Ujjain']=4;}
  const sc=Object.entries(cc).sort((a,b)=>b[1]-a[1]).slice(0,8),mxC=sc[0]?.[1]||1;
  se('city-chart',sc.map(([c,n])=>`<div class="vis-row"><span class="vis-city">📍 ${c}</span><div class="vis-bar" style="width:120px"><div class="vis-fill" style="width:${Math.round(n/mxC*100)}%"></div></div><span class="vis-pct">${n}</span></div>`).join(''));
  let mob=0,desk=0,tab=0;vs.forEach(v=>{if(!v.ua)return;const u=v.ua.toLowerCase();if(/mobile|android|iphone/.test(u))mob++;else if(/tablet|ipad/.test(u))tab++;else desk++;});
  if(mob+desk+tab===0){mob=12;desk=20;tab=3;}
  se('device-chart',`<div style="display:flex;height:10px;border-radius:5px;overflow:hidden;gap:2px"><div style="flex:${mob};background:var(--bark);border-radius:3px"></div><div style="flex:${desk};background:var(--blue);border-radius:3px"></div><div style="flex:${tab};background:var(--green);border-radius:3px"></div></div><div style="display:flex;gap:1.2rem;margin-top:0.5rem">${[['var(--bark)','Mobile',mob],['var(--blue)','Desktop',desk],['var(--green)','Tablet',tab]].map(([c,l,n])=>`<div style="display:flex;align-items:center;gap:0.3rem;font-size:0.7rem"><span style="width:7px;height:7px;border-radius:50%;background:${c};display:inline-block"></span>${l} (${n})</div>`).join('')}</div>`);
  renderFullLog();
}
function filterLog(type,el){logFilter=type;document.querySelectorAll('.lf-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');renderFullLog();}
function renderFullLog(){
  const vs=gv();const filtered=logFilter==='all'?vs:vs.filter(v=>v.type===logFilter);
  const ti={visit:'📍',session:'🌐',add_to_cart:'🛒',quote:'💬',newsletter:'📧',view_3d:'🔮'};
  se('full-log-body',[...filtered].reverse().length===0?'<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2rem;font-size:0.78rem">No records. Visit the store first.</td></tr>':[...filtered].reverse().map(v=>`<tr><td style="font-size:0.68rem;white-space:nowrap">${ft(v.time)}</td><td><span class="pill ${v.type==='visit'?'active':v.type==='quote'?'pending':v.type==='session'?'new':'view'}">${(ti[v.type]||'•')} ${v.type.replace(/_/g,' ')}</span></td><td style="font-size:0.74rem">${v.item||v.name||'—'}</td><td style="font-size:0.74rem">${v.city||v.loc||'—'}</td><td style="font-size:0.66rem;color:var(--muted)">${gdi(v.ua)} ${gbr(v.ua)}</td><td style="font-size:0.66rem;color:var(--muted)">${(v.ref||'Direct').replace(/^https?:\/\//,'').split('/')[0].slice(0,18)||'Direct'}</td></tr>`).join(''));
}
function clearVisitorLog(){if(!confirm('Clear all visitor data?'))return;localStorage.removeItem('tf_visitors');refreshAll();adminToast('Visitor log cleared.');}
function renderPMGrid(){
  PRODS=JSON.parse(localStorage.getItem('tf_products')||'null')||DP;
  const q=(document.getElementById('pm-search')?.value||'').toLowerCase();
  const cat=document.getElementById('pm-cat-filter')?.value||'';
  const list=PRODS.filter(p=>(!q||p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q))&&(!cat||p.cat===cat));
  se('pm-grid',list.map(p=>`<div class="pm-card"><div class="pm-img"><img src="${p.img||''}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">${p.modelData?'<div class="pm-3d-badge">3D ✓</div>':''}</div><div class="pm-body"><div class="pm-name">${p.name}</div><div class="pm-cat">${p.cat}${p.badge?` · <span style="color:var(--bark)">${p.badge}</span>`:''}</div><div class="pm-price">₹${p.price.toLocaleString('en-IN')}${p.oldPrice?` <span style="text-decoration:line-through;opacity:0.4;font-size:0.7rem">₹${p.oldPrice.toLocaleString('en-IN')}</span>`:''}</div><div class="pm-acts"><button class="pm-btn" onclick="editProduct(${p.id})">✏️ Edit</button><button class="pm-btn danger" onclick="deleteProduct(${p.id})">🗑️</button></div><div class="pm-toggle-row"><div class="toggle ${p.active!==false?'on':''}" onclick="toggleProduct(${p.id},this)"></div><span>${p.active!==false?'Active':'Hidden'}</span></div></div></div>`).join('')||'<p style="color:var(--muted);padding:1rem;font-size:0.8rem">No products found.</p>');
}
function openAddProduct(){editId=null;se('modal-title-text','Add New Product');clearForm();document.getElementById('prod-modal').classList.add('open');document.body.style.overflow='hidden';}
function closeProdModal(){document.getElementById('prod-modal').classList.remove('open');document.body.style.overflow='';stopPreview3D();}
function clearForm(){['pm-name','pm-price','pm-old-price','pm-rating','pm-img','pm-desc'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});const b=document.getElementById('pm-badge');if(b)b.value='';const up=document.getElementById('upload-preview');if(up){up.style.display='none';up.src='';}const s=document.getElementById('model-3d-status');if(s){s.style.display='none';s.textContent='';}const c=document.getElementById('preview-3d-canvas');if(c)c.style.display='none';window._pendingOBJ=null;}
function editProduct(id){
  const p=PRODS.find(x=>x.id===id);if(!p)return;
  editId=id;se('modal-title-text','Edit Product');
  document.getElementById('pm-name').value=p.name;document.getElementById('pm-cat').value=p.cat;document.getElementById('pm-price').value=p.price;document.getElementById('pm-old-price').value=p.oldPrice||'';document.getElementById('pm-badge').value=p.badge||'';document.getElementById('pm-rating').value=p.rating||4.5;document.getElementById('pm-img').value=p.img||'';document.getElementById('pm-desc').value=p.desc||'';
  if(p.img){const pr=document.getElementById('upload-preview');pr.src=p.img;pr.style.display='block';}
  const s=document.getElementById('model-3d-status');
  if(p.modelData){s.textContent='✓ 3D model attached';s.style.display='block';window._pendingOBJ=p.modelData;show3DPreview(p.modelData);}
  else{s.style.display='none';window._pendingOBJ=null;}
  document.getElementById('prod-modal').classList.add('open');document.body.style.overflow='hidden';
}
function saveProduct(){
  const name=document.getElementById('pm-name').value.trim(),price=+document.getElementById('pm-price').value;
  if(!name||!price){adminToast('Name and price required.',true);return;}
  const badge=document.getElementById('pm-badge').value,bType=badge.toLowerCase().replace(/\s+/g,'');
  const imgEl=document.getElementById('upload-preview');
  const prod={name,cat:document.getElementById('pm-cat').value,badge:badge||null,badgeType:bType,img:document.getElementById('pm-img').value||(imgEl.style.display!=='none'?imgEl.src:'')||'',price,oldPrice:+document.getElementById('pm-old-price').value||null,rating:+document.getElementById('pm-rating').value||4.5,reviews:Math.floor(Math.random()*200+20),desc:document.getElementById('pm-desc').value,active:true,tags:['all',bType].filter(Boolean),modelData:window._pendingOBJ||null};
  if(editId!==null){const idx=PRODS.findIndex(p=>p.id===editId);if(idx>-1)PRODS[idx]={...PRODS[idx],...prod};adminToast('Product updated!');}
  else{prod.id=Date.now();PRODS.push(prod);adminToast('Product added!');}
  localStorage.setItem('tf_products',JSON.stringify(PRODS));
  closeProdModal();renderPMGrid();se('m-products',PRODS.length);
}
function deleteProduct(id){if(!confirm('Delete this product?'))return;PRODS=PRODS.filter(p=>p.id!==id);localStorage.setItem('tf_products',JSON.stringify(PRODS));renderPMGrid();adminToast('Product deleted.');}
function toggleProduct(id,el){const p=PRODS.find(x=>x.id===id);if(!p)return;p.active=!el.classList.contains('on');el.classList.toggle('on');el.nextElementSibling.textContent=p.active?'Active':'Hidden';localStorage.setItem('tf_products',JSON.stringify(PRODS));adminToast(p.active?'Product visible':'Product hidden');}
function previewImg(){const v=document.getElementById('pm-img').value,pr=document.getElementById('upload-preview');pr.src=v;pr.style.display=v?'block':'none';}
function handleImgUpload(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{const pr=document.getElementById('upload-preview');pr.src=e.target.result;pr.style.display='block';document.getElementById('pm-img').value='';};r.readAsDataURL(f);}
function handleOBJUpload(inp){
  const f=inp.files[0];if(!f)return;
  if(!f.name.toLowerCase().endsWith('.obj')){adminToast('Only .obj files supported',true);return;}
  const r=new FileReader();
  r.onload=e=>{
    const text=e.target.result;
    const lines=text.split('\n');
    if(!lines.some(l=>l.trim().startsWith('v '))||!lines.some(l=>l.trim().startsWith('f '))){adminToast('Invalid OBJ file',true);return;}
    window._pendingOBJ=text;
    const s=document.getElementById('model-3d-status');s.textContent=`✓ 3D model loaded: ${f.name} (${Math.round(text.length/1024)}KB)`;s.style.display='block';
    show3DPreview(text);adminToast('3D model loaded!');
  };
  r.readAsText(f);
}
let previewActive=false;
function show3DPreview(objText){
  const canvas=document.getElementById('preview-3d-canvas');
  if(!canvas||!window.Engine3D)return;
  canvas.style.display='block';previewActive=true;
  const geo=Engine3D.parseOBJ(objText);
  const rot=new Engine3D.RotController();rot.attach(canvas);
  function loop(){if(!previewActive)return;Engine3D.renderCanvas(canvas,rot,(ctx,cx,cy,rx,ry)=>Engine3D.drawOBJModel(ctx,cx,cy,rx,ry,geo,'#8B6B4A'));requestAnimationFrame(loop);}
  loop();
}
function stopPreview3D(){previewActive=false;const c=document.getElementById('preview-3d-canvas');if(c)c.style.display='none';}
function renderQuotes(){
  const qs=gv().filter(v=>v.type==='quote').reverse();
  se('quotes-body',qs.length===0?'<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:2rem;font-size:0.78rem">No quote requests yet.</td></tr>':qs.map(q=>`<tr><td style="font-size:0.68rem">${ft(q.time)}</td><td style="font-size:0.78rem;font-weight:500">${q.name||'—'}</td><td><a href="tel:${q.phone}" style="color:var(--bark)">${q.phone||'—'}</a></td><td style="font-size:0.74rem">${q.loc||'—'}</td><td style="font-size:0.74rem">${q.cat||'—'}</td><td style="font-size:0.68rem;color:var(--muted);max-width:110px;overflow:hidden;text-overflow:ellipsis">${q.msg||'—'}</td><td><a href="tel:${q.phone}" style="background:var(--bark);color:#1a1a1a;padding:0.18rem 0.6rem;border-radius:5px;font-size:0.66rem;font-weight:600;white-space:nowrap;text-decoration:none">Call</a></td></tr>`).join(''));
}
function exportQuotes(){const qs=gv().filter(v=>v.type==='quote');if(!qs.length){adminToast('No quotes.');return;}const rows=['Time,Name,Phone,Location,Category,Message',...qs.map(q=>`${q.time},${q.name||''},${q.phone||''},${q.loc||''},${q.cat||''},"${(q.msg||'').replace(/"/g,'""')}"`)];const b=new Blob([rows.join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='tf_quotes.csv';a.click();adminToast('Exported CSV!');}
function renderOrders(){se('orders-body',DEMO_ORDERS.map(o=>`<tr><td style="font-size:0.74rem;font-weight:500">${o.id}</td><td style="font-size:0.78rem">${o.customer}</td><td style="font-size:0.7rem;color:var(--muted)">${o.items}</td><td style="color:var(--bark);font-weight:500">₹${o.amount.toLocaleString('en-IN')}</td><td style="font-size:0.74rem">${o.city}</td><td style="font-size:0.68rem;color:var(--muted)">${o.date}</td><td><span class="pill ${o.status}">${o.status}</span></td></tr>`).join(''));}

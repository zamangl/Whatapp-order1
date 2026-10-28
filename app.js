/* WhatsApp Store app.js - clean plain-text order messages */
const KEY = "waStorePlus_v3", ADMIN_PASSWORD = "ZAHEER";
const defaults = {
  title: "WhatsApp Store", whatsapp: "", currency: "Rs", paymentLink: "",
  easypaisaNumber: "", jazzcashNumber: "",
  products: [
    {id:1,name:"Everyday Tote",price:1800,emoji:"Bag",image:"",description:"A practical everyday bag."},
    {id:2,name:"Classic Sneakers",price:4200,emoji:"Shoes",image:"",description:"Comfortable everyday style."},
    {id:3,name:"Minimal Watch",price:2800,emoji:"Watch",image:"",description:"A simple, timeless accessory."}
  ], orders: []
};
let store;
try { store = {...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}")}; }
catch { store = JSON.parse(JSON.stringify(defaults)); }
let cart = {}, logged = false, editId = null, previewImage = "";
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money = n => (store.currency || "Rs") + " " + Number(n || 0).toLocaleString("en-PK");
function save(){ try { localStorage.setItem(KEY, JSON.stringify(store)); } catch(e) { toast("Storage is full. Try a smaller image."); } }
function toast(s){ const el=$("#toast"); if(!el)return; el.textContent=s; el.classList.remove("hidden"); clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.add("hidden"),2800); }
function items(){ return Object.entries(cart).map(([id,q])=>({p:store.products.find(p=>p.id===+id),q})).filter(x=>x.p&&x.q>0); }
function total(){ return items().reduce((s,x)=>s+x.p.price*x.q,0); }
function productArt(p,cls="art"){ return p.image ? `<div class="${cls}"><img src="${p.image}" alt="${esc(p.name)}"></div>` : `<div class="${cls}">${esc(p.emoji || "Product")}</div>`; }
function renderProducts(){
 const input=$("#searchInput"); const q=(input?input.value:"").toLowerCase();
 const ps=store.products.filter(p=>(p.name+" "+p.description).toLowerCase().includes(q));
 $("#productGrid").innerHTML=ps.map(p=>`<article class="card">${productArt(p)}<h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="foot"><span>${money(p.price)}</span><button class="add" data-add="${p.id}" aria-label="Add ${esc(p.name)} to cart">+</button></div></article>`).join("");
 $("#emptyProducts").classList.toggle("hidden",ps.length>0); $("#storeTitle").textContent=store.title; $("#footerStoreTitle").textContent=store.title; document.title=store.title;
}
function renderCart(){
 const xs=items(); $("#cartCount").textContent=xs.reduce((s,x)=>s+x.q,0);
 $("#cartItems").innerHTML=xs.length?xs.map(x=>`<div class="cartrow"><span>${x.p.image?`<span class="product-thumb"><img src="${x.p.image}" alt=""></span> `:""}<b>${esc(x.p.name)}</b><br><small>${money(x.p.price)} x ${x.q} = ${money(x.p.price*x.q)}</small></span><span><button data-q="${x.p.id}" data-d="-1">-</button> <button data-q="${x.p.id}" data-d="1">+</button></span></div>`).join(""):`<p class="hint">Your cart is empty. Explore the store and add a product.</p>`;
 $("#cartTotal").textContent=money(total());
}
function ordersTable(os){ if(!os.length)return '<p class="hint">No orders saved in this browser yet.</p>'; return `<div class="tablewrap"><table><thead><tr><th>Order / customer</th><th>Total / payment</th><th>Status</th><th>Actions</th></tr></thead><tbody>${os.map(o=>`<tr><td><b>${esc(o.id)}</b><br>${esc(o.customerName)}<br>${esc(o.customerPhone)}</td><td>${money(o.total)}<br>${esc(o.paymentMethod)}</td><td>${esc(o.status)}</td><td><button data-status="${esc(o.id)}">Next status</button> <button data-delorder="${esc(o.id)}">Delete</button></td></tr>`).join("")}</tbody></table></div>`; }
function renderTab(t){
 document.querySelectorAll(".tabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab===t));
 ["dashboard","products","orders","settings"].forEach(k=>$("#view-"+k).classList.toggle("hidden",k!==t));
 if(t==="dashboard")$("#view-dashboard").innerHTML=`<div class="statgrid"><div class="stat">Total orders<strong>${store.orders.length}</strong></div><div class="stat">Products<strong>${store.products.length}</strong></div><div class="stat">Order value<strong>${money(store.orders.reduce((s,o)=>s+o.total,0))}</strong></div></div><h3>Recent orders</h3>${ordersTable([...store.orders].reverse().slice(0,5))}<p class="hint">This static version saves data in this browser only. It does not sync across devices.</p>`;
 if(t==="orders")$("#view-orders").innerHTML=`<h3>All orders (${store.orders.length})</h3>${ordersTable([...store.orders].reverse())}`;
 if(t==="products")renderProductAdmin(); if(t==="settings")renderSettings();
}
function renderProductAdmin(){
 const old=editId?store.products.find(p=>p.id===editId):null;
 $("#view-products").innerHTML=`<h3>${old?"Edit product":"Add a product"}</h3><form id="productForm" class="productform"><label>Product name<input name="name" required placeholder="e.g. Ladies handbag"></label><label>Price<input name="price" type="number" min="0" step="0.01" required placeholder="0"></label><label>Emoji or short label (optional)<input name="emoji" placeholder="Bag"></label><label>Description<input name="description" placeholder="Short product description"></label><label class="full">Upload product image<input class="file-input" id="productImage" name="imageFile" type="file" accept="image/*"><span class="hint">Choose an image from your phone gallery. Smaller images work best.</span></label><div class="image-preview-wrap full">${old&&old.image?`<img id="imagePreview" class="preview-image" src="${old.image}" alt="Product preview">`:`<img id="imagePreview" class="preview-image hidden" alt="Image preview">`}<span class="hint">Image preview</span><button type="button" id="clearImage">Remove image</button></div><button class="primary full">${old?"Save product":"Add product"}</button>${old?'<button type="button" id="cancelEdit" class="full">Cancel editing</button>':""}</form><h3>Products (${store.products.length})</h3><div class="tablewrap"><table><thead><tr><th>Product</th><th>Price</th><th>Actions</th></tr></thead><tbody>${store.products.map(p=>`<tr><td><div class="product-name-cell">${p.image?`<span class="product-thumb"><img src="${p.image}" alt=""></span>`:""}<span><b>${esc(p.name)}</b><br><span class="product-description">${esc(p.description)}</span></span></div></td><td>${money(p.price)}</td><td><button data-edit="${p.id}">Edit</button> <button data-delproduct="${p.id}">Delete</button></td></tr>`).join("")}</tbody></table></div>`;
 const f=$("#productForm"); if(old){["name","price","emoji","description"].forEach(k=>f.elements[k].value=old[k]??"");previewImage=old.image||"";}else previewImage="";
 const file=$("#productImage"),prev=$("#imagePreview"); file.onchange=()=>{const fl=file.files[0];if(!fl)return;if(!fl.type.startsWith("image/")){toast("Please choose an image file");file.value="";return;}if(fl.size>1200000){toast("Please choose an image under 1.2 MB");file.value="";return;}const r=new FileReader();r.onload=()=>{previewImage=String(r.result);prev.src=previewImage;prev.classList.remove("hidden");};r.readAsDataURL(fl);};
 $("#clearImage").onclick=()=>{previewImage="";file.value="";prev.src="";prev.classList.add("hidden");}; if($("#cancelEdit"))$("#cancelEdit").onclick=()=>{editId=null;previewImage="";renderTab("products");};
 f.onsubmit=e=>{e.preventDefault();const d=new FormData(f);const p={id:editId||Date.now(),name:d.get("name").trim(),price:+d.get("price"),emoji:d.get("emoji").trim()||"Product",description:d.get("description").trim(),image:previewImage};if(editId)store.products=store.products.map(x=>x.id===editId?p:x);else store.products.push(p);editId=null;previewImage="";save();renderProducts();renderTab("products");toast("Product saved successfully");};
}
function renderSettings(){
 $("#view-settings").innerHTML=`<form id="settingsForm" class="settingsform"><label>Store name<input name="title" value="${esc(store.title)}" required></label><label>Store WhatsApp number<input name="whatsapp" inputmode="tel" value="${esc(store.whatsapp)}" placeholder="923001234567" required></label><label>Currency<input name="currency" value="${esc(store.currency)}" placeholder="Rs"></label><label>Easypaisa account / mobile number<input name="easypaisaNumber" inputmode="tel" value="${esc(store.easypaisaNumber||"")}" placeholder="03XX XXXXXXX"></label><label>JazzCash account / mobile number<input name="jazzcashNumber" inputmode="tel" value="${esc(store.jazzcashNumber||"")}" placeholder="03XX XXXXXXX"></label><label class="full">Optional payment link<input name="paymentLink" type="url" value="${esc(store.paymentLink)}" placeholder="https://..."></label><p class="hint full">WhatsApp number: country code and digits only, e.g. 923001234567. Payments are not automatically verified.</p><button class="primary full">Save settings</button></form><button id="resetDemo">Reset demo data</button>`;
 $("#settingsForm").onsubmit=e=>{e.preventDefault();const d=new FormData(e.target);store.title=d.get("title").trim();store.whatsapp=d.get("whatsapp").replace(/\D/g,"");store.currency=d.get("currency").trim()||"Rs";store.easypaisaNumber=d.get("easypaisaNumber").trim();store.jazzcashNumber=d.get("jazzcashNumber").trim();store.paymentLink=d.get("paymentLink").trim();save();renderProducts();renderTab("settings");toast("Settings saved");};
 $("#resetDemo").onclick=()=>{if(confirm("Reset all local data? This removes products and orders saved in this browser.")){store=JSON.parse(JSON.stringify(defaults));save();cart={};renderProducts();renderCart();renderTab("dashboard");}};
}
function open(id){$("#"+id).classList.remove("hidden");} function close(id){$("#"+id).classList.add("hidden");}
$("#searchInput").oninput=renderProducts;
$("#productGrid").onclick=e=>{const b=e.target.closest("[data-add]");if(b){cart[b.dataset.add]=(cart[b.dataset.add]||0)+1;renderCart();toast("Added to cart");}};
$("#cartButton").onclick=()=>{renderCart();open("cartModal");};
$("#openAdmin").onclick=()=>{open("adminModal");$("#adminLogin").classList.toggle("hidden",logged);$("#adminApp").classList.toggle("hidden",!logged);if(logged)renderTab("dashboard");};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>close(b.dataset.close));
document.querySelectorAll(".backdrop").forEach(b=>b.onclick=e=>{if(e.target===b)close(b.id);});
$("#cartItems").onclick=e=>{const b=e.target.closest("[data-q]");if(!b)return;const id=b.dataset.q;cart[id]=(cart[id]||0)+ +b.dataset.d;if(cart[id]<=0)delete cart[id];renderCart();};
$("#checkoutForm").onsubmit=e=>{
 e.preventDefault(); if(!items().length)return toast("Your cart is empty");
 if(!store.whatsapp)return toast("Admin: save your WhatsApp number in Admin > Settings");
 if(!/^\d{10,15}$/.test(store.whatsapp))return toast("Check WhatsApp number: country code and digits only");
 const d=new FormData(e.target); const o={id:"ORD-"+Date.now().toString().slice(-7),date:new Date().toLocaleString(),customerName:d.get("customerName").trim(),customerPhone:d.get("customerPhone").trim(),address:d.get("address").trim(),paymentMethod:d.get("paymentMethod"),items:items().map(x=>({name:x.p.name,price:x.p.price,qty:x.q})),total:total(),status:"New"};
 store.orders.push(o);save();
 // Plain text only: no emoji, decorative lines, or WhatsApp formatting marks.
 let msg = `${store.title}\nNEW ORDER\n\nOrder ID: ${o.id}\nDate: ${o.date}\n\nCUSTOMER DETAILS\nName: ${o.customerName}\nPhone: ${o.customerPhone}\nAddress: ${o.address}\n\nORDER DETAILS\n`;
 o.items.forEach((x,i)=>{msg += `${i+1}. ${x.name}\nQuantity: ${x.qty}\nPrice: ${money(x.price)}\nSubtotal: ${money(x.price*x.qty)}\n\n`;});
 msg += `TOTAL: ${money(o.total)}\nPayment method: ${o.paymentMethod}`;
 if(o.paymentMethod==="Easypaisa / JazzCash")msg += `\nEasypaisa: ${store.easypaisaNumber||"Please ask store owner"}\nJazzCash: ${store.jazzcashNumber||"Please ask store owner"}`;
 if(o.paymentMethod==="Online payment link"&&store.paymentLink)msg += `\nPayment link: ${store.paymentLink}`;
 msg += "\n\nPlease confirm my order. Thank you.";
 const waUrl="https://wa.me/"+store.whatsapp+"?text="+encodeURIComponent(msg);
 cart={};renderCart();e.target.reset();close("cartModal");window.location.href=waUrl;
};
$("#loginForm").onsubmit=e=>{e.preventDefault();if(new FormData(e.target).get("password")!==ADMIN_PASSWORD)return toast("Incorrect admin password");logged=true;$("#adminLogin").classList.add("hidden");$("#adminApp").classList.remove("hidden");renderTab("dashboard");};
$("#logoutButton").onclick=()=>{logged=false;$("#adminLogin").classList.remove("hidden");$("#adminApp").classList.add("hidden");};
document.querySelector(".tabs").onclick=e=>{const b=e.target.closest("[data-tab]");if(b)renderTab(b.dataset.tab);};
$("#adminApp").onclick=e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.edit){editId=+b.dataset.edit;renderTab("products");}if(b.dataset.delproduct&&confirm("Delete product?")){store.products=store.products.filter(p=>p.id!==+b.dataset.delproduct);save();renderProducts();renderTab("products");}if(b.dataset.status){const o=store.orders.find(o=>o.id===b.dataset.status),ss=["New","Processing","Shipped","Completed"];o.status=ss[(ss.indexOf(o.status)+1)%ss.length];save();renderTab("orders");}if(b.dataset.delorder&&confirm("Delete order?")){store.orders=store.orders.filter(o=>o.id!==b.dataset.delorder);save();renderTab("orders");}};
$("#exportOrders").onclick=()=>{const rows=[["Order ID","Date","Customer","Phone","Address","Payment","Total","Status"],...store.orders.map(o=>[o.id,o.date,o.customerName,o.customerPhone,o.address,o.paymentMethod,o.total,o.status])];const csv=rows.map(r=>r.map(x=>`"${String(x??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");const url=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv"}));const a=document.createElement("a");a.href=url;a.download="orders.csv";a.click();URL.revokeObjectURL(url);};
renderProducts();renderCart();

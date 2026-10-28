const $ = (s) => document.querySelector(s);
const defaultProducts = [
 {id:"p1",name:"Everyday Tote Bag",price:1850,description:"A roomy everyday bag with a clean, timeless look.",image:""},
 {id:"p2",name:"Classic Wallet",price:950,description:"A compact wallet for your daily essentials.",image:""},
 {id:"p3",name:"Minimal Watch",price:3200,description:"A versatile style for work and weekends.",image:""},
 {id:"p4",name:"Travel Pouch",price:700,description:"Keep your small essentials neatly organised.",image:""},
 {id:"p5",name:"Gift Set",price:2400,description:"A thoughtful gift, ready for any occasion.",image:""},
 {id:"p6",name:"Crossbody Bag",price:2750,description:"Lightweight, practical and easy to style.",image:""}
];
const read = (key, fallback) => { try { const v=localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
let products = read("of_products", defaultProducts);
let cart = [];
let settings = read("of_settings", {name:"OrderFlow Store",phone:""});
const money = n => "Rs " + Number(n).toLocaleString("en-PK");
const safe = s => String(s ?? "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600)}
function persistProducts(){localStorage.setItem("of_products",JSON.stringify(products))}
function renderProducts(){
 const q=$("#searchInput").value.trim().toLowerCase();
 const list=products.filter(p=>(p.name+" "+p.description).toLowerCase().includes(q));
 $("#productGrid").innerHTML=list.length?list.map(p=>`<article class="product-card"><div class="product-image">${p.image?`<img src="${safe(p.image)}" alt="${safe(p.name)}" loading="lazy" onerror="this.remove()">`:"✳"}</div><div class="product-info"><h3>${safe(p.name)}</h3><p>${safe(p.description||"Made with care. Message us for details.")}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${safe(p.id)}">＋ Add to order</button></div></div></article>`).join(""):`<p class="empty">No products found. Try another search.</p>`;
}
function renderCart(){
 const count=cart.reduce((n,i)=>n+i.qty,0), total=cart.reduce((n,i)=>n+i.price*i.qty,0);
 $("#cartCount").textContent=`${count} item${count===1?"":"s"}`; $("#cartTotal").textContent=money(total);
 $("#cartItems").innerHTML=cart.length?cart.map(i=>`<div class="cart-row"><div><strong>${safe(i.name)}</strong><small>${money(i.price)} each</small></div><div class="quantity"><button data-dec="${safe(i.id)}" aria-label="Decrease quantity">−</button><strong>${i.qty}</strong><button data-inc="${safe(i.id)}" aria-label="Increase quantity">＋</button></div><button class="remove-btn" data-remove="${safe(i.id)}">Remove</button></div>`).join(""):`<p class="empty">Your cart is empty. Add a product to get started.</p>`;
}
function renderManage(){
 $("#storeName").value=settings.name||"";$("#storePhone").value=settings.phone||"";
 $("#manageProducts").innerHTML=products.length?products.map(p=>`<div class="manage-product"><div><strong>${safe(p.name)}</strong><small>${money(p.price)}</small></div><button class="remove-btn" data-delete-product="${safe(p.id)}">Delete</button></div>`).join(""):`<p class="empty">No products yet. Add one above.</p>`;
}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add){const p=products.find(x=>x.id===add.dataset.add);if(p){const item=cart.find(x=>x.id===p.id);item?item.qty++:cart.push({...p,qty:1});renderCart();toast("Added to your order");}}
 const inc=e.target.closest("[data-inc]");if(inc){const i=cart.find(x=>x.id===inc.dataset.inc);if(i)i.qty++;renderCart()}
 const dec=e.target.closest("[data-dec]");if(dec){const i=cart.find(x=>x.id===dec.dataset.dec);if(i){i.qty--;if(i.qty<=0)cart=cart.filter(x=>x.id!==i.id)}renderCart()}
 const rem=e.target.closest("[data-remove]");if(rem){cart=cart.filter(x=>x.id!==rem.dataset.remove);renderCart()}
 const del=e.target.closest("[data-delete-product]");if(del){products=products.filter(p=>p.id!==del.dataset.deleteProduct);cart=cart.filter(p=>products.some(x=>x.id===p.id));persistProducts();renderProducts();renderCart();renderManage();toast("Product removed")}
 const nav=e.target.closest("[data-view]");if(nav){document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b===nav));$("#storeView").classList.toggle("hidden",nav.dataset.view!=="store");$("#manageView").classList.toggle("hidden",nav.dataset.view!=="manage");if(nav.dataset.view==="manage")renderManage();window.scrollTo({top:0,behavior:"smooth"})}
});
$("#searchInput").addEventListener("input",renderProducts);
$("#settingsForm").addEventListener("submit",e=>{e.preventDefault();const phone=$("#storePhone").value.replace(/\D/g,"");if(phone.length<10||phone.length>15){toast("Enter a valid WhatsApp number with country code");return}settings={name:$("#storeName").value.trim(),phone};localStorage.setItem("of_settings",JSON.stringify(settings));toast("Store details saved in this browser")});
$("#productForm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.target);products.unshift({id:"p"+Date.now(),name:String(f.get("name")).trim(),price:Number(f.get("price")),image:String(f.get("image")).trim(),description:String(f.get("description")).trim()});persistProducts();renderProducts();renderManage();e.target.reset();toast("Product added")});
$("#checkoutForm").addEventListener("submit",e=>{
 e.preventDefault();if(!cart.length){toast("Add at least one product first");return}
 if(!settings.phone){toast("Store owner: add your WhatsApp number in Manage store first");return}
 const f=new FormData(e.target), name=String(f.get("customerName")).trim(), phone=String(f.get("customerPhone")).trim(), address=String(f.get("address")).trim(), note=String(f.get("note")).trim();
 const total=cart.reduce((n,i)=>n+i.price*i.qty,0);
 const lines=[`New order — ${settings.name}`,``,`Customer: ${name}`,`Customer phone: ${phone}`,`Address: ${address}`,``,`Items:`,...cart.map(i=>`• ${i.name} × ${i.qty} — ${money(i.price*i.qty)}`),``,`Estimated total: ${money(total)}`,note?`Note: ${note}`:"",``,`Please confirm availability and delivery details.`].filter(Boolean);
 const url=`https://wa.me/${settings.phone}?text=${encodeURIComponent(lines.join("\n"))}`;
 window.open(url,"_blank","noopener,noreferrer");
});
$("#resetDemo").addEventListener("click",()=>{if(confirm("Reset demo products and store settings in this browser?")){products=[...defaultProducts];settings={name:"OrderFlow Store",phone:""};cart=[];persistProducts();localStorage.removeItem("of_settings");renderProducts();renderCart();renderManage();toast("Demo data reset")}});
$("#exportProducts").addEventListener("click",()=>{const rows=[["Name","Price PKR","Description","Image URL"],...products.map(p=>[p.name,p.price,p.description,p.image])];const csv=rows.map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}));a.download="orderflow-products.csv";a.click();URL.revokeObjectURL(a.href)});
renderProducts();renderCart();

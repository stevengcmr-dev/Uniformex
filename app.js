// Configuración de la tienda: cambia aquí los productos, precios y teléfono.
const WHATSAPP_NUMBER = "525662698251"; // México: 52 + número de 10 dígitos
const products = [
  {id:1,name:"Playera SMN México",category:"Ropa",price:0,description:"Playera blanca con diseño SMN México. Consulta tallas.",symbol:"SMN"},
  {id:2,name:"Sudadera blanca",category:"Ropa",price:0,description:"Sudadera blanca con diseño SMN México.",symbol:"SMN"},
  {id:3,name:"Gorra roja",category:"Accesorios",price:0,description:"Gorra roja. Consulta disponibilidad.",symbol:"SMN"},
  {id:4,name:"Cinturón con hebilla",category:"Accesorios",price:0,description:"Cinturón con hebilla dorada. Consulta detalles.",symbol:"★"}
];
let cart = JSON.parse(localStorage.getItem("smnCart") || "[]");
let activeFilter = "Todos";
const money = n => n.toLocaleString("es-MX",{style:"currency",currency:"MXN"});
const grid = document.getElementById("productGrid");

function renderProducts(){
  const term = document.getElementById("searchInput").value.toLowerCase().trim();
  const shown = products.filter(p => (activeFilter==="Todos" || p.category===activeFilter) && (p.name+" "+p.description).toLowerCase().includes(term));
  grid.innerHTML = shown.map(p=>`<article class="product-card">
    <div class="product-visual"><span class="category">${p.category.toUpperCase()}</span><span class="symbol">${p.symbol}</span></div>
    <div class="product-info"><h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom"><span class="price">${p.price>0?money(p.price):"Consultar precio"}</span><button class="add-button" data-add="${p.id}">Agregar +</button></div></div>
  </article>`).join("");
  document.getElementById("emptyState").classList.toggle("hidden",shown.length!==0);
}
function saveCart(){localStorage.setItem("smnCart",JSON.stringify(cart));renderCart();}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();}
function renderCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  const items=document.getElementById("cartItems");
  items.innerHTML=cart.length?cart.map(x=>{const p=products.find(p=>p.id===x.id);return `<div class="cart-row"><div><b>${p.name}</b><small>${p.price>0?money(p.price):"Precio por confirmar"} · Cantidad: ${x.qty}</small></div><div class="quantity"><button data-minus="${p.id}">−</button><span>${x.qty}</span><button data-plus="${p.id}">+</button></div></div>`}).join(""):'<p class="empty">Tu carrito está vacío. Agrega productos del catálogo.</p>';
  const total=cart.reduce((s,x)=>s+(products.find(p=>p.id===x.id).price*x.qty),0);
  document.getElementById("cartTotal").textContent=total?money(total):"Por confirmar";
}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("cartOverlay").classList.remove("hidden");document.getElementById("cartDrawer").setAttribute("aria-hidden","false");}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("cartOverlay").classList.add("hidden");document.getElementById("cartDrawer").setAttribute("aria-hidden","true");}
function sendOrder(){
  if(!cart.length){alert("Agrega al menos un producto antes de enviar tu pedido.");return;}
  const lines=cart.map(x=>{const p=products.find(p=>p.id===x.id);return `• ${p.name} — ${x.qty} pieza(s) — ${p.price?money(p.price):"precio por confirmar"}`;});
  const total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
  const msg=`Hola, SMN México. Quiero solicitar este pedido:\n\n${lines.join("\n")}\n\nTotal estimado: ${total?money(total):"Por confirmar"}\n\n¿Me pueden confirmar disponibilidad, tallas, precio final y entrega?`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank","noopener");
}
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(Number(b.dataset.add));});
document.getElementById("cartItems").addEventListener("click",e=>{const plus=e.target.closest("[data-plus]"),minus=e.target.closest("[data-minus]");if(plus)changeQty(Number(plus.dataset.plus),1);if(minus)changeQty(Number(minus.dataset.minus),-1);});
document.getElementById("filters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeFilter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("cartOverlay").addEventListener("click",closeCart);
document.getElementById("checkoutButton").addEventListener("click",sendOrder);
document.getElementById("clearCart").addEventListener("click",()=>{cart=[];saveCart();});
document.getElementById("contactWhatsApp").href=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, quiero información sobre los productos de SMN México.")}`;
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();

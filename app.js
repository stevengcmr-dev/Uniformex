const WHATSAPP_NUMBER="525662698251";
const SIZES=["CH","M","G","XL","XXL"];
const products=[
{id:1,name:"Paquete básico",cat:"Paquetes",price:350,desc:"Gorra + playera SMN México + porta cartilla.",image:"assets/paquete-basico.webp",tag:"PAQUETE",sizes:["playera"]},
{id:2,name:"Paquete completo",cat:"Paquetes",price:780,desc:"Cinturón + sudadera SMN México + gorra + playera SMN México + porta cartilla.",image:"assets/paquete-completo.webp",tag:"PAQUETE",sizes:["playera","sudadera"]},
{id:3,name:"Playera SMN México",cat:"Playeras",price:249,desc:"Playera blanca con diseño SMN México.",image:"assets/playera-smn.png",sizes:["playera"]},
{id:8,name:"Playera Mujer SMN México Voluntaria",cat:"Playeras",price:249,desc:"Playera blanca para mujer con diseño SMN México Voluntaria.",image:"assets/playera-mujer-voluntaria.png",sizes:["playera"]},
{id:4,name:"Gorra",cat:"Gorras",price:120,desc:"Gorra roja. Consulta disponibilidad.",image:"assets/gorra-roja.png"},
{id:5,name:"Sudadera SMN México",cat:"Sudaderas",price:350,desc:"Sudadera blanca con diseño SMN México.",image:"assets/sudadera-producto.jpg",sizes:["sudadera"]},
{id:6,name:"Cinturón",cat:"Cinturones",price:100,desc:"Cinturón. Consulta detalles y disponibilidad.",image:"assets/cinturon-smn.png"},
{id:7,name:"Porta cartilla",cat:"Porta cartillas",price:50,desc:"Porta cartilla negro con emblema S.M.N.",image:"assets/porta-cartilla.jpg"}
];
let cart=JSON.parse(localStorage.getItem("uniformexCart")||"[]"),filter="Todos";
const $=id=>document.getElementById(id);
const money=n=>n.toLocaleString("es-MX",{style:"currency",currency:"MXN"});
function sizeControls(p){
 if(!p.sizes?.length)return "";
 return p.sizes.map(kind=>`<label class="size-field"><span>TALLA ${kind==="playera"?"PLAYERA":"SUDADERA"}</span><select data-size="${kind}" aria-label="Talla de ${kind}">${SIZES.map(s=>`<option value="${s}">${s}</option>`).join("")}</select></label>`).join("");
}
function renderProducts(){
 const term=$("searchInput").value.toLowerCase().trim();
 const list=products.filter(p=>(filter==="Todos"||p.cat===filter)&&(p.name+" "+p.desc).toLowerCase().includes(term));
 $("productGrid").innerHTML=list.map(p=>`<article class="card">
 <div class="visual">${p.image?`<img src="${p.image}" alt="${p.name}">`:`<span class="glyph">${p.glyph||""}</span>`}${p.tag?`<span class="tag">${p.tag}</span>`:""}</div>
 <div class="info"><span class="category">${p.cat.toUpperCase()}</span><h3>${p.name}</h3><p>${p.desc}</p>
 ${sizeControls(p)}
 <div class="bottom"><span class="price">${money(p.price)}</span><button class="add" data-add="${p.id}">AGREGAR +</button></div></div></article>`).join("");
 $("emptyState").classList.toggle("hidden",list.length>0);
}
function itemKey(item){return `${item.id}|${item.shirtSize||""}|${item.hoodieSize||""}`;}
function save(){localStorage.setItem("uniformexCart",JSON.stringify(cart));renderCart();}
function sizeDescription(item){
 const parts=[];
 if(item.shirtSize)parts.push(`Playera: ${item.shirtSize}`);
 if(item.hoodieSize)parts.push(`Sudadera: ${item.hoodieSize}`);
 return parts.join(" · ");
}
function renderCart(){
 $("cartCount").textContent=cart.reduce((n,x)=>n+x.qty,0);
 $("cartItems").innerHTML=cart.length?cart.map((x,i)=>{let p=products.find(p=>p.id===x.id);return `<div class="cart-row"><div><b>${p.name}</b>${sizeDescription(x)?`<small class="cart-size">${sizeDescription(x)}</small>`:""}<small>${money(p.price)} c/u</small></div><div class="qty"><button data-dec="${i}">−</button>${x.qty}<button data-inc="${i}">+</button></div></div>`}).join(""):'<p class="empty">Tu carrito está vacío.</p>';
 const total=cart.reduce((sum,x)=>sum+products.find(p=>p.id===x.id).price*x.qty,0);
 $("cartTotal").textContent=money(total);
}
function addFromCard(button){
 const p=products.find(p=>p.id===+button.dataset.add);
 const card=button.closest(".card");
 const item={id:p.id,qty:1};
 if(p.sizes?.includes("playera"))item.shirtSize=card.querySelector('[data-size="playera"]').value;
 if(p.sizes?.includes("sudadera"))item.hoodieSize=card.querySelector('[data-size="sudadera"]').value;
 const existing=cart.find(x=>itemKey(x)===itemKey(item));
 if(existing)existing.qty++;else cart.push(item);
 save();
}
function open(){ $("drawer").classList.add("open");$("overlay").classList.remove("hidden");$("drawer").setAttribute("aria-hidden","false");}
function close(){ $("drawer").classList.remove("open");$("overlay").classList.add("hidden");$("drawer").setAttribute("aria-hidden","true");}
function wa(text){return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;}
function buildWhatsAppMessage(){
 if(!cart.length)return "Hola, Uniformex. Quiero información sobre sus productos.";
 const lines=cart.map(x=>{const p=products.find(p=>p.id===x.id);const sizes=sizeDescription(x);return `• ${p.name}${sizes?` (${sizes})`:""} — ${x.qty} x ${money(p.price)} = ${money(p.price*x.qty)}`}).join("\n");
 const total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
 const state=$("orderState")?.value.trim()||"No especificado";
 const municipality=$("orderMunicipality")?.value.trim()||"No especificado";
 return `Hola, Uniformex. Quiero realizar este pedido:\n\n${lines}\n\nTOTAL ESTIMADO: ${money(total)}\n\nLugar del pedido: ${municipality}, ${state}.\n\n¿Me confirman disponibilidad y forma de entrega?`;
}
function openWhatsAppWithCart(event){
 if(event)event.preventDefault();
 window.location.href = wa(buildWhatsAppMessage());
}
function checkout(){
 if(!cart.length){alert("Agrega productos al carrito.");return;}
 openWhatsAppWithCart();
}
// Conserva el lugar indicado para que no tengan que capturarlo en cada pedido.
const savedLocation=JSON.parse(localStorage.getItem("uniformexLocation")||"{}");
if($("orderState"))$("orderState").value=savedLocation.state||"";
if($("orderMunicipality"))$("orderMunicipality").value=savedLocation.municipality||"";
function saveLocation(){
 localStorage.setItem("uniformexLocation",JSON.stringify({
  state:$("orderState").value,
  municipality:$("orderMunicipality").value.trim()
 }));
}
$("orderState").addEventListener("change",saveLocation);
$("orderMunicipality").addEventListener("input",saveLocation);
$("detectLocation").addEventListener("click",()=>{
 const status=$("locationStatus");
 if(!navigator.geolocation){status.textContent="Este navegador no permite detectar la ubicación. Escribe tu estado y municipio.";return;}
 status.textContent="Solicitando permiso de ubicación…";
 navigator.geolocation.getCurrentPosition(async pos=>{
  status.textContent="Ubicación detectada. Buscando estado y municipio…";
  try{
   const {latitude,longitude}=pos.coords;
   const url=`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
   const response=await fetch(url,{headers:{Accept:"application/json"}});
   if(!response.ok)throw new Error("No fue posible consultar el servicio de mapas.");
   const data=await response.json();
   const a=data.address||{};
   const municipality=a.city||a.town||a.village||a.municipality||a.county||a.city_district||"";
   const state=a.state||"";
   const stateSelect=$("orderState");
   const option=[...stateSelect.options].find(o=>o.value.toLowerCase()===state.toLowerCase()||o.text.toLowerCase()===state.toLowerCase());
   if(option)stateSelect.value=option.value;
   else if(state){stateSelect.value="Otro / No aparece";}
   $("orderMunicipality").value=municipality;
   saveLocation();
   status.textContent=municipality||state
    ?`Ubicación aproximada: ${municipality||"municipio no identificado"}${state?", "+state:""}. Verifica los datos antes de enviar.`
    :"No se pudo identificar el municipio; puedes escribirlo manualmente.";
  }catch(err){
   status.textContent="No se pudo convertir la ubicación en estado y municipio. Puedes capturarlos manualmente.";
  }
 },err=>{
  status.textContent=err.code===1
   ?"No diste permiso de ubicación. Puedes escribir tu estado y municipio manualmente."
   :"No se pudo detectar la ubicación. Puedes escribirla manualmente.";
 },{enableHighAccuracy:false,timeout:12000,maximumAge:300000});
});
$("productGrid").addEventListener("click",e=>{let b=e.target.closest("[data-add]");if(b)addFromCard(b);});
$("cartItems").addEventListener("click",e=>{let a=e.target.closest("[data-inc]"),b=e.target.closest("[data-dec]");if(a){cart[+a.dataset.inc].qty++;save();}if(b){let i=+b.dataset.dec;cart[i].qty--;if(cart[i].qty<1)cart.splice(i,1);save();}});
$("filters").addEventListener("click",e=>{let b=e.target.closest("[data-filter]");if(!b)return;filter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
$("searchInput").addEventListener("input",renderProducts);$("openCart").onclick=open;$("closeCart").onclick=close;$("overlay").onclick=close;$("checkout").onclick=checkout;$("clearCart").onclick=()=>{cart=[];save();};
$("contactWhatsApp").href=wa(buildWhatsAppMessage());$("heroWhatsApp").href=wa(buildWhatsAppMessage());$("contactWhatsApp").addEventListener("click",openWhatsAppWithCart);$("heroWhatsApp").addEventListener("click",openWhatsAppWithCart);$("year").textContent=new Date().getFullYear();renderProducts();renderCart();

const WHATSAPP_NUMBER="525662698251";
const products=[
{id:1,name:"Paquete básico",cat:"Paquetes",price:350,desc:"Gorra + playera SMN México + porta cartilla.",image:"assets/paquete-basico.webp",tag:"PAQUETE"},
{id:2,name:"Paquete completo",cat:"Paquetes",price:780,desc:"Cinturón + sudadera SMN México + gorra + playera SMN México + porta cartilla.",image:"assets/paquete-completo.webp",tag:"PAQUETE"},
{id:3,name:"Playera SMN México",cat:"Playeras",price:299,desc:"Playera blanca con diseño SMN México.",image:"assets/playera-smn.png"},
{id:4,name:"Gorra",cat:"Gorras",price:120,desc:"Gorra roja. Consulta disponibilidad.",image:"assets/gorra-roja.png"},
{id:5,name:"Sudadera SMN México",cat:"Sudaderas",price:350,desc:"Sudadera blanca con diseño SMN México.",image:"assets/sudadera-producto.jpg"},
{id:6,name:"Cinturón",cat:"Cinturones",price:100,desc:"Cinturón. Consulta detalles y disponibilidad.",image:"assets/cinturon-smn.png"},
{id:7,name:"Porta cartilla",cat:"Porta cartillas",price:50,desc:"Porta cartilla negro con emblema S.M.N.",image:"assets/porta-cartilla.jpg"}
];
let cart=JSON.parse(localStorage.getItem("uniformexCart")||"[]"),filter="Todos";
const $=id=>document.getElementById(id);
const money=n=>n.toLocaleString("es-MX",{style:"currency",currency:"MXN"});
function renderProducts(){
 const term=$("searchInput").value.toLowerCase().trim();
 const list=products.filter(p=>(filter==="Todos"||p.cat===filter)&&(p.name+" "+p.desc).toLowerCase().includes(term));
 $("productGrid").innerHTML=list.map(p=>`<article class="card">
 <div class="visual">${p.image?`<img src="${p.image}" alt="${p.name}">`:`<span class="glyph">${p.glyph}</span>`}${p.tag?`<span class="tag">${p.tag}</span>`:""}</div>
 <div class="info"><span class="category">${p.cat.toUpperCase()}</span><h3>${p.name}</h3><p>${p.desc}</p>
 <div class="bottom"><span class="price">${money(p.price)}</span><button class="add" data-add="${p.id}">AGREGAR +</button></div></div></article>`).join("");
 $("emptyState").classList.toggle("hidden",list.length>0);
}
function save(){localStorage.setItem("uniformexCart",JSON.stringify(cart));renderCart();}
function renderCart(){
 $("cartCount").textContent=cart.reduce((n,x)=>n+x.qty,0);
 $("cartItems").innerHTML=cart.length?cart.map(x=>{let p=products.find(p=>p.id===x.id);return `<div class="cart-row"><div><b>${p.name}</b><small>${money(p.price)} c/u</small></div><div class="qty"><button data-dec="${p.id}">−</button>${x.qty}<button data-inc="${p.id}">+</button></div></div>`}).join(""):'<p class="empty">Tu carrito está vacío.</p>';
 const total=cart.reduce((sum,x)=>sum+products.find(p=>p.id===x.id).price*x.qty,0);
 $("cartTotal").textContent=money(total);
}
function add(id){let x=cart.find(x=>x.id===id);x?x.qty++:cart.push({id,qty:1});save();}
function open(){ $("drawer").classList.add("open");$("overlay").classList.remove("hidden");$("drawer").setAttribute("aria-hidden","false");}
function close(){ $("drawer").classList.remove("open");$("overlay").classList.add("hidden");$("drawer").setAttribute("aria-hidden","true");}
function wa(text){return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;}
function checkout(){
 if(!cart.length){alert("Agrega productos al carrito.");return;}
 let lines=cart.map(x=>{let p=products.find(p=>p.id===x.id);return `• ${p.name} — ${x.qty} x ${money(p.price)} = ${money(p.price*x.qty)}`}).join("\n");
 let total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
 window.open(wa(`Hola, Uniformex. Quiero realizar este pedido:\n\n${lines}\n\nTOTAL: ${money(total)}\n\n¿Me confirman disponibilidad y forma de entrega?`),"_blank","noopener");
}
$("productGrid").addEventListener("click",e=>{let b=e.target.closest("[data-add]");if(b)add(+b.dataset.add);});
$("cartItems").addEventListener("click",e=>{let a=e.target.closest("[data-inc]"),b=e.target.closest("[data-dec]");if(a){cart.find(x=>x.id===+a.dataset.inc).qty++;save();}if(b){let x=cart.find(x=>x.id===+b.dataset.dec);x.qty--;if(x.qty<1)cart=cart.filter(y=>y.id!==x.id);save();}});
$("filters").addEventListener("click",e=>{let b=e.target.closest("[data-filter]");if(!b)return;filter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
$("searchInput").addEventListener("input",renderProducts);$("openCart").onclick=open;$("closeCart").onclick=close;$("overlay").onclick=close;$("checkout").onclick=checkout;$("clearCart").onclick=()=>{cart=[];save();};
$("contactWhatsApp").href=wa("Hola, Uniformex. Quiero información sobre sus productos.");$("heroWhatsApp").href=wa("Hola, Uniformex. Quiero información sobre sus paquetes SMN.");$("year").textContent=new Date().getFullYear();renderProducts();renderCart();

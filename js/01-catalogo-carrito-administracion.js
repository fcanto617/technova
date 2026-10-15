/* ============================================================
   TECHNOVA PERÚ — CÓDIGO PRINCIPAL DE LA TIENDA
   Secciones: 1) configuración y productos, 2) utilidades,
   3) catálogo, 4) carrito, 5) detalle de producto,
   6) administración e imágenes, 7) eventos de la página.
   Los datos se guardan en este navegador (localStorage), no en
   una base de datos compartida entre dispositivos.
   ============================================================ */

/* SECCIÓN 1 — CONFIGURACIÓN GENERAL Y PRODUCTOS DE EJEMPLO */
const WHATSAPP_NUMBER = "51999999999"; // Reemplaza por tu número real: código país + número, sin + ni espacios.
const STORAGE_PRODUCTS = "technova_products_v2";
const STORAGE_CART = "technova_cart_v2";

const seedProducts = [
  {id:"tn-1001",name:"Laptop Lenovo IdeaPad 15.6 pulgadas",brand:"Lenovo",model:"IdeaPad 15",category:"Laptops",price:1899,stock:5,lowStock:2,description:"Laptop para estudio, trabajo diario y videollamadas. Verifica procesador, memoria y almacenamiento de la unidad específica antes de publicar.",emoji:"💻",images:[],video:"",featured:true,sku:"TN-LAP-001"},
  {id:"tn-1002",name:"PC Gamer Ryzen 5 con gráfica RTX",brand:"TechNova",model:"Gamer R5",category:"Computadoras",price:3299,stock:3,lowStock:1,description:"Computadora para juegos y creación de contenido. Completa las especificaciones exactas de procesador, gráfica, RAM y SSD antes de vender.",emoji:"🖥️",images:[],video:"",featured:true,sku:"TN-PC-002"},
  {id:"tn-1003",name:"SSD NVMe 1TB",brand:"Por confirmar",model:"NVMe 1TB",category:"Componentes",price:299,stock:8,lowStock:3,description:"Unidad SSD NVMe de 1 TB. Confirma interfaz, velocidad y compatibilidad con el equipo.",emoji:"💾",images:[],video:"",featured:true,sku:"TN-SSD-003"},
  {id:"tn-1004",name:"Memoria RAM DDR4 16GB",brand:"Por confirmar",model:"DDR4 16GB",category:"Componentes",price:169,stock:10,lowStock:3,description:"Memoria RAM DDR4 de 16 GB. Confirma frecuencia, formato DIMM/SO-DIMM y compatibilidad.",emoji:"🧩",images:[],video:"",featured:false,sku:"TN-RAM-004"},
  {id:"tn-1005",name:"Monitor Gaming 24 pulgadas 144Hz",brand:"Por confirmar",model:"24G 144Hz",category:"Monitores",price:599,stock:4,lowStock:2,description:"Monitor para gaming y uso diario. Verifica resolución, puertos y frecuencia exacta del modelo.",emoji:"🖥️",images:[],video:"",featured:true,sku:"TN-MON-005"},
  {id:"tn-1006",name:"Impresora multifunción WiFi",brand:"Por confirmar",model:"Multifunción WiFi",category:"Impresoras",price:649,stock:2,lowStock:2,description:"Impresora multifunción con conexión WiFi. Agrega modelo exacto, consumibles compatibles y características reales.",emoji:"🖨️",images:[],video:"",featured:false,sku:"TN-IMP-006"},
  {id:"tn-1007",name:"Router WiFi 6",brand:"Por confirmar",model:"WiFi 6",category:"Redes",price:249,stock:6,lowStock:2,description:"Router inalámbrico WiFi 6. Confirma número de puertos, velocidad y cobertura anunciada por el fabricante.",emoji:"📡",images:[],video:"",featured:false,sku:"TN-RED-007"},
  {id:"tn-1008",name:"Teclado mecánico RGB",brand:"Por confirmar",model:"RGB Mecánico",category:"Periféricos",price:149,stock:7,lowStock:2,description:"Teclado mecánico con iluminación RGB. Completa distribución, tipo de switch y conexión.",emoji:"⌨️",images:[],video:"",featured:false,sku:"TN-TEC-008"},
  {id:"tn-1009",name:"Mouse Gaming RGB",brand:"Por confirmar",model:"Gaming RGB",category:"Periféricos",price:79,stock:12,lowStock:4,description:"Mouse para gaming con iluminación RGB. Completa DPI, botones y tipo de conexión.",emoji:"🖱️",images:[],video:"",featured:false,sku:"TN-MOU-009"},
  {id:"tn-1010",name:"Fuente de poder 650W 80+ Bronze",brand:"Por confirmar",model:"650W Bronze",category:"Componentes",price:289,stock:4,lowStock:2,description:"Fuente de poder de 650 W. Confirma certificación, conectores y dimensiones del modelo real.",emoji:"🔌",images:[],video:"",featured:false,sku:"TN-FUE-010"},
  {id:"tn-1011",name:"Webcam Full HD",brand:"Por confirmar",model:"Webcam FHD",category:"Periféricos",price:119,stock:5,lowStock:2,description:"Cámara web Full HD para videollamadas y clases virtuales. Confirma micrófono, enfoque y compatibilidad.",emoji:"📷",images:[],video:"",featured:false,sku:"TN-WEB-011"},
  {id:"tn-1012",name:"Switch Gigabit de 8 puertos",brand:"Por confirmar",model:"8-Port Gigabit",category:"Redes",price:139,stock:6,lowStock:2,description:"Switch de red Gigabit de 8 puertos. Confirma si es administrable o no administrable.",emoji:"🔀",images:[],video:"",featured:false,sku:"TN-SWI-012"}
];

/* SECCIÓN 2 — ALMACENAMIENTO Y FUNCIONES AUXILIARES */
function safeRead(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("No se pudo leer el almacenamiento local:", error);
    return fallback;
  }
}
let products = safeRead(STORAGE_PRODUCTS, null);
if (!Array.isArray(products) || products.length === 0) {
  products = seedProducts.map(p => ({...p}));
  localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
}
let cart = safeRead(STORAGE_CART, []);
let activeCategory = "Todos";
let searchTerm = "";
let showOnlyInStock = false;
let detailProductId = null;
let toastTimeout = null;
// Imágenes seleccionadas en el formulario de administración.
let uploadedProductImages = [];
let editingProductImages = [];

const $ = id => document.getElementById(id);
const productGrid = $("productGrid");
const cartDrawer = $("cartDrawer");
const scrim = $("scrim");
const cartLines = $("cartLines");
const productModal = $("productModal");
const adminModal = $("adminModal");

function money(value) {
  return new Intl.NumberFormat("es-PE",{style:"currency",currency:"PEN",minimumFractionDigits:2}).format(Number(value)||0).replace("PEN","S/");
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function saveProducts() { localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products)); }
function saveCart() { localStorage.setItem(STORAGE_CART, JSON.stringify(cart)); }
function stockState(product) {
  if (Number(product.stock) <= 0) return {label:"Agotado",className:"out"};
  if (Number(product.stock) <= Number(product.lowStock ?? 3)) return {label:`Últimas ${product.stock} u.`,className:"low"};
  return {label:"Disponible",className:""};
}
function productImage(product) {
  const first = Array.isArray(product.images) ? product.images.find(Boolean) : "";
  return first ? `<img src="${escapeHTML(first)}" alt="${escapeHTML(product.name)}" loading="lazy" onerror="this.outerHTML='<span class=&quot;product-emoji&quot; aria-hidden=&quot;true&quot;>📦</span>'">` : `<span class="product-emoji" aria-hidden="true">${escapeHTML(product.emoji || "📦")}</span>`;
}
function filteredProducts() {
  let list = products.filter(p => {
    const categoryMatch = activeCategory === "Todos" || p.category === activeCategory;
    const text = `${p.name} ${p.brand||""} ${p.model||""} ${p.category||""} ${p.sku||""}`.toLowerCase();
    return categoryMatch && text.includes(searchTerm.toLowerCase()) && (!showOnlyInStock || Number(p.stock)>0);
  });
  const sort = $("sortSelect").value;
  if (sort === "priceAsc") list.sort((a,b)=>a.price-b.price);
  if (sort === "priceDesc") list.sort((a,b)=>b.price-a.price);
  if (sort === "name") list.sort((a,b)=>a.name.localeCompare(b.name,"es"));
  if (sort === "featured") list.sort((a,b)=>Number(Boolean(b.featured))-Number(Boolean(a.featured)));
  return list;
}
/* SECCIÓN 3 — CATÁLOGO Y FILTROS */
function renderProducts() {
  const list = filteredProducts();
  $("resultsCount").textContent = `${list.length} producto${list.length===1?"":"s"}`;
  $("emptyState").classList.toggle("hidden", list.length>0);
  productGrid.innerHTML = list.map(p => {
    const state = stockState(p);
    return `<article class="product-card">
      <div class="product-visual" data-details="${escapeHTML(p.id)}" tabindex="0" role="button" aria-label="Ver detalles de ${escapeHTML(p.name)}">
        ${p.featured ? '<span class="product-tag">Destacado</span>' : ""}
        ${productImage(p)}
        <span class="stock-tag ${state.className}">${state.label}</span>
      </div>
      <div class="product-body">
        <span class="product-brand">${escapeHTML(p.brand||"Marca por confirmar")}</span>
        <h3 class="product-name">${escapeHTML(p.name)}</h3>
        <p class="product-description">${escapeHTML(p.description||"Consulta las características de este producto.")}</p>
        <div class="product-price-row"><span class="product-price">${money(p.price)}</span><span class="product-sku">${escapeHTML(p.sku||"")}</span></div>
        <div class="product-actions"><button class="button button-primary add-button" data-add="${escapeHTML(p.id)}" ${Number(p.stock)<=0?"disabled":""}>${Number(p.stock)<=0?"Agotado":"Agregar al carrito"}</button><button class="details-btn" data-details="${escapeHTML(p.id)}" aria-label="Ver más información">↗</button></div>
      </div>
    </article>`;
  }).join("");
  renderCategoryCounts();
}
function renderCategoryCounts() {
  document.querySelectorAll("[data-category]").forEach(btn=>btn.classList.toggle("active",btn.dataset.category===activeCategory));
}
function findProduct(id) { return products.find(p=>String(p.id)===String(id)); }

/* SECCIÓN 4 — CARRITO Y PEDIDOS */
function cartDetails() {
  return cart.map(item=>{
    const p=findProduct(item.id);
    if(!p || Number(p.stock)<=0) return null;
    const quantity=Math.min(Number(item.quantity)||1,Number(p.stock));
    return {...p,quantity,subtotal:Number(p.price)*quantity};
  }).filter(Boolean);
}
function cartTotal() { return cartDetails().reduce((sum,p)=>sum+p.subtotal,0); }
function cartQuantity() { return cartDetails().reduce((sum,p)=>sum+p.quantity,0); }
function renderCart() {
  const lines=cartDetails();
  $("cartCount").textContent=cartQuantity();
  $("cartSubtotal").textContent=money(cartTotal());
  $("checkoutBtn").disabled=lines.length===0;
  $("checkoutBtn").style.opacity=lines.length===0?".5":"1";
  $("clearCartBtn").disabled=lines.length===0;
  if(!lines.length) {
    cartLines.innerHTML='<div class="cart-empty"><span>🛒</span><h3>Tu carrito está vacío</h3><p>Agrega productos disponibles para comenzar.</p></div>';
  } else {
    cartLines.innerHTML=lines.map(p=>`<div class="cart-line">
      <div class="cart-line-image">${productImage(p)}</div>
      <div><h4>${escapeHTML(p.name)}</h4><small>${money(p.price)} por unidad</small>
        <div class="qty-control"><button data-qty="-1" data-id="${escapeHTML(p.id)}" aria-label="Reducir cantidad" ${p.quantity<=1?"disabled":""}>−</button><b>${p.quantity}</b><button data-qty="1" data-id="${escapeHTML(p.id)}" aria-label="Aumentar cantidad" ${p.quantity>=Number(p.stock)?"disabled":""}>+</button></div>
        <button class="remove-line" data-remove="${escapeHTML(p.id)}">Eliminar</button>
      </div><div class="cart-line-total">${money(p.subtotal)}</div>
    </div>`).join("");
  }
}
function openCart() { cartDrawer.classList.add("open");cartDrawer.setAttribute("aria-hidden","false");scrim.classList.remove("hidden");document.body.classList.add("locked"); }
function closeCart() { cartDrawer.classList.remove("open");cartDrawer.setAttribute("aria-hidden","true");scrim.classList.add("hidden");document.body.classList.remove("locked"); }
function changeCart(id,delta) {
  const p=findProduct(id); if(!p)return;
  const item=cart.find(i=>String(i.id)===String(id));
  if(!item && delta>0) { if(p.stock>0) cart.push({id:p.id,quantity:1}); }
  else if(item) { item.quantity=Math.min(Number(p.stock),Number(item.quantity)+delta); if(item.quantity<=0) cart=cart.filter(i=>String(i.id)!==String(id)); }
  saveCart();renderCart();renderProducts();
}
function addToCart(id) {
  const p=findProduct(id);if(!p)return;
  const current=cart.find(i=>String(i.id)===String(id));
  if(Number(p.stock)<=0){showToast("Este producto está agotado.");return;}
  if(current && Number(current.quantity)>=Number(p.stock)){showToast("No puedes agregar más unidades que el stock disponible.");return;}
  changeCart(id,1);showToast("Producto agregado al carrito.");openCart();
}
function showToast(message) {
  const toast=$("toast");toast.textContent=message;toast.classList.remove("hidden");
  clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>toast.classList.add("hidden"),2800);
}
function normalizeVideoURL(url) {
  const raw=String(url||"").trim();
  if(!raw)return "";
  try {
    const u=new URL(raw);
    if(u.hostname.includes("youtube.com")) {
      const id=u.searchParams.get("v");
      if(id)return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
      if(u.pathname.startsWith("/embed/"))return raw;
    }
    if(u.hostname==="youtu.be")return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(u.pathname.slice(1))}`;
    return raw;
  } catch { return ""; }
}
/* SECCIÓN 5 — FICHA, GALERÍA Y VIDEO DEL PRODUCTO */
function openProductDetail(id) {
  const p=findProduct(id);if(!p)return;detailProductId=p.id;
  const images=(p.images||[]).filter(Boolean);
  const video=normalizeVideoURL(p.video);
  const state=stockState(p);
  const media=[...images.map((src,i)=>({type:"image",src,label:`Imagen ${i+1}`}))];
  if(video)media.push({type:"video",src:video,label:"Video"});
  const initial=media.length?media[0]:{type:"emoji",src:"",label:"Producto"};
  $("productDetail").innerHTML=`<div class="product-detail-grid">
    <div><div class="gallery-main" id="galleryMain">${initial.type==="image"?`<img src="${escapeHTML(initial.src)}" alt="${escapeHTML(p.name)}">`:initial.type==="video"?`<iframe width="100%" height="100%" src="${escapeHTML(initial.src)}" title="Video de ${escapeHTML(p.name)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`:`<span class="product-emoji">${escapeHTML(p.emoji||"📦")}</span>`}</div>
      <div class="gallery-thumbs" id="galleryThumbs">${media.map((m,i)=>`<button class="gallery-thumb ${i===0?"active":""}" data-media-index="${i}" aria-label="${escapeHTML(m.label)}">${m.type==="image"?`<img src="${escapeHTML(m.src)}" alt="">`:"▶"}</button>`).join("")}${media.length===0?`<div class="gallery-thumb active">${escapeHTML(p.emoji||"📦")}</div>`:""}</div>
    </div>
    <div class="detail-copy"><span class="eyebrow eyebrow-dark">${escapeHTML(p.category||"Tecnología")}</span><h2 id="detailTitle">${escapeHTML(p.name)}</h2><p>${escapeHTML(p.brand||"Marca por confirmar")} ${p.model?"· "+escapeHTML(p.model):""}</p><div class="detail-price">${money(p.price)}</div><span class="detail-stock ${state.className}">${state.label}${Number(p.stock)>0?` · ${p.stock} unidad(es) en stock`:""}</span><p>${escapeHTML(p.description||"Consulta las características exactas antes de comprar.")}</p>
      <ul class="spec-list"><li><span>Marca</span><b>${escapeHTML(p.brand||"Por confirmar")}</b></li><li><span>Modelo / SKU</span><b>${escapeHTML(p.model||p.sku||"Por confirmar")}</b></li><li><span>Categoría</span><b>${escapeHTML(p.category||"Otros")}</b></li><li><span>Disponibilidad</span><b>${Number(p.stock)>0?"En stock":"Agotado"}</b></li></ul>
      <button class="button button-primary" data-detail-add="${escapeHTML(p.id)}" ${Number(p.stock)<=0?"disabled":""}>${Number(p.stock)<=0?"Producto agotado":"Agregar al carrito"}</button>
    </div></div>`;
  productModal.classList.remove("hidden");document.body.classList.add("locked");
  const thumbs=$("galleryThumbs");
  thumbs?.addEventListener("click",e=>{
    const btn=e.target.closest("[data-media-index]");if(!btn)return;
    const mediaItem=media[Number(btn.dataset.mediaIndex)];if(!mediaItem)return;
    thumbs.querySelectorAll(".gallery-thumb").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
    $("galleryMain").innerHTML=mediaItem.type==="image"?`<img src="${escapeHTML(mediaItem.src)}" alt="${escapeHTML(p.name)}">`:`<iframe width="100%" height="100%" src="${escapeHTML(mediaItem.src)}" title="Video de ${escapeHTML(p.name)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  },{once:true});
}
function closeModal(modal) { modal.classList.add("hidden");if(productModal.classList.contains("hidden")&&adminModal.classList.contains("hidden"))document.body.classList.remove("locked"); }

function makeWhatsAppURL() {
  const lines=cartDetails();if(!lines.length)return "";
  let message="PEDIDO - TECHNOVA PERÚ\n\n";
  lines.forEach(p=>message+=`• ${p.name} x${p.quantity} — ${money(p.subtotal)}\n`);
  message+=`\nTOTAL ESTIMADO: ${money(cartTotal())}\n\nHola, quisiera coordinar disponibilidad, envío y forma de pago de este pedido.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function checkoutWhatsApp() {
  if(!cartDetails().length){showToast("Agrega productos disponibles primero.");return;}
  const url=makeWhatsAppURL();
  window.open(url,"_blank","noopener,noreferrer");
}

/* ============================================================
   SECCIÓN 6 — ADMINISTRACIÓN DEL CATÁLOGO, STOCK E IMÁGENES
   ============================================================ */
function renderInventory() {
  const query=$("inventorySearch").value.trim().toLowerCase();
  const list=products.filter(p=>`${p.name} ${p.brand||""} ${p.sku||""}`.toLowerCase().includes(query));
  const units=products.reduce((s,p)=>s+Math.max(0,Number(p.stock)||0),0);
  const low=products.filter(p=>Number(p.stock)>0&&Number(p.stock)<=Number(p.lowStock??3)).length;
  const out=products.filter(p=>Number(p.stock)<=0).length;
  $("inventorySummary").innerHTML=`<div class="summary-card"><small>Referencias de productos</small><strong>${products.length}</strong></div><div class="summary-card"><small>Unidades disponibles</small><strong>${units}</strong></div><div class="summary-card warning"><small>Stock bajo / agotado</small><strong>${low+out}</strong></div>`;
  $("inventoryRows").innerHTML=list.length?list.map(p=>{
    const state=stockState(p);
    return `<tr><td><div class="inventory-product"><div class="inventory-product-image">${productImage(p)}</div><div><b>${escapeHTML(p.name)}</b><small>${escapeHTML(p.sku||p.model||"Sin SKU")}</small></div></div></td><td>${money(p.price)}</td><td><b>${Number(p.stock)||0}</b></td><td><span class="status-pill ${state.className}">${state.label}</span></td><td><div class="table-actions"><button data-edit="${escapeHTML(p.id)}">Editar</button><button class="delete-btn" data-delete="${escapeHTML(p.id)}">Eliminar</button></div></td></tr>`;
  }).join(""):`<tr><td colspan="5" class="inventory-empty">No hay productos que coincidan.</td></tr>`;
}
function resetProductForm() {
  $("productForm").reset();
  $("editProductId").value = "";
  $("pLowStock").value = 3;
  $("saveProductBtn").textContent = "Guardar producto";
  $("cancelEditBtn").classList.add("hidden");
  uploadedProductImages = [];
  editingProductImages = [];
  renderImagePreviews();
}
function openAdmin() {renderInventory();adminModal.classList.remove("hidden");document.body.classList.add("locked");}
function startEditProduct(id) {
  const p = findProduct(id);
  if (!p) return;

  $("editProductId").value = p.id;
  $("pName").value = p.name || "";
  $("pBrand").value = p.brand || "";
  $("pModel").value = p.model || "";
  $("pCategory").value = p.category || "Accesorios";
  $("pPrice").value = p.price;
  $("pStock").value = p.stock;
  $("pLowStock").value = p.lowStock ?? 3;
  $("pDescription").value = p.description || "";
  // Las fotos actuales se muestran como miniaturas; no se pegan enlaces largos en el campo.
  $("pImages").value = "";
  $("pVideo").value = p.video || "";
  $("pFeatured").checked = Boolean(p.featured);
  $("pRemoveExistingImages").checked = false;
  editingProductImages = Array.isArray(p.images) ? [...p.images] : [];
  uploadedProductImages = [];
  $("pImageFiles").value = "";
  renderImagePreviews();
  $("saveProductBtn").textContent = "Guardar cambios";
  $("cancelEditBtn").classList.remove("hidden");
  $("productForm").scrollIntoView({ behavior: "smooth", block: "start" });
}
async function saveProductFromForm(event) {
  event.preventDefault();
  const saveButton = $("saveProductBtn");
  saveButton.disabled = true;
  saveButton.textContent = "Guardando fotos...";

  try {
    const id = $("editProductId").value || `tn-${Date.now()}`;
    const previous = findProduct(id);
    const imageLinks = $("pImages").value.split(/\r?\n/).map(link => link.trim()).filter(Boolean);
    const keepOldImages = previous && !$("pRemoveExistingImages").checked;
    const images = [...(keepOldImages ? editingProductImages : []), ...uploadedProductImages, ...imageLinks];
    const video = $("pVideo").value.trim();
    const product = {
      id,
      name: $("pName").value.trim(),
      brand: $("pBrand").value.trim() || "Por confirmar",
      model: $("pModel").value.trim(),
      category: $("pCategory").value,
      price: Number($("pPrice").value),
      stock: Math.max(0, Math.floor(Number($("pStock").value))),
      lowStock: Math.max(0, Math.floor(Number($("pLowStock").value) || 0)),
      description: $("pDescription").value.trim(),
      images,
      video,
      featured: $("pFeatured").checked,
      emoji: previous?.emoji || "📦",
      sku: $("pModel").value.trim() || previous?.sku || `TN-${String(Date.now()).slice(-6)}`
    };

    if (!product.name || !Number.isFinite(product.price) || product.price < 0 || !Number.isFinite(product.stock)) {
      showToast("Revisa el nombre, precio y stock.");
      return;
    }
    const safeVideo = video ? normalizeVideoURL(video) : "";
    if (video && !safeVideo) {
      showToast("El enlace de video no parece válido.");
      return;
    }
    if (previous) products = products.map(item => String(item.id) === String(id) ? product : item);
    else products.unshift(product);

    // Ajusta el carrito si cambió la disponibilidad del producto.
    cart = cart.map(item => {
      const updatedProduct = products.find(itemProduct => String(itemProduct.id) === String(item.id));
      return updatedProduct && Number(updatedProduct.stock) > 0
        ? { ...item, quantity: Math.min(Number(item.quantity), Number(updatedProduct.stock)) }
        : item;
    }).filter(item => {
      const updatedProduct = products.find(itemProduct => String(itemProduct.id) === String(item.id));
      return updatedProduct && Number(updatedProduct.stock) > 0;
    });

    try {
      saveProducts();
      saveCart();
    } catch (storageError) {
      console.error(storageError);
      showToast("No se pudieron guardar las fotos: reduce su tamaño o usa menos imágenes.");
      return;
    }
    renderProducts();
    renderCart();
    renderInventory();
    resetProductForm();
    showToast(previous ? "Producto actualizado." : "Producto registrado.");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = $("editProductId").value ? "Guardar cambios" : "Guardar producto";
  }
}

// Convierte las fotos seleccionadas a JPG optimizado para que ocupen menos espacio.
function compressImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Selecciona solamente archivos de imagen."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer una de las imágenes."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("No se pudo abrir una de las imágenes."));
      image.onload = () => {
        const maxDimension = 1200;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function renderImagePreviews() {
  const container = $("imagePreview");
  if (!container) return;
  const oldImages = $("pRemoveExistingImages")?.checked ? [] : editingProductImages;
  const allImages = [
    ...oldImages.map((src, index) => ({ src, label: `Foto actual ${index + 1}`, old: true })),
    ...uploadedProductImages.map((src, index) => ({ src, label: `Foto nueva ${index + 1}`, old: false }))
  ];
  container.innerHTML = allImages.length
    ? allImages.map(image => `<div class="image-preview-item"><img src="${escapeHTML(image.src)}" alt="${escapeHTML(image.label)}"><span>${image.label}</span></div>`).join("")
    : '<p class="image-preview-empty">Aún no has seleccionado fotos. Elige archivos para ver la vista previa.</p>';
}

async function handleProductImageSelection(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  try {
    const compressedImages = await Promise.all(files.map(compressImageFile));
    uploadedProductImages.push(...compressedImages);
    renderImagePreviews();
    showToast(`${compressedImages.length} foto(s) listas para guardar.`);
  } catch (error) {
    showToast(error.message || "No se pudieron cargar las fotos.");
  }
  // Permite volver a seleccionar el mismo archivo si fuera necesario.
  event.target.value = "";
}

function deleteProduct(id) {
  const p=findProduct(id);if(!p)return;
  if(!confirm(`¿Eliminar "${p.name}" del catálogo?`))return;
  products=products.filter(item=>String(item.id)!==String(id));cart=cart.filter(item=>String(item.id)!==String(id));
  saveProducts();saveCart();renderProducts();renderCart();renderInventory();showToast("Producto eliminado.");
}

/* SECCIÓN 7 — EVENTOS E INICIO DE LA TIENDA */
$("searchForm").addEventListener("submit",e=>{e.preventDefault();searchTerm=$("searchInput").value.trim();renderProducts();$("catalogo").scrollIntoView({behavior:"smooth"});});
$("searchInput").addEventListener("input",()=>{searchTerm=$("searchInput").value.trim();renderProducts();});
$("categoryList").addEventListener("click",e=>{const btn=e.target.closest("[data-category]");if(!btn)return;activeCategory=btn.dataset.category;renderProducts();});
$("sortSelect").addEventListener("change",renderProducts);
$("inStockOnly").addEventListener("change",e=>{showOnlyInStock=e.target.checked;renderProducts();});
$("resetFiltersBtn").addEventListener("click",()=>{activeCategory="Todos";searchTerm="";showOnlyInStock=false;$("searchInput").value="";$("inStockOnly").checked=false;renderProducts();});
productGrid.addEventListener("click",e=>{const add=e.target.closest("[data-add]");if(add){addToCart(add.dataset.add);return;}const detail=e.target.closest("[data-details]");if(detail)openProductDetail(detail.dataset.details);});
productGrid.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-details]")){e.preventDefault();openProductDetail(e.target.dataset.details);}});
$("cartOpenBtn").addEventListener("click",openCart);$("cartCloseBtn").addEventListener("click",closeCart);scrim.addEventListener("click",closeCart);
cartLines.addEventListener("click",e=>{const qty=e.target.closest("[data-qty]");if(qty){changeCart(qty.dataset.id,Number(qty.dataset.qty));return;}const remove=e.target.closest("[data-remove]");if(remove){cart=cart.filter(i=>String(i.id)!==String(remove.dataset.remove));saveCart();renderCart();renderProducts();}});
$("clearCartBtn").addEventListener("click",()=>{if(cart.length&&confirm("¿Vaciar el carrito?")){cart=[];saveCart();renderCart();}});
$("checkoutBtn").addEventListener("click",checkoutWhatsApp);
productModal.addEventListener("click",e=>{if(e.target===productModal||e.target.closest('[data-close="productModal"]'))closeModal(productModal);if(e.target.closest("[data-detail-add]")){const id=e.target.closest("[data-detail-add]").dataset.detailAdd;closeModal(productModal);addToCart(id);}});
$("adminOpenBtn").addEventListener("click",openAdmin);
adminModal.addEventListener("click",e=>{if(e.target===adminModal||e.target.closest('[data-close="adminModal"]'))closeModal(adminModal);const edit=e.target.closest("[data-edit]");if(edit)startEditProduct(edit.dataset.edit);const del=e.target.closest("[data-delete]");if(del)deleteProduct(del.dataset.delete);});
$("productForm").addEventListener("submit", saveProductFromForm);
$("pImageFiles").addEventListener("change", handleProductImageSelection);
$("pRemoveExistingImages").addEventListener("change", renderImagePreviews);
$("cancelEditBtn").addEventListener("click",resetProductForm);
$("inventorySearch").addEventListener("input",renderInventory);
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();if(!productModal.classList.contains("hidden"))closeModal(productModal);if(!adminModal.classList.contains("hidden"))closeModal(adminModal);}});
$("year").textContent=new Date().getFullYear();

renderProducts();renderCart();

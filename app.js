const $ = (sel) => document.querySelector(sel);

const CART_KEY = "MY_ECOM_CART_V2";

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch { return {}; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount() {
  const cart = loadCart();
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const el = $("#cartCount");
  if (el) el.textContent = String(count);
}
function addToCart(productId, qty = 1) {
  const cart = loadCart();
  cart[productId] = (cart[productId] || 0) + qty;
  if (cart[productId] <= 0) delete cart[productId];
  saveCart(cart);
}

function money(n){ return Number(n || 0).toLocaleString("en-US"); }

function getDiscountedPrice(p) {
  const d = Number(p.discount || 0);
  if (!d) return p.price;
  return Math.round(p.price - (p.price * d) / 100);
}

function productCard(p) {
  const a = document.createElement("a");
  a.href = `./product.html?id=${encodeURIComponent(p.id)}`;
  a.className = "card";

  const imgSrc = p.image || "./assets/img/placeholder.png";
  const finalPrice = getDiscountedPrice(p);

  a.innerHTML = `
    <div class="thumb">
      <img src="${imgSrc}" alt="${p.name}" loading="lazy" />
      ${p.discount ? `<span class="badge">-${p.discount}%</span>` : ""}
    </div>
    <div class="muted small">${p.category}</div>
    <h3>${p.name}</h3>
    <div class="price">
      ${p.discount ? `<span class="old">${money(p.price)} ৳</span>` : ""}
      ${money(finalPrice)} ৳
    </div>
    <button class="btn" type="button" data-add="${p.id}">Add to Cart</button>
  `;

  a.querySelector("[data-add]").addEventListener("click", (e) => {
    e.preventDefault();
    addToCart(p.id, 1);
  });

  return a;
}

function renderHome() {
  $("#year").textContent = new Date().getFullYear();
  updateCartCount();

  const featured = (window.DB?.products || []).filter(p => p.featured).slice(0, 8);
  const grid = $("#featuredGrid");
  if (!grid) return;

  grid.innerHTML = "";
  featured.forEach(p => grid.appendChild(productCard(p)));
}

function renderProducts() {
  $("#year").textContent = new Date().getFullYear();
  updateCartCount();

  const categorySelect = $("#categorySelect");
  if (!categorySelect) return;

  (window.DB?.categories || []).forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  });

  const state = { q: "", cat: "all", sort: "featured" };

  function computeList() {
    let items = [...(window.DB?.products || [])];

    if (state.cat !== "all") items = items.filter(p => p.category === state.cat);

    if (state.q.trim()) {
      const q = state.q.trim().toLowerCase();
      items = items.filter(p => (p.name + " " + p.category).toLowerCase().includes(q));
    }

    switch (state.sort) {
      case "priceAsc": items.sort((a,b)=>getDiscountedPrice(a)-getDiscountedPrice(b)); break;
      case "priceDesc": items.sort((a,b)=>getDiscountedPrice(b)-getDiscountedPrice(a)); break;
      case "nameAsc": items.sort((a,b)=>a.name.localeCompare(b.name)); break;
      default:
        items.sort((a,b)=>(b.featured===true)-(a.featured===true));
    }

    return items;
  }

  function render() {
    const grid = $("#productsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    computeList().forEach(p => grid.appendChild(productCard(p)));
  }

  $("#searchInput")?.addEventListener("input", (e)=>{ state.q = e.target.value; render(); });
  categorySelect.addEventListener("change", (e)=>{ state.cat = e.target.value; render(); });
  $("#sortSelect")?.addEventListener("change", (e)=>{ state.sort = e.target.value; render(); });

  render();
}

function renderProduct() {
  $("#year").textContent = new Date().getFullYear();
  updateCartCount();

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const p = (window.DB?.products || []).find(x => x.id === id);
  const host = $("#productView");
  if (!host) return;

  if (!p) {
    host.innerHTML = `<p>Product not found. <a class="link" href="./products.html">Go back</a></p>`;
    return;
  }

  const imgSrc = p.image || "./assets/img/placeholder.png";
  const finalPrice = getDiscountedPrice(p);

  host.innerHTML = `
    <div class="panel">
      <div class="thumb large">
        <img src="${imgSrc}" alt="${p.name}" loading="lazy" />
        ${p.discount ? `<span class="badge">-${p.discount}%</span>` : ""}
      </div>
      <p class="muted small" style="margin:10px 0 0;">${p.category}</p>
    </div>

    <div class="panel">
      <h1 style="margin-top:0;">${p.name}</h1>
      <div class="price" style="font-size:22px; margin:8px 0;">
        ${p.discount ? `<span class="old">${money(p.price)} ৳</span>` : ""}
        ${money(finalPrice)} ৳
      </div>
      <p class="muted">${p.description || ""}</p>
      <button id="addBtn" class="btn" type="button">Add to Cart</button>
    </div>
  `;

  $("#addBtn").addEventListener("click", ()=> addToCart(p.id, 1));
}

function renderCart() {
  $("#year").textContent = new Date().getFullYear();
  updateCartCount();

  const cart = loadCart();
  const items = Object.entries(cart).map(([id, qty]) => {
    const p = (window.DB?.products || []).find(x => x.id === id);
    return p ? { ...p, qty } : null;
  }).filter(Boolean);

  const host = $("#cartItems");
  if (!host) return;

  host.innerHTML = "";

  if (!items.length) {
    host.innerHTML = `<p class="muted">Cart খালি। <a class="link" href="./products.html">Shopping শুরু করো</a></p>`;
    $("#cartSubtotal").textContent = "0";
    return;
  }

  let subtotal = 0;

  items.forEach(item => {
    const unit = getDiscountedPrice(item);
    subtotal += unit * item.qty;

    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div>
        <div style="font-weight:700;">${item.name}</div>
        <div class="muted small">${item.category} • ${money(unit)} ৳</div>
      </div>
      <div class="qty">
        <button class="iconbtn" data-minus="${item.id}">−</button>
        <div style="min-width:22px; text-align:center;">${item.qty}</div>
        <button class="iconbtn" data-plus="${item.id}">+</button>
      </div>
    `;

    row.querySelector("[data-minus]").addEventListener("click", ()=>{ addToCart(item.id, -1); renderCart(); });
    row.querySelector("[data-plus]").addEventListener("click", ()=>{ addToCart(item.id, 1); renderCart(); });

    host.appendChild(row);
  });

  $("#cartSubtotal").textContent = money(subtotal);

  $("#checkoutBtn")?.addEventListener("click", ()=>{
    alert("Demo checkout ✅ (পরের ধাপে আমরা order system করবো)");
  });
}

(function init(){
  updateCartCount();
  const page = document.body?.dataset?.page;

  if (page === "home") return renderHome();
  if (page === "products") return renderProducts();
  if (page === "product") return renderProduct();
  if (page === "cart") return renderCart();
})();

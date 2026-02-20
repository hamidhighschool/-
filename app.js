const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const CART_KEY = "MN_CART_V1";

function loadCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch { return {}; } }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }

function updateCartCount(){
  const cart = loadCart();
  const count = Object.values(cart).reduce((a,b)=>a+b,0);
  const el = $("#cartCount");
  if (el) el.textContent = String(count);
}

function addToCart(id, qty=1){
  const cart = loadCart();
  cart[id] = (cart[id] || 0) + qty;
  if (cart[id] <= 0) delete cart[id];
  saveCart(cart);
}

function moneyUSD(n){
  const v = Number(n || 0);
  return v.toLocaleString("en-US", { style:"currency", currency:"USD" });
}

function finalPrice(p){
  const d = Number(p.discount || 0);
  if (!d) return p.price;
  return Math.round((p.price - (p.price*d)/100) * 100) / 100;
}

function stars(r){
  const full = Math.floor(r);
  const half = (r - full) >= 0.5;
  let s = "★".repeat(full);
  if (half) s += "½";
  return s.padEnd(5, "☆");
}

function productCard(p){
  const a = document.createElement("a");
  a.href = `./product.html?id=${encodeURIComponent(p.id)}`;
  a.className = "card";
  const fp = finalPrice(p);

  a.innerHTML = `
    <div class="card__img">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
    </div>
    <div class="card__body">
      <div class="muted small">${p.category}</div>
      <div class="card__name">${p.name}</div>
      <div class="card__meta">
        <div>
          <span class="price2">${moneyUSD(fp)}</span>
          ${p.discount ? `<span class="old">${moneyUSD(p.price)}</span>` : ``}
        </div>
        ${p.discount ? `<span class="badge">-${p.discount}%</span>` : ``}
      </div>
      <div class="stars">${stars(p.rating || 4.2)}</div>
      <button class="btn" type="button" data-add="${p.id}">Add to cart</button>
    </div>
  `;

  a.querySelector("[data-add]").addEventListener("click", (e)=>{
    e.preventDefault();
    addToCart(p.id, 1);
  });

  return a;
}

function renderSidebarCats(){
  const ul = $("#catList");
  if (!ul) return;
  ul.innerHTML = "";
  window.DB.categories.forEach(c=>{
    const li = document.createElement("li");
    li.innerHTML = `<span><span class="dot"></span>${c}</span><span class="muted">›</span>`;
    li.addEventListener("click", ()=> location.href = `./products.html?cat=${encodeURIComponent(c)}`);
    ul.appendChild(li);
  });
}

function renderTabs(){
  const tabs = $("#tabs");
  if (!tabs) return;
  const cats = ["All", ...window.DB.categories.slice(0, 3)];
  tabs.innerHTML = "";
  cats.forEach((c, idx)=>{
    const b = document.createElement("button");
    b.className = "tab" + (idx===0 ? " is-active":"");
    b.type = "button";
    b.textContent = c;
    b.addEventListener("click", ()=>{
      $$(".tab").forEach(x=>x.classList.remove("is-active"));
      b.classList.add("is-active");
      renderHomeGrid(c === "All" ? "all" : c);
    });
    tabs.appendChild(b);
  });
}

function renderHomeGrid(cat){
  const grid = $("#homeGrid");
  if (!grid) return;
  let items = [...window.DB.products];
  if (cat && cat !== "all") items = items.filter(p=>p.category===cat);
  items = items.slice(0, 8);
  grid.innerHTML = "";
  items.forEach(p=>grid.appendChild(productCard(p)));
}

function setupDealButtons(){
  $$("[data-add]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      addToCart(btn.getAttribute("data-add"), 1);
    });
  });
}

function runCountdown(){
  const target = Date.now() + (36*60*60*1000);
  const tick = ()=>{
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / (24*60*60*1000));
    const h = Math.floor((diff / (60*60*1000)) % 24);
    const m = Math.floor((diff / (60*1000)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    if ($("#tDays")) $("#tDays").textContent = String(d).padStart(2,"0");
    if ($("#tHrs")) $("#tHrs").textContent = String(h).padStart(2,"0");
    if ($("#tMin")) $("#tMin").textContent = String(m).padStart(2,"0");
    if ($("#tSec")) $("#tSec").textContent = String(s).padStart(2,"0");
  };
  tick();
  setInterval(tick, 1000);
}

function renderProducts(){
  const year = $("#year"); if (year) year.textContent = new Date().getFullYear();
  updateCartCount();

  const params = new URLSearchParams(location.search);
  const initialCat = params.get("cat");

  const categorySelect = $("#categorySelect");
  if (categorySelect){
    window.DB.categories.forEach(c=>{
      const o = document.createElement("option");
      o.value = c; o.textContent = c;
      categorySelect.appendChild(o);
    });
    if (initialCat) categorySelect.value = initialCat;
  }

  const state = { q:"", cat: initialCat || "all", sort:"featured" };

  const searchInput = $("#searchInput");
  if (searchInput) searchInput.value = params.get("q") || "";

  function compute(){
    let items = [...window.DB.products];

    const q = (state.q || "").trim().toLowerCase();
    if (q) items = items.filter(p => (p.name + " " + p.category).toLowerCase().includes(q));
    if (state.cat !== "all") items = items.filter(p=>p.category===state.cat);

    switch(state.sort){
      case "priceAsc": items.sort((a,b)=>finalPrice(a)-finalPrice(b)); break;
      case "priceDesc": items.sort((a,b)=>finalPrice(b)-finalPrice(a)); break;
      case "nameAsc": items.sort((a,b)=>a.name.localeCompare(b.name)); break;
      default: items.sort((a,b)=>(b.featured===true)-(a.featured===true));
    }
    return items;
  }

  function paint(){
    const grid = $("#productsGrid");
    if (!grid) return;
    const items = compute();
    grid.innerHTML = "";
    items.forEach(p=>grid.appendChild(productCard(p)));
    const rc = $("#resultCount");
    if (rc) rc.textContent = `${items.length} items`;
  }

  $("#searchInput")?.addEventListener("input", (e)=>{ state.q = e.target.value; paint(); });
  categorySelect?.addEventListener("change", (e)=>{ state.cat = e.target.value; paint(); });
  $("#sortSelect")?.addEventListener("change", (e)=>{ state.sort = e.target.value; paint(); });

  if (searchInput) state.q = searchInput.value;
  paint();
}

function renderProduct(){
  const year = $("#year"); if (year) year.textContent = new Date().getFullYear();
  updateCartCount();

  const id = new URLSearchParams(location.search).get("id");
  const p = window.DB.products.find(x=>x.id===id);
  const host = $("#productView");
  if (!host) return;

  if (!p){
    host.innerHTML = `<div class="panel" style="padding:14px">Product not found. <a href="./products.html">Back</a></div>`;
    return;
  }

  const fp = finalPrice(p);
  const crumb = $("#crumbName"); if (crumb) crumb.textContent = p.name;

  host.innerHTML = `
    <div class="product__media">
      <img src="${p.image}" alt="${p.name}">
    </div>
    <div class="product__info">
      <h1 class="product__title">${p.name}</h1>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <div class="price2" style="font-size:22px">${moneyUSD(fp)}</div>
        ${p.discount ? `<div class="muted"><span class="old">${moneyUSD(p.price)}</span></div><span class="badge">-${p.discount}%</span>` : ``}
      </div>
      <p class="muted">Category: <strong>${p.category}</strong></p>
      <p class="muted">Rating: ${stars(p.rating || 4.2)}</p>
      <div style="height:10px"></div>
      <button class="btn btn--primary btn--block" id="addBtn" type="button">Add to cart</button>
      <div style="height:8px"></div>
      <a class="btn btn--block" href="./products.html">Back to shop</a>
    </div>
  `;

  $("#addBtn").addEventListener("click", ()=> addToCart(p.id, 1));
}

function renderCart(){
  const year = $("#year"); if (year) year.textContent = new Date().getFullYear();
  updateCartCount();

  const cart = loadCart();
  const items = Object.entries(cart).map(([id, qty])=>{
    const p = window.DB.products.find(x=>x.id===id);
    return p ? { ...p, qty } : null;
  }).filter(Boolean);

  const host = $("#cartItems");
  if (!host) return;

  if (!items.length){
    host.innerHTML = `<div class="muted" style="padding:14px">Your cart is empty. <a href="./products.html">Shop now</a></div>`;
    $("#cartSubtotal").textContent = moneyUSD(0);
    $("#cartTotal").textContent = moneyUSD(0);
    return;
  }

  let subtotal = 0;
  host.innerHTML = "";
  items.forEach(item=>{
    const unit = finalPrice(item);
    subtotal += unit * item.qty;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item__thumb"><img src="${item.image}" alt="${item.name}"></div>
      <div>
        <div class="cart-item__name">${item.name}</div>
        <div class="muted small">${item.category} • ${moneyUSD(unit)}</div>
      </div>
      <div class="qty">
        <button class="iconbtn" type="button" data-minus="${item.id}">−</button>
        <div style="min-width:22px;text-align:center;font-weight:900">${item.qty}</div>
        <button class="iconbtn" type="button" data-plus="${item.id}">+</button>
      </div>
    `;
    row.querySelector("[data-minus]").addEventListener("click", ()=>{ addToCart(item.id, -1); renderCart(); });
    row.querySelector("[data-plus]").addEventListener("click", ()=>{ addToCart(item.id, 1); renderCart(); });
    host.appendChild(row);
  });

  $("#cartSubtotal").textContent = moneyUSD(subtotal);
  $("#cartTotal").textContent = moneyUSD(subtotal);

  $("#checkoutBtn")?.addEventListener("click", ()=> alert("Demo checkout ✅"));
}

function initCommon(){
  updateCartCount();
  const form = document.querySelector("form.search");
  if (form){
    form.addEventListener("submit", (e)=>{
      e.preventDefault();
      const q = ($("#searchQ")?.value || $("#searchInput")?.value || "").trim();
      const url = new URL("./products.html", location.href);
      if (q) url.searchParams.set("q", q);
      location.href = url.toString();
    });
  }
}

(function init(){
  initCommon();
  const page = document.body?.dataset?.page;

  if (page === "home"){
    renderSidebarCats();
    renderTabs();
    renderHomeGrid("all");
    setupDealButtons();
    runCountdown();
    return;
  }
  if (page === "products") return renderProducts();
  if (page === "product") return renderProduct();
  if (page === "cart") return renderCart();
})();

const PRODUCTS = [
  {
    id: 1,
    title: "Lemon Tee",
    price: 22.0,
    category: "Clothing",
    img: "../Assets/lemon tea.jpg",
  },
  {
    id: 2,
    title: "Sunny Mug",
    price: 12.5,
    category: "Home",
    img: "../Assets/sunny mug.jpg",
  },
  {
    id: 3,
    title: "Citrus Scarf",
    price: 18.0,
    category: "Accessories",
    img: "../Assets/citrus scarf.jpg",
  },
  {
    id: 4,
    title: "Yellow Cushion",
    price: 34.99,
    category: "Home",
    img: "../Assets/download.jpg",
  },
  {
    id: 5,
    title: "Sun Hat",
    price: 28.0,
    category: "Accessories",
    img: "../Assets/sunhat.jpg",
  },
  {
    id: 6,
    title: "Summer Dress",
    price: 45.0,
    category: "Clothing",
    img: "../Assets/summer dress.jpg",
  },
];

// Basic app state
let state = {
  products: PRODUCTS.slice(),
  cart: {},
  filters: { cat: null, min: null, max: null },
  sort: "featured",
};

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cart-drawer");
const cartList = document.getElementById("cartList");
const subTotal = document.getElementById("subTotal");

function formatPrice(n) {
  return "$" + n.toFixed(2);
}

// Render functions
function renderProducts(list) {
  productGrid.innerHTML = "";
  if (!list.length) {
    productGrid.innerHTML = '<div class="muted">No products found.</div>';
    return;
  }
  list.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
          <div class="prod-media" aria-hidden><img src="${p.img}" alt="${
            p.title
          }"></div>
          <div style="display:flex;flex-direction:column;gap:.25rem">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div style="font-weight:700">${p.title}</div>
              <div class="price">${formatPrice(p.price)}</div>
            </div>
            <div class="meta text-muted text-sm">${p.category} • Free returns</div>
          </div>
          <div class="flex font-inter gap-[.5rem] justify-between" style="margin-top:.5rem;">
            <button class="btn add bg-accent shadow-card rounded-lg text-text text-sm font-semibold focus:shadow-focus" data-id="${p.id}">Add</button>
            <button class="btn ghost bg-transparent shadow-card rounded-lg text-text appearance-none font-semibold border border-[#1118270f] text-sm focus:shadow-focus quick" data-id="${
              p.id
            }">Quick view</button>
          </div>
        `;
    productGrid.appendChild(card);
  });
}

function applyFiltersAndSort() {
  let list = PRODUCTS.slice();
  const { cat, min, max } = state.filters;
  if (cat) {
    list = list.filter((p) => p.category === cat);
  }
  if (min) list = list.filter((p) => p.price >= Number(min));
  if (max) list = list.filter((p) => p.price <= Number(max));
  if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
  renderProducts(list);
}

// Cart functions
function saveCart() {
  localStorage.setItem("suncart", JSON.stringify(state.cart));
}
function loadCart() {
  const c = localStorage.getItem("suncart");
  if (c) state.cart = JSON.parse(c);
}
function updateCartUI() {
  const qty = Object.values(state.cart).reduce((s, n) => s + n.qty, 0);
  cartCount.textContent = qty;
  cartList.innerHTML = "";
  let total = 0;
  for (const id in state.cart) {
    const item = state.cart[id];
    total += item.price * item.qty;
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
          <img src="${item.img}" alt="${item.title}">
          <div style="flex:1">
            <div class="font-bold">${item.title}</div>
            <div class="text-muted text-sm">${formatPrice(
              item.price,
            )} • Qty: <strong>${item.qty}</strong></div>
          </div>
          <div class="flex flex-col gap-[.25rem]">
            <button class="btn small bg-accent appearance-none rounded-lg font-semibold cursor-pointer outline-none focus:shadow-focus text-text text-sm" data-action="plus" data-id="${id}">+</button>
            <button class="btn ghost small bg-transparent rounded-lg text-text border border-[#1118270f] font-semibold cursor-pointer outline-none focus:shadow-focus text-sm" data-action="minus" data-id="${id}">-</button>
          </div>
        `;
    cartList.appendChild(el);
  }
  subTotal.textContent = formatPrice(total);
  saveCart();
}

function addToCart(id, qty = 1) {
  const p = PRODUCTS.find((x) => x.id == id);
  if (!p) return;
  if (state.cart[id]) state.cart[id].qty += qty;
  else
    state.cart[id] = {
      id: p.id,
      title: p.title,
      price: p.price,
      img: p.img,
      qty: qty,
    };
  updateCartUI();
}

function removeFromCart(id) {
  delete state.cart[id];
  updateCartUI();
}

// Event delegation for product actions
document.addEventListener("click", (e) => {
  const add = e.target.closest(".add");
  if (add) {
    addToCart(add.dataset.id);
    return;
  }
  const quick = e.target.closest(".quick");
  if (quick) {
    const p = PRODUCTS.find((x) => x.id == quick.dataset.id);
    alert(p.title + " — " + formatPrice(p.price));
    return;
  }

  const cartToggle = e.target.closest("#cartToggle");
  if (cartToggle) {
    cartDrawer.classList.toggle("open");
    cartToggle.setAttribute(
      "aria-expanded",
      cartDrawer.classList.contains("open")
    );
    return;
  }

  const clearBtn = e.target.closest("#clearCart");
  if (clearBtn) {
    state.cart = {};
    updateCartUI();
    return;
  }

  const checkout = e.target.closest("#checkout");
  if (checkout) {
    alert("Proceeding to checkout — demo only");
    return;
  }

  const plus = e.target.closest('button[data-action="plus"]');
  if (plus) {
    const id = plus.dataset.id;
    state.cart[id].qty += 1;
    updateCartUI();
    return;
  }
  const minus = e.target.closest('button[data-action="minus"]');
  if (minus) {
    const id = minus.dataset.id;
    state.cart[id].qty -= 1;
    if (state.cart[id].qty <= 0) removeFromCart(id);
    else updateCartUI();
    return;
  }

  const offerBtn = e.target.closest("#offerBtn");
  if (offerBtn) {
    alert("Offer applied: SUN10");
    return;
  }
});

// Filters and search
document.getElementById("applyFilters").addEventListener("click", () => {
  state.filters.min = document.getElementById("minPrice").value || null;
  state.filters.max = document.getElementById("maxPrice").value || null;
  applyFiltersAndSort();
});

document.getElementById("sort").addEventListener("change", (e) => {
  state.sort = e.target.value;
  applyFiltersAndSort();
});

// Category pills
document.querySelectorAll("[data-cat]").forEach((btn) =>
  btn.addEventListener("click", (ev) => {
    const cat = ev.currentTarget.textContent.trim();
    state.filters.cat = cat === "All" ? null : cat;
    applyFiltersAndSort();
  })
);

// Search input (basic)
document.getElementById("q").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = PRODUCTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );
  renderProducts(filtered);
});

// Persist cart
loadCart();
updateCartUI();
applyFiltersAndSort();

// small niceties
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("shopNow").addEventListener("click", () => {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});

// Accessibility: close cart on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cartDrawer.classList.remove("open");
    document
      .getElementById("cartToggle")
      .setAttribute("aria-expanded", "false");
  }
});

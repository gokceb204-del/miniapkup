const tg = window.Telegram?.WebApp;
const productsRoot = document.getElementById("products");
const balancePill = document.getElementById("balancePill");
const toast = document.getElementById("toast");
const quantities = new Map();

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function formatMoney(value) {
  return `${Number(value || 0).toFixed(2)}₺`;
}

function getTelegramUserId() {
  return tg?.initDataUnsafe?.user?.id || null;
}

async function fetchJson(url, fallback) {
  try {
    const response = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`${url} alınamadı:`, error);
    return fallback;
  }
}

function applyTelegramUi() {
  if (!tg) {
    return;
  }

  tg.ready();
  tg.expand();

  const root = document.documentElement;
  const theme = tg.themeParams || {};

  if (theme.bg_color) {
    root.style.setProperty("--page-bg", theme.bg_color);
  }
  if (theme.text_color) {
    root.style.setProperty("--text", theme.text_color);
  }
  if (theme.hint_color) {
    root.style.setProperty("--muted", theme.hint_color);
  }
}

function buildCard(product) {
  const qty = quantities.get(product.code) ?? 1;
  quantities.set(product.code, qty);

  const discountHtml = product.discount_pct
    ? `<span class="discount-badge">-%${product.discount_pct}</span>`
    : "";

  return `
    <article class="product-card">
      <div class="brand-badge brand-${product.theme}">${product.brand}</div>
      <div class="product-main">
        <h2 class="product-title">${product.title}</h2>
        <p class="product-subtitle">${product.subtitle || ""}</p>
        <div class="price-row">
          ${product.old_price ? `<span class="old-price">${product.old_price}₺</span>` : ""}
          <span class="new-price">${product.price}₺</span>
          ${discountHtml}
        </div>
        <div class="card-footer">
          <div class="qty-control">
            <button class="qty-btn is-muted" data-action="decrease" data-code="${product.code}">-</button>
            <div class="qty-value" data-qty="${product.code}">${qty}</div>
            <button class="qty-btn" data-action="increase" data-code="${product.code}">+</button>
          </div>
          <button
            class="stock-btn ${product.stock ? "" : "is-disabled"}"
            data-action="buy"
            data-code="${product.code}"
            ${product.stock ? "" : "disabled"}
          >
            ${product.button_text || (product.stock ? "STOK VAR" : "STOK YOK")}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(products) {
  productsRoot.innerHTML = products.map(buildCard).join("");
}

function updateQty(productCode, delta) {
  const current = quantities.get(productCode) ?? 1;
  const nextValue = Math.max(1, current + delta);
  quantities.set(productCode, nextValue);

  const qtyNode = document.querySelector(`[data-qty="${productCode}"]`);
  if (qtyNode) {
    qtyNode.textContent = String(nextValue);
  }
}

function sendProductToBot(productCode) {
  const qty = quantities.get(productCode) ?? 1;
  const payload = {
    type: "buy",
    code: productCode,
    qty,
  };

  if (!tg) {
    showToast(`Test modu: ${JSON.stringify(payload)}`);
    return;
  }

  tg.sendData(JSON.stringify(payload));
  showToast("İstek bota gönderildi.");

  setTimeout(() => {
    tg.close();
  }, 450);
}

async function loadBalance() {
  const userId = getTelegramUserId();
  if (!userId) {
    balancePill.innerHTML = `<span>Bakiye</span><strong>0.00₺</strong>`;
    return;
  }

  const data = await fetchJson(`/api/balance?user_id=${userId}`, { balance: 0 });
  balancePill.innerHTML = `<span>Bakiye</span><strong>${formatMoney(data.balance)}</strong>`;
}

async function loadProducts() {
  const userId = getTelegramUserId();
  const suffix = userId ? `?user_id=${userId}` : "";
  const products = await fetchJson(`/api/products${suffix}`, []);
  renderProducts(products);
}

productsRoot.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const productCode = button.dataset.code;

  if (action === "increase") {
    updateQty(productCode, 1);
    return;
  }

  if (action === "decrease") {
    updateQty(productCode, -1);
    return;
  }

  if (action === "buy") {
    sendProductToBot(productCode);
  }
});

(async function bootstrap() {
  applyTelegramUi();
  await Promise.all([loadBalance(), loadProducts()]);
})();

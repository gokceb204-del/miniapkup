const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const productsBox = document.getElementById("products");

const products = [
  { code: "yemek", title: "Paket 1", price: "30₺", desc: "Açıklama" },
  { code: "yemek2", title: "Paket 2", price: "25₺", desc: "Açıklama" },
  { code: "market", title: "Paket 3", price: "17₺", desc: "Açıklama" }
];

function sendProductCommand(product) {
  try {
    const payload = `/${product.code}`;
    console.log("Gönderilen payload:", payload);

    tg.sendData(payload);

    tg.showPopup({
      title: "İşlem başlatıldı",
      message: `${product.title} için istek bota gönderildi.`,
      buttons: [{ type: "ok" }]
    });
  } catch (err) {
    console.error("Mini App veri gönderme hatası:", err);

    tg.showPopup({
      title: "Hata",
      message: "İstek gönderilemedi.",
      buttons: [{ type: "ok" }]
    });
  }
}

function renderProducts() {
  if (!productsBox) {
    console.error("products elementi bulunamadı");
    return;
  }

  productsBox.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-title">${product.title}</div>
      <div class="card-desc">${product.desc}</div>
      <div class="card-price">${product.price}</div>
      <button class="buy-btn">Satın Al</button>
    `;

    const btn = card.querySelector(".buy-btn");
    btn.addEventListener("click", () => sendProductCommand(product));

    productsBox.appendChild(card);
  });
}

renderProducts();

const tg = window.Telegram.WebApp;
tg.expand();

const productsBox = document.getElementById("products");

const products = [
  { code: "yemek", title: "Paket 1", price: "30₺", desc: "Açıklama" },
  { code: "yemek2", title: "Paket 2", price: "25₺", desc: "Açıklama" },
  { code: "market", title: "Paket 3", price: "17₺", desc: "Açıklama" }
];

function renderProducts() {
  productsBox.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-title">${product.title}</div>
      <div class="card-desc">${product.desc}</div>
      <div class="card-price">${product.price}</div>
      <button class="buy-btn">Detay</button>
    `;

    const btn = card.querySelector(".buy-btn");
    btn.addEventListener("click", () => {
      tg.showAlert(`${product.title}\n${product.desc}\nFiyat: ${product.price}`);
    });

    productsBox.appendChild(card);
  });
}

renderProducts();

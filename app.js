const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe?.user;
const productsBox = document.getElementById("products");

const products = [
  {
    code: "yemek",
    title: "Yemek 350/250",
    price: "30₺",
    discount: "350/250 indirim"
  },
  {
    code: "yemek2",
    title: "Yemek 300/180",
    price: "25₺",
    discount: "300/180 indirim"
  },
  {
    code: "market",
    title: "Market 300/200",
    price: "17₺",
    discount: "300/200 indirim"
  }
];

function loadProducts() {

  productsBox.innerHTML = "";

  products.forEach(product => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-title">${product.title}</div>
      <div class="card-desc">${product.discount}</div>
      <div class="card-price">${product.price}</div>
      <button class="buy-btn">Satın Al</button>
    `;

    const btn = card.querySelector(".buy-btn");

    btn.addEventListener("click", () => {

      const commandMap = {
        "yemek": "/yemek",
        "yemek2": "/yemek2",
        "market": "/market"
      };

      const cmd = commandMap[product.code];

      if (cmd) {

        tg.sendData(cmd);

        tg.showAlert(product.title + " işlemi başlatıldı.\nBot mesajlarını kontrol et.");

      }

    });

    productsBox.appendChild(card);

  });

}

loadProducts();

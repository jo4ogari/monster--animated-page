"use strict";

const params = new URLSearchParams(window.location.search);
const requestedId = params.get("flavor");
const product = window.MONSTER_FLAVORS.find((flavor) => flavor.id === requestedId) || window.MONSTER_FLAVORS[0];
let quantity = 1;

const nameElement = document.querySelector("#product-name");
const detailElement = document.querySelector("#product-detail");
const unitPriceElement = document.querySelector("#unit-price");
const totalElement = document.querySelector("#total-price");
const quantityElement = document.querySelector("#quantity");
const decreaseButton = document.querySelector("#decrease");
const increaseButton = document.querySelector("#increase");
const continueButton = document.querySelector("#continue-button");
const statusElement = document.querySelector("#checkout-status");
const productIndexElement = document.querySelector(".product-index");

document.documentElement.style.setProperty("--accent", product.palette.accent);
document.documentElement.style.setProperty("--accent-soft", product.palette.accentSoft);
nameElement.textContent = product.name;
detailElement.textContent = product.detail;
unitPriceElement.textContent = window.formatMonsterPrice(product.price);
productIndexElement.textContent = String(window.MONSTER_FLAVORS.indexOf(product) + 1).padStart(2, "0");

function updateQuantity() {
  quantityElement.value = String(quantity);
  quantityElement.textContent = String(quantity);
  totalElement.textContent = window.formatMonsterPrice(product.price * quantity);
  decreaseButton.disabled = quantity === 1;
}

decreaseButton.addEventListener("click", () => {
  quantity = Math.max(1, quantity - 1);
  updateQuantity();
});

increaseButton.addEventListener("click", () => {
  quantity = Math.min(24, quantity + 1);
  updateQuantity();
});

continueButton.addEventListener("click", () => {
  statusElement.textContent = "Checkout demonstrativo: conecte seu provedor de pagamento para concluir pedidos reais.";
  continueButton.textContent = "Pedido revisado ✓";
});

updateQuantity();

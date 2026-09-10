/* =========================================================================
   CART.JS
   Drives cart.html: renders the products currently in the cart (from
   the shared Cart helper in app.js), lets the user remove items, and
   builds a "Request via WhatsApp" link listing everything in the cart.
   Runs only on cart.html.
   ========================================================================= */

const CartPage = {

  init() {
    this.emptyEl = $("#cart-empty");
    this.layoutEl = $("#cart-layout");
    this.listEl = $("#cart-list");
    this.countEl = $("#cart-item-count");
    this.checkoutBtn = $("#cart-checkout-btn");
    if (!this.listEl) return; // only run on cart.html

    this.render();
  },

  getItems() {
    // Cart stores product ids; look each one up in PRODUCTS so removed/
    // discontinued products never break the page.
    return Cart.get()
      .map(id => PRODUCTS.find(p => p.id === id))
      .filter(Boolean);
  },

  render() {
    const items = this.getItems();

    if (this.countEl) {
      this.countEl.textContent = items.length
        ? `${items.length} item${items.length === 1 ? "" : "s"} in your cart`
        : "Your cart is currently empty.";
    }

    if (!items.length) {
      this.emptyEl.style.display = "block";
      this.layoutEl.style.display = "none";
      return;
    }

    this.emptyEl.style.display = "none";
    this.layoutEl.style.display = "grid";
    this.listEl.innerHTML = items.map(p => this.buildRow(p)).join("");
    this.updateCheckoutLink(items);
  },

  buildRow(product) {
    const cat = getCategoryById(product.category);
    const brandName = getBrandById(product.brand);
    return `
      <div class="cart-item" data-id="${product.id}">
        <a href="products.html?view=${encodeURIComponent(product.id)}" class="cart-item__media">
          <img src="${product.image}" alt="${product.name}" loading="lazy" width="200" height="240">
        </a>
        <div class="cart-item__body">
          <p class="cart-item__eyebrow">${brandName} &nbsp;·&nbsp; ${cat ? cat.name : ""}</p>
          <h3 class="cart-item__title">
            <a href="products.html?view=${encodeURIComponent(product.id)}">${product.name}</a>
          </h3>
          <button class="cart-item__remove" data-cart-id="${product.id}">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m2 0-1 13a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7"/></svg>
            Remove
          </button>
        </div>
      </div>
    `;
  },

  updateCheckoutLink(items) {
    if (!this.checkoutBtn) return;
    const lines = items.map(p => `- ${p.name} (${getBrandById(p.brand)})`).join("\n");
    const message = `Hello, I would like to request information / place an order for the following products:\n\n${lines}`;
    this.checkoutBtn.href = `${SITE_CONFIG.contact.whatsappLink}?text=${encodeURIComponent(message)}`;
  }
};

/* Removing an item: app.js's global [data-cart-id] click handler already
   toggles the product out of the Cart and updates every matching button
   on the page (including this one). We only need to re-render the list
   afterwards so the row disappears and the WhatsApp link stays in sync. */
document.addEventListener("click", e => {
  if (e.target.closest(".cart-item__remove")) {
    CartPage.render();
  }
});

document.addEventListener("DOMContentLoaded", () => CartPage.init());

/* =========================================================================
   APP.JS
   Shared site behaviour: navigation, footer, product card rendering,
   product detail modal, cart, homepage sections, contact form.
   Runs on every page.
   ========================================================================= */

/* -------------------------------------------------------------------------
   Small helpers
   ------------------------------------------------------------------------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function getCategoryById(id) {
  return SITE_CONFIG.categories.find(c => c.id === id) || null;
}
function getBrandById(id) {
  const found = SITE_CONFIG.brands.find(b => b.id === id);
  return found ? found.name : id;
}

/* -------------------------------------------------------------------------
   Cart (persisted in localStorage)
   ------------------------------------------------------------------------- */
const Cart = {
  KEY: "aesthera_cart",
  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch (e) { return []; }
  },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    let list = this.get();
    if (list.includes(id)) list = list.filter(x => x !== id);
    else list.push(id);
    localStorage.setItem(this.KEY, JSON.stringify(list));
    this.updateCount();
    return list.includes(id);
  },
  updateCount() {
    const count = this.get().length;
    $$(".js-cart-count").forEach(el => {
      el.textContent = count;
      el.classList.toggle("is-visible", count > 0);
    });
  }
};

/* -------------------------------------------------------------------------
   Product card + detail markup builders
   Used by index.html (featured/bestsellers) and products.html (grid)
   ------------------------------------------------------------------------- */
function buildProductCard(product) {
  const cat = getCategoryById(product.category);
  const brandName = getBrandById(product.brand);
  const inCart = Cart.has(product.id);
  const badge = product.bestseller
    ? '<span class="product-badge product-badge--bestseller">Bestseller</span>'
    : (product.featured ? '<span class="product-badge product-badge--featured">Featured</span>' : "");

  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.id = product.id;

  card.innerHTML = `
    <div class="product-card__media">
      <img src="${product.image}" alt="${product.name}" loading="lazy" width="700" height="860">
      ${badge}
      <button class="cart-btn ${inCart ? "is-active" : ""}" aria-pressed="${inCart}" aria-label="Add ${product.name} to cart" data-cart-id="${product.id}">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="9" cy="21" r="1.3"/><circle cx="18" cy="21" r="1.3"/><path d="M2.5 3h2.4l2.3 12.4a2 2 0 002 1.6h8.6a2 2 0 002-1.6L21 7H6"/></svg>
      </button>
    </div>
    <div class="product-card__body">
      <p class="product-card__eyebrow">${brandName} &nbsp;·&nbsp; ${cat ? cat.name : ""}</p>
      <h3 class="product-card__title">${product.name}</h3>
      <button class="btn btn--outline btn--small product-card__view" data-view-id="${product.id}">View Product</button>
    </div>
  `;
  return card;
}

function renderProductGridInto(container, products, { emptyMessage } = {}) {
  container.innerHTML = "";
  if (!products.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `
      <p class="empty-state__title">${emptyMessage || "No products matched your search."}</p>
      <p class="empty-state__body">Try adjusting your filters or search terms.</p>
    `;
    container.appendChild(empty);
    return;
  }
  const frag = document.createDocumentFragment();
  products.forEach(p => frag.appendChild(buildProductCard(p)));
  container.appendChild(frag);
}

/* -------------------------------------------------------------------------
   Product detail modal
   ------------------------------------------------------------------------- */
function ensureModalScaffold() {
  if ($("#product-modal")) return;
  const modal = document.createElement("div");
  modal.id = "product-modal";
  modal.className = "modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal__backdrop" data-modal-close></div>
    <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal__close" data-modal-close aria-label="Close product details">&times;</button>
      <div class="modal__content"></div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener("click", e => {
    if (e.target.hasAttribute("data-modal-close")) closeProductModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeProductModal();
  });
}

function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  ensureModalScaffold();
  const modal = $("#product-modal");
  const cat = getCategoryById(product.category);
  const brandName = getBrandById(product.brand);

  const gallery = [product.image, ...(product.gallery || [])];

  $(".modal__content", modal).innerHTML = `
    <div class="modal-product">
      <div class="modal-product__gallery">
        <div class="modal-product__main">
          <img src="${gallery[0]}" alt="${product.name}" id="modal-main-image" width="700" height="860">
        </div>
        ${gallery.length > 1 ? `
        <div class="modal-product__thumbs">
          ${gallery.map((g, i) => `<button class="modal-thumb ${i === 0 ? "is-active" : ""}" data-thumb-src="${g}"><img src="${g}" alt="${product.name} view ${i + 1}"></button>`).join("")}
        </div>` : ""}
      </div>
      <div class="modal-product__info">
        <p class="modal-product__eyebrow">${brandName} &nbsp;·&nbsp; ${cat ? cat.name : ""}</p>
        <h2 class="modal-product__title" id="modal-title">${product.name}</h2>
        <p class="modal-product__desc">${product.description}</p>

        <table class="modal-product__specs">
          <tbody>
            <tr><th>Brand</th><td>${brandName}</td></tr>
            <tr><th>Category</th><td>${cat ? cat.name : ""}</td></tr>
            <tr><th>Subcategory</th><td>${product.subcategory}</td></tr>
          </tbody>
        </table>

        <p class="modal-product__notice">For professional use only. Availability and use are subject to applicable regulations.</p>

        <div class="modal-product__actions">
          <a href="${SITE_CONFIG.contact.whatsappLink}?text=${encodeURIComponent("I would like more information about: " + product.name)}" target="_blank" rel="noopener" class="btn btn--primary">Request Product Information</a>
          <button class="btn btn--outline cart-btn-inline ${Cart.has(product.id) ? "is-active" : ""}" data-cart-id="${product.id}">
            ${Cart.has(product.id) ? "Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeProductModal() {
  const modal = $("#product-modal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

/* Delegated clicks for "View Product", cart, and modal thumbnails/related */
document.addEventListener("click", e => {
  const viewBtn = e.target.closest("[data-view-id]");
  if (viewBtn) {
    openProductModal(viewBtn.dataset.viewId);
    return;
  }
  const cartBtn = e.target.closest("[data-cart-id]");
  if (cartBtn) {
    const isNowInCart = Cart.toggle(cartBtn.dataset.cartId);
    document.querySelectorAll(`[data-cart-id="${CSS.escape(cartBtn.dataset.cartId)}"]`).forEach(btn => {
      btn.classList.toggle("is-active", isNowInCart);
      if (btn.classList.contains("cart-btn-inline")) {
        btn.textContent = isNowInCart ? "Added to Cart" : "Add to Cart";
      }
      if (btn.hasAttribute("aria-pressed")) btn.setAttribute("aria-pressed", isNowInCart);
    });
    return;
  }
  const thumb = e.target.closest(".modal-thumb");
  if (thumb) {
    $$(".modal-thumb").forEach(t => t.classList.remove("is-active"));
    thumb.classList.add("is-active");
    $("#modal-main-image").src = thumb.dataset.thumbSrc;
  }
});

/* -------------------------------------------------------------------------
   Navigation: mobile menu, mega-menu, sticky shadow, back to top
   ------------------------------------------------------------------------- */
function initNavigation() {
  const header = $(".site-header");
  const menuToggle = $(".nav-toggle");
  const mobileMenu = $(".mobile-nav");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("no-scroll", isOpen);
    });
    $$(".mobile-nav a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("no-scroll");
      });
    });
  }

  const megaTrigger = $(".nav-item--categories");
  if (megaTrigger) {
    megaTrigger.addEventListener("mouseenter", () => megaTrigger.classList.add("is-open"));
    megaTrigger.addEventListener("mouseleave", () => megaTrigger.classList.remove("is-open"));
    const link = $(".nav-item--categories > a");
    link.addEventListener("click", e => {
      if (window.innerWidth < 981) {
        e.preventDefault();
        megaTrigger.classList.toggle("is-open");
      }
    });
  }

  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const backToTop = $(".back-to-top");
  if (backToTop) {
    const toggleVisibility = () => backToTop.classList.toggle("is-visible", window.scrollY > 600);
    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

/* -------------------------------------------------------------------------
   Populate nav categories mega-menu + footer categories (from config)
   ------------------------------------------------------------------------- */
function renderNavCategories() {
  $$(".js-nav-categories").forEach(container => {
    container.innerHTML = SITE_CONFIG.categories.map(cat => `
      <a href="products.html?category=${cat.id}" class="mega-menu__link">
        <span>${cat.name}</span>
      </a>
    `).join("");
  });
  $$(".js-footer-categories").forEach(container => {
    container.innerHTML = SITE_CONFIG.categories.slice(0, 4).map(cat => `
      <li><a href="products.html?category=${cat.id}">${cat.name}</a></li>
    `).join("");
  });
}

/* -------------------------------------------------------------------------
   Brand name / contact info injection (from config) — edit config.js only
   ------------------------------------------------------------------------- */
function injectBrandAndContact() {
  $$(".js-brand-name").forEach(el => el.textContent = SITE_CONFIG.brand.name);
  $$(".js-brand-tagline").forEach(el => el.textContent = SITE_CONFIG.brand.tagline);
  $$(".js-brand-desc").forEach(el => el.textContent = SITE_CONFIG.brand.shortDescription);
  $$(".js-contact-email").forEach(el => { el.textContent = SITE_CONFIG.contact.email; el.href = `mailto:${SITE_CONFIG.contact.email}`; });
  $$(".js-contact-phone").forEach(el => { el.textContent = SITE_CONFIG.contact.phone; el.href = `tel:${SITE_CONFIG.contact.phone.replace(/[^\d+]/g, "")}`; });
  $$(".js-contact-whatsapp").forEach(el => { el.href = SITE_CONFIG.contact.whatsappLink; });
  $$(".js-contact-location").forEach(el => el.textContent = SITE_CONFIG.contact.location);
  $$(".js-contact-hours").forEach(el => el.textContent = SITE_CONFIG.contact.hours);
  $$(".js-social-instagram").forEach(el => el.href = SITE_CONFIG.social.instagram);
  $$(".js-social-facebook").forEach(el => el.href = SITE_CONFIG.social.facebook);
  $$(".js-social-linkedin").forEach(el => el.href = SITE_CONFIG.social.linkedin);
  $$(".js-year").forEach(el => el.textContent = new Date().getFullYear());
}

/* -------------------------------------------------------------------------
   Homepage sections
   ------------------------------------------------------------------------- */
function renderFeaturedProducts() {
  const el = $("#featured-products-grid");
  if (!el) return;
  const items = PRODUCTS.filter(p => p.featured).slice(0, 4);
  renderProductGridInto(el, items);
}

function renderBestSellers() {
  const el = $("#bestsellers-grid");
  if (!el) return;
  const items = PRODUCTS.filter(p => p.bestseller).slice(0, 8);
  renderProductGridInto(el, items);
}

/* -------------------------------------------------------------------------
   Init
   ------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  injectBrandAndContact();
  renderNavCategories();
  initNavigation();
  Cart.updateCount();
  renderFeaturedProducts();
  renderBestSellers();
});

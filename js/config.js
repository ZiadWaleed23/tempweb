/* =========================================================================
   CONFIG.JS
   Centralized, editable configuration for the entire site.
   Change the brand name, contact details, social links, categories and
   brand list here — every page and component reads from this one file.
   ========================================================================= */

const SITE_CONFIG = {

  // ---------------------------------------------------------------------
  // BRAND
  // ---------------------------------------------------------------------
  brand: {
    name: "AESTHERA",
    tagline: "Elevating Aesthetic Excellence.",
    shortDescription:
      "A curated portfolio of professional aesthetic and beauty products, selected for clinics and skincare professionals who expect more.",
    logoLetter: "A" // used as a fallback mark if no image logo is supplied
  },

  // ---------------------------------------------------------------------
  // CONTACT & SOCIAL — placeholders, replace with real details
  // ---------------------------------------------------------------------
  contact: {
    email: "hello@aesthera.com",
    phone: "+971 4 880 7659",
    whatsapp: "+971 50 900 7659",
    whatsappLink: "https://wa.me/971509007659",
    location: "حدائق الأهرام - 118",
    hours: "Mon – Fri, 9:00 – 18:00"
  },

  social: {
    instagram: "https://instagram.com/aesthera",
    facebook: "https://facebook.com/aesthera",
    linkedin: "https://linkedin.com/company/aesthera"
  },

  // ---------------------------------------------------------------------
  // NAVIGATION CATEGORIES (used in mega-menu, footer, filters, homepage)
  // Add or edit entries here — every component that lists categories
  // reads from this array.
  // ---------------------------------------------------------------------
  categories: [
    {
      id: "botox",
      name: "Botulinum Toxin",
      description: "Injectable neuromodulators for the treatment of dynamic wrinkles and hyperhidrosis.",
      image: "https://picsum.photos/seed/aesthera-cat-botox/900/1100"
    },
    {
      id: "dermal-fillers",
      name: "Dermal Fillers",
      description: "Hyaluronic-acid, PLLA and calcium-hydroxyapatite based volumizing and contouring formulations for professional aesthetic use.",
      image: "https://picsum.photos/seed/aesthera-cat-fillers/900/1100"
    },
    {
      id: "skin-boosters",
      name: "Skin Boosters",
      description: "Bio-revitalizing injectable treatments formulated to support skin hydration, quality and radiance.",
      image: "https://picsum.photos/seed/aesthera-cat-boosters/900/1100"
    },
    {
      id: "mesotherapy",
      name: "Mesotherapy",
      description: "Ampoules and vial complexes used in mesotherapy sessions for skin, hair and body revitalization.",
      image: "https://picsum.photos/seed/aesthera-cat-meso/900/1100"
    },
    {
      id: "cold-peeling",
      name: "Cold Peeling",
      description: "Non-thermal peeling solutions for surface renewal without downtime.",
      image: "https://picsum.photos/seed/aesthera-cat-peeling/900/1100"
    },
    {
      id: "disposables",
      name: "Disposables & Accessories",
      description: "Cannulas, needles and injection accessories for professional aesthetic procedures.",
      image: "https://picsum.photos/seed/aesthera-cat-disposables/900/1100"
    }
  ],

  // ---------------------------------------------------------------------
  // BRANDS — "Selected Brands" section. Replace logo text with <img> tags
  // once real logos are available (see renderBrands() in app.js).
  // ---------------------------------------------------------------------
  brands: [
    { id: "refinex",       name: "REFINEX" },
    { id: "metox",         name: "METOX" },
    { id: "dysport",       name: "DYSPORT" },
    { id: "evetox",        name: "EVE TOX" },
    { id: "nabota",        name: "NABOTA" },
    { id: "demure",        name: "DEMURE" },
    { id: "dermofil",      name: "DERMOFIL" },
    { id: "hyamax",        name: "HYAMAX" },
    { id: "master-treat",  name: "MASTER TREAT" },
    { id: "audrey",        name: "AUDREY" },
    { id: "revolax",       name: "REVOLAX" },
    { id: "deneb",         name: "DENEB" },
    { id: "sedyfill",      name: "SEDYFILL" },
    { id: "celosome",      name: "CELOSOME" },
    { id: "sculptra",      name: "SCULPTRA" },
    { id: "olidia",        name: "OLIDIA" },
    { id: "vom",           name: "VOM" },
    { id: "premium",       name: "PREMIUM" },
    { id: "richesse",      name: "RICHESSE" },
    { id: "eptq",          name: "E.P.T.Q" },
    { id: "bella",         name: "BELLA" },
    { id: "hadurage",      name: "HADURAGE" },
    { id: "maxyfill",      name: "MAXYFILL" },
    { id: "bde-beaute",    name: "BDE BEAUTÉ" },
    { id: "hyaron",        name: "HYARON" },
    { id: "aqua",          name: "AQUA" },
    { id: "exo",           name: "EXO" },
    { id: "regloray",      name: "REGLORAY" },
    { id: "mesoheal",      name: "MESOHEAL" },
    { id: "rrs",           name: "RRS" },
    { id: "jalupro",       name: "JALUPRO" },
    { id: "nithya",        name: "NITHYA" },
    { id: "everline",      name: "EVERLINE" },
    { id: "kiara",         name: "KIARA" },
    { id: "remedium",      name: "REMEDIUM" },
    { id: "rablanca",      name: "RABLANCA" },
    { id: "medisupply",    name: "MEDISUPPLY" },
    { id: "clinic-select", name: "CLINIC SELECT" }
  ],

  // ---------------------------------------------------------------------
  // CATALOG SETTINGS — tune performance/pagination behaviour here
  // ---------------------------------------------------------------------
  catalog: {
    productsPerPage: 12,     // number of cards revealed per "Load More" click
    gridPageInitial: 12      // number of cards rendered on first paint
  }
};

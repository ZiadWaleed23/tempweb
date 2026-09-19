/* =========================================================================
   LOADER.JS  —  AESTHERA  ("Gravity Loader")
   ملف مستقل بالكامل (CSS + HTML + JS في ملف واحد) زي animations.js.
   - بيظهر في أول زيارة بس (لكل جلسة/تاب). بعد كده مبيعملش أي حاجة.
   - مبيغيّرش أي حاجة في الكود الأساسي (HTML / style.css / app.js ...).
   - لازم يتحط في <head> قبل ملفات الـ CSS عشان يغطي الصفحة من أول لحظة:
       <script src="js/loader.js"></script>
   - للإلغاء الكامل: شيل سطر السكريبت ده من الصفحات.
   - بيحترم prefers-reduced-motion (لو مفعّلة بيتخطى اللودر خالص).
   - لما يخلص بيبعت event اسمه "loader:done" وبيضيف class "is-loaded" على <html>.
   ========================================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     1) الإعدادات
     --------------------------------------------------------------------- */
  var CFG = {
    storage: "session",          // "session" = مرة لكل تاب/جلسة  |  "local" = مرة واحدة بس في عمر الزائر
    key: "aesthera_loader_seen",
    brand: "AESTHERA",
    minTime: 1200,               // أقل مدة يفضل فيها اللودر (ms)
    maxTime: 8000,               // حد أمان: يخلص حتى لو في حاجة اتعلقت (ms)
    phases: [[0, "Preparing the catalog"], [35, "Setting up your space"], [75, "Almost there"], [100, "Welcome"]]
  };

  /* ---------------------------------------------------------------------
     2) شروط التشغيل: أول زيارة بس + مفيش reduced-motion
     --------------------------------------------------------------------- */
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    var store = CFG.storage === "local" ? window.localStorage : window.sessionStorage;
    if (store.getItem(CFG.key)) return;   // شافه قبل كده
    store.setItem(CFG.key, "1");
  } catch (e) { return; }                 // التخزين مقفول (private mode) -> مفيش لودر أحسن من لودر في كل صفحة

  var root = document.documentElement;

  /* ---------------------------------------------------------------------
     3) الـ CSS
     --------------------------------------------------------------------- */
  var css = "\
#ld{position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;\
gap:clamp(10px,2.4vmin,22px);color:#FCF6FB;font-family:'Plus Jakarta Sans','Helvetica Neue','Segoe UI',system-ui,-apple-system,sans-serif;\
background:radial-gradient(90% 80% at 50% 42%,#4D3D66 0%,#3A2A4D 55%,#2A1C3A 100%);\
-webkit-user-select:none;user-select:none;overscroll-behavior:contain}\
#ld.revealing{-webkit-mask-image:radial-gradient(circle at 50% 50%,transparent var(--hole,0px),#000 calc(var(--hole,0px) + 2px));\
mask-image:radial-gradient(circle at 50% 50%,transparent var(--hole,0px),#000 calc(var(--hole,0px) + 2px))}\
#ld *{box-sizing:border-box}\
#ld .ld-stage{position:relative;z-index:1;width:min(54vmin,340px);aspect-ratio:1}\
#ld .ld-svg{width:100%;height:100%;overflow:visible;display:block}\
#ld .ld-count{position:relative;z-index:1;display:flex;align-items:flex-start;justify-content:center;\
font-family:'Helvetica Neue','Segoe UI',system-ui,-apple-system,Arial,sans-serif;\
font-size:clamp(46px,10.5vmin,92px);line-height:1;font-weight:200;letter-spacing:-.03em;font-variant-numeric:tabular-nums}\
#ld .ld-col{position:relative;display:inline-block;width:.6em;height:1em;overflow:hidden;text-align:center}\
#ld .ld-col.h{width:0;opacity:0;transition:width .45s cubic-bezier(.2,.9,.2,1),opacity .45s}\
#ld .ld-col.h.on{width:.6em;opacity:1}\
#ld .ld-col .d{position:absolute;inset:0;line-height:1}\
#ld .ld-col .in{animation:ld-in .38s cubic-bezier(.2,.9,.2,1) both}\
#ld .ld-col .out{animation:ld-out .3s ease-in both}\
@keyframes ld-in{from{transform:translateY(70%);opacity:0;filter:blur(5px)}}\
@keyframes ld-out{to{transform:translateY(-70%);opacity:0;filter:blur(5px)}}\
#ld .ld-pct{align-self:flex-start;margin:.14em 0 0 .12em;font-size:.3em;font-weight:400;opacity:.6;letter-spacing:0}\
#ld .ld-status{position:relative;z-index:1;height:1.4em;font-size:clamp(13px,2.2vmin,16px);opacity:.75}\
#ld .ld-status.sw{animation:ld-swap .5s cubic-bezier(.2,.9,.2,1)}\
@keyframes ld-swap{from{opacity:0;transform:translateY(6px)}}\
#ld .ld-brand{position:absolute;left:0;right:0;bottom:max(28px,env(safe-area-inset-bottom));text-align:center;\
font-family:'Fraunces',Georgia,serif;font-size:1.25rem;font-weight:480;letter-spacing:.02em;opacity:.85}\
#ld-shock{position:fixed;left:50%;top:50%;z-index:100000;width:0;height:0;opacity:0;border-radius:50%;box-sizing:border-box;\
pointer-events:none;transform:translate(-50%,-50%);border:2px solid rgba(252,246,251,.9);\
box-shadow:0 0 28px 3px #FFAFCC,0 0 90px 10px #CDB4DB,inset 0 0 30px 2px #A2D2FF}";

  /* ---------------------------------------------------------------------
     4) الـ HTML
     --------------------------------------------------------------------- */
  var html = '\
<div class="ld-stage">\
<svg class="ld-svg" viewBox="-100 -100 200 200" aria-hidden="true">\
<defs>\
<linearGradient id="ld-grad" gradientUnits="userSpaceOnUse" x1="-100" y1="-100" x2="100" y2="100">\
<stop offset="0" stop-color="#A2D2FF"/><stop offset=".55" stop-color="#CDB4DB"/><stop offset="1" stop-color="#FFAFCC"/>\
</linearGradient>\
<filter id="ld-goo" filterUnits="userSpaceOnUse" x="-100" y="-100" width="200" height="200" color-interpolation-filters="sRGB">\
<feGaussianBlur in="SourceGraphic" stdDeviation="4.2" result="b"/>\
<feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"/>\
</filter>\
<filter id="ld-glow" filterUnits="userSpaceOnUse" x="-100" y="-100" width="200" height="200"><feGaussianBlur stdDeviation="9"/></filter>\
<g id="ld-blobs" filter="url(#ld-goo)" fill="url(#ld-grad)">\
<circle id="ld-core" r="5"/>\
<circle class="ld-orb" r="8"/><circle class="ld-orb" r="8"/><circle class="ld-orb" r="8"/><circle class="ld-orb" r="8"/><circle class="ld-orb" r="8"/>\
</g>\
</defs>\
<g id="ld-ring">\
<circle r="99" fill="none" stroke="#FCF6FB" stroke-opacity=".35" stroke-width="1.4" stroke-dasharray="1.2 6.4">\
<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="40s" repeatCount="indefinite"/></circle>\
<circle r="92" fill="none" stroke="#FCF6FB" stroke-opacity=".16" stroke-width="1.5"/>\
<circle id="ld-arc" r="92" fill="none" stroke="url(#ld-grad)" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="578.053" stroke-dashoffset="578.053" transform="rotate(-90)"/>\
<circle id="ld-halo" r="6.5" fill="#FCF6FB" opacity=".2"/><circle id="ld-head" r="3" fill="#FCF6FB"/>\
</g>\
<use href="#ld-blobs" filter="url(#ld-glow)" opacity=".55"/><use href="#ld-blobs"/>\
</svg></div>\
<div class="ld-count" aria-hidden="true"><span class="ld-col h" data-c="h"></span><span class="ld-col" data-c="t"></span><span class="ld-col" data-c="o"></span><span class="ld-pct">%</span></div>\
<div class="ld-status" aria-hidden="true"></div>\
<div class="ld-brand"></div>';

  var styleEl = document.createElement("style");
  styleEl.id = "ld-style";
  styleEl.textContent = css;
  (document.head || root).appendChild(styleEl);

  var el = document.createElement("div");
  el.id = "ld";
  el.setAttribute("role", "progressbar");
  el.setAttribute("aria-label", "Loading");
  el.setAttribute("aria-valuemin", "0");
  el.setAttribute("aria-valuemax", "100");
  el.setAttribute("aria-valuenow", "0");
  el.innerHTML = html;
  var shock = document.createElement("div");
  shock.id = "ld-shock";
  root.appendChild(el);      // بنضيفه على <html> عشان يغطي الصفحة قبل ما الـ <body> يتبني
  root.appendChild(shock);
  root.style.overflow = "hidden";
  el.querySelector(".ld-brand").textContent = CFG.brand;

  /* ---------------------------------------------------------------------
     5) الحركة
     --------------------------------------------------------------------- */
  var $ = function (s) { return el.querySelector(s); };
  var clamp = function (v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var easeInOut = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  var arc = $("#ld-arc"), ring = $("#ld-ring"), head = $("#ld-head"), halo = $("#ld-halo");
  var grad = $("#ld-grad"), core = $("#ld-core");
  var countBox = $(".ld-count"), statusEl = $(".ld-status");
  var colH = $('[data-c="h"]'), colT = $('[data-c="t"]'), colO = $('[data-c="o"]');
  var CIRC = 2 * Math.PI * 92;

  // كل كورة ليها مسار Lissajous خاص بيها، فبتتقاطع وتلزق في بعض
  var orbs = Array.prototype.map.call(el.querySelectorAll(".ld-orb"), function (o, i) {
    return { el: o, fx: 1 + i * .23, fy: 1.3 + i * .31, ph: i * 1.9, R: 46 + (i % 3) * 14, r: 7 + (i % 2) * 3.2, dir: i % 2 ? -1 : 1 };
  });

  /* عداد الأرقام: خانة الآحاد بتتغيّر بسرعة فبنبدّلها فورًا، والعشرات/المئات بتلف بحركة */
  function put(col, ch, animate) {
    if (col.getAttribute("data-v") === ch) return;
    col.setAttribute("data-v", ch);
    if (!animate) {
      col.innerHTML = "";
      var s = document.createElement("span");
      s.className = "d"; s.textContent = ch;
      col.appendChild(s);
      return;
    }
    Array.prototype.forEach.call(col.children, function (o) {
      o.className = "d out";
      o.addEventListener("animationend", function () { if (o.parentNode) o.parentNode.removeChild(o); }, { once: true });
    });
    while (col.children.length > 3) col.removeChild(col.firstChild);
    var n = document.createElement("span");
    n.className = "d in"; n.textContent = ch;
    col.appendChild(n);
  }
  function setCount(v) {
    colH.classList.toggle("on", v >= 100);
    put(colH, v >= 100 ? "1" : "0", true);
    put(colT, v >= 100 ? "0" : String(Math.floor(v / 10) % 10), true);
    put(colO, v >= 100 ? "0" : String(v % 10), false);
    el.setAttribute("aria-valuenow", v);
  }

  /* التقدم الحقيقي: الـ DOM + الصور + حدث load */
  var loaded = false;
  window.addEventListener("load", function () { loaded = true; }, { once: true });
  if (document.readyState === "complete") loaded = true;

  function realProgress() {
    if (loaded) return 1;
    if (document.readyState === "loading") return 0;
    var n = 0, c = 0, imgs = document.images;
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].loading === "lazy") continue;
      n++; if (imgs[i].complete) c++;
    }
    return .3 + .6 * (n ? c / n : 1);
  }

  var raf = 0, start = performance.now(), last = start, T = 0;
  var phase = "load", phaseStart = 0, shown = 0, lastV = -1, lastPhase = -1, maxR = 0;
  var MERGE_MS = 750, REVEAL_MS = 1000;

  function complete() {
    cancelAnimationFrame(raf);
    if (el.parentNode) el.parentNode.removeChild(el);
    if (shock.parentNode) shock.parentNode.removeChild(shock);
    if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    root.style.overflow = "";
    root.classList.add("is-loaded");
    document.dispatchEvent(new CustomEvent("loader:done"));
  }

  function startReveal() {
    maxR = Math.hypot(window.innerWidth, window.innerHeight) / 2 * 1.06;
    el.classList.add("revealing");
    root.classList.add("is-loaded");
  }

  function doReveal(k) {
    var r = maxR * easeInOut(k);
    el.style.setProperty("--hole", r + "px");
    if (r > 3) {
      shock.style.width = shock.style.height = (r * 2) + "px";
      shock.style.opacity = k < .8 ? 1 : (1 - k) / .2;
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    var elapsed = now - start;
    T += dt;

    if (phase === "load") {
      if (elapsed > CFG.maxTime) loaded = true;
      var real = realProgress();
      if (!loaded) real = Math.min(.92, Math.max(real, elapsed / CFG.maxTime * .9));   // زحف بطيء عشان مايبانش متجمّد
      var target = Math.min(real, clamp(elapsed / CFG.minTime));
      shown += (target - shown) * (1 - Math.exp(-dt * 5));
      if (target >= 1 && shown > .996) { shown = 1; phase = "merge"; phaseStart = now; }
    }

    var merge = 0, swell = 0;
    if (phase === "merge") {
      var k1 = clamp((now - phaseStart) / MERGE_MS);
      merge = easeInOut(k1);
      if (k1 >= 1) { phase = "reveal"; phaseStart = now; startReveal(); }
    } else if (phase === "reveal") {
      var k2 = clamp((now - phaseStart) / REVEAL_MS);
      merge = 1; swell = easeOut(clamp(k2 / .3));
      doReveal(k2);
      if (k2 >= 1) { complete(); return; }
    }

    /* الكور */
    var p = shown;
    core.setAttribute("r", (lerp(5, 17, easeOut(p)) + Math.sin(T * 3) * .7 + merge * 9 + swell * 34).toFixed(2));
    var tight = 1 - .5 * easeOut(p);
    for (var i = 0; i < orbs.length; i++) {
      var o = orbs[i];
      var a = T * o.dir * o.fx * .9 + o.ph, b = T * o.fy * .9 + o.ph * 1.3;
      var R = o.R * tight * (1 - merge);
      o.el.setAttribute("cx", (Math.cos(a) * R).toFixed(2));
      o.el.setAttribute("cy", (Math.sin(b) * R).toFixed(2));
      o.el.setAttribute("r", (o.r * (1 - .35 * merge) * (.9 + .1 * Math.sin(T * 2 + o.ph))).toFixed(2));
    }
    grad.setAttribute("gradientTransform", "rotate(" + ((T * 40) % 360).toFixed(1) + ")");

    /* الحلقة */
    arc.setAttribute("stroke-dashoffset", (CIRC * (1 - p)).toFixed(2));
    var ang = -Math.PI / 2 + p * Math.PI * 2;
    var hx = (Math.cos(ang) * 92).toFixed(2), hy = (Math.sin(ang) * 92).toFixed(2);
    head.setAttribute("cx", hx); head.setAttribute("cy", hy);
    halo.setAttribute("cx", hx); halo.setAttribute("cy", hy);
    ring.style.opacity = (1 - clamp(merge * 1.2)).toFixed(3);

    /* العداد + الحالة */
    var v = Math.round(p * 100);
    if (v !== lastV) { lastV = v; setCount(v); }
    var idx = 0;
    for (var j = 0; j < CFG.phases.length; j++) if (v >= CFG.phases[j][0]) idx = j;
    if (idx !== lastPhase) {
      lastPhase = idx;
      statusEl.textContent = CFG.phases[idx][1];
      statusEl.classList.remove("sw"); void statusEl.offsetWidth; statusEl.classList.add("sw");
    }
    var fade = (1 - clamp((merge - .3) / .7)).toFixed(3);
    countBox.style.opacity = fade;
    statusEl.style.opacity = (fade * .75).toFixed(3);
  }

  setCount(0);
  raf = requestAnimationFrame(frame);
})();

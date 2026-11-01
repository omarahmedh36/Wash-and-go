(function () {
"use strict";
/* ========= الإعدادات =========
   WA_NUMBER: رقم واتساب الشركة بالصيغة الدولية بدون + (مصر: 20 + الرقم بدون الصفر).
   لو سبته فاضي هيتستخدم رابط الـ QR (WA_LINK) بدله. */
const WA_LINK = "https://wa.me/qr/6S37FGYN4OHFL1";
const WA_NUMBER = "201121518098";   // 01121518098 بالصيغة الدولية
const waUrl = text => (WA_NUMBER ? `https://wa.me/${WA_NUMBER}` : WA_LINK) + "?text=" + encodeURIComponent(text);

window.WG_OK = true;
document.documentElement.classList.add("js");
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
// كل ميزة شغالة لوحدها: لو واحدة فيها مشكلة، الباقي يكمل شغل
const safe = fn => { try { fn(); } catch (err) { console.error(err); } };

/* ----- الناف: ظل عند السكرول + قائمة الموبايل ----- */
safe(() => {
  const nav = $("#nav"), burger = $("#burger"), menu = $("#menu");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 20);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  $$("a", menu).forEach(a => a.addEventListener("click", () => {
    menu.classList.remove("open"); burger.setAttribute("aria-expanded", false);
  }));
});

/* ----- فقاعات صابون + "بوب" عند الضغط على الهيرو ----- */
safe(() => {
  if (reduceMotion) return;
  const bubbles = $("#bubbles"), hero = $(".hero");
  const count = innerWidth < 600 ? 12 : 22;
  for (let i = 0; i < count; i++) {
    const b = document.createElement("span"), size = 10 + Math.random() * 40;
    b.className = "bubble";
    b.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;` +
      `animation-duration:${8 + Math.random() * 10}s;animation-delay:${-Math.random() * 14}s;--dx:${(Math.random() - .5) * 120}px`;
    bubbles.appendChild(b);
  }
  hero.addEventListener("pointerdown", e => {
    if (e.target.closest("a,button")) return;
    const r = hero.getBoundingClientRect(), p = document.createElement("span");
    p.className = "pop"; p.style.left = e.clientX - r.left + "px"; p.style.top = e.clientY - r.top + "px";
    hero.appendChild(p); setTimeout(() => p.remove(), 600);
  });
});

/* ----- كلمة متغيرة في العنوان ----- */
safe(() => {
  if (reduceMotion) return;
  const words = ["في البيت", "في الشغل", "في أي مكان", "من غير مجهود"], rot = $("#rotator");
  let i = 0;
  setInterval(() => {
    rot.classList.add("out");
    setTimeout(() => { i = (i + 1) % words.length; rot.textContent = words[i]; rot.classList.remove("out"); }, 350);
  }, 2600);
});

/* ----- ظهور العناصر مع السكرول ----- */
safe(() => {
  if (!("IntersectionObserver" in window)) { $$(".reveal").forEach(el => el.classList.add("in")); return; }
  const io = new IntersectionObserver(list => list.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: .1 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 90 + "ms"; io.observe(el); });
});

/* ========= نموذج الطلب (3 خطوات) ========= */
const steps = $$(".step"), prog = $$("#progress li");
let cur = 0;

function go(n) {
  cur = Math.max(0, Math.min(2, n));
  steps.forEach((el, i) => el.classList.toggle("on", i === cur));
  prog.forEach((el, i) => { el.classList.toggle("on", i === cur); el.classList.toggle("done", i < cur); });
  if (cur === 2) renderSummary();
  const box = $(".order-box");
  if (box) box.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

const rules = {
  name: v => v.length >= 2,
  phone: v => /^\+?[\d\s-]{10,16}$/.test(v),
  car: v => v.length >= 2
};
function validate() {
  let first = null;
  for (const id in rules) {
    const input = $("#" + id), ok = rules[id](input.value.trim());
    input.parentElement.classList.toggle("bad", !ok);
    if (!ok && !first) first = input;
  }
  if (first) first.focus();
  return !first;
}

const icons = { "الخدمة": "🧼", "الإضافات": "➕", "الاسم": "👤", "الموبايل": "📞", "نوع العربية": "🚗", "المكان": "📍", "الميعاد": "🕒" };
const keys = ["الاسم", "الموبايل", "نوع العربية", "الخدمة", "الإضافات", "المكان", "الميعاد"];

function collect() {
  const val = id => $("#" + id).value.trim();
  return {
    "الخدمة": $("#service .on").textContent.trim(),
    "الإضافات": $$("#extras .on").map(x => x.textContent.trim()).join("، ") || "بدون",
    "الاسم": val("name"), "الموبايل": val("phone"), "نوع العربية": val("car"),
    "المكان": val("place") || "هبعتلكم اللوكيشن",
    "الميعاد": val("when") || "أي وقت مناسب"
  };
}
function buildMessage() {
  const o = collect();
  return ["🚿 *طلب غسيل جديد – WASH & GO*", "━━━━━━━━━━━━",
    ...keys.map(k => `${icons[k]} *${k}:* ${o[k]}`),
    "━━━━━━━━━━━━", "💰 *السعر:* بانتظار تحديده والرد عليا هنا", "شكراً ليكم 🙏"].join("\n");
}
function renderSummary() {
  const o = collect(), dl = $("#summary");
  dl.textContent = "";
  keys.forEach(k => {
    const row = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd");
    dt.textContent = icons[k] + " " + k; dd.textContent = o[k];
    row.append(dt, dd); dl.appendChild(row);
  });
}
function showToast(t) {
  const el = $("#toast"); el.textContent = t; el.classList.add("show");
  clearTimeout(showToast.t); showToast.t = setTimeout(() => el.classList.remove("show"), 5000);
}

/* موجة مية صغيرة عند الضغط على أي اختيار أو زرار */
function ripple(el, e) {
  if (reduceMotion) return;
  const r = el.getBoundingClientRect(), s = document.createElement("span");
  s.className = "ripple";
  s.style.left = (e.clientX - r.left || r.width / 2) + "px";
  s.style.top = (e.clientY - r.top || r.height / 2) + "px";
  el.appendChild(s); setTimeout(() => s.remove(), 650);
}

/* كل الضغطات من مكان واحد (أضمن وأسلس) */
document.addEventListener("click", e => {
  const hit = e.target.closest(".chip, .btn");
  if (hit && !hit.classList.contains("fab")) ripple(hit, e);
  const chip = e.target.closest(".chip");
  if (chip) {
    if (chip.parentElement.id === "service") {
      $$("#service .chip").forEach(x => { x.classList.remove("on"); x.setAttribute("aria-checked", "false"); });
      chip.classList.add("on"); chip.setAttribute("aria-checked", "true");
    } else if (chip.parentElement.id === "extras") {
      chip.setAttribute("aria-pressed", chip.classList.toggle("on"));
    }
    return;
  }
  const btn = e.target.closest("button");
  if (!btn) return;
  if (btn.hasAttribute("data-next")) { if (cur === 1 && !validate()) return; go(cur + 1); }
  else if (btn.hasAttribute("data-back")) go(cur - 1);
  else if (btn.id === "send") {
    const msg = buildMessage();
    try { navigator.clipboard && navigator.clipboard.writeText(msg).catch(() => {}); } catch (_) {}
    window.open(waUrl(msg), "_blank", "noopener");
    showToast("اتفتح واتساب ✅ لو الرسالة ماظهرتش، الصقها (اتنسخت تلقائياً)");
  }
});
document.addEventListener("input", e => {
  if (e.target.matches(".fields input")) e.target.parentElement.classList.remove("bad");
});

/* زرار واتساب العايم */
safe(() => { $("#fab").href = waUrl("أهلاً WASH & GO 👋 عايز أستفسر عن الغسيل"); });

})();
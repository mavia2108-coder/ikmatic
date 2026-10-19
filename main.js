/* ==========================================================
   CONFIG: fill these in before launch. See README.md.
   Empty or null values are treated as "not set yet" and the
   page falls back to honest wording. Nothing fake is shown.
   ========================================================== */
const CONFIG = {
  SITE_URL: "",              // TODO: e.g. "https://ikmatic.co.uk" (also replace https://YOUR-DOMAIN in the HTML files)
  CONTACT_EMAIL: "",         // TODO: e.g. "hello@your-domain.co.uk"
  FORM_ENDPOINT: "",         // TODO: Formspree or Web3Forms URL
  DEMO_TURNAROUND_DAYS: null,// TODO: number, e.g. 3
  NOTICE_PERIOD_DAYS: null,  // TODO: number, e.g. 30
  PRICES: { setup: null, monthly: null } // TODO: numbers in GBP, e.g. { setup: 500, monthly: 199 }
};

(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  // Year
  $$("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));

  // Menu
  const btn = $(".menu-btn"), nav = $("#nav");
  if (btn && nav) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
    nav.addEventListener("click", e => {
      if (e.target.closest("a")) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.focus(); }
    });
  }

  // Config-driven content
  if (CONFIG.CONTACT_EMAIL) {
    $$("[data-email]").forEach(a => { a.href = "mailto:" + CONFIG.CONTACT_EMAIL; a.textContent = CONFIG.CONTACT_EMAIL; });
    $$("[data-email-wrap]").forEach(el => (el.hidden = false));
  }
  if (CONFIG.DEMO_TURNAROUND_DAYS) $$("[data-turnaround]").forEach(el => (el.textContent = CONFIG.DEMO_TURNAROUND_DAYS));
  if (CONFIG.NOTICE_PERIOD_DAYS) {
    $$("[data-notice]").forEach(el => (el.textContent = CONFIG.NOTICE_PERIOD_DAYS));
    const nb = $("#notice-box"); if (nb) nb.hidden = false;
    const fn = $("#faq-notice"); if (fn) fn.textContent = "Yes. You can cancel with " + CONFIG.NOTICE_PERIOD_DAYS + " days’ notice.";
  }
  const pb = $("#price-box"), P = CONFIG.PRICES || {};
  if (pb && P.setup && P.monthly) {
    const f = n => "£" + Number(n).toLocaleString("en-GB");
    pb.textContent = "From " + f(P.setup) + " setup, then from " + f(P.monthly) + " a month. Your demo comes with an exact quote.";
  }

  // FAQ: keep one answer open at a time
  const items = $$(".faq details");
  items.forEach(d => d.addEventListener("toggle", () => {
    if (d.open) items.forEach(o => { if (o !== d) o.open = false; });
  }));

  // Fade-up on scroll
  const rev = $$(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.1 });
    rev.forEach(el => io.observe(el));
  } else rev.forEach(el => el.classList.add("in"));

  // Hero 3D tilt (pointer devices only, off for reduced motion)
  const scene = $(".scene"), stage = $(".stage");
  if (scene && stage && !matchMedia("(prefers-reduced-motion: reduce)").matches && matchMedia("(hover: hover)").matches) {
    scene.addEventListener("pointermove", e => {
      const r = scene.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.setProperty("--ry", (x * 30 - 4).toFixed(1) + "deg");
      stage.style.setProperty("--rx", (6 - y * 22).toFixed(1) + "deg");
    });
    scene.addEventListener("pointerleave", () => { stage.style.removeProperty("--ry"); stage.style.removeProperty("--rx"); });
  }

  // Demo form (no data is stored in the browser)
  const form = $("#demo-form");
  if (!form) return;
  const status = $("#form-status");
  const say = (msg, kind) => { status.textContent = msg; status.className = "status " + kind; };

  if (form.dataset.industry) $("#f-ind").value = form.dataset.industry;

  function validate() {
    let first = null;
    $$("[required]", form).forEach(el => {
      const field = el.closest(".field"), err = $(".err", field);
      const ok = el.type === "checkbox" ? el.checked : el.value.trim() !== "" && el.checkValidity();
      field.classList.toggle("bad", !ok);
      el.setAttribute("aria-invalid", !ok);
      if (err) err.textContent = ok ? "" :
        el.type === "checkbox" ? "Please tick the box to continue." :
        el.type === "email" ? "Please enter a valid email address." :
        el.type === "url" ? "Please enter a full web address starting with https://" :
        "Please complete this field.";
      if (!ok && !first) first = el;
    });
    if (first) first.focus();
    return !first;
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    say("", "");
    if (!validate()) return;
    const fd = new FormData(form);
    if (fd.get("_gotcha")) return; // honeypot
    if (!CONFIG.FORM_ENDPOINT) {
      if (CONFIG.CONTACT_EMAIL) {
        const body = [...fd.entries()].filter(([k]) => k !== "_gotcha").map(([k, v]) => k + ": " + v).join("\n");
        location.href = "mailto:" + CONFIG.CONTACT_EMAIL + "?subject=" + encodeURIComponent("Demo request") + "&body=" + encodeURIComponent(body);
        say("Your email app should now open with your request. Please send it from there.", "ok");
      } else say("The form is not connected yet. Please try again later.", "bad");
      return;
    }
    const submit = $("button[type=submit]", form); submit.disabled = true;
    try {
      const r = await fetch(CONFIG.FORM_ENDPOINT, { method: "POST", body: fd, headers: { Accept: "application/json" } });
      if (!r.ok) throw new Error("bad response");
      form.reset();
      if (form.dataset.industry) $("#f-ind").value = form.dataset.industry;
      say("Thank you. We have your details and will send your demo within " + (CONFIG.DEMO_TURNAROUND_DAYS || "a few") + " working days.", "ok");
    } catch (err) {
      say("Sorry, that did not send. Please try again" + (CONFIG.CONTACT_EMAIL ? " or email " + CONFIG.CONTACT_EMAIL : "") + ".", "bad");
    }
    submit.disabled = false;
  });
})();

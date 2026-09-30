// Contact form -> same-origin Worker (m3istr-e.com/api/contact), which verifies Turnstile and
// delivers a Discord DM + an email. No third-party mail SDK, and no address in the page.
const CONTACT_ERRORS = {
  verification_failed: "The anti-spam check did not pass. Please try again.",
  missing_turnstile: "Please wait for the anti-spam check to finish, then send again.",
  invalid_email: "That email address does not look right.",
  invalid_name: "Please enter your name (up to 100 characters).",
  invalid_message: "Please enter a message (up to 4000 characters).",
};

function showContactError(form, text) {
  const el = form.querySelector(".form__error");
  if (!el) return;
  el.textContent = text;
  el.hidden = !text;
}

async function contact(event) {
  event.preventDefault();
  const form = event.target;
  const loading = document.querySelector('.modal__overlay--loading');
  const success = document.querySelector('.modal__overlay--success');
  showContactError(form, "");

  const data = Object.fromEntries(new FormData(form).entries());
  if (!data["cf-turnstile-response"]) {
    showContactError(form, CONTACT_ERRORS.missing_turnstile);
    return;
  }

  loading.classList.add("modal__overlay--visible");
  let result = null;
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    result = await res.json().catch(() => null);
    if (res.ok && result && result.ok) {
      loading.classList.remove("modal__overlay--visible");
      success.classList.add("modal__overlay--visible");
      form.reset();
      return;
    }
  } catch (e) { /* network error: fall through to the generic message */ }

  loading.classList.remove("modal__overlay--visible");
  showContactError(form, CONTACT_ERRORS[result && result.error] ||
    "Sorry, the message could not be sent right now. Please try again later, or reach me on LinkedIn.");
  // a Turnstile token is single-use; get a fresh one for the retry
  if (window.turnstile) window.turnstile.reset(form.querySelector(".cf-turnstile"));
}


let lastFocus = null;

function toggleModal(event) {
  if (event) event.preventDefault();            // "#" links must not jump to the top
  const open = document.body.classList.toggle("modal--open");
  if (open) {
    lastFocus = document.activeElement;
    setTimeout(() => document.getElementById("contact-name")?.focus(), 350);
  } else if (lastFocus) {
    // the nav/hero fade back in (CSS: 300ms after a 400ms delay) and a browser will not
    // focus an element that is still visibility:hidden -- retry until it can take focus
    const target = lastFocus;
    let tries = 0;
    const refocus = () => {
      target.focus();
      if (document.activeElement !== target && ++tries < 12) setTimeout(refocus, 100);
    };
    setTimeout(refocus, 50);
  }
}

// Esc closes the contact popup
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.body.classList.contains("modal--open")) toggleModal(e);
});

function applyContrast(dark) {
  document.body.classList.toggle("dark-theme", dark);
  document.getElementById("contrast-toggle")?.setAttribute("aria-pressed", String(dark));
}

function toggleContrast(event) {
  if (event) event.preventDefault();
  const dark = !document.body.classList.contains("dark-theme");
  applyContrast(dark);
  try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) { /* private mode */ }
}

// remember the visitor's dark-mode choice
try { if (localStorage.getItem("theme") === "dark") applyContrast(true); } catch (e) { /* private mode */ }

// Event wiring lives here, not in inline on* attributes, so the Content-Security-Policy
// can forbid inline script ('unsafe-inline' is NOT allowed in script-src).
document.querySelectorAll('[data-action="toggle-modal"]').forEach((el) => el.addEventListener("click", toggleModal));
document.querySelectorAll('[data-action="toggle-contrast"]').forEach((el) => el.addEventListener("click", toggleContrast));
document.querySelector('[data-action="contact-submit"]')?.addEventListener("submit", contact);

// Smooth in-page scrolling for the menu, the "about me" / scroll-arrow links and the
// logo (back to top). CSS scroll-behavior:smooth is NOT enough: Chrome drops it when the
// OS asks for reduced motion (Windows "Animation effects" off), so the owner's own clicks
// jumped. Owner decision 2026-09-30: animate it here for every visitor - it is one short
// scroll the visitor started, not motion that plays by itself.
let scrollAnim = null;
function smoothScrollTo(targetY) {
  cancelAnimationFrame(scrollAnim);
  const startY = window.scrollY;
  const maxY = document.documentElement.scrollHeight - window.innerHeight;
  const endY = Math.max(0, Math.min(targetY, maxY));
  const distance = endY - startY;
  if (Math.abs(distance) < 2) return;
  const duration = Math.min(900, Math.max(400, Math.abs(distance) * 0.35));
  const t0 = performance.now();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const step = (now) => {
    const t = Math.min(1, (now - t0) / duration);
    // "instant" so the CSS smooth behaviour does not animate each frame a second time
    window.scrollTo({ top: startY + distance * ease(t), behavior: "instant" });
    if (t < 1) scrollAnim = requestAnimationFrame(step);
  };
  scrollAnim = requestAnimationFrame(step);
}
// the visitor grabbing the wheel, the screen or the keyboard takes over at once
["wheel", "touchstart", "keydown"].forEach((ev) =>
  window.addEventListener(ev, () => cancelAnimationFrame(scrollAnim), { passive: true }));

document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link || e.defaultPrevented) return;
  const hash = link.getAttribute("href");
  if (hash === "#") return; // contact / dark-mode controls have their own handlers
  if (hash === "#top") {
    e.preventDefault();
    smoothScrollTo(0);
    history.replaceState(null, "", location.pathname + location.search);
    return;
  }
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  e.preventDefault();
  // land below the fixed menu bar (CSS --nav-h); sections are flush, so no extra gap needed
  const navH = document.querySelector("nav")?.offsetHeight || 0;
  smoothScrollTo(target.getBoundingClientRect().top + window.scrollY - navH);
  history.pushState(null, "", hash);
  // keyboard and screen-reader users continue from the section they jumped to
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
});

// a soft shadow under the fixed menu bar once the page has scrolled, so it reads as a bar
const navBar = document.querySelector("nav");
const markScrolled = () => navBar?.classList.toggle("nav--scrolled", window.scrollY > 8);
window.addEventListener("scroll", markScrolled, { passive: true });
markScrolled();

// hide the floating mail button while the footer (which has its own Email link) is visible
const footerEl = document.querySelector("footer");
if (footerEl && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    document.body.classList.toggle("footer--visible", entry.isIntersecting);
  }).observe(footerEl);
}

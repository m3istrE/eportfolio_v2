// EmailJS public key (public by design; it can only trigger this site's own template)
emailjs.init("jVsHuaxsPFTEcB-o_");

async function contact(event) {
  event.preventDefault();
  const loading = document.querySelector('.modal__overlay--loading');
  const success = document.querySelector('.modal__overlay--success');

  loading.classList.toggle("modal__overlay--visible");

  try {
    await emailjs.sendForm('service_h3lv0ku', 'template_tmumtro', event.target, 'jVsHuaxsPFTEcB-o_');
    loading.classList.toggle("modal__overlay--visible");
    success.classList.toggle("modal__overlay--visible");
  } catch (error) {
    loading.classList.toggle("modal__overlay--visible");
    // address assembled at runtime so it never appears whole in the page source for scrapers
    const addr = ["v-2krisg", "outlook.com"].join("@");
    alert("The email service is temporarily unavailable. Contact me directly at " + addr + ".");
  }
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

//how to use async instead of then for sending an email?

// Event wiring lives here, not in inline on* attributes, so the Content-Security-Policy
// can forbid inline script ('unsafe-inline' is NOT allowed in script-src).
document.querySelectorAll('[data-action="toggle-modal"]').forEach((el) => el.addEventListener("click", toggleModal));
document.querySelectorAll('[data-action="toggle-contrast"]').forEach((el) => el.addEventListener("click", toggleContrast));
document.querySelector('[data-action="contact-submit"]')?.addEventListener("submit", contact);

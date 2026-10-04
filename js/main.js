// E-mail de contato do site. Enquanto estiver vazio, a página mostra o marcador
// [PREENCHER: ...] que está no HTML.
const CONTACT_EMAIL = "";

function applyContactEmail() {
  const emailLink = document.querySelector('[data-contact="email"]');
  if (!emailLink) {
    return;
  }
  if (!CONTACT_EMAIL) {
    console.error("Contato: CONTACT_EMAIL está vazio em js/main.js. A página mostra o marcador [PREENCHER].");
    return;
  }
  emailLink.href = `mailto:${CONTACT_EMAIL}`;
  emailLink.textContent = CONTACT_EMAIL;
}

function setFooterYear() {
  const year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
}

applyContactEmail();
setFooterYear();

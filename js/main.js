function setFooterYear() {
  const year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
}

// As demonstrações animadas das páginas de produto rodam num iframe. Fora da tela, a página
// pede para pausar ({ goDemo: 'pause' }) e, de volta, para continuar. O botão Pausar dentro da
// demonstração vale mais: se a pessoa pausou, o 'play' daqui não retoma.
function setupDemoFrames() {
  const frames = document.querySelectorAll("iframe[data-go-demo]");
  if (frames.length === 0) {
    return;
  }
  if (!("IntersectionObserver" in window)) {
    console.warn("Demonstração: navegador sem IntersectionObserver; a animação roda mesmo fora da tela.");
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const message = { goDemo: entry.isIntersecting ? "play" : "pause" };
      if (entry.target.contentWindow) {
        entry.target.contentWindow.postMessage(message, "*");
      }
    });
  }, { threshold: 0.2 });
  frames.forEach((frame) => observer.observe(frame));
}

setFooterYear();
setupDemoFrames();

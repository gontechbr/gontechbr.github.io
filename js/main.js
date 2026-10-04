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

// Amplia a demonstração para ocupar a largura da faixa. Ela é desenhada para 800 x 520; a escala
// é a menor entre caber na largura e caber em 85% da altura da janela. Em tela estreita (menos de
// 760 px) não amplia: o iframe fica na largura da tela e a demonstração usa o layout de celular.
const DEMO_WIDTH = 800;
const DEMO_HEIGHT = 520;
const DEMO_MIN_STAGE = 760;

function fitDemoStage(stage) {
  const stageWidth = stage.clientWidth;
  if (stageWidth < DEMO_MIN_STAGE) {
    stage.classList.remove("is-scaled");
    stage.style.height = "";
    return;
  }
  const scale = Math.min(stageWidth / DEMO_WIDTH, (window.innerHeight * 0.85) / DEMO_HEIGHT);
  stage.classList.add("is-scaled");
  stage.style.setProperty("--demo-scale", String(scale));
  stage.style.height = `${Math.round(DEMO_HEIGHT * scale)}px`;
  // Centraliza quando o limite foi a altura e sobra largura.
  stage.querySelector(".p-demo-frame").style.marginLeft = `${Math.max(0, (stageWidth - DEMO_WIDTH * scale) / 2)}px`;
}

function setupDemoStages() {
  const stages = document.querySelectorAll(".p-demo-stage");
  if (stages.length === 0) {
    return;
  }
  const fitAll = () => stages.forEach(fitDemoStage);
  fitAll();
  window.addEventListener("resize", fitAll);
}

setFooterYear();
setupDemoFrames();
setupDemoStages();

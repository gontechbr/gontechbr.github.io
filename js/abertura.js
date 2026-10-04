/*
  Abertura do site: o GO! entra (G e O sobem, o "!" cai) e a tela some sozinha em cerca de 3 s.
  Adaptado do abertura.js do SGO. Daqui saíram o nome da empresa cliente, o link externo e o
  rodapé com o logo do SGO, que só fazem sentido dentro do app.
  Aparece uma vez por visita (sessionStorage): quem vai a uma página de produto e volta não vê de novo.
  Uso: carregar este arquivo no <head> e chamar GoOpening.showOncePerVisit() logo depois de abrir o
  <body>, para a tela cobrir a página antes de ela aparecer.
*/
(function () {
  'use strict';

  var STORAGE_KEY = 'go-abertura-vista';
  var STYLE_ID = 'go-abertura-css';

  // Tempos em ms. A sequência termina de entrar em ~1,4 s e a tela some por volta de 3,2 s.
  var EXIT_START = 2750;
  var FADE_DURATION = 450;
  var SKIP_FADE = 200;
  var REDUCED_MOTION_HOLD = 1800;

  // Logo em curvas (mesmo desenho do SGO), para não depender da fonte carregar a tempo.
  var GO_SVG =
    '<svg class="goab-go" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2098 784" role="img" aria-label="GO!"><title>GO!</title>' +
    '<path class="goab-g" fill="currentColor" d="M804 443Q801 509 777.0 570.5Q753 632 707.0 680.5Q661 729 591.0 756.5Q521 784 427 784Q339 784 262.0 758.5Q185 733 126.0 683.5Q67 634 33.5 561.0Q0 488 0 392Q0 296 33.5 223.0Q67 150 127.5 100.5Q188 51 267.5 25.5Q347 0 439 0Q566 0 657.5 38.0Q749 76 805.0 143.0Q861 210 877 297H643Q634 264 605.5 240.5Q577 217 535.0 204.5Q493 192 441 192Q377 192 330.5 214.0Q284 236 259.0 280.0Q234 324 234 392Q234 460 261.5 506.0Q289 552 340.5 575.0Q392 598 462 598Q530 598 582.5 580.0Q635 562 667.0 527.0Q699 492 705 440ZM480 534V372H884V767H721L687 475L730 534Z"/>' +
    '<path class="goab-o" fill="currentColor" d="M1370 784Q1235 784 1133.5 735.0Q1032 686 975.5 598.0Q919 510 919 392Q919 274 975.5 186.0Q1032 98 1133.5 49.0Q1235 0 1370 0Q1505 0 1606.5 49.0Q1708 98 1764.5 186.0Q1821 274 1821 392Q1821 510 1764.5 598.0Q1708 686 1606.5 735.0Q1505 784 1370 784ZM1370 577Q1437 577 1485.5 554.5Q1534 532 1560.0 490.5Q1586 449 1586 392Q1586 335 1560.0 293.5Q1534 252 1485.5 229.5Q1437 207 1370 207Q1303 207 1254.5 229.5Q1206 252 1180.0 293.5Q1154 335 1154 392Q1154 449 1180.0 490.5Q1206 532 1254.5 554.5Q1303 577 1370 577Z"/>' +
    '<path class="goab-ex" fill="#0A9E64" d="M1854 17H2094L2055 489H1893ZM1974 778Q1918 778 1884.0 746.0Q1850 714 1850 663Q1850 611 1884.0 579.0Q1918 547 1974 547Q2030 547 2064.0 579.0Q2098 611 2098 663Q2098 714 2064.0 746.0Q2030 778 1974 778Z"/>' +
    '</svg>';

  // Prefixo goab- para não colidir com as classes do site.
  var CSS = [
    '.goab{--fundo:#F4F5F7;--tinta:#0F1114;--sec:#5B6270;--linha:#D5D8DE;--verde:#0A9E64;',
    'position:fixed;inset:0;z-index:1000;display:flex;flex-direction:column;align-items:center;justify-content:center;',
    'gap:clamp(12px,3vmin,28px);padding:24px;text-align:center;',
    'background:var(--fundo);color:var(--tinta);font-family:Arial,Helvetica,sans-serif;',
    'opacity:1;transition:opacity ' + FADE_DURATION + 'ms ease;-webkit-tap-highlight-color:transparent;overflow:hidden;box-sizing:border-box}',
    '.goab *,.goab *::before,.goab *::after{box-sizing:border-box}',
    '.goab.goab-saindo{opacity:0;pointer-events:none}',
    '.goab-go{display:block;height:clamp(64px,22vmin,170px);width:auto;max-width:100%;overflow:visible;margin-bottom:clamp(4px,1.5vmin,14px)}',
    // Sem atributo transform nos paths: fill-box faz a origem ser a própria letra.
    '.goab-go path{transform-box:fill-box;transform-origin:50% 100%}',
    '.goab-sub{margin:0;font-size:clamp(17px,2.8vmin,26px);line-height:1.35;color:var(--sec)}',

    '.goab-pular{position:absolute;top:12px;right:12px;min-width:48px;min-height:48px;padding:0 20px;',
    'border:1px solid var(--linha);border-radius:999px;background:transparent;color:var(--sec);',
    'font:inherit;font-size:15px;font-weight:700;cursor:pointer;touch-action:manipulation}',
    '.goab-pular:hover{color:var(--tinta);border-color:var(--sec)}',
    '.goab-pular:focus-visible{outline:2px solid var(--verde);outline-offset:2px}',

    // Entrada: G e O sobem, o ! cai e assenta com um leve achatamento.
    '@keyframes goab-sobe{from{opacity:0;transform:translateY(30%)}to{opacity:1;transform:none}}',
    '@keyframes goab-cai{0%{opacity:0;transform:translateY(-75%)}',
    '50%{opacity:1;transform:translateY(3%) scaleY(.93);animation-timing-function:ease-out}',
    '72%{transform:translateY(-3%) scaleY(1.02);animation-timing-function:ease-in-out}',
    '100%{opacity:1;transform:none}}',
    '@keyframes goab-surge{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
    '.goab-g{animation:goab-sobe 500ms cubic-bezier(.2,.8,.2,1) 60ms both}',
    '.goab-o{animation:goab-sobe 500ms cubic-bezier(.2,.8,.2,1) 180ms both}',
    '.goab-ex{animation:goab-cai 600ms cubic-bezier(.55,0,.85,.4) 400ms both}',
    '.goab-sub{animation:goab-surge 500ms cubic-bezier(.2,.8,.2,1) 900ms both}',

    // Movimento reduzido: tudo já no lugar; só o fade de saída continua.
    '@media (prefers-reduced-motion:reduce){.goab *{animation:none!important}}'
  ].join('');

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function prefersReducedMotion() {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (error) {
      console.warn('Abertura: sem como saber se o sistema pede menos movimento; seguindo com a animação.', error);
      return false;
    }
  }

  /** Diz se a abertura ainda não rodou nesta visita. Sem sessionStorage, não mostra, para não repetir a cada página. */
  function isNeeded() {
    try {
      return window.sessionStorage.getItem(STORAGE_KEY) !== '1';
    } catch (error) {
      console.warn('Abertura: sessionStorage indisponível, abertura não será exibida.', error);
      return false;
    }
  }

  /** Mostra a abertura e devolve uma Promise que resolve quando a tela sai (sozinha, por "Pular" ou Esc). */
  function show() {
    return new Promise(function (resolve) {
      var screen = null;
      var leaving = false;
      var finished = false;
      var timers = [];

      function finish() {
        if (finished) return;
        finished = true;
        timers.forEach(clearTimeout);
        document.removeEventListener('keydown', onKeyDown, true);
        try {
          if (screen && screen.parentNode) screen.parentNode.removeChild(screen);
        } catch (error) {
          console.warn('Abertura: não deu para remover a tela; o site segue mesmo assim.', error);
        }
        resolve();
      }

      function leave(fast) {
        if (leaving || finished) return;
        leaving = true;
        if (!screen) return finish();
        var duration = fast ? SKIP_FADE : FADE_DURATION;
        screen.style.transitionDuration = duration + 'ms';
        screen.classList.add('goab-saindo');
        screen.addEventListener('transitionend', function (event) {
          if (event.target === screen) finish();
        });
        // Garantia caso o transitionend não dispare (aba em segundo plano, por exemplo).
        timers.push(setTimeout(finish, duration + 150));
      }

      function onKeyDown(event) {
        if (event.key === 'Escape' || event.key === 'Esc') {
          event.preventDefault();
          leave(true);
        }
      }

      function start() {
        try {
          injectStyle();
          screen = document.createElement('div');
          screen.className = 'goab';
          screen.setAttribute('role', 'dialog');
          screen.setAttribute('aria-modal', 'true');
          screen.setAttribute('aria-label', 'GO!, software para a operação');
          screen.innerHTML =
            '<button type="button" class="goab-pular" aria-label="Pular abertura">Pular</button>' +
            GO_SVG +
            '<p class="goab-sub">software para a operação</p>';

          screen.querySelector('.goab-pular').addEventListener('click', function () { leave(true); });
          document.addEventListener('keydown', onKeyDown, true);
          document.body.appendChild(screen);

          var hold = prefersReducedMotion() ? REDUCED_MOTION_HOLD : EXIT_START;
          timers.push(setTimeout(function () { leave(false); }, hold));
          // Teto absoluto: nada segura o site por mais de 4 s mais o fade.
          timers.push(setTimeout(finish, 4000 + FADE_DURATION));
        } catch (error) {
          console.warn('Abertura: falha ao montar a tela, seguindo sem ela.', error);
          finish();
        }
      }

      // Grava logo no começo: se a pessoa recarregar no meio, não vê de novo.
      try {
        window.sessionStorage.setItem(STORAGE_KEY, '1');
      } catch (error) {
        console.warn('Abertura: não foi possível gravar no sessionStorage.', error);
      }
      if (document.body) start();
      else document.addEventListener('DOMContentLoaded', start, { once: true });
    });
  }

  /** Mostra a abertura só na primeira página vista na visita. */
  function showOncePerVisit() {
    if (isNeeded()) show();
  }

  window.GoOpening = { isNeeded: isNeeded, show: show, showOncePerVisit: showOncePerVisit };
})();

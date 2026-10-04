/* Motor das demonstracoes GO! (SGO, CGO, GQB). JavaScript puro, sem dependencias. */
(function () {
  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
  var E = {
    lin: function (p) { return p; },
    out: function (p) { return 1 - Math.pow(1 - p, 3); },
    inOut: function (p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; },
    back: function (p) { var c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); }
  };
  function seg(t, a, b, e) { return (e || E.out)(clamp((t - a) / (b - a), 0, 1)); }
  function win(t, a, b, f) { f = f || .35; if (t < a || t > b) return 0; return Math.min(seg(t, a, a + f), seg(t, b, b - f)); }
  function bump(t, a, d) { d = d || .35; var p = (t - a) / d; return p < 0 || p > 1 ? 0 : Math.sin(p * Math.PI); }
  function brl(v) { var s = Math.abs(v).toFixed(2).split('.'); return 'R$ ' + s[0].replace(/\B(?=(\d{3})+$)/g, '.') + ',' + s[1]; }
  function dec(v, n) { return v.toFixed(n).replace('.', ','); }
  function setS(el, p, v) { if (!el) return; var c = el.__gs || (el.__gs = {}); if (c[p] !== v) { c[p] = v; el.style[p] = v; } }
  function css(el, o) { if (!el) return; for (var p in o) setS(el, p, o[p]); }
  function txt(el, s) {
    if (!el || el.__gt === s) return; el.__gt = s;
    if (el.firstChild && el.firstChild.nodeType === 3 && !el.firstChild.nextSibling) el.firstChild.nodeValue = s; else el.textContent = s;
  }
  function type(el, s, t, a, b) { txt(el, s.slice(0, Math.round(s.length * clamp((t - a) / (b - a), 0, 1)))); }
  function vis(el, o, extra) {
    var st = { opacity: String(+o.toFixed(3)), visibility: o <= .001 ? 'hidden' : 'visible' };
    if (extra) for (var p in extra) st[p] = extra[p];
    css(el, st);
  }
  function scene(el, t, wins, dx) {
    dx = dx == null ? 1.6 : dx; var o = 0, x = 0;
    for (var i = 0; i < wins.length; i++) {
      var a = wins[i][0], b = wins[i][1]; if (t < a || t > b) continue;
      var pi = seg(t, a, a + .4), po = seg(t, b - .4, b, E.inOut), oo = pi * (1 - po);
      if (oo > o) { o = oo; x = (1 - pi) * dx - po * dx; }
    }
    vis(el, o, { transform: 'translateX(' + x.toFixed(3) + 'rem)' });
  }
  function fade(el, t, wins, f) { var o = 0; for (var i = 0; i < wins.length; i++) o = Math.max(o, win(t, wins[i][0], wins[i][1], f || .25)); vis(el, o); }
  function press(t, taps) {
    taps = [].concat(taps); var m = 0;
    for (var i = 0; i < taps.length; i++) { var d = t - taps[i]; if (d > -.09 && d < .26) m = Math.max(m, d < 0 ? 1 + d / .09 : 1 - d / .26); }
    return m;
  }
  function qr(el, seed, dark) {
    if (!el || el.__qr) return; el.__qr = 1;
    var n = 25, s = seed || 7, d = '';
    var r = function () { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    var fin = function (x, y) { return (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8); };
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) { if (fin(x, y)) continue; if (r() < .5) d += 'M' + x + ' ' + y + 'h1v1h-1z'; }
    [[0, 0], [n - 7, 0], [0, n - 7]].forEach(function (c) {
      var X = c[0], Y = c[1];
      d += 'M' + X + ' ' + Y + 'h7v7h-7zM' + (X + 1) + ' ' + (Y + 1) + 'v5h5v-5zM' + (X + 2) + ' ' + (Y + 2) + 'h3v3h-3z';
    });
    el.innerHTML = '<svg viewBox="-2 -2 ' + (n + 4) + ' ' + (n + 4) + '" width="100%" height="100%" shape-rendering="crispEdges" style="display:block">' +
      '<rect x="-2" y="-2" width="' + (n + 4) + '" height="' + (n + 4) + '" fill="#fff"/><path fill-rule="evenodd" fill="' + (dark || '#111') + '" d="' + d + '"/></svg>';
  }

  function start(cfg) {
    var root = cfg.root; if (!root) return function () {};
    var cache = {};
    var U = {
      E: E, seg: seg, win: win, bump: bump, brl: brl, dec: dec, css: css, txt: txt, type: type, vis: vis,
      scene: scene, fade: fade, press: press, qr: qr, clamp: clamp,
      k: function (n) { var e = cache[n]; if (!e || !e.isConnected) { e = root.querySelector('[data-k="' + n + '"]'); cache[n] = e; } return e; }
    };
    var screen = U.k('screen');
    U.measure = function () {
      var r = screen.getBoundingClientRect();
      U.sl = r.left; U.st = r.top; U.sw = r.width; U.sh = r.height;
      U.rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 12;
      var narrow = root.clientWidth < 440;
      if (narrow !== U.narrow) {
        U.narrow = narrow;
        root.querySelectorAll('[data-wide]').forEach(function (e) { e.style.display = narrow ? 'none' : ''; });
        root.querySelectorAll('[data-narrow]').forEach(function (e) { e.style.display = narrow ? '' : 'none'; });
      }
    };
    U.center = function (el) { var r = el.getBoundingClientRect(); return [r.left + r.width / 2 - U.sl, r.top + r.height / 2 - U.st]; };
    U.svgPt = function (svg, path, p, vw, vh) {
      var L = path.__L || (path.__L = path.getTotalLength()), q = path.getPointAtLength(L * clamp(p, 0, 1));
      var r = svg.getBoundingClientRect(), s = Math.min(r.width / vw, r.height / vh);
      return [r.left - U.sl + (r.width - vw * s) / 2 + q.x * s, r.top - U.st + (r.height - vh * s) / 2 + q.y * s];
    };
    function pt(w) {
      if (w.fn) return w.fn();
      if (w.at) return [w.at[0] * U.sw, w.at[1] * U.sh];
      var e = U.k(w.k); return e ? U.center(e) : [U.sw / 2, U.sh / 2];
    }
    U.finger = function (t, path, taps, o, over, pressOver) {
      var xy = over;
      if (!xy) {
        if (t <= path[0].t) xy = pt(path[0]);
        else {
          xy = pt(path[path.length - 1]);
          for (var i = 0; i < path.length - 1; i++) {
            var A = path[i], B = path[i + 1];
            if (t < B.t) {
              var mv = Math.max(.2, Math.min(B.mv || .55, B.t - A.t - .22));
              var p = E.inOut(clamp((t - (B.t - mv)) / mv, 0, 1)), a = pt(A), b = pt(B);
              xy = [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p]; break;
            }
          }
        }
      }
      if (U.reduced) o = 0;
      var f = U.k('finger'), rp = U.k('ripple'), h = f.offsetWidth / 2;
      var pr = Math.max(press(t, taps), pressOver || 0);
      css(f, { transform: 'translate(' + (xy[0] - h).toFixed(1) + 'px,' + (xy[1] - h).toFixed(1) + 'px) scale(' + (1 - .22 * pr).toFixed(3) + ')', opacity: String(+o.toFixed(3)) });
      var last = null; taps = [].concat(taps);
      for (var j = 0; j < taps.length; j++) if (taps[j] <= t && t - taps[j] < .5) last = taps[j];
      if (rp) {
        if (last == null || o <= 0) css(rp, { opacity: '0' });
        else { var q = (t - last) / .5; css(rp, { opacity: String(+(o * (1 - q) * .8).toFixed(3)), transform: 'translate(' + (xy[0] - h).toFixed(1) + 'px,' + (xy[1] - h).toFixed(1) + 'px) scale(' + (1 + 1.3 * q).toFixed(3) + ')' }); }
      }
    };
    U.toast = function (t, list) {
      var el = U.k('toast'), o = 0, y = 0;
      for (var i = 0; i < list.length; i++) {
        var a = list[i][0], b = list[i][1];
        if (t >= a && t <= b) { o = win(t, a, b, .25); y = (1 - seg(t, a, a + .3)) * .8; txt(U.k('toastTxt'), list[i][2]); break; }
      }
      vis(el, o, { transform: 'translateY(' + y.toFixed(3) + 'rem)' });
    };

    var D = cfg.duration, t = cfg.start || 0, last = null, userPaused = false, sitePaused = false, alive = true, raf = 0;
    var mq = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
    var btn = U.k('pause');
    function label() { if (!btn) return; txt(btn, userPaused ? 'Continuar' : 'Pausar'); btn.setAttribute('aria-pressed', userPaused ? 'true' : 'false'); }
    function onBtn() { userPaused = !userPaused; label(); }
    function onMsg(e) { var d = e && e.data; if (!d || typeof d !== 'object') return; if (d.goDemo === 'pause') sitePaused = true; else if (d.goDemo === 'play') sitePaused = false; }
    if (btn) btn.addEventListener('click', onBtn);
    window.addEventListener('message', onMsg);
    function draw() {
      U.reduced = mq.matches;
      if (btn) btn.style.visibility = U.reduced ? 'hidden' : '';
      U.measure(); cfg.frame(U.reduced ? cfg.still : t, U);
    }
    function tick(now) {
      if (!alive) return;
      var running = !mq.matches && !userPaused && !sitePaused && !document.hidden;
      if (running && last != null) t = (t + Math.min(.1, (now - last) / 1000)) % D;
      last = now; draw(); raf = requestAnimationFrame(tick);
    }
    label(); raf = requestAnimationFrame(tick);
    window.__goSeek = function (x) { t = x; userPaused = true; label(); draw(); };
    return function () { alive = false; cancelAnimationFrame(raf); window.removeEventListener('message', onMsg); if (btn) btn.removeEventListener('click', onBtn); };
  }
  window.GoDemo = { start: start };
})();

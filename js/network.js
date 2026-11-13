/* Info Tech Fly: animated tech network background
   Circle-framed tech icons (Python, Java, Linux, Hacker, Laptop ...) drift slowly,
   and are joined by thin glowing lines with data packets travelling along them.
   - Pure canvas, no libraries. Uses the Font Awesome you already load.
   - Follows the light / dark theme automatically.
   - Pointer (mouse or finger) gently pushes nodes and draws lines to them.
   - Pauses when the tab is hidden, honours "reduce motion", and is lighter on phones. */
(() => {
  "use strict";

  /* ---------- settings (safe to tweak) ---------- */
  const OPT = {
    density: 46000,      // bigger number = fewer icons (px² of screen per icon)
    minNodes: 12,
    maxNodes: 32,
    speed: 0.16,         // drift speed, px per frame at 60fps
    link: 210,           // max distance (px) at which two icons are joined by a line
    mouseRadius: 190,    // pointer reach
    packets: 7,          // glowing data dots travelling on the lines
    opacity: 0.95        // overall canvas opacity
  };

  /* [fontType, glyph, colour or null (= theme ink)]   b = brand font, s = solid font
     the first five are the ones you asked for, so they always appear */
  const ICONS = [
    ["b", "\uf3e2", "#3776ab"], // python
    ["b", "\uf4e4", "#e76f00"], // java
    ["b", "\uf17c", "#e0a800"], // linux
    ["s", "\uf21b", null],      // hacker (user-secret)
    ["s", "\uf5fc", "#5bb5d6"], // laptop with code
    ["s", "\uf120", "#10b981"], // terminal
    ["b", "\uf09b", null],      // github
    ["b", "\uf395", "#2496ed"], // docker
    ["b", "\uf41b", "#1fb6d6"], // react
    ["b", "\uf3d3", "#68a063"], // node.js
    ["b", "\uf375", "#ff9900"], // aws
    ["b", "\uf13b", "#e34f26"], // html5
    ["b", "\uf3b8", "#d9a400"], // javascript
    ["s", "\uf3ed", "#10b981"], // shield
    ["s", "\uf1c0", "#5bb5d6"], // database
    ["s", "\uf0c2", "#5bb5d6"], // cloud
    ["s", "\uf188", "#e5484d"], // bug
    ["b", "\uf457", "#777bb3"], // php
    ["b", "\uf19a", "#21759b"], // wordpress
    ["b", "\uf841", "#f05032"]  // git
  ];

  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const root = document.documentElement;
  const cv = document.createElement("canvas");
  cv.id = "net";
  cv.setAttribute("aria-hidden", "true");
  cv.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:" + OPT.opacity;
  document.body.insertAdjacentElement("afterbegin", cv);
  const ctx = cv.getContext("2d");

  let W = 0, H = 0, DPR = 1, nodes = [], packets = [], raf = 0, fontsOk = false;
  const mouse = { x: -9999, y: -9999, on: false };

  /* ---------- theme colours ---------- */
  const palette = () => {
    const dark = root.dataset.theme === "dark";
    return dark
      /* dark mode: soft but clearly visible, text stays easy to read (cards are frosted glass) */
      ? { dark, line: "135,206,235", lineMax: 0.17, fill: "rgba(14,30,50,.92)", ring: "rgba(135,206,235,.5)", ink: "#cfe4f3", glow: "rgba(135,206,235,.14)", pk: "#7cc4e2", nodeA: 0.5, canvas: 0.78, blur: 6 }
      : { dark, line: "70,150,190", lineMax: 0.36, fill: "rgba(255,255,255,.95)", ring: "rgba(91,181,214,.8)", ink: "#1e3a5f", glow: "rgba(91,181,214,.3)", pk: "#2a9fc9", nodeA: 0.72, canvas: OPT.opacity, blur: 12 };
  };
  let P = palette();

  /* ---------- sprite: one circle frame with its icon ---------- */
  const sprite = (n) => {
    const pad = 14, s = Math.ceil((n.r + pad) * 2);
    const c = document.createElement("canvas");
    c.width = c.height = Math.ceil(s * DPR);
    const g = c.getContext("2d");
    g.scale(DPR, DPR);
    const m = s / 2;
    if (fontsOk) {
      // soft glow + body of the circle
      g.shadowColor = P.glow; g.shadowBlur = P.blur;
      g.beginPath(); g.arc(m, m, n.r, 0, 6.2832);
      g.fillStyle = P.fill; g.fill();
      g.shadowBlur = 0;
      g.lineWidth = 1.6; g.strokeStyle = P.ring; g.stroke();
      // thin inner ring for a "tech badge" look
      g.beginPath(); g.arc(m, m, n.r - 4, 0, 6.2832);
      g.lineWidth = 0.7; g.strokeStyle = P.ring.replace(/[\d.]+\)$/, "0.28)"); g.stroke();
      // icon
      const ic = ICONS[n.icon];
      g.fillStyle = ic[2] || P.ink;
      g.textAlign = "center"; g.textBaseline = "middle";
      g.font = (ic[0] === "b" ? "400 " : "900 ") + Math.round(n.r * 0.95) +
        'px "Font Awesome 6 ' + (ic[0] === "b" ? "Brands" : "Free") + '"';
      g.fillText(ic[1], m, m + 0.5);
    } else {
      // fonts did not load: fall back to a plain glowing dot
      g.shadowColor = P.glow; g.shadowBlur = 8;
      g.beginPath(); g.arc(m, m, 4, 0, 6.2832);
      g.fillStyle = P.ring; g.fill();
    }
    n.img = c; n.size = s;
  };

  /* ---------- build the nodes ---------- */
  const build = () => {
    const small = W < 700;
    let count = Math.round((W * H) / (small ? OPT.density * 1.5 : OPT.density));
    count = Math.max(small ? 9 : OPT.minNodes, Math.min(small ? 16 : OPT.maxNodes, count));
    // icon order: the five key icons first, then a shuffled mix
    const rest = ICONS.map((_, i) => i).slice(5).sort(() => Math.random() - 0.5);
    const order = [0, 1, 2, 3, 4].concat(rest);
    nodes = [];
    for (let i = 0; i < count; i++) {
      const z = 0.62 + Math.random() * 0.38;                // depth: far = small + faint
      const base = small ? 15 + Math.random() * 6 : 18 + Math.random() * 9;
      const a = Math.random() * 6.2832;
      const sp = OPT.speed * (0.5 + Math.random()) * z;
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        r: base * z, z, icon: order[i % order.length],
        ph: Math.random() * 6.2832
      });
    }
    nodes.forEach(sprite);
    packets = [];
  };

  const size = () => {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };

  /* ---------- one frame ---------- */
  const frame = (move, dt) => {
    ctx.clearRect(0, 0, W, H);
    const t = performance.now() / 1000;

    // move
    if (move) {
      for (const n of nodes) {
        n.x += n.vx * dt; n.y += n.vy * dt;
        const r = n.r + 6;
        if (n.x < r) { n.x = r; n.vx = Math.abs(n.vx); }
        if (n.x > W - r) { n.x = W - r; n.vx = -Math.abs(n.vx); }
        if (n.y < r) { n.y = r; n.vy = Math.abs(n.vy); }
        if (n.y > H - r) { n.y = H - r; n.vy = -Math.abs(n.vy); }
        if (mouse.on) {                                   // pointer pushes nodes away softly
          const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
          if (d < OPT.mouseRadius && d > 1) {
            const f = (1 - d / OPT.mouseRadius) * 0.06 * dt;
            n.vx += (dx / d) * f; n.vy += (dy / d) * f;
          }
        }
        // keep speed calm
        const sp = Math.hypot(n.vx, n.vy), max = OPT.speed * 1.6;
        if (sp > max) { n.vx *= max / sp; n.vy *= max / sp; }
      }
      // gentle separation so icons never overlap
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), min = a.r + b.r + 14;
        if (d < min && d > 0.1) {
          const f = ((min - d) / min) * 0.02 * dt, ux = dx / d, uy = dy / d;
          a.vx -= ux * f; a.vy -= uy * f; b.vx += ux * f; b.vy += uy * f;
        }
      }
    }

    // lines between icons (from edge to edge of the circles)
    const L = W < 700 ? OPT.link * 0.72 : OPT.link;
    ctx.lineWidth = 1;
    const links = [];
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
      if (d > L) continue;
      const k = 1 - d / L, ux = dx / d, uy = dy / d;
      ctx.strokeStyle = `rgba(${P.line},${(k * P.lineMax * Math.min(a.z, b.z) + 0.04).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(a.x + ux * a.r, a.y + uy * a.r);
      ctx.lineTo(b.x - ux * b.r, b.y - uy * b.r);
      ctx.stroke();
      links.push([a, b, d]);
    }

    // pointer lines
    if (mouse.on) {
      for (const n of nodes) {
        const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
        if (d > OPT.mouseRadius * 1.25) continue;
        const k = 1 - d / (OPT.mouseRadius * 1.25);
        ctx.strokeStyle = `rgba(${P.line},${(k * 0.7).toFixed(3)})`;
        ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(n.x - (dx / d) * n.r, n.y - (dy / d) * n.r); ctx.stroke();
      }
    }

    // data packets running along the lines
    if (move && links.length) {
      while (packets.length < OPT.packets && Math.random() < 0.08) {
        const l = links[(Math.random() * links.length) | 0];
        packets.push({ a: l[0], b: l[1], t: 0, s: 0.006 + Math.random() * 0.008 });
      }
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += p.s * dt;
        if (p.t >= 1 || Math.hypot(p.b.x - p.a.x, p.b.y - p.a.y) > L) { packets.splice(i, 1); continue; }
        const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx.save();
        ctx.shadowColor = P.pk; ctx.shadowBlur = P.dark ? 6 : 10; ctx.globalAlpha = P.dark ? 0.75 : 1;
        ctx.fillStyle = P.pk;
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 6.2832); ctx.fill();
        ctx.restore();
      }
    }

    // the circle icons (with a very slight float)
    for (const n of nodes) {
      const bob = reduce ? 0 : Math.sin(t * 0.9 + n.ph) * 1.6;
      ctx.globalAlpha = (0.5 + 0.5 * n.z) * P.nodeA;
      ctx.drawImage(n.img, n.x - n.size / 2, n.y - n.size / 2 + bob, n.size, n.size);
    }
    ctx.globalAlpha = 1;
  };

  /* ---------- loop ---------- */
  let last = 0;
  const loop = (ts) => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(3, (ts - last) / 16.667 || 1);
    last = ts;
    frame(true, dt);
  };
  const play = () => { if (!raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  /* ---------- events ---------- */
  addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true; }, { passive: true });
  document.documentElement.addEventListener("mouseleave", () => { mouse.on = false; });
  addEventListener("pointerup", (e) => { if (e.pointerType === "touch") mouse.on = false; }, { passive: true });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));

  let rt, lw = innerWidth, lh = innerHeight;
  addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      // ignore tiny height changes (mobile address bar)
      if (innerWidth === lw && Math.abs(innerHeight - lh) < 150) return;
      lw = innerWidth; lh = innerHeight;
      size(); build();
      if (reduce) frame(false, 0);
    }, 200);
  });

  // light <-> dark switch: repaint the icon frames in the new colours
  new MutationObserver(() => {
    P = palette(); cv.style.opacity = P.canvas; nodes.forEach(sprite);
    if (reduce) frame(false, 0);
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  /* ---------- start (wait for Font Awesome so the icons draw correctly) ---------- */
  const init = () => {
    size(); P = palette(); cv.style.opacity = P.canvas; build(); frame(true, 0); play();
  };
  const loadFonts = () => {
    if (!document.fonts || !document.fonts.load) return Promise.resolve(false);
    return Promise.race([
      Promise.all([
        document.fonts.load('400 20px "Font Awesome 6 Brands"', "\uf3e2"),
        document.fonts.load('900 20px "Font Awesome 6 Free"', "\uf21b")
      ]).then(() => true),
      new Promise((r) => setTimeout(() => r(false), 5000))
    ]).catch(() => false);
  };
  const go = () => loadFonts().then((ok) => {
    fontsOk = !!ok && document.fonts.check('400 20px "Font Awesome 6 Brands"', "\uf3e2") &&
      document.fonts.check('900 20px "Font Awesome 6 Free"', "\uf21b");
    init();
  });
  if (document.readyState === "complete") go();
  else addEventListener("load", go);
})();

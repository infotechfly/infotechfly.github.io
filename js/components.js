(() => {
  const r = document.documentElement;
  r.classList.add("js");
  let t;
  try {
    t = localStorage.getItem("theme");
  } catch (e) {}
  r.dataset.theme =
    t || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");

  const NAV = [
    ["index.html", "Home"],
    ["about.html", "About"],
    ["services.html", "Services"],
    ["contact.html", "Contact"],
  ];
  const SOCIAL = [
    ["youtube", "https://www.youtube.com/@InfoTechFly", "YouTube"],
    ["instagram", "https://www.instagram.com/infotechfly/", "Instagram"],
    ["telegram", "https://t.me/infotechfly", "Telegram"],
    [
      "linkedin-in",
      "https://www.linkedin.com/company/infotechfly/",
      "LinkedIn",
    ],
    ["github", "https://github.com/infotechfly", "GitHub"],
  ];
  const page = (
    location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();
  const brand =
    '<a href="index.html" class="brand"><span class="logo"><img src="img/Logo.png" alt="" onerror="this.remove()"></span><span>Info Tech <b>Fly</b></span></a>';
  const soc =
    '<div class="soc">' +
    SOCIAL.map(
      (s) =>
        `<a href="${s[1]}" target="_blank" rel="noopener" aria-label="${s[2]}"><i class="fa-brands fa-${s[0]}"></i></a>`,
    ).join("") +
    "</div>";

  const themeBtn = `<button class="tbtn" id="theme" aria-label="Switch light or dark mode" aria-pressed="false"><i class="fa-solid fa-moon"></i><i class="fa-solid fa-sun"></i></button>`;

  const header = `<header class="hdr" id="hdr"><div class="wrap">${brand}
    <nav class="menu" id="menu" aria-label="Main">${NAV.map((n) => `<a href="${n[0]}" class="${page === n[0] ? "on" : ""}">${n[1]}</a>`).join("")}
      <div class="mob-actions">${themeBtn}<a href="contact.html" class="btn mob-cta">Get Started</a></div>
    </nav>
    <div class="desk-actions">${themeBtn}<a href="contact.html" class="btn hbtn" style="padding:.5rem 1.2rem">Get Started</a></div>
    <button class="burger" id="burger" aria-label="Menu"><i></i><i></i><i></i></button></div></header><div id="prog"></div>`;

  const footer = `<footer class="ftr"><div class="wrap"><div class="fg">
    <div>${brand}<p>Websites, apps, hosting and free online tools, built by Info Tech Fly.</p>${soc}</div>
    <div><h4>Pages</h4><ul>${NAV.map((n) => `<li><a href="${n[0]}">${n[1]}</a></li>`).join("")}</ul></div>
    <div><h4>Contact</h4><ul><li><i class="fa-solid fa-phone"></i> +91 7225880469</li><li><i class="fa-solid fa-envelope"></i> contactinfotechfly@gmail.com</li><li><i class="fa-solid fa-location-dot"></i> India (Remote)</li></ul></div>
    </div><div class="fb">&copy; <span id="yr"></span> <b>Info Tech Fly</b>. All rights reserved.</div></div></footer><div id="toast" role="status" aria-live="polite"></div>`;

  const form = `<div data-chatbot></div>`;

  document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("afterbegin", header);
    const f = document.getElementById("site-footer");
    if (f) f.outerHTML = footer;
    document
      .querySelectorAll("[data-lead-form]")
      .forEach((el) => (el.innerHTML = form));

    const ICONS = [
      "fa-brands fa-python",
      "fa-brands fa-java",
      "fa-solid fa-laptop-code",
      "fa-solid fa-server",
      "fa-brands fa-js",
      "fa-brands fa-node-js",
      "fa-brands fa-react",
      "fa-brands fa-php",
      "fa-brands fa-html5",
      "fa-brands fa-css3-alt",
      "fa-brands fa-aws",
      "fa-brands fa-docker",
      "fa-brands fa-linux",
      "fa-brands fa-git-alt",
      "fa-brands fa-wordpress",
      "fa-solid fa-database",
      "fa-solid fa-shield-halved",
      "fa-solid fa-cloud",
      "fa-solid fa-terminal",
      "fa-solid fa-microchip",
      "fa-solid fa-bug",
      "fa-solid fa-network-wired",
      "fa-solid fa-mobile-screen",
      "fa-solid fa-code",
    ];
    const GLYPHS = [
      "</>",
      "{ }",
      "01010",
      "def()",
      "sudo",
      "git push",
      "404",
      "#!/bin",
    ];
    const still = matchMedia("(prefers-reduced-motion:reduce)").matches,
      N = innerWidth < 700 ? 14 : 26,
      R = (a, b) => a + Math.random() * (b - a);
    const fx = document.createElement("div");
    fx.className = "bgfx";
    fx.setAttribute("aria-hidden", "true");
    for (let k = 0; k < N; k++) {
      const glyph = k % 4 === 3,
        el = document.createElement(glyph ? "b" : "i");
      if (glyph) el.textContent = GLYPHS[((k / 4) | 0) % GLYPHS.length];
      else el.className = ICONS[k % ICONS.length];
      el.style.cssText = `--x:${R(2, 96).toFixed(1)}%;--y:${R(5, 90).toFixed(0)}%;--s:${R(1.6, 3.8).toFixed(1)}rem;--d:${R(22, 46).toFixed(0)}s;--dl:-${R(0, 46).toFixed(0)}s;--sx:${R(-60, 60).toFixed(0)}px;--r:${R(-40, 40).toFixed(0)}deg;--o:${R(0.1, 0.17).toFixed(2)}`;
      fx.append(el);
    }
    document.body.prepend(fx);
    if (!still) {
      let raf;
      addEventListener(
        "mousemove",
        (e) => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(
            () =>
              (fx.style.transform = `translate(${(e.clientX / innerWidth - 0.5) * -26}px,${(e.clientY / innerHeight - 0.5) * -26}px)`),
          );
        },
        { passive: true },
      );
    }
    document.getElementById("yr").textContent = new Date().getFullYear();
    const menu = document.getElementById("menu"),
      bg = document.getElementById("burger");
    bg.onclick = () => {
      bg.classList.toggle("on");
      menu.classList.toggle("on");
    };
    menu.onclick = (e) => {
      if (e.target.closest("a")) {
        bg.classList.remove("on");
        menu.classList.remove("on");
      }
    };

    const themeBtns = document.querySelectorAll(".tbtn");
    const syncPressed = () =>
      themeBtns.forEach((b) =>
        b.setAttribute("aria-pressed", r.dataset.theme === "dark"),
      );
    syncPressed();
    themeBtns.forEach((btn) => {
      btn.onclick = () => {
        const n = r.dataset.theme === "dark" ? "light" : "dark";
        r.dataset.theme = n;
        try {
          localStorage.setItem("theme", n);
        } catch (e) {}
        syncPressed();
      };
    });
  });
})();
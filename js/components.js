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
    ["youtube", "https://www.youtube.com/@InfoTechFly", "YouTube", "yt"],
    ["instagram", "https://www.instagram.com/infotechfly/", "Instagram", "ig"],
    ["telegram", "https://t.me/infotechfly", "Telegram", "tg"],
    [
      "linkedin-in",
      "https://www.linkedin.com/company/infotechfly/",
      "LinkedIn",
      "in",
    ],
    ["github", "https://github.com/infotechfly", "GitHub", "gh"],
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
        `<a class="sl sl-${s[3]}" href="${s[1]}" target="_blank" rel="noopener me" aria-label="${s[2]}" title="${s[2]}"><i class="fa-brands fa-${s[0]}" aria-hidden="true"></i></a>`,
    ).join("") +
    "</div>";

  const themeBtn = `<button class="tbtn" id="theme" aria-label="Switch light or dark mode" aria-pressed="false"><i class="fa-solid fa-moon"></i><i class="fa-solid fa-sun"></i></button>`;

  const header = `<header class="hdr" id="hdr"><div class="wrap">${brand}
    <nav class="menu" id="menu" aria-label="Main"><button class="mclose" id="mclose" type="button" aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>${NAV.map((n, i) => `<a href="${n[0]}" style="--i:${i}" class="${page === n[0] ? "on" : ""}">${n[1]}</a>`).join("")}
      <div class="mob-actions">${themeBtn}<a href="contact.html" class="btn mob-cta">Get Started</a></div>
    </nav>
    <div class="desk-actions">${themeBtn}<a href="contact.html" class="btn hbtn" style="padding:.5rem 1.2rem">Get Started</a></div>
    <button class="burger" id="burger" aria-label="Menu" aria-controls="menu" aria-expanded="false"><i></i><i></i><i></i></button></div></header><div id="scrim"></div><div id="prog"></div>`;

  const footer = `<footer class="ftr"><div class="wrap"><div class="fg">
    <div>${brand}<p>Websites, apps, hosting and free online tools, built by Info Tech Fly.</p>${soc}</div>
    <div><h4>Pages</h4><ul>${NAV.map((n) => `<li><a href="${n[0]}">${n[1]}</a></li>`).join("")}</ul></div>
    <div><h4>Contact</h4><ul><li><i class="fa-solid fa-phone"></i> <a href="tel:+917225880469">+91 7225880469</a></li><li><i class="fa-solid fa-envelope"></i> <a href="mailto:contactinfotechfly@gmail.com">contactinfotechfly@gmail.com</a></li><li><i class="fa-solid fa-location-dot"></i> India (Remote)</li></ul></div>
    </div><div class="fb">&copy; <span id="yr"></span> <b>Info Tech Fly</b>. All rights reserved.</div></div></footer><div id="toast" role="status" aria-live="polite"></div>`;

  /* contact form: full name, phone, email, message + two send options */
  const FORM = `<div class="card fw">
    <h3>Send us a message</h3>
    <p>Fill in your details and choose how to send them.</p>
    <form class="lead" novalidate autocomplete="on">
      <label for="lf-name">Full name</label>
      <input id="lf-name" name="name" type="text" maxlength="60" placeholder="Your full name" autocomplete="name" required>
      <div class="two">
        <div><label for="lf-phone">Phone number</label>
        <input id="lf-phone" name="phone" type="tel" inputmode="tel" maxlength="20" placeholder="+91 7225880469" autocomplete="tel" required></div>
        <div><label for="lf-email">Email</label>
        <input id="lf-email" name="email" type="email" maxlength="80" placeholder="you@example.com" autocomplete="email" required></div>
      </div>
      <label for="lf-msg">Message</label>
      <textarea id="lf-msg" name="message" rows="4" maxlength="1000" placeholder="Tell us about your project..." required></textarea>
      <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="acts">
        <button type="button" class="act wa" data-via="whatsapp"><span class="ico"><i class="fa-brands fa-whatsapp"></i></span><span class="tx"><b>Send to WhatsApp</b><small>Opens chat instantly</small></span></button>
        <button type="button" class="act team" data-via="team"><span class="ico"><i class="fa-solid fa-users"></i></span><span class="tx"><b>Send to Team</b><small>We reply within 24 hours</small></span></button>
      </div>
      <small class="note"><i class="fa-solid fa-circle-info"></i> WhatsApp opens a chat with your details. Team sends them to us directly. We reply within 24 hours.</small>
    </form>
    <i class="fa-solid fa-paper-plane plane" aria-hidden="true"></i>
  </div>`;

  /* chatbot / form switcher. default = "form" shows the form first, otherwise the chatbot */
  const widget = (def) => {
    const f = def === "form";
    return `<div class="lw">
      <div class="lw-tabs" role="tablist" aria-label="Choose how to contact us">
        <button type="button" role="tab" class="${f ? "" : "on"}" aria-selected="${!f}" data-tab="bot"><i class="fa-solid fa-robot"></i> Chatbot</button>
        <button type="button" role="tab" class="${f ? "on" : ""}" aria-selected="${f}" data-tab="form"><i class="fa-solid fa-envelope"></i> Contact form</button>
      </div>
      <div class="lw-pane" data-pane="bot" ${f ? "hidden" : ""}><div data-chatbot></div></div>
      <div class="lw-pane" data-pane="form" ${f ? "" : "hidden"}>${FORM}</div>
    </div>`;
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("afterbegin", header);
    const f = document.getElementById("site-footer");
    if (f) f.outerHTML = footer;

    document.querySelectorAll("[data-lead-form]").forEach((el) => {
      el.innerHTML = widget(el.dataset.leadForm);
      const tabs = [...el.querySelectorAll(".lw-tabs button")];
      tabs.forEach((b) => {
        b.onclick = () => {
          tabs.forEach((x) => {
            const on = x === b;
            x.classList.toggle("on", on);
            x.setAttribute("aria-selected", on);
          });
          el.querySelectorAll(".lw-pane").forEach(
            (p) => (p.hidden = p.dataset.pane !== b.dataset.tab),
          );
          if (b.dataset.tab === "bot") {
            const log = el.querySelector(".cbot-log");
            if (log) log.scrollTop = log.scrollHeight;
          }
        };
      });
    });

    document.getElementById("yr").textContent = new Date().getFullYear();

    /* mobile menu: slides in from the LEFT */
    const menu = document.getElementById("menu"),
      bg = document.getElementById("burger"),
      scrim = document.getElementById("scrim");
    const setMenu = (on) => {
      bg.classList.toggle("on", on);
      menu.classList.toggle("on", on);
      r.classList.toggle("menu-open", on);
      bg.setAttribute("aria-expanded", on);
    };
    bg.onclick = () => setMenu(!menu.classList.contains("on"));
    menu.onclick = (e) => {
      if (e.target.closest("a") || e.target.closest("#mclose")) setMenu(false);
    };
    scrim.onclick = () => setMenu(false);
    addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
    matchMedia("(min-width:901px)").addEventListener("change", (e) => {
      if (e.matches) setMenu(false);
    });

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
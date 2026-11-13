document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

  const hdr = $("#hdr"),
    prog = $("#prog"),
    tl = $(".tl");
  const onScroll = () => {
    const y = scrollY,
      max = document.documentElement.scrollHeight - innerHeight;
    hdr.classList.toggle("scrolled", y > 30);
    prog.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (!reduce)
      $$("[data-parallax]").forEach(
        (el) =>
          (el.style.transform = `translateY(${y * el.dataset.parallax}px)`),
      );
    if (tl) {
      const b = tl.getBoundingClientRect();
      tl.style.setProperty(
        "--p",
        Math.min(1, Math.max(0, (innerHeight * 0.65 - b.top) / b.height)),
      );
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  window.reveal = (root = document) =>
    $$("[data-a]:not(.in)", root).forEach((el, i) => {
      el.style.setProperty("--dl", (i % 4) * 0.08 + "s");
      io.observe(el);
    });

  /* ---- scroll direction + pop-in cards ----
     scroll down: cards fly in one by one from the LEFT
     scroll up:   cards fly in one by one from the RIGHT */
  let lastY = scrollY,
    dir = 1;
  addEventListener(
    "scroll",
    () => {
      const y = scrollY;
      if (Math.abs(y - lastY) > 2) {
        dir = y > lastY ? 1 : -1;
        lastY = y;
      }
    },
    { passive: true },
  );
  const fio = new IntersectionObserver(
    (es) => {
      const ent = es.filter((e) => e.isIntersecting).map((e) => e.target);
      ent.sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1));
      if (dir < 0) ent.reverse();
      ent.forEach((el, i) => {
        el.style.setProperty("--cd", (i * 0.13).toFixed(2) + "s");
        el.classList.remove("cp-hide", "cp-l", "cp-r");
        void el.offsetWidth;
        el.classList.add(dir > 0 ? "cp-l" : "cp-r");
      });
      es.filter((e) => !e.isIntersecting).forEach((e) => {
        e.target.classList.remove("cp-l", "cp-r");
        e.target.classList.add("cp-hide");
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
  );
  const FLY = ".grid > .card, .stats > .stat, .tl > .it";
  const flown = new WeakSet();
  window.flyCards = (root = document) => {
    if (reduce) return;
    $$(FLY, root).forEach((el) => {
      if (flown.has(el)) return;
      flown.add(el);
      el.removeAttribute("data-a");
      el.classList.add("cp-hide");
      fio.observe(el);
    });
  };

  const home = $("#homeSvc");
  if (home)
    home.innerHTML = SERVICES.slice(0, 3)
      .map(
        (s) =>
          `<a class="card" data-a="up" href="services.html#${s.id}"><div class="ic"><i class="${s.icon}"></i></div><h3>${s.title}</h3><p>${s.summary}</p></a>`,
      )
      .join("");
  if (tl)
    tl.insertAdjacentHTML(
      "beforeend",
      STEPS.map(
        (s, i) =>
          `<div class="it card" data-n="${i + 1}" data-a="right"><h3>${s[0]}</h3><p>${s[1]}</p></div>`,
      ).join(""),
    );
  window.flyCards();
  window.reveal();

  $$("[data-type]").forEach((el) => {
    const w = el.dataset.type.split("|");
    if (reduce) {
      el.textContent = w[0];
      return;
    }
    let i = 0,
      c = 0,
      del = false;
    (function step() {
      const t = w[i];
      c += del ? -1 : 1;
      el.textContent = t.slice(0, c);
      let d = del ? 35 : 80 + Math.random() * 60;
      if (!del && c === t.length) {
        d = 1700;
        del = true;
      } else if (del && c === 0) {
        del = false;
        i = (i + 1) % w.length;
        d = 400;
      }
      setTimeout(step, d);
    })();
  });

  const co = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        const n = +e.target.dataset.count,
          t0 = performance.now();
        (function tick(t) {
          const p = Math.min(1, (t - t0) / 1400);
          e.target.textContent = Math.round(n * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      }),
    { threshold: 0.6 },
  );
  $$("[data-count]").forEach((el) => co.observe(el));

  let tt;
  window.toast = (m, bad) => {
    const t = $("#toast");
    t.textContent = m;
    t.className = "on" + (bad ? " bad" : "");
    clearTimeout(tt);
    tt = setTimeout(() => (t.className = ""), 3800);
  };

  // Phone is valid if it has 7 to 15 digits. +, spaces, ( ) and - are all allowed.
  const phoneOk = (p) => {
    const n = p.replace(/\D/g, "").length;
    return n >= 7 && n <= 15;
  };
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---- contact form: two ways to send ----
     WhatsApp: saves to Google Sheet AND opens WhatsApp with the message
     Team:     saves to Google Sheet only (nothing goes to WhatsApp) */
  $$("form.lead").forEach((form) => {
    const wrap = form.closest(".fw");
    const btns = $$("button[data-via]", form);
    let opened = Date.now();
    let busy = false;

    // Phone box: allow only + digits spaces ( ) and -
    const ph = form.elements.phone;
    if (ph)
      ph.addEventListener("input", () => {
        const clean = ph.value.replace(/[^0-9+\s()\-]/g, "");
        if (clean !== ph.value) ph.value = clean;
      });

    const service = new URLSearchParams(location.search).get("service");
    if (service && form.elements.message && !form.elements.message.value) {
      form.elements.message.value = `I am interested in: ${service}.\n`;
    }

    const send = async (via, btn) => {
      if (busy) return;

      const d = Object.fromEntries(new FormData(form));
      if (d.website) return; // honeypot

      const name = (d.name || "").trim();
      const phone = (d.phone || "").trim();
      const email = (d.email || "").trim();
      const message = (d.message || "").trim();

      if (name.length < 2) return toast("Please enter your full name.", 1);
      if (!phoneOk(phone))
        return toast("Please enter a valid phone number.", 1);
      if (!EMAIL_RE.test(email)) return toast("Please enter a valid email.", 1);
      if (message.length < 5) return toast("Please write a short message.", 1);

      const api = typeof CFG !== "undefined" ? CFG.SHEET_API : "";
      if (!api.startsWith("http"))
        return toast(
          "Form is not connected yet. Add the Web App URL in js/config.js.",
          1,
        );

      const wa = via === "whatsapp";
      const waNum =
        (typeof CFG !== "undefined" && CFG.WHATSAPP) || "917225880469";
      const waText =
        `Hello Info Tech Fly,\n\n` +
        `*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}\n\n*Message:*\n${message}`;
      const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(waText)}`;

      // open the WhatsApp tab right now (inside the click) so browsers do not block it
      let win = null;
      if (wa) {
        win = window.open("", "_blank");
        try {
          if (win)
            win.document.write(
              '<p style="font:16px system-ui;padding:2rem">Opening WhatsApp...</p>',
            );
        } catch (e) {}
      }

      busy = true;
      btns.forEach((b) => (b.disabled = true));
      const old = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), wa ? 10000 : 20000);
      let saved = true,
        errMsg = "";

      try {
        const res = await fetch(api, {
          method: "POST",
          body: new URLSearchParams({
            name,
            phone,
            email,
            message,
            via: wa ? "WhatsApp" : "Team",
            website: "",
            t: Date.now() - opened,
          }),
          signal: ctrl.signal,
        });
        const out = await res.json();
        if (out.status !== "success")
          throw new Error(out.message || "Could not send. Please try again.");
      } catch (err) {
        saved = false;
        const offline = err.name === "AbortError" || err instanceof TypeError;
        errMsg = offline
          ? "Could not send. Please check your connection and try again."
          : err.message;
      } finally {
        clearTimeout(timer);
      }

      // WhatsApp always opens, so the visitor never loses their message
      if (wa) {
        if (win && !win.closed) win.location.href = waUrl;
        else window.location.href = waUrl;
      }

      if (saved || wa) {
        if (wrap) {
          wrap.classList.remove("fly");
          void wrap.offsetWidth;
          wrap.classList.add("fly");
        }
        form.reset();
        opened = Date.now();
      }

      if (saved)
        toast(
          wa
            ? "Thank you! Opening WhatsApp..."
            : "Thank you! Your message was sent to our team.",
        );
      else if (wa)
        toast("WhatsApp opened, but we could not save to our sheet. " + errMsg, 1);
      else toast(errMsg, 1);

      busy = false;
      btns.forEach((b) => (b.disabled = false));
      btn.innerHTML = old;
    };

    btns.forEach((b) => b.addEventListener("click", () => send(b.dataset.via, b)));
    form.addEventListener("submit", (e) => e.preventDefault());
  });
});
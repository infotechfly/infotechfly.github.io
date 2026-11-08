(() => {
  const CONTACT = {
    phone: "+91 7225880469",
    email: "contactinfotechfly@gmail.com",
    location: "India (Remote)",
    website: "www.infotechfly.com",
    social: [
      ["YouTube", "https://www.youtube.com/@InfoTechFly"],
      ["Instagram", "https://www.instagram.com/infotechfly/"],
      ["Telegram", "https://t.me/infotechfly"],
      ["LinkedIn", "https://www.linkedin.com/company/infotechfly/"],
      ["GitHub", "https://github.com/infotechfly"],
    ],
  };

  const KB = {
    about: {
      keys: ["about", "infotechfly", "info tech fly", "company", "who are you", "mission", "vision", "why choose"],
      text: "Info Tech Fly creates free online tools and builds websites, apps and cloud setups. Our mission is fast, reliable digital tools with no hassle. Every project is mobile friendly, fast and protected with HTTPS. We are privacy friendly and give quick support on WhatsApp.",
    },
    process: {
      keys: ["process", "how it works", "how do you work", "steps", "timeline"],
      text: "How it works: 1) Tell us your idea. 2) Get a plan and quote. 3) We build it, with updates along the way. 4) We launch, connect your domain and stay on call.",
    },
    price: {
      keys: ["price", "pricing", "cost", "quote", "charge", "rate", "how much", "budget"],
      text: "We share a clear quote (scope, timeline and cost) before we start. Choose “Contact the team” and tell us your idea. We reply within 24 hours.",
    },
    reply: {
      keys: ["reply", "response time", "how long", "24 hours"],
      text: "We reply within 24 hours.",
    },
    tech: {
      keys: ["technology", "technologies", "tech stack", "stack", "tools you use", "python", "react", "node", "flask", "php", "docker", "aws"],
      text: "Our tech stack: HTML5, CSS3, JavaScript, Node.js, Python, Flask, PHP, WordPress, React, MySQL / MongoDB, AWS, Docker, Git & GitHub, Linux, Vercel / Netlify, and SSL & security tools.",
    },
    hello: {
      keys: ["hi", "hello", "hey", "good morning", "good evening", "namaste"],
      text: "Hello! How can I help you today?",
    },
    thanks: {
      keys: ["thanks", "thank you", "thx", "ok thanks"],
      text: "You’re welcome! Anything else I can help with?",
    },
    bye: {
      keys: ["bye", "goodbye", "see you"],
      text: "Bye! Have a great day. We are here whenever you need us.",
    },
  };

  /* Service keywords: key -> service id in data.js */
  const SVC_KEYS = {
    static: ["static", "portfolio", "landing page", "html", "small business", "simple website"],
    dynamic: ["dynamic", "database", "full-stack", "full stack", "admin panel", "sign in", "login", "dashboard"],
    wordpress: ["wordpress", "wp", "woocommerce", "cms", "online store", "shop"],
    apps: ["app", "apps", "software", "desktop", "application", "automation"],
    deploy: ["deploy", "deployment", "hosting", "host", "server", "cloud", "domain", "ssl", "ci/cd", "vercel", "netlify"],
    security: ["security", "secure", "malware", "backup", "hacked", "maintenance", "update", "virus"],
  };
  const SVC_LIST_KEYS = ["services", "service", "what do you do", "what you offer", "offer", "web development", "web devlopment", "web dev", "website", "websites", "development"];
  const CONTACT_INFO_KEYS = ["contact detail", "contact details", "contact info", "phone", "number", "call", "email", "mail", "instagram", "insta", "social", "youtube", "telegram", "linkedin", "github", "address", "location", "whatsapp", "where are you"];
  const TEAM_KEYS = ["contact team", "contact the team", "talk to team", "talk to someone", "get quote", "request quote", "hire", "start project", "my project", "i want a website", "i need a website"];

  /* ---------- helpers ---------- */
  const norm = (s) => " " + s.toLowerCase().replace(/[^a-z0-9/+ ]+/g, " ").replace(/\s+/g, " ").trim() + " ";
  const hit = (text, keys) => keys.some((k) => text.includes(" " + k.toLowerCase() + " ") || (k.length > 4 && text.includes(k.toLowerCase())));
  const phoneOk = (p) => { const n = p.replace(/\D/g, "").length; return n >= 7 && n <= 15; };
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const svcById = (id) => (typeof SERVICES !== "undefined" ? SERVICES.find((s) => s.id === id) : null);

  /* ---------- styles ---------- */
  const css = `
.cbot{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;display:flex;flex-direction:column;text-align:left}
.cbot-h{display:flex;align-items:center;gap:.75rem;padding:.9rem 1.1rem;background:linear-gradient(135deg,var(--navy),var(--navy-d));color:#fff}
.cbot-h i{font-size:1.3rem;color:var(--sky)}
.cbot-h b{display:block;font-size:1rem;line-height:1.2}
.cbot-h small{opacity:.8;font-size:.78rem}
.cbot-log{height:420px;max-height:62vh;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.6rem;background:var(--bg2);scroll-behavior:smooth}
.cbot-m{max-width:86%;padding:.6rem .9rem;border-radius:16px;font-size:.93rem;line-height:1.5;white-space:pre-line;word-wrap:break-word;overflow-wrap:anywhere;animation:cbIn .25s ease both}
.cbot-m.bot{align-self:flex-start;background:var(--card);color:var(--tx);border:1px solid var(--bd);border-bottom-left-radius:4px}
.cbot-m.me{align-self:flex-end;background:var(--navy);color:#fff;border-bottom-right-radius:4px}
[data-theme=dark] .cbot-m.me{background:var(--sky-d);color:#06121f}
.cbot-m a{color:var(--sky-d);font-weight:600;text-decoration:underline}
.cbot-m ul{margin:.3rem 0 0;padding-left:1.1rem}
.cbot-typing{display:inline-flex;gap:4px;align-items:center;padding:.75rem .9rem}
.cbot-typing i{width:7px;height:7px;border-radius:50%;background:var(--mu);animation:cbDot 1s infinite ease-in-out}
.cbot-typing i:nth-child(2){animation-delay:.15s}.cbot-typing i:nth-child(3){animation-delay:.3s}
.cbot-q{display:flex;flex-wrap:wrap;gap:.45rem;align-self:flex-start;max-width:100%}
.cbot-q button{font:inherit;font-size:.85rem;font-weight:500;padding:.42rem .85rem;border-radius:999px;border:1.5px solid var(--sky-d);background:var(--card);color:var(--hc);cursor:pointer;transition:var(--t)}
.cbot-q button:hover,.cbot-q button:focus-visible{background:var(--sky-d);color:#fff;outline:none}
.cbot-f{display:flex;gap:.5rem;padding:.7rem;border-top:1px solid var(--bd);background:var(--card)}
.cbot-f input{flex:1;min-width:0;font:inherit;padding:.65rem .9rem;border:1.5px solid var(--bd);border-radius:999px;background:var(--bg);color:var(--tx)}
.cbot-f input:focus{outline:none;border-color:var(--sky-d)}
.cbot-f button{width:44px;height:44px;border:0;border-radius:50%;background:var(--navy);color:#fff;cursor:pointer;flex:none}
[data-theme=dark] .cbot-f button{background:var(--sky-d);color:#06121f}
.cbot-f button:disabled,.cbot-f input:disabled{opacity:.55;cursor:not-allowed}
@keyframes cbIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes cbDot{0%,80%,100%{transform:scale(.6);opacity:.5}40%{transform:scale(1);opacity:1}}
@media(prefers-reduced-motion:reduce){.cbot-m,.cbot-typing i{animation:none}.cbot-log{scroll-behavior:auto}}
`;
  const st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- chatbot ---------- */
  function init(root) {
    root.classList.add("cbot");
    root.innerHTML = `<div class="cbot-h"><i class="fa-solid fa-robot"></i><div><b>Info Tech Fly Assistant</b><small>Online. We reply within 24 hours.</small></div></div>
      <div class="cbot-log" role="log" aria-live="polite"></div>
      <form class="cbot-f" autocomplete="off"><input type="text" maxlength="1000" placeholder="Type your message..." aria-label="Type your message"><button type="submit" aria-label="Send"><i class="fa-solid fa-paper-plane"></i></button></form>`;
    const log = root.querySelector(".cbot-log"),
      form = root.querySelector("form"),
      input = form.querySelector("input"),
      sendBtn = form.querySelector("button");

    const lead = { name: "", phone: "", email: "", message: "" };
    let step = "askName"; // askName | askHow | menu | l_name | l_phone | l_email | l_msg | sending
    let userName = "";
    let opened = Date.now();

    const scroll = () => (log.scrollTop = log.scrollHeight);
    const clearChips = () => log.querySelectorAll(".cbot-q").forEach((n) => n.remove());

    const addMsg = (who, content, html) => {
      const d = document.createElement("div");
      d.className = "cbot-m " + who;
      if (html) d.innerHTML = content; else d.textContent = content;
      log.appendChild(d);
      scroll();
      return d;
    };
    const chips = (list) => {
      const w = document.createElement("div");
      w.className = "cbot-q";
      list.forEach(([label, value]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.onclick = () => handle(value || label, label);
        w.appendChild(b);
      });
      log.appendChild(w);
      scroll();
    };
    const MENU = [["Contact the team", "contact team"], ["Our services", "services"], ["About Info Tech Fly", "about"], ["Contact details", "contact details"]];

    // bot says one or more things, with a short typing delay
    const say = (parts, after) => {
      const list = Array.isArray(parts) ? parts : [parts];
      input.disabled = true;
      sendBtn.disabled = true;
      let i = 0;
      const next = () => {
        if (i >= list.length) {
          input.disabled = step === "sending";
          sendBtn.disabled = step === "sending";
          if (!input.disabled) input.focus({ preventScroll: true });
          if (after) after();
          return;
        }
        const tp = document.createElement("div");
        tp.className = "cbot-m bot cbot-typing";
        tp.innerHTML = "<i></i><i></i><i></i>";
        log.appendChild(tp);
        scroll();
        setTimeout(() => {
          tp.remove();
          const item = list[i++];
          if (typeof item === "object") addMsg("bot", item.html, true); else addMsg("bot", item);
          next();
        }, 450);
      };
      next();
    };

    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

    const contactHtml = () =>
      `Here are our contact details:<ul>
<li>Phone: <a href="tel:${CONTACT.phone.replace(/\s/g, "")}">${CONTACT.phone}</a></li>
<li>Email: <a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li>
<li>Location: ${CONTACT.location}</li>
<li>Website: ${CONTACT.website}</li>
${CONTACT.social.map(([n, u]) => `<li>${n}: <a href="${u}" target="_blank" rel="noopener">${u.replace("https://", "")}</a></li>`).join("")}</ul>`;

    const serviceListHtml = () => {
      if (typeof SERVICES === "undefined") return "We build websites, apps, hosting and security. Ask me about any of them.";
      return `We offer these services. Tap one to learn more:<ul>${SERVICES.filter((s) => s.id !== "notsure").map((s) => `<li>${esc(s.title)}: ${esc(s.summary)}</li>`).join("")}</ul>`;
    };
    const serviceChips = () => (typeof SERVICES === "undefined" ? [] : SERVICES.filter((s) => s.id !== "notsure").map((s) => [s.title, "svc:" + s.id]));

    const serviceHtml = (s) =>
      `<b>${esc(s.title)}</b> (${esc(s.tag)})\n${esc(s.summary)}\n\n${esc(s.pagesTitle)}:<ul>${s.pages.map((p) => `<li>${esc(p[1])}: ${esc(p[2])}</li>`).join("")}</ul>` +
      (s.perks.length ? `\nAlso included: ${s.perks.map(esc).join(", ")}.` : "") +
      (s.addons && s.addons.length ? `\nAdd-ons: ${s.addons.map(esc).join(", ")}.` : "");

    const backToMenu = (text) => {
      step = "menu";
      say(text || "Anything else I can help with?", () => chips(MENU));
    };

    const startLead = () => {
      step = "l_name";
      say(["Great! I will pass your details to our team. You can type “cancel” any time.", "1) What is your full name?"], () => {
        if (userName) chips([[`Use “${userName}”`, "__usename"]]);
      });
    };

    const submitLead = async () => {
      step = "sending";
      input.disabled = true;
      sendBtn.disabled = true;
      const api = typeof CFG !== "undefined" ? CFG.SHEET_API : "";
      if (!api || !api.startsWith("http")) {
        step = "menu";
        say("The chat is not connected yet. Please add the Web App URL in js/config.js.", () => chips(MENU));
        return;
      }
      const wait = addMsg("bot", "Sending your message...");
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000);
      try {
        const res = await fetch(api, {
          method: "POST",
          body: new URLSearchParams({ name: lead.name, phone: lead.phone, email: lead.email, message: lead.message, website: "", t: Date.now() - opened }),
          signal: ctrl.signal,
        });
        const out = await res.json();
        if (out.status !== "success") throw new Error(out.message || "Could not send.");
        wait.remove();
        opened = Date.now();
        Object.keys(lead).forEach((k) => (lead[k] = ""));
        step = "menu";
        say([`Thank you${userName ? ", " + userName : ""}! Your message was sent. Our team will reply within 24 hours.`], () => chips(MENU));
      } catch (err) {
        wait.remove();
        const offline = err.name === "AbortError" || err instanceof TypeError;
        step = "l_retry";
        say(offline ? "Could not send. Please check your connection." : "Sorry, something went wrong: " + err.message, () => chips([["Try again", "__retry"], ["Cancel", "cancel"]]));
      } finally {
        clearTimeout(timer);
        if (step !== "sending") { input.disabled = false; sendBtn.disabled = false; }
      }
    };

    // find the best answer for free text (key -> value lookup)
    const answer = (raw) => {
      const t = norm(raw);
      if (hit(t, TEAM_KEYS)) return { go: "lead" };
      if (hit(t, CONTACT_INFO_KEYS)) return { html: contactHtml() };
      for (const id in SVC_KEYS) {
        if (hit(t, SVC_KEYS[id])) { const s = svcById(id); if (s) return { html: serviceHtml(s), chips: [["Request a quote", "contact team"], ["Other services", "services"]] }; }
      }
      if (hit(t, SVC_LIST_KEYS)) return { html: serviceListHtml(), chips: serviceChips() };
      for (const k in KB) if (hit(t, KB[k].keys)) return { text: KB[k].text };
      return null;
    };

    const handle = (value, label) => {
      clearChips();
      const shown = label || value;
      if (value === "__usename" || value === "__retry" || value.startsWith("svc:") || ["contact team", "services", "about", "contact details", "cancel"].includes(value))
        addMsg("me", shown);
      else addMsg("me", value);
      const v = value.trim();
      if (!v) return;

      // cancel inside lead flow
      if (step.startsWith("l_") && /^(cancel|stop|exit|back)$/i.test(v)) {
        Object.keys(lead).forEach((k) => (lead[k] = ""));
        return backToMenu("No problem, I cancelled that. What would you like to do?");
      }

      switch (step) {
        case "askName": {
          userName = v.replace(/^(my name is|i am|i'm|this is|me)\s+/i, "").trim().slice(0, 40);
          if (userName.length < 2) return say("Please tell me your name so I can address you.");
          userName = userName.replace(/\b\w/g, (c) => c.toUpperCase());
          step = "askHow";
          return say(`Nice to meet you, ${userName}! How are you today?`);
        }
        case "askHow": {
          step = "menu";
          return say(["Glad to chat with you!", "What would you like to do?"], () => chips(MENU));
        }
        case "l_name": {
          const nm = v === "__usename" ? userName : v;
          if (nm.length < 2) return say("Please enter your full name.");
          lead.name = nm.slice(0, 60);
          step = "l_phone";
          return say(`Thanks, ${lead.name}. 2) What is your phone number?`);
        }
        case "l_phone": {
          if (!phoneOk(v)) return say("That phone number does not look right. Use 7 to 15 digits, for example +91 7225880469.");
          lead.phone = v.replace(/[^0-9+\s()\-]/g, "").slice(0, 20);
          step = "l_email";
          return say("3) What is your email address?");
        }
        case "l_email": {
          if (!EMAIL_RE.test(v)) return say("Please enter a valid email, like you@example.com.");
          lead.email = v.slice(0, 80);
          step = "l_msg";
          return say("4) Last one: what would you like to tell our team?");
        }
        case "l_msg": {
          if (v.length < 5) return say("Please write a short message (at least 5 characters).");
          lead.message = v.slice(0, 1000);
          return submitLead();
        }
        case "l_retry": {
          if (v === "__retry") return submitLead();
          return backToMenu("What would you like to do?");
        }
        default: {
          // menu / free chat
          if (v.startsWith("svc:")) {
            const s = svcById(v.slice(4));
            if (s) return say({ html: serviceHtml(s) }, () => chips([["Request a quote", "contact team"], ["Other services", "services"], ["Main menu", "menu"]]));
          }
          if (v === "menu") return backToMenu("What would you like to do?");
          const a = answer(v);
          if (!a) return say("Sorry, I did not understand that. Please choose an option below or ask about our services, pricing or contact details.", () => chips(MENU));
          if (a.go === "lead") return startLead();
          return say(a.html ? { html: a.html } : a.text, () => chips(a.chips || MENU));
        }
      }
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!v || input.disabled) return;
      input.value = "";
      handle(v);
    });

    say(["Hi! I am the Info Tech Fly assistant.", "What is your name?"]);
  }

  document.addEventListener("DOMContentLoaded", () => document.querySelectorAll("[data-chatbot]").forEach(init));
})();
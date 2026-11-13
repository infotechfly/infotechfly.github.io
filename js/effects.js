(() => {
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const page = ((location.pathname.split('/').pop() || 'index').toLowerCase()).replace(/\.html$/, '') || 'index';

  /* one message per <section> inside <main>, in order */
  const SAY = {
    index: [
      'Welcome to Info Tech Fly! We build websites, apps and cloud setups.',
      'These are our services. Tap any card to see what is included.',
      'Who we are: simple, fast and secure by default.',
      'Chat with our bot or use the contact form. We reply within 24 hours.'
    ],
    about: [
      'About us: we help people and businesses work smarter.',
      'Our mission, our vision and why people choose us.',
      'This is how we work, from first idea to launch.',
      'Have a project in mind? Tap Contact us.'
    ],
    services: [
      'Our services cover websites, apps, hosting and security.',
      'Tap any card for the pages, features and technology you get.',
      'These are the tools we build with.',
      'Four simple steps from idea to launch. Ask for a quote!'
    ],
    contact: [
      'Contact us! Fill in the form and we will get back to you.',
      'Send your message here. We reply within 24 hours.'
    ]
  };
  const HELLO = {
    index: 'Hi! I am your Fly developer. Scroll down and I will show you around.',
    about: 'This is the About page. Meet the team behind Info Tech Fly.',
    services: 'Welcome to Services! Tap any card for full details.',
    contact: 'This is the Contact page. Send us a message anytime.'
  };

  /* developer with laptop (160x140). Used in the loader and as the site guide */
  const DEV = `<g class="dv">
    <path d="M40 140c0-30 18-44 40-44s40 14 40 44z" fill="#1e3a5f"/>
    <rect x="70" y="72" width="20" height="14" rx="6" fill="#e8b98f"/>
    <circle cx="80" cy="54" r="24" fill="#f1c9a5"/>
    <path d="M56 52a24 24 0 0 1 48 0c-6-10-14-14-24-14s-18 4-24 14z" fill="#152840"/>
    <path d="M55 56a25 25 0 0 1 50 0" fill="none" stroke="#5bb5d6" stroke-width="4"/>
    <rect x="50" y="52" width="8" height="15" rx="4" fill="#5bb5d6"/><rect x="102" y="52" width="8" height="15" rx="4" fill="#5bb5d6"/>
    <path d="M54 65q0 12 14 13" fill="none" stroke="#5bb5d6" stroke-width="2.5"/>
    <g class="ey"><circle cx="71" cy="56" r="2.6" fill="#152840"/><circle cx="89" cy="56" r="2.6" fill="#152840"/></g>
    <ellipse class="mo" cx="80" cy="68" rx="5.5" ry="3" fill="#9b4d3a"/>
    <path d="M44 84h72l6 30H38z" fill="#152840" stroke="#5bb5d6" stroke-width="3" stroke-linejoin="round"/>
    <rect class="cl" x="52" y="91" width="34" height="3.5" rx="1.7" fill="#87ceeb"/>
    <rect class="cl" x="58" y="98" width="46" height="3.5" rx="1.7" fill="#10b981" style="animation-delay:-.5s"/>
    <rect class="cl" x="52" y="105" width="28" height="3.5" rx="1.7" fill="#87ceeb" style="animation-delay:-.9s"/>
    <rect x="30" y="114" width="100" height="8" rx="4" fill="#cbd9e8"/>
    <circle class="hd" cx="66" cy="113" r="5" fill="#f1c9a5"/><circle class="hd" cx="94" cy="113" r="5" fill="#f1c9a5"/>
  </g>`;
  const GUIDE_SVG = `<svg viewBox="0 0 160 140" id="dev" role="button" tabindex="0" aria-label="Fly developer: click to mute or unmute">${DEV}</svg>`;

  /* loader scene: server racks, glowing wires with data packets, developer */
  const scene = () => {
    let o = `<defs>
      <linearGradient id="svg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f3d63"/><stop offset="1" stop-color="#0f2239"/></linearGradient>
      <filter id="gl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
    for (let i = 0; i < 3; i++) for (let sd = 0; sd < 2; sd++) {
      const y = 70 + i * 38, wy = y + 17, x = sd ? 342 : 14, sx = sd ? 342 : 78, ex = sd ? 262 : 158, c = sd ? 305 : 115;
      const p = `M${sx} ${wy}C${c} ${wy},${c} 205,${ex} 205`;
      const dur = (1.7 + i * .3).toFixed(1), dl = (i * .4 + sd * .2).toFixed(1);
      o += `<path d="${p}" fill="none" stroke="#24405f" stroke-width="4" stroke-linecap="round"/>
        <path class="wire" d="${p}" fill="none" stroke="#5bb5d6" stroke-width="1.8" stroke-linecap="round"/>
        <circle r="3.2" fill="#87ceeb" filter="url(#gl)"><animateMotion dur="${dur}s" repeatCount="indefinite" path="${p}"/></circle>
        <circle r="2.4" fill="#10b981" filter="url(#gl)"><animateMotion dur="${dur}s" begin="-${(dur / 2).toFixed(2)}s" repeatCount="indefinite" path="${p}"/></circle>
        <circle cx="${sx}" cy="${wy}" r="3.2" fill="#5bb5d6"/><circle cx="${ex}" cy="205" r="3.6" fill="#5bb5d6" filter="url(#gl)"/>
        <rect x="${x}" y="${y}" width="64" height="34" rx="6" fill="url(#svg1)" stroke="#5bb5d6" stroke-width="1.6"/>
        <rect x="${x + 8}" y="${y + 8}" width="34" height="4" rx="2" fill="#24405f"/>
        <rect class="sv-bar" x="${x + 8}" y="${y + 8}" width="34" height="4" rx="2" fill="#87ceeb" style="animation-delay:-${dl}s"/>
        <rect x="${x + 8}" y="${y + 21}" width="34" height="4" rx="2" fill="#24405f"/>
        <rect class="sv-bar" x="${x + 8}" y="${y + 21}" width="34" height="4" rx="2" fill="#10b981" style="animation-delay:-${(+dl + .6).toFixed(1)}s"/>
        <circle class="led" cx="${x + 52}" cy="${y + 10}" r="2.6" fill="#10b981" style="animation-delay:-${dl}s"/>
        <circle class="led" cx="${x + 52}" cy="${y + 24}" r="2.6" fill="#87ceeb" style="animation-delay:-${(+dl + .5).toFixed(1)}s"/>`;
    }
    return `<svg viewBox="0 0 420 240" aria-hidden="true">${o}<rect x="100" y="228" width="220" height="6" rx="3" fill="#24405f"/><g transform="translate(130 90)">${DEV}</g></svg>`;
  };
  const LOADER = `<div id="loader" aria-hidden="true"><div class="door"></div><div class="door"></div>
    <div class="mid"><div class="lg"><i class="fa-solid fa-paper-plane"></i><img src="img/Logo.png" alt="" onerror="this.remove()"></div>
    <div class="nm">INFO TECH FLY</div>
    <div class="sc" id="lsc"><div class="say" id="lsay"></div>${scene()}</div>
    <div class="pb"><s></s></div></div></div>`;

  /* hide sections before the loader opens, so the slide-in plays when the site appears */
  /* sections that hold card grids are skipped: their cards animate one by one instead (see main.js flyCards) */
  const secs = () => [...document.querySelectorAll('main > section, .ftr')]
    .filter(el => !el.querySelector('.grid, .tl'));

  /* welcome loader shows ONE time per browser tab.
     sessionStorage is per tab: a new tab (or a closed and reopened tab) shows it again,
     moving between pages or refreshing inside the same tab does not. */
  const KEY = 'itf_welcomed';
  let seen = false;
  try { seen = sessionStorage.getItem(KEY) === '1'; } catch (e) {}

  document.addEventListener('DOMContentLoaded', () => {
    const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const body = document.body;
    if (!reduce) secs().forEach(el => el.classList.add('sx', 'fl'));

    /* ticker under the home hero */
    const hero = $('.hero');
    if (hero) {
      const w = ['WEBSITES', 'APPS', 'CLOUD HOSTING', 'SECURITY', 'WORDPRESS', 'PYTHON', 'REACT', 'AWS', 'DOCKER', 'FREE TOOLS'].map(t => `<span>◆ ${t}</span>`).join('');
      hero.insertAdjacentHTML('afterend', `<div class="tick" aria-hidden="true"><div>${w + w}</div></div>`);
    }

    body.insertAdjacentHTML('beforeend', `<div id="glow" aria-hidden="true"></div><button class="ib" id="top" aria-label="Back to top"><i class="fa-solid fa-arrow-up"></i></button><div id="guide"><div id="bub" class="hide" role="status" aria-live="polite"></div>${GUIDE_SVG}</div>`);

    /* cursor glow + back to top */
    const glow = $('#glow'), top = $('#top');
    if (matchMedia('(hover:hover)').matches)
      addEventListener('pointermove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }, { passive: true });
    addEventListener('scroll', () => top.classList.toggle('show', scrollY > 500), { passive: true });
    top.onclick = () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });

    /* 3D tilt on glass cards */
    if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce)
      $$('.card:not(.svc):not(.tech):not(.fw):not(.it)').forEach(c => {
        c.addEventListener('pointermove', e => {
          const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
          c.style.transitionDelay = '0s';
          c.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
        });
        c.addEventListener('pointerleave', () => c.style.transform = '');
      });

    /* developer guide */
    const guide = $('#guide'), bub = $('#bub');
    let tk = 0, muted = false, last = null, ready = false;
    const type = (t, sp = 22) => {
      const id = ++tk; bub.textContent = ''; guide.classList.add('talk'); let i = 0;
      (function s() {
        if (id !== tk) return;
        bub.textContent = t.slice(0, ++i);
        if (i < t.length) setTimeout(s, sp); else guide.classList.remove('talk');
      })();
    };
    const say = t => {
      if (muted || !t || t === last) return;
      last = t; bub.classList.remove('hide');
      if (reduce) bub.textContent = '👨‍💻 ' + t; else type('👨‍💻 ' + t);
    };
    const toggle = () => {
      muted = !muted; bub.classList.toggle('hide', muted); guide.classList.remove('talk');
      if (!muted) { last = null; say('I am back! Keep scrolling and I will guide you.'); }
    };
    $('#dev').onclick = toggle;
    $('#dev').onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } };
    const msgs = SAY[page] || [];
    const rio = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && ready && say(e.target.dataset.say)), { rootMargin: '-40% 0px -40% 0px' });
    $$('main > section').forEach((s, i) => { if (msgs[i]) { s.dataset.say = msgs[i]; rio.observe(s); } });

    /* scroll slide: scrolling down = sections enter left to right,
       scrolling up = sections enter right to left */
    const initScroll = () => {
      if (reduce) return;
      const io = new IntersectionObserver(es => es.forEach(e => {
        const t = e.target;
        if (e.isIntersecting) { t.classList.remove('fl', 'fr'); t.classList.add('in'); }
        else { t.classList.remove('in'); t.classList.add(e.boundingClientRect.top > 0 ? 'fl' : 'fr'); }
      }), { threshold: .08, rootMargin: '0px 0px -6% 0px' });
      secs().forEach(el => io.observe(el));
    };

    /* loader: logo, developer working with servers, "Welcome", then the site opens (once per tab) */
    const start = () => { ready = true; say(HELLO[page] || HELLO.index); initScroll(); };
    if (reduce || seen) { start(); return; }   /* same tab, already welcomed: open the page directly */
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    body.insertAdjacentHTML('afterbegin', LOADER);
    body.style.overflow = 'hidden';
    const L = $('#loader'), sy = $('#lsay'), sc = $('#lsc');
    let done = false;
    const open = () => {
      if (done) return; done = true;
      L.classList.add('open'); body.style.overflow = '';
      setTimeout(() => { L.remove(); start(); }, 1000);
    };
    setTimeout(() => { sy.textContent = 'Welcome to Info Tech Fly!'; sy.classList.add('on'); sc.classList.add('talk'); }, 2300);
    setTimeout(() => sc.classList.remove('talk'), 4000);
    setTimeout(open, 4600);
    L.onclick = open; /* click to skip */
  });
})();
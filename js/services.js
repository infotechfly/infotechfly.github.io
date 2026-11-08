document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const chip = k => `<span class="tc"><i class="${TECH[k][0]}"></i>${TECH[k][1]}</span>`;

  $('#svcGrid').innerHTML = SERVICES.map(s => `<article class="card svc" id="${s.id}" data-a="up" data-id="${s.id}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="${s.title}: show more details">
    <div class="media"><img src="img/${s.img}" alt="${s.title}" loading="lazy" onerror="this.remove()"><span class="peek"><i class="fa-solid fa-expand"></i></span></div>
    <div class="sb"><span class="tag">${s.tag}</span><h3>${s.title}</h3><p>${s.summary}</p><div class="chips">${s.tech.slice(0, 4).map(chip).join('')}</div>
    <span class="more">Show more details <i class="fa-solid fa-arrow-right"></i></span></div></article>`).join('');
  const items = Object.values(TECH).map(([i, n, u]) => `<div class="card tech"><i class="${i}"></i><h4>${n}</h4><p>${u}</p></div>`).join('');
  $('#techRow').innerHTML = items + items;
  $('#steps').innerHTML = STEPS.map((s, i) => `<div class="card" data-a="up"><div class="ic">${i + 1}</div><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('');
  window.reveal();

  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches)
    document.querySelectorAll('.svc').forEach(c => {
      c.addEventListener('mousemove', e => { const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5; c.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-8px)`; });
      c.addEventListener('mouseleave', () => c.style.transform = '');
    });

  const m = $('#svcModal');
  let cur = 0, opener = null;
  const fill = i => {
    cur = (i + SERVICES.length) % SERVICES.length;
    const s = SERVICES[cur];
    const img = $('#mImg') || m.querySelector('.mside').insertAdjacentElement('afterbegin', Object.assign(document.createElement('img'), { id: 'mImg', alt: '' }));
    img.onerror = () => img.remove(); img.alt = s.title; img.src = 'img/' + s.img;
    img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
    $('#mTag').textContent = s.tag; $('#mTitle').textContent = s.title; $('#mSum').textContent = s.summary;
    $('#mPT').textContent = s.pagesTitle;
    $('#mPages').innerHTML = s.pages.map(([ic, t, d], n) => `<li style="--i:${n}"><i class="fa-solid fa-${ic}"></i><div><strong>${t}</strong><span>${d}</span></div></li>`).join('');
    $('#mPerks').innerHTML = s.perks.map(p => `<li><i class="fa-solid fa-circle-check"></i>${p}</li>`).join('');
    $('#mPerkBox').hidden = !s.perks.length;
    $('#mTech').innerHTML = s.tech.map(chip).join('');
    $('#mCount').textContent = `${cur + 1} / ${SERVICES.length}`;
    $('#mQuote').href = 'contact.html?service=' + encodeURIComponent(s.title);
    m.querySelector('.mmain').scrollTop = 0; m.querySelector('.mgrid').scrollTop = 0;
    history.replaceState(null, '', '#' + s.id);
  };
  const open = id => { const i = SERVICES.findIndex(x => x.id === id); if (i < 0 || m.open) return; fill(i); m.showModal(); };

  const g = $('#svcGrid');
  g.addEventListener('click', e => { const c = e.target.closest('.svc'); if (c) { opener = c; open(c.dataset.id); } });
  g.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.svc')) { e.preventDefault(); opener = e.target; open(e.target.dataset.id); } });
  m.addEventListener('click', e => {
    if (e.target === m || e.target.closest('[data-close]')) return m.close();
    const n = e.target.closest('[data-nav]'); if (n) fill(cur + +n.dataset.nav);
  });
  m.addEventListener('keydown', e => { if (e.key === 'ArrowRight') fill(cur + 1); if (e.key === 'ArrowLeft') fill(cur - 1); });
  m.addEventListener('close', () => { history.replaceState(null, '', location.pathname); if (opener) opener.focus({ preventScroll: true }); });
  if (location.hash.length > 1) setTimeout(() => open(location.hash.slice(1)), 500);
});
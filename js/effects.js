// Scroll reveals, countdown, programme thread, candlelight ripples, gallery viewer, butterfly flight, logo intro.
import { WEDDING as W } from './wedding.js';
import { SVG } from './svg.js';
import { num } from './i18n.js';

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initReveals() {
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .14, rootMargin: '0px 0px -6% 0px' });
  $$('[data-r],.arch,.mapframe,.person .frame,.gal button,.mask').forEach(el => io.observe(el));
}

/* ---- name logo: names reveal left to right, flourish draws, heart pops, butterfly flies in ---- */
export function playLogo(el) {
  if (!el || !el.classList.contains('pre')) return;
  const q = (s) => el.querySelector(s);
  const reveal = (n, d) => n.animate([{ clipPath: 'inset(-40% 110% -40% -10%)' }, { clipPath: 'inset(-40% -10% -40% -10%)' }], { duration: 1100, delay: d, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'both' });
  const anims = [
    q('.nl-crest').animate([{ opacity: 0, transform: 'translateY(8px) scale(.9)' }, { opacity: 1, transform: 'none' }], { duration: 900, easing: 'ease-out', fill: 'both' }),
    reveal(q('.g'), 250), reveal(q('.b'), 900),
    q('.nl-flo path').animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1200, delay: 700, easing: 'ease-in-out', fill: 'both' }),
    q('.nl-heart').animate([{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1.35)', offset: .6 }, { opacity: 1, transform: 'scale(1)' }], { duration: 700, delay: 1300, easing: 'cubic-bezier(.3,1.4,.5,1)', fill: 'both' }),
    q('.nl-bf').animate([{ opacity: 0, transform: 'translate(-90%,70%) rotate(-40deg) scale(.5)' }, { opacity: 1, transform: 'translate(-30%,20%) rotate(14deg) scale(.9)', offset: .6 }, { opacity: 1, transform: 'none' }], { duration: 1500, delay: 1600, easing: 'cubic-bezier(.3,.7,.3,1)', fill: 'both' }),
  ];
  Promise.all(anims.map(a => a.finished)).then(() => { el.classList.remove('pre'); anims.forEach(a => a.cancel()); }).catch(() => {});
}
export function initLogoOnView() {
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { playLogo(e.target); io.unobserve(e.target); } }), { threshold: .5 });
  $$('.nlogo.pre.late').forEach(l => io.observe(l));
}

/* ---- countdown (Khmer numerals in Khmer mode) ---- */
export function initCountdown(getLang) {
  const d = W.date, t = W.calendar.start.split(':').map(Number);
  const target = Date.UTC(d.y, d.m - 1, d.d, t[0] - 7, t[1]);
  const els = { d: $('#cdD'), h: $('#cdH'), m: $('#cdM'), s: $('#cdS') }, last = {};
  function tick() {
    const lang = getLang(); let ms = Math.max(0, target - Date.now());
    const v = { d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 };
    for (const k in v) {
      const txt = num(k === 'd' ? v[k] : String(v[k]).padStart(2, '0'), lang), key = txt + lang;
      if (last[k] !== key) { last[k] = key; els[k].innerHTML = `<span class="${k === 's' || last[k + 'i'] ? 'tick' : ''}">${txt}</span>`; last[k + 'i'] = 1; }
    }
    $('#cdDone').hidden = ms > 0;
  }
  tick(); setInterval(tick, 1000);
  return tick;
}

/* ---- programme: gold thread draws down as you scroll; each ritual icon draws and lights up ---- */
export function initProgramme() {
  const prog = $('.prog'), thread = $('.thread'), steps = $$('.step', prog);
  let ticking = false;
  function upd() {
    ticking = false;
    const r = prog.getBoundingClientRect(), mid = innerHeight * .62;
    const p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
    thread.style.setProperty('--p', p.toFixed(4));
    steps.forEach(s => { const sr = s.getBoundingClientRect(); s.classList.toggle('on', sr.top + sr.height / 2 < mid); });
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } };
  addEventListener('scroll', req, { passive: true }); addEventListener('resize', req); upd();
}

/* ---- candlelight: ripples on a 2D canvas, small lotus lanterns float up ---- */
export function initCandle({ lite }) {
  const sec = $('.candle'), cv = $('canvas', sec), ctx = cv.getContext('2d');
  let w = 0, h = 0, dpr = 1, ripples = [], raf = 0, visible = false, lastAuto = 0, lastMove = 0, lanterns = 0;
  function size() { const r = sec.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, lite ? 1 : 2); const nw = Math.round(r.width * dpr), nh = Math.round(r.height * dpr); if (cv.width !== nw || cv.height !== nh) { cv.width = nw; cv.height = nh; } w = r.width; h = r.height; }
  new ResizeObserver(size).observe(sec); size();
  const add = (x, y, big) => { ripples.push({ x, y, t: 0, max: big ? 150 : 90, big }); if (ripples.length > 18) ripples.shift(); if (!raf && visible) raf = requestAnimationFrame(loop); };
  function lantern(x, y) {
    if (lanterns > 7) return; lanterns++;
    const el = document.createElement('div'); el.className = 'lantern'; el.style.left = x + 'px'; el.style.top = y + 'px'; el.innerHTML = SVG.lotus; sec.appendChild(el);
    const dx = (Math.random() - .5) * 90, rise = Math.min(h * .32, 240) + Math.random() * 60;
    el.animate([{ transform: 'translate(0,0) scale(.3)', opacity: 0 }, { transform: `translate(${dx * .3}px,${-rise * .12}px) scale(1)`, opacity: 1, offset: .12 }, { transform: `translate(${dx}px,${-rise}px) scale(.85) rotate(${dx / 10}deg)`, opacity: .9, offset: .8 }, { transform: `translate(${dx * 1.1}px,${-rise * 1.1}px) scale(.8)`, opacity: 0 }], { duration: 9000, easing: 'cubic-bezier(.3,.5,.4,1)' }).onfinish = () => { el.remove(); lanterns--; };
  }
  function loop(ts) {
    raf = 0; if (!visible) return;
    if (ts - lastAuto > 2600) { lastAuto = ts; add(w * (.2 + Math.random() * .6), h * (.62 + Math.random() * .3)); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    ripples = ripples.filter(r => r.t < r.max);
    for (const r of ripples) {
      r.t++; const k = r.t / r.max, e = 1 - Math.pow(1 - k, 2.2);
      for (let i = 0; i < 3; i++) {
        const kk = Math.max(0, e - i * .13); if (kk <= 0) continue;
        const rad = kk * (r.big ? 110 : 70); ctx.beginPath(); ctx.ellipse(r.x, r.y, rad * 1.5, rad * .55, 0, 0, 6.2832);
        ctx.strokeStyle = `rgba(255,236,190,${(1 - k) * (.55 - i * .15)})`; ctx.lineWidth = 1.4 - i * .3; ctx.stroke();
      }
    }
    if (ripples.length || visible) raf = requestAnimationFrame(loop);
  }
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }, { threshold: .05 }).observe(sec);
  sec.addEventListener('pointerdown', e => { const r = sec.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; add(x, y, true); lantern(x, y); });
  sec.addEventListener('pointermove', e => { const now = performance.now(); if (now - lastMove < 90 || e.pointerType === 'touch') return; lastMove = now; const r = sec.getBoundingClientRect(); add(e.clientX - r.left, e.clientY - r.top); });
}

/* ---- gallery viewer: swipeable full-screen ---- */
export function initGallery(photos) {
  const v = $('.viewer'), track = $('.vtrack', v), count = $('.vcount', v);
  track.innerHTML = photos.map((p, i) => `<figure><img data-i="${i}" alt="" decoding="async"></figure>`).join('');
  const imgs = $$('img', track);
  const load = (i) => { const im = imgs[i]; if (im && !im.src) im.src = `assets/photos/${photos[i].id}-1280.webp`; };
  const cur = () => Math.round(track.scrollLeft / track.clientWidth);
  const upd = () => { const i = cur(); count.textContent = `${i + 1} / ${photos.length}`; [i - 1, i, i + 1].forEach(load); };
  track.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true });
  const go = (i) => { i = Math.max(0, Math.min(photos.length - 1, i)); track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' }); };
  function open(i) { v.classList.add('open'); document.body.classList.add('locked'); load(i); track.scrollTo({ left: i * track.clientWidth }); upd(); $('.vclose', v).focus(); }
  function close() { v.classList.remove('open'); document.body.classList.remove('locked'); }
  $$('.gal button').forEach((b, i) => b.addEventListener('click', () => open(i)));
  $('.vclose', v).addEventListener('click', close);
  $('.vnav.p', v).addEventListener('click', () => go(cur() - 1)); $('.vnav.n', v).addEventListener('click', () => go(cur() + 1));
  addEventListener('keydown', e => { if (!v.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') go(cur() + 1); if (e.key === 'ArrowLeft') go(cur() - 1); });
}

/* ---- thank-you butterfly: flies a looping path while its section is on screen ---- */
export function initButterfly() {
  const sec = $('.thanks'), b = $('.bfly', sec); let vis = false, raf = 0, t0 = 0;
  function loop(ts) {
    raf = 0; if (!vis) return; if (!t0) t0 = ts; const t = (ts - t0) / 1000, r = sec.getBoundingClientRect();
    const x = r.width * (.5 + .38 * Math.sin(t * .5)), y = r.height * (.2 + .13 * Math.sin(t * .83 + 1)) + r.height * .06 * Math.sin(t * 1.9);
    const dx = Math.cos(t * .5) * .38 * r.width * .5, rot = Math.max(-35, Math.min(35, dx / 6));
    b.style.transform = `translate(${x - 30}px,${y}px) rotate(${rot}deg)`; raf = requestAnimationFrame(loop);
  }
  new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis && !raf) raf = requestAnimationFrame(loop); }, { threshold: .05 }).observe(sec);
}

/* ---- top bar background once scrolled ---- */
export function initTopbar() {
  const tb = $('.topbar'); const f = () => tb.classList.toggle('scrolled', scrollY > 24); addEventListener('scroll', f, { passive: true }); f();
}

/* ---- calendar (.ics), share, QR download ---- */
export function icsBlobUrl(lang) {
  const d = W.date, utc = (hm) => { const [h, m] = hm.split(':').map(Number); const x = new Date(Date.UTC(d.y, d.m - 1, d.d, h - 7, m)); return x.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''); };
  const esc = (s) => s.replace(/[,;]/g, m => '\\' + m).replace(/\n/g, '\\n');
  const prog = W.programme.map(p => `${p.t} ${p.km}`).join('\\n');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//KM', 'BEGIN:VEVENT', `UID:wedding-${d.y}${d.m}${d.d}@invite`, `DTSTAMP:${utc('00:00').slice(0, 8)}T000000Z`,
    `DTSTART:${utc(W.calendar.start)}`, `DTEND:${utc(W.calendar.end)}`, `SUMMARY:${esc('អាពាហ៍ពិពាហ៍ ' + W.groom.short.km + ' & ' + W.bride.short.km)}`,
    `LOCATION:${esc(W.venue.en)}`, `GEO:${W.venue.lat};${W.venue.lng}`, `DESCRIPTION:${prog}`, 'END:VEVENT', 'END:VCALENDAR'];
  return URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' }));
}

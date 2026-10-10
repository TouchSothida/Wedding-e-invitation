import { WEDDING as W } from './wedding.js';
import { T, num, fmtTime, MONTHS_KM, MONTHS_EN } from './i18n.js';
import { SVG, FOIL_DEFS, corner } from './svg.js';
import { logoHTML, flapFace, flapShadowPath, scallopFrame, icon } from './parts.js';
import { initTilt, openEnvelope } from './envelope.js';
import * as fx from './effects.js';

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
let lang = 'km';
try { lang = localStorage.getItem('lang') || 'km'; } catch (e) {}
if (new URLSearchParams(location.search).get('lang') === 'en') lang = 'en';
const photos = await fetch('assets/photos/gallery.json').then(r => r.json()).catch(() => []);
const P = (id, w = 1280) => `assets/photos/${id}-${w}.webp`;
const lite = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 2 || matchMedia('(max-width:480px)').matches && (navigator.hardwareConcurrency || 8) <= 6;
if (lite) document.documentElement.classList.add('lite');
if (fx.reduceMotion) document.documentElement.classList.add('reduce');

/* ---------- dynamic text blocks (re-rendered on language switch) ---------- */
const parentsBlock = (p) => `<span><em>${T[lang].mr}&nbsp;</em><span class="nw">${p.father}</span></span><span><em>${T[lang].mrs}&nbsp;</em><span class="nw">${p.mother}</span></span>`;
const d = W.date;
const B = {
  topG: () => W.groom.short[lang], topB: () => W.bride.short[lang],
  enNames: () => `${W.groom.short.en} &amp; ${W.bride.short.en}`,
  dateRow: () => {
    const k = lang === 'km';
    const v = [k ? d.weekdayKm : d.weekdayEn.slice(0, 3), num(d.d, lang), k ? MONTHS_KM[d.m] : MONTHS_EN[d.m].slice(0, 3), num(d.y, lang)];
    const l = [T[lang].dDay, T[lang].dDate, T[lang].dMonth, T[lang].dYear];
    return v.map((x, i) => `<div><small>${l[i]}</small><b>${x}</b></div>`).join('');
  },
  lunar: () => lang === 'km' ? W.lunarKm : '',
  venueLine: () => `<b>${W.venue[lang]}</b>`,
  gp: () => parentsBlock(W.groom), bp: () => parentsBlock(W.bride),
  gName: () => W[lang === 'km' ? 'groom' : 'groom'][lang], bName: () => W.bride[lang],
  gOf: () => `<span>${T[lang].sonOf}</span>${parentsBlock(W.groom)}`.replace('<span>' + T[lang].mr, '<span>' + T[lang].mr),
  bOf: () => `<span>${T[lang].daughterOf}</span>${parentsBlock(W.bride)}`,
  cdLabels: () => '',
  cardDate: () => `${num(d.d, lang)} ${lang === 'km' ? MONTHS_KM[d.m] : MONTHS_EN[d.m]} ${num(d.y, lang)}`,
  marquee: () => Array(8).fill(T[lang].marquee).join(' &nbsp;·&nbsp; '),
  short: () => '',
};
W.programme.forEach((p, i) => B['step' + i] = () => `<div class="tm">${fmtTime(p.t, lang)}</div><div class="nm">${p[lang]}</div>`);

const FOCUS = { groom: { cx: .55, cy: .37, zh: .5 }, bride: { cx: .56, cy: .36, zh: .62 } };
const focus = (k) => { const ph = photos.find(p => p.id === W.photos[k]); return ph ? { ...FOCUS[k], w: ph.w, h: ph.h } : null; };
/* ---------- markup ---------- */
const cornerDiv = (cls, fx_, fy) => `<div class="corner ${cls}">${corner(fx_, fy)}</div>`;
const sealSVG = SVG['wax-seal'];
const cardHTML = `
  <div class="c-corner c1">${corner(false, false)}</div><div class="c-corner c2">${corner(true, false)}</div>
  <div class="c-corner c3">${corner(false, true)}</div><div class="c-corner c4">${corner(true, true)}</div>
  <div class="c-crest">${SVG.crest}</div>
  <div class="c-title moul foil" data-t="blessing"></div>
  <div class="c-logo">${logoHTML(lang)}</div>
  <div class="c-honor"><span data-t="honour"></span></div>`;

const html = `
${FOIL_DEFS}
<header class="topbar" id="topbar">
  <div class="top-logo"><span class="km foil" data-b="topG"></span><svg class="dot" viewBox="0 0 24 22"><path class="k-gold" d="M12 21 C3 14 1 9 1 6.2 C1 3.2 3.4 1 6.2 1 C8.6 1 10.7 2.4 12 4.6 C13.3 2.4 15.4 1 17.8 1 C20.6 1 23 3.2 23 6.2 C23 9 21 14 12 21Z"/></svg><span class="km foil" data-b="topB"></span></div>
  <div class="top-btns"><button class="chip" id="langBtn" data-t="lang" aria-label="Language"></button>
  <button class="chip eq" id="musicBtn" aria-label="Music"><span class="bars"><i></i><i></i><i></i></span></button></div>
</header>

<section class="env-screen" id="env" aria-label="Wedding invitation envelope">
  <div class="env-bg" style="background-image:url(${P(W.photos.envelopeBg)})"></div>
  <div class="env-head"><div class="moul foil shimmer" data-t="envTitle"></div><span class="serif" data-t="envSub"></span></div>
  <div class="env-wrap"><div class="env-float"><div class="env-tilt">
    <div class="env-stage" id="envStage" role="button" tabindex="0" aria-label="Open the invitation">
      <div class="env-back env-part paper"></div>
      <div class="card paper paper-cream">${cardHTML}</div>
      <div class="pocket env-part"><div class="pk pk-l"><i></i></div><div class="pk pk-r"><i></i></div><div class="pk pk-b"><i></i></div></div>
      <div class="flap-shadow">${flapShadowPath()}</div>
      <div class="flap-wrap env-part"><div class="flap">
        <div class="face front">${flapFace('front', 'assets/textures/paper-cream.webp', '#efd6d1')}<div class="f-logo">${logoHTML(lang)}</div></div>
        <div class="face back">${flapFace('back', 'assets/textures/paper-lining.webp', '#f6e4de')}</div>
      </div></div>
      <div class="seal-shadow"></div>
      <div class="seal">${sealSVG}</div>
    </div>
  </div></div></div>
  <div class="env-hint"><span data-t="tap"></span></div>
  <div class="veil"></div>
</section>

<main id="main">
  <section class="cover" id="cover">
    <picture>
      <source media="(min-aspect-ratio: 5/4)" srcset="${P(W.photos.coverWide, 1280)} 1280w, ${P(W.photos.coverWide, 2000)} 2000w" sizes="100vw">
      <img class="bgimg" alt="" src="${P(W.photos.cover, 1280)}" srcset="${P(W.photos.cover, 640)} 640w, ${P(W.photos.cover, 1280)} 1280w, ${P(W.photos.cover, 2000)} 2000w" sizes="100vw" fetchpriority="high">
    </picture>
    ${cornerDiv('tl', 0, 0)}${cornerDiv('tr', 1, 0)}${cornerDiv('bl', 0, 1)}${cornerDiv('br', 1, 1)}
    <div class="cv">
     <div class="cv-t">
      <div class="crest" style="--i:0">${SVG.crest}</div>
      <h1 class="foil shimmer" style="--i:1" data-t="blessing"></h1>
     </div>
     <div class="cv-m"><div class="nlogo-wrap" style="--i:2;width:100%;display:flex;justify-content:center">${logoHTML(lang, 'pre')}</div></div>
     <div class="cv-b">
      <div class="en-names" style="--i:3" data-b="enNames"></div>
      <div class="honour" style="--i:4" data-t="honour"></div>
      <div class="dateRow" style="--i:5" data-b="dateRow"></div>
      <div class="lunar" style="--i:6" data-b="lunar"></div>
      <div class="venue" style="--i:7" data-b="venueLine"></div>
     </div>
    </div>
    <div class="scrollcue"><span data-t="scroll"></span><i></i></div>
  </section>

  <section class="sec sec-cream" id="invite">
    ${cornerDiv('tl', 0, 0)}${cornerDiv('br', 1, 1)}
    <div class="arch"><div class="in-arch"><img alt="" loading="lazy" src="${P(W.photos.invite, 1280)}" srcset="${P(W.photos.invite, 640)} 640w, ${P(W.photos.invite, 1280)} 1280w" sizes="300px"></div></div>
    <h2 class="h2 foil" data-r data-t="inviteHead"></h2>
    <div class="divider" data-r>${SVG.divider}</div>
    <p class="inv-text" data-r data-t="inviteBody"></p>
    <div class="parents">
      <div class="pg" data-r><h3 data-t="groomParents"></h3><p data-b="gp"></p></div>
      <div class="pg" data-r style="--d:.12s"><h3 data-t="brideParents"></h3><p data-b="bp"></p></div>
    </div>
  </section>

  <section class="sec sec-blush" id="couple">
    ${cornerDiv('tr', 1, 0)}${cornerDiv('bl', 0, 1)}
    <h2 class="h2 foil" data-r data-t="coupleHead"></h2>
    <div class="divider" data-r>${SVG.divider}</div>
    <div class="couple">
      <div class="person"><div class="frame" style="--rot:-3deg">${scallopFrame(P(W.photos.groom, 2000), 'g', focus('groom'))}</div>
        <div class="role" data-r data-t="groomRole"></div><div class="name" data-r data-b="gName"></div><div class="of" data-r data-b="gOf"></div></div>
      <div class="person"><div class="frame" style="--rot:3deg">${scallopFrame(P(W.photos.bride, 2000), 'b', focus('bride'))}</div>
        <div class="role" data-r data-t="brideRole"></div><div class="name" data-r data-b="bName"></div><div class="of" data-r data-b="bOf"></div></div>
    </div>
  </section>

  <section class="count" id="count">
    <div class="marq" aria-hidden="true"><div data-b="marquee"></div><div data-b="marquee"></div></div>
    <div style="position:relative;text-align:center">
      <h2 class="h2 foil" data-r data-t="countHead"></h2>
      <div class="cd" data-r>
        <div class="u"><b id="cdD"></b><small data-t="cdD"></small></div><div class="u"><b id="cdH"></b><small data-t="cdH"></small></div>
        <div class="u"><b id="cdM"></b><small data-t="cdM"></small></div><div class="u"><b id="cdS"></b><small data-t="cdS"></small></div>
      </div>
      <p id="cdDone" class="sub" hidden data-t="cdDone" style="margin-top:1.4em"></p>
    </div>
  </section>

  <section class="sec sec-cream" id="programme">
    ${cornerDiv('tl', 0, 0)}${cornerDiv('tr', 1, 0)}
    <h2 class="h2 foil" data-r data-t="progHead"></h2>
    <div class="divider" data-r>${SVG.divider}</div>
    <div class="prog">
      <div class="thread"><i></i></div>
      ${W.programme.map((p, i) => `<div class="step"><div class="ic">${icon(p.icon)}</div><div class="tx" data-b="step${i}"></div></div>`).join('')}
    </div>
  </section>

  <section class="candle" id="candle">
    <div class="bg" style="background-image:url(${P(W.photos.candle, 1280)})"></div>
    <canvas aria-hidden="true"></canvas>
    <div class="txt"><h2 class="h2 foil shimmer" data-t="candleHead"></h2><p data-t="candleHint"></p></div>
  </section>

  <section class="sec sec-cream" id="gallery">
    <h2 class="h2 foil" data-r data-t="galHead"></h2>
    <div class="divider" data-r>${SVG.divider}</div>
    <div class="gal">${photos.map((p, i) => `<button aria-label="Photo ${i + 1}" style="--d:${(i % 4) * .08}s"><img loading="lazy" decoding="async" width="${640}" height="${Math.round(640 * p.h / p.w)}" alt="" src="${P(p.id, 640)}" srcset="${P(p.id, 640)} 640w, ${P(p.id, 1280)} 1280w" sizes="(min-width:1100px) 25vw,(min-width:760px) 33vw,50vw"></button>`).join('')}</div>
  </section>

  <section class="sec sec-blush venue-sec" id="venue">
    ${cornerDiv('tl', 0, 0)}${cornerDiv('tr', 1, 0)}
    <div class="crest-s" data-r style="width:clamp(70px,16vw,100px)">${SVG.crest}</div>
    <h2 class="h2 foil" data-r data-t="venueHead"></h2>
    <div class="venue-name" data-r>${W.venue.en}</div>
    <div class="mapframe"><iframe title="Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${W.venue.lat},${W.venue.lng}&output=embed"></iframe></div>
    <div class="btns" data-r>
      <a class="btn solid" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${W.venue.lat},${W.venue.lng}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6.1 7-11.2A7 7 0 0 0 5 9.800C5 14.900 12 21 12 21z"/><circle cx="12" cy="10" r="2.500"/></svg><span data-t="openMaps"></span></a>
      <a class="btn" id="icsBtn" download="wedding.ics" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.500" y="5" width="17" height="15" rx="2"/><path d="M8 3v4M16 3v4M3.500 10h17"/></svg><span data-t="saveCal"></span></a>
    </div>
  </section>

  <section class="sec sec-cream" id="gift">
    ${cornerDiv('tl', 0, 0)}${cornerDiv('br', 1, 1)}
    <h2 class="h2 foil" data-r data-t="giftHead"></h2>
    <p class="sub" data-r data-t="giftSub"></p>
    <div class="qrs">${W.qr.map((q, i) => `<div class="qr-wrap" data-r><div class="qr"><img src="${q.src}" alt="${q.label}" loading="lazy"></div><a class="btn solid" download="gift-qr.png" href="${q.src}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4v11M7.500 10.500 12 15l4.500-4.500M5 19.500h14"/></svg><span data-t="saveQr"></span></a></div>`).join('')}</div>
  </section>

  <section class="sec sec-blush apology" id="apology">
    ${cornerDiv('tl', 0, 0)}${cornerDiv('br', 1, 1)}
    <div class="note" data-r>
      <div class="crest">${SVG.crest}</div>
      <h2 class="h2 foil" data-t="apologyHead"></h2>
      <div class="divider">${SVG.divider}</div>
      <p class="ap-text" data-t="apologyBody"></p>
    </div>
  </section>

  <section class="thanks" id="thanks">
    <div class="bfly" aria-hidden="true">${SVG.butterfly}</div>
    <div style="text-align:center;position:relative">
      <span class="big foil shimmer" data-r data-t="thanks"></span>
      <div class="divider" data-r style="margin-top:1em">${SVG.divider}</div>
      <div class="shares" data-r>
        <a class="share" id="shTg" target="_blank" rel="noopener"><span class="lg" style="background:#229ED9"><svg viewBox="0 0 24 24"><path d="M21 3 3 10.500l5.500 2L17 6.500l-6.800 7.300-.2 5.200 3-2.800 4.500 3.300L21 3z"/></svg></span><span data-t="shareTg"></span></a>
        <a class="share" id="shMs" target="_blank" rel="noopener"><span class="lg" style="background:#0A7CFF"><svg viewBox="0 0 24 24"><path d="M12 2C6.500 2 2 6.200 2 11.400c0 2.900 1.400 5.500 3.600 7.200V22l3.300-1.800c.9.200 1.900.4 3.100.4 5.500 0 10-4.200 10-9.400S17.500 2 12 2zm1 12.600-2.500-2.700-4.800 2.700 5.300-5.600 2.600 2.700 4.700-2.700-5.300 5.600z"/></svg></span><span data-t="shareMs"></span></a>
        <a class="share" id="shFb" target="_blank" rel="noopener"><span class="lg" style="background:#1877F2"><svg viewBox="0 0 24 24"><path d="M13.500 21v-8h2.700l.4-3.200h-3.100V7.800c0-.9.300-1.500 1.600-1.500h1.700V3.400c-.3 0-1.300-.1-2.400-.1-2.400 0-4 1.500-4 4.100v2.400H7.700V13h2.700v8h3.100z"/></svg></span><span data-t="shareFb"></span></a>
        <button class="share" id="shCopy"><span class="lg" style="background:linear-gradient(135deg,#9c7124,#e2bb64)"><svg viewBox="0 0 24 24"><path d="M10.600 13.400a3.500 3.500 0 0 0 5 0l3-3a3.500 3.500 0 0 0-5-5l-1 1 1.400 1.400 1-1a1.500 1.500 0 0 1 2.200 2.200l-3 3a1.500 1.500 0 0 1-2.200 0zM13.400 10.600a3.500 3.500 0 0 0-5 0l-3 3a3.500 3.500 0 0 0 5 5l1-1-1.400-1.400-1 1a1.500 1.500 0 0 1-2.200-2.200l3-3a1.500 1.500 0 0 1 2.200 0z"/></svg></span><span id="copyTxt" data-t="copyLink"></span></button>
      </div>
      <div class="nlogo-wrap" style="display:flex;justify-content:center">${logoHTML(lang, 'pre late')}</div>
      <p class="foot">${num(d.d, lang)} · ${num(d.m, lang)} · ${num(d.y, lang)}</p>
    </div>
  </section>
</main>

<div class="viewer" role="dialog" aria-modal="true" aria-label="Gallery">
  <div class="vbar"><span class="vcount"></span><button class="chip vclose" data-t="close"></button></div>
  <button class="vnav p" aria-label="Previous"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 5-7 7 7 7"/></svg></button>
  <button class="vnav n" aria-label="Next"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 5 7 7-7 7"/></svg></button>
  <div class="vtrack"></div>
</div>`;

$('#app').innerHTML = html;
document.documentElement.lang = lang;

/* ---------- language ---------- */
let cdTick = () => {};
function applyLang() {
  document.documentElement.lang = lang;
  $$('[data-t]').forEach(el => el.innerHTML = T[lang][el.dataset.t]);
  $$('[data-b]').forEach(el => el.innerHTML = B[el.dataset.b]());
  $$('[data-short]').forEach(el => el.textContent = W[el.dataset.short === 'g' ? 'groom' : 'bride'].short[lang]);
  $('#icsBtn').href = fx.icsBlobUrl(lang);
  const url = shareUrl(), msg = encodeURIComponent(T[lang].ogTitle);
  $('#shTg').href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${msg}`;
  $('#shFb').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  $('#shMs').href = `fb-messenger://share/?link=${encodeURIComponent(url)}`;
  document.title = T[lang].ogTitle; cdTick();
}
const shareUrl = () => W.siteUrl || location.href.split('#')[0].split('?')[0];
$('#langBtn').addEventListener('click', () => { lang = lang === 'km' ? 'en' : 'km'; try { localStorage.setItem('lang', lang); } catch (e) {} applyLang(); });
$('#shMs').addEventListener('click', (e) => { if (!/Android|iPhone|iPad/i.test(navigator.userAgent)) { e.preventDefault(); copy(); } });
async function copy() { try { await navigator.clipboard.writeText(shareUrl()); } catch (e) { const t = document.createElement('textarea'); t.value = shareUrl(); document.body.append(t); t.select(); try { document.execCommand('copy'); } catch (_) {} t.remove(); } const s = $('#copyTxt'); s.textContent = T[lang].copied; setTimeout(() => s.textContent = T[lang].copyLink, 1800); }
$('#shCopy').addEventListener('click', copy);
cdTick = fx.initCountdown(() => lang);
applyLang();

/* ---------- music ---------- */
const audio = new Audio(W.music); audio.loop = true; audio.preload = 'none'; audio.volume = 0;
const musicBtn = $('#musicBtn');
function setPlaying(on) { musicBtn.classList.toggle('play', on); }
async function playMusic() { try { audio.volume = 0; await audio.play(); setPlaying(true); const t0 = performance.now(); (function f(t) { const k = Math.max(0, Math.min(1, (t - t0) / 2500)); audio.volume = Math.max(0, Math.min(1, .55 * k)); if (k < 1) requestAnimationFrame(f); })(t0); } catch (e) { setPlaying(false); } }
musicBtn.addEventListener('click', () => { if (audio.paused) playMusic(); else { audio.pause(); setPlaying(false); } });
document.addEventListener('visibilitychange', () => { if (document.hidden && !audio.paused) { audio.pause(); audio.dataset.auto = 1; } else if (!document.hidden && audio.dataset.auto) { delete audio.dataset.auto; audio.play().catch(() => {}); } });

/* ---------- envelope ---------- */
const env = $('#env'), stage = $('#envStage'), main = $('#main'), topbar = $('#topbar');
const stopTilt = lite && 0 ? () => {} : initTilt(env);
requestAnimationFrame(() => {
  const intro = [[$('.env-head'), 0], [$('.env-wrap'), 250], [$('.env-hint'), 1100]];
  intro.forEach(([el, d]) => el.animate([{ opacity: 0, transform: el.classList.contains('env-wrap') ? 'translateY(22px) scale(.96)' : 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 1300, delay: d, easing: 'cubic-bezier(.22,.8,.2,1)', fill: 'forwards' }));
});
let opened = false;
function open() {
  if (opened) return; opened = true; stopTilt();
  try { if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission) DeviceOrientationEvent.requestPermission().catch(() => {}); } catch (e) {}
  playMusic();
  stage.style.cursor = 'default'; stage.removeAttribute('role');
  $('.env-float').style.animation = 'none';
  openEnvelope(env, {
    reduce: fx.reduceMotion,
    onMid: () => {
      env.querySelectorAll('*').forEach(n => n.getAnimations && n.getAnimations().forEach(a => a.pause()));
      env.style.visibility = 'hidden'; document.body.classList.remove('locked'); scrollTo(0, 0);
      main.classList.add('on'); topbar.classList.add('on');
      const cover = $('#cover'); cover.classList.add('go'); setTimeout(() => fx.playLogo($('#cover .nlogo')), 700);
      fx.initReveals(); fx.initTopbar(); fx.initProgramme(); fx.initCandle({ lite }); fx.initGallery(photos); fx.initButterfly(); fx.initLogoOnView();
    },
    onDone: () => env.remove(),
  });
}
stage.addEventListener('click', open);
stage.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
if (new URLSearchParams(location.search).has('skip')) { open(); }

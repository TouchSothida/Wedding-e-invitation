// Reusable pieces: name logo, flap shapes, scalloped frames, line icons.
import { SVG, corner } from './svg.js';
import { WEDDING as W } from './wedding.js';

export const logoHTML = (lang, cls = '') => `
<div class="nlogo ${cls}" data-logo>
  <div class="nl-crest">${SVG.crest}</div>
  <div class="nl-names">
    <span class="g km foil"><span data-short="g">${W.groom.short[lang]}</span></span>
    <svg class="nl-flo" viewBox="0 0 150 100" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 50 C26 50 40 43 62 51 C74 55 80 56 90 53 C106 48 128 54 146 50"/></svg>
    <svg class="nl-heart" viewBox="0 0 24 22" aria-hidden="true"><path class="k-gold" d="M12 21 C3 14 1 9 1 6.2 C1 3.2 3.4 1 6.2 1 C8.6 1 10.7 2.4 12 4.6 C13.3 2.4 15.4 1 17.8 1 C20.6 1 23 3.2 23 6.2 C23 9 21 14 12 21Z"/></svg>
    <span class="nl-bf">${SVG.butterfly}</span>
    <span class="b km foil"><span data-short="b">${W.bride.short[lang]}</span></span>
  </div>
</div>`;

// Scalloped edge for the envelope flap, drawn in a 1000x400 box so circles stay circular.
export function flapShapes() {
  const N = 6, A = [[1000, 0], [500, 400], [0, 0]];
  let edge = '';
  for (let s = 0; s < 2; s++) {
    const [x1, y1] = A[s], [x2, y2] = A[s + 1];
    const len = Math.hypot(x2 - x1, y2 - y1), r = (len / N / 2) * 1.04;
    for (let i = 1; i <= N; i++) {
      const x = x1 + (x2 - x1) * i / N, y = y1 + (y2 - y1) * i / N;
      edge += ` A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }
  const front = `M0 0 L1000 0${edge} Z`;
  const line = `M1000 0${edge}`;
  return { front, line };
}
export function flapFace(kind, tex, base) {
  const { front, line } = flapShapes();
  const flip = kind === 'back' ? 'translate(0 400) scale(1 -1)' : '';
  const id = 'pat' + kind;
  return `<svg class="scallop" viewBox="0 0 1000 400" aria-hidden="true">
  <defs><pattern id="${id}" width="300" height="300" patternUnits="userSpaceOnUse"><image href="${tex}" width="300" height="300"/></pattern>
  <linearGradient id="sh${kind}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${kind === 'back' ? 0 : .2}"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#5a281c" stop-opacity="${kind === 'back' ? .22 : .14}"/></linearGradient></defs>
  <g transform="${flip}">
    <path d="${front}" fill="${base}"/>
    <path d="${front}" fill="url(#${id})" style="mix-blend-mode:multiply" opacity=".55"/>
    <path d="${front}" fill="url(#sh${kind})"/>
    ${kind === 'front' ? `<path d="${line}" transform="translate(500 0) scale(.945) translate(-500 0)" fill="none" stroke="url(#g-foil)" stroke-width="3.2" stroke-linecap="round"/>` : ''}
  </g></svg>`;
}
export const flapShadowPath = () => `<svg viewBox="0 0 1000 400" width="100%" height="100%" aria-hidden="true"><path d="${flapShapes().front}" fill="#3a1612"/></svg>`;

// Scalloped photo frame (gold rim + photo), drawn in a 400x500 box.
export function scallopFrame(src, uid, f) {
  const Wd = 400, H = 500, r = 15, step = 27;
  const shape = (inset, tf) => {
    const a = tf ? ` transform="${tf}"` : '';
    let s = `<rect${a} x="${r + inset}" y="${r + inset}" width="${Wd - 2 * r - 2 * inset}" height="${H - 2 * r - 2 * inset}"/>`;
    const nx = Math.round((Wd - 2 * r) / step), ny = Math.round((H - 2 * r) / step);
    for (let i = 0; i <= nx; i++) { const x = r + (Wd - 2 * r) * i / nx; s += `<circle${a} cx="${x}" cy="${r + inset}" r="${r}"/><circle${a} cx="${x}" cy="${H - r - inset}" r="${r}"/>`; }
    for (let j = 1; j < ny; j++) { const y = r + (H - 2 * r) * j / ny; s += `<circle${a} cx="${r + inset}" cy="${y}" r="${r}"/><circle${a} cx="${Wd - r - inset}" cy="${y}" r="${r}"/>`; }
    return s;
  };
  const tf = `translate(${Wd / 2} ${H / 2}) scale(.955) translate(${-Wd / 2} ${-H / 2})`;
  return `<svg viewBox="0 0 ${Wd} ${H}" aria-hidden="true">
  <defs><clipPath id="o${uid}">${shape(0)}</clipPath><clipPath id="i${uid}">${shape(0, tf)}</clipPath></defs>
  <g clip-path="url(#o${uid})"><rect width="${Wd}" height="${H}" fill="url(#g-foil)"/></g>
  ${f ? cropped(src, uid, f) : `<image href="${src}" width="${Wd}" height="${H}" preserveAspectRatio="xMidYMid slice" clip-path="url(#i${uid})"/>`}</svg>`;
}

function cropped(src, uid, f) {
  // crop the photo around a focal point so people fill the frame (4:5)
  const ch = f.h * f.zh, cw = Math.min(f.w, ch * .8), h2 = Math.min(f.h, cw / .8);
  const x = Math.max(0, Math.min(f.w - cw, f.cx * f.w - cw / 2)), y = Math.max(0, Math.min(f.h - h2, f.cy * f.h - h2 / 2));
  return `<g clip-path="url(#i${uid})"><svg x="0" y="0" width="400" height="500" viewBox="${x.toFixed(0)} ${y.toFixed(0)} ${cw.toFixed(0)} ${h2.toFixed(0)}" preserveAspectRatio="xMidYMid slice"><image href="${src}" width="${f.w}" height="${f.h}"/></svg></g>`;
}
const P = (d) => `<path pathLength="1" d="${d}"/>`;
export const ICONS = {
  chant: P('M17 19h6v15h-6z') + P('M20 5C25 11 25 15 20 18C15 15 15 11 20 5Z') + P('M12 34h16'),
  tray: P('M6 27h28') + P('M9 27c0 5 4 8 11 8s11-3 11-8') + P('M12 27c0-7 4-11 8-11s8 4 8 11') + `<circle pathLength="1" cx="20" cy="13" r="2"/>`,
  ring: `<circle pathLength="1" cx="20" cy="25" r="9"/>` + P('M16 11L20 6L24 11L20 15Z'),
  scissors: `<circle pathLength="1" cx="12" cy="30" r="4"/><circle pathLength="1" cx="28" cy="30" r="4"/>` + P('M15 27L30 7') + P('M25 27L10 7'),
  knot: P('M20 20C14 11 5 13 5 20C5 27 14 29 20 20C26 11 35 13 35 20C35 27 26 29 20 20Z') + P('M20 20v12'),
  cheers: P('M6 8h12l-1.5 9a4.5 4.5 0 0 1-9 0z') + P('M12 21.5V33') + P('M8 33h8') + P('M22 8h12l-1.5 9a4.5 4.5 0 0 1-9 0z') + P('M28 21.5V33') + P('M24 33h8'),
};
export const icon = (k) => `<svg viewBox="0 0 40 40" aria-hidden="true">${ICONS[k]}</svg>`;
export { corner, SVG };

// Envelope: idle float/tilt and the ~5.5 s "by hand" opening. Flat layers + explicit z-index (no CSS filters on 3D parents).
const $ = (s, r = document) => r.querySelector(s);
const EASE = { io: 'cubic-bezier(.45,0,.2,1)', out: 'cubic-bezier(.2,.75,.25,1)', in: 'cubic-bezier(.5,0,.9,.4)', soft: 'cubic-bezier(.33,0,.2,1)' };
const A = (el, kf, o) => el.animate(kf, { fill: 'forwards', easing: EASE.io, ...o });

export function initTilt(root) {
  const tilt = $('.env-tilt', root);
  const set = (x, y) => { tilt.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg'); tilt.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg'); };
  const onMove = (e) => set((e.clientX / innerWidth - .5) * 2, (e.clientY / innerHeight - .5) * 2);
  const onOri = (e) => { if (e.gamma == null) return; set(Math.max(-1, Math.min(1, e.gamma / 30)), Math.max(-1, Math.min(1, ((e.beta || 45) - 45) / 30))); };
  addEventListener('pointermove', onMove, { passive: true });
  addEventListener('deviceorientation', onOri, { passive: true });
  return () => { removeEventListener('pointermove', onMove); removeEventListener('deviceorientation', onOri); set(0, 0); };
}

export function openEnvelope(root, { reduce, onMid, onDone }) {
  const stage = $('.env-stage', root), card = $('.card', root), flap = $('.flap', root), fshadow = $('.flap-shadow', root);
  const fw = $('.flap-wrap', root), seal = $('.seal', root), sshadow = $('.seal-shadow', root), parts = [...root.querySelectorAll('.env-part')];
  const veil = $('.veil', root), wrap = $('.env-wrap', root), head = $('.env-head', root), hint = $('.env-hint', root);
  const vw = innerWidth, vh = innerHeight;
  if (reduce) { A(veil, [{ opacity: 0 }, { opacity: 1 }], { duration: 400 }).onfinish = () => { onMid(); A(veil, [{ opacity: 1 }, { opacity: 0 }], { duration: 500 }).onfinish = onDone; }; return; }

  const envH = stage.getBoundingClientRect().height, envW = stage.getBoundingClientRect().width;
  const cr = card.getBoundingClientRect();
  const ccx = cr.left + cr.width / 2, ccy = cr.top + cr.height / 2;
  const rise = envH * 0.66, pushDown = envH * 0.07;
  const T0 = 0;

  A(hint, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 });
  // 1 seal pressed -> lifted (shadow grows) -> set aside off screen
  A(seal, [{ transform: 'scale(1)' }, { transform: 'scale(.92)' }], { duration: 380, delay: T0, easing: EASE.soft });
  A(seal, [{ transform: 'translate(0,0) scale(.92) rotate(0)' }, { transform: 'translate(0,-6%) scale(1.2) rotate(-6deg)' }], { duration: 780, delay: T0 + 380, easing: EASE.out });
  A(sshadow, [{ transform: 'translateY(1cqw) scale(1)', opacity: 1 }, { transform: 'translateY(4cqw) scale(1.25)', opacity: .55 }], { duration: 780, delay: T0 + 380, easing: EASE.out });
  const aside = A(seal, [{ transform: 'translate(0,-6%) scale(1.2) rotate(-6deg)', opacity: 1 }, { transform: `translate(${vw * 0.75}px,${-vh * 0.12}px) scale(1.35) rotate(40deg)`, opacity: 1, offset: .8 }, { transform: `translate(${vw}px,${-vh * 0.12}px) scale(1.4) rotate(55deg)`, opacity: 0 }], { duration: 900, delay: T0 + 1160, easing: EASE.io });
  A(sshadow, [{ opacity: .55 }, { opacity: 0 }], { duration: 500, delay: T0 + 1160 });
  // 2 flap folds back in 3D; its shadow on the pocket lifts; once past 90deg it goes behind the card
  const fT = T0 + 1700, fD = 1400;
  A(flap, [{ transform: 'perspective(1000px) rotateX(0deg)' }, { transform: 'perspective(1000px) rotateX(-180deg)' }], { duration: fD, delay: fT, easing: EASE.io });
  A(fshadow, [{ opacity: .5, transform: 'translateY(1.8cqw)' }, { opacity: 0, transform: 'translateY(.2cqw)' }], { duration: fD * .7, delay: fT });
  setTimeout(() => { fw.style.zIndex = 1; fshadow.style.display = 'none'; }, fT + fD * .5);
  // 3 card drawn out of the pocket at a slight angle while the envelope moves down a little
  const cT = fT + fD + 100;
  A(card, [{ transform: 'translate(0,0) rotate(0deg)' }, { transform: `translate(${envW * .02}px,${-rise}px) rotate(-2.6deg)` }], { duration: 1150, delay: cT, easing: EASE.soft });
  parts.forEach(p => A(p, [{ transform: 'translateY(0)' }, { transform: `translateY(${pushDown}px)` }], { duration: 1150, delay: cT, easing: EASE.soft }));
  // 4 envelope dropped out of frame; card lifted free of the pocket
  const dT = cT + 1200;
  setTimeout(() => { card.style.zIndex = 8; }, dT);
  parts.forEach(p => A(p, [{ transform: `translateY(${pushDown}px)`, opacity: 1 }, { transform: `translateY(${vh * 1.05}px)`, opacity: 1 }], { duration: 800, delay: dT, easing: EASE.in }));
  // 5 card to the camera
  const camT = dT + 150, s = Math.min(vw * .94 / cr.width, vh * .72 / cr.height, 2.2);
  A(card, [{ transform: `translate(${envW * .02}px,${-rise}px) rotate(-2.6deg) scale(1)` }, { transform: `translate(${vw / 2 - ccx}px,${vh * .5 - ccy}px) rotate(0deg) scale(${s})` }], { duration: 1050, delay: camT, easing: EASE.out });
  A(head, [{ opacity: 1 }, { opacity: 0 }], { duration: 700, delay: dT });
  // 6 fade through dark into the cover
  const vT = camT + 1000;
  A(veil, [{ opacity: 0 }, { opacity: 1 }], { duration: 650, delay: vT, easing: 'ease-in' });
  setTimeout(onMid, vT + 650);
  const fin = A(veil, [{ opacity: 1 }, { opacity: 0 }], { duration: 900, delay: vT + 700, easing: 'ease-out' });
  fin.onfinish = onDone;
  return vT + 1600;
}

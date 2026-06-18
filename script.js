/* =============================================
   ROSHNI — CINEMATIC APOLOGY WEBSITE
   script.js — Full Interaction Engine
   ============================================= */

'use strict';

// ─── GLOBALS ─────────────────────────────────
let soundEnabled = false;
let audioCtx = null;
let punchCount = 0;
let loaderDone = false;
let noBtn, yesBtn;

const PROMISES = [
  '"I\'ll always listen first."',
  '"I\'ll never let silence grow between us again."',
  '"I\'ll be honest, even when it\'s uncomfortable."',
  '"I\'ll respect your space without making you feel guilty."',
  '"I\'ll say sorry sooner, not louder."',
  '"I\'ll make space for your quiet moods."',
  '"I\'ll never assume — I\'ll always ask."',
  '"I\'ll hold the friendship with both hands."',
  '"I\'ll show up, even in the ordinary days."',
];

const LETTER_TEXT = `I don't know what changed, ma. I've replayed every conversation, every moment — and I still can't find the exact place where things shifted. Maybe I was careless in ways I didn't realise. Maybe I missed something important you needed from me.\n\nWhat I do know is this: you were never just someone I spoke to. You were someone I genuinely cared about. That kind of connection doesn't come often, and I should have been more careful with it.\n\nIf I hurt you — knowingly or unknowingly, Roshnu — I am truly sorry from the deepest part of my heart. Not a quick sorry. The kind that sits quietly and means something.\n\nI'm not here asking for anything. No reply needed. No explanation required. Your silence deserves as much respect as your words ever did.\n\nI simply wanted you to know — that I'm sorry, and that this connection mattered to me.`;

// ─── CURSOR ───────────────────────────────────
(function initCursor() {
  const glow = document.getElementById('cursor-glow');
  const dot  = document.getElementById('cursor-dot');
  let mx = -100, my = -100;
  let gx = -100, gy = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animateCursor() {
    gx += (mx - gx) * 0.1;
    gy += (my - gy) * 0.1;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animateCursor);
  })();
})();

// ─── AUDIO ────────────────────────────────────
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, type = 'sine', duration = 0.15, vol = 0.06) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(); osc.stop(ctx.currentTime + duration);
  } catch(e) {}
}

function playHeartbeat() {
  if (!soundEnabled) return;
  playTone(80, 'sine', 0.08, 0.08);
  setTimeout(() => playTone(65, 'sine', 0.1, 0.06), 120);
}

function playPunch() {
  if (!soundEnabled) return;
  playTone(120, 'sawtooth', 0.08, 0.12);
}

function playChime() {
  if (!soundEnabled) return;
  [523, 659, 784].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.3, 0.05), i * 120));
}

function playBurst() {
  if (!soundEnabled) return;
  [261, 329, 392, 523, 659].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.4, 0.04), i * 80));
}

document.getElementById('sound-toggle').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  document.getElementById('sound-on-icon').style.display  = soundEnabled ? 'block' : 'none';
  document.getElementById('sound-off-icon').style.display = soundEnabled ? 'none' : 'block';
  if (soundEnabled) {
    try { getAudioCtx().resume(); } catch(e) {}
    playChime();
  }
});

// ─── LOADER ───────────────────────────────────
(function initLoader() {
  const canvas = document.getElementById('loader-canvas');
  const ctx = canvas.getContext('2d');
  const loaderParticles = [];
  let progress = 0;
  let animFrame;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // loader particles
  for (let i = 0; i < 60; i++) {
    loaderParticles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loaderParticles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,149,108,${p.alpha})`;
      ctx.fill();
    });
    animFrame = requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // heartbeat sound every 1.4s
  const hbInterval = setInterval(playHeartbeat, 1400);

  // typed loader text
  const loaderTyped = document.getElementById('typed-loader');
  const loaderMsg   = 'Some bonds are too precious to lose...';
  let charIdx = 0;
  const typeInterval = setInterval(() => {
    if (charIdx < loaderMsg.length) {
      loaderTyped.textContent += loaderMsg[charIdx++];
    } else {
      clearInterval(typeInterval);
    }
  }, 55);

  // progress bar
  const bar = document.getElementById('loader-bar');
  const progressInterval = setInterval(() => {
    progress += Math.random() * 3 + 1;
    if (progress >= 100) { progress = 100; clearInterval(progressInterval); }
    bar.style.width = progress + '%';
  }, 60);

  // finish loader after ~4.2s
  setTimeout(() => {
    clearInterval(hbInterval);
    cancelAnimationFrame(animFrame);
    const loader = document.getElementById('loader');
    const main   = document.getElementById('main-site');

    loader.style.transition = 'opacity 1.2s ease';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      main.style.transition = 'opacity 1s ease';
      main.style.opacity = '1';
      loaderDone = true;
      afterLoaderInit();
    }, 1200);
  }, 4200);
})();

// ─── AFTER LOADER ─────────────────────────────
function afterLoaderInit() {
  AOS.init({ duration: 900, easing: 'ease-out-cubic', once: true, offset: 60 });
  initThreeJS();
  initFloatingPetals();
  initHeroFadeIn();
  initLetterTyping();
  initMagneticButtons();
  initFinale();
  initNoButton();
  initSectionUnlocks();
}

// ─── SECTION LOCKING / REVEAL CTAs ────────────
function unlockSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  section.classList.add('section-unlocked');
  setTimeout(() => {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.AOS) AOS.refreshHard();
  }, 100);
  playChime();

  if (sectionId === 'section-finale') {
    setTimeout(() => {
      const fq = document.getElementById('finale-quote');
      if (fq) fq.classList.add('visible');
    }, 600);
  }
}

function initSectionUnlocks() {
  const r2 = document.getElementById('reveal-section-two');
  if (r2) r2.addEventListener('click', () => unlockSection('section-two'));

  const r4 = document.getElementById('reveal-section-four');
  if (r4) r4.addEventListener('click', () => unlockSection('section-four'));

  const rf = document.getElementById('reveal-finale');
  if (rf) rf.addEventListener('click', () => unlockSection('section-finale'));
}

// ─── THREE.JS BACKGROUND ──────────────────────
function initThreeJS() {
  const canvas   = document.getElementById('three-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 8;

  // Heart shape
  function createHeartShape() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.5);
    shape.bezierCurveTo(0, 1.2, 1.2, 1.2, 1.2, 0.3);
    shape.bezierCurveTo(1.2, -0.5, 0, -0.8, 0, -1.2);
    shape.bezierCurveTo(0, -0.8, -1.2, -0.5, -1.2, 0.3);
    shape.bezierCurveTo(-1.2, 1.2, 0, 1.2, 0, 0.5);
    return shape;
  }

  const hearts = [];
  const heartGeom = new THREE.ShapeGeometry(createHeartShape());
  const heartMat  = new THREE.MeshBasicMaterial({
    color: 0x9b1b30, transparent: true, opacity: 0.18, side: THREE.DoubleSide,
  });

  for (let i = 0; i < 18; i++) {
    const mesh = new THREE.Mesh(heartGeom, heartMat.clone());
    const s = Math.random() * 0.25 + 0.06;
    mesh.scale.set(s, s, s);
    mesh.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 5,
    );
    mesh.userData = {
      vx: (Math.random() - 0.5) * 0.005,
      vy: Math.random() * 0.006 + 0.003,
      vr: (Math.random() - 0.5) * 0.01,
      amp: Math.random() * 0.004 + 0.002,
      freq: Math.random() * 0.02 + 0.01,
      phase: Math.random() * Math.PI * 2,
    };
    scene.add(mesh);
    hearts.push(mesh);
  }

  // Particles
  const pGeo = new THREE.BufferGeometry();
  const pCount = 180;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 30;
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xc9956c, size: 0.04, transparent: true, opacity: 0.5 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Mouse parallax
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    // parallax camera drift
    camera.position.x += (mx * 0.6 - camera.position.x) * 0.03;
    camera.position.y += (-my * 0.4 - camera.position.y) * 0.03;

    hearts.forEach(h => {
      h.position.x += h.userData.vx + Math.sin(t * h.userData.freq + h.userData.phase) * h.userData.amp;
      h.position.y += h.userData.vy;
      h.rotation.z += h.userData.vr;
      if (h.position.y > 10) h.position.y = -10;
      h.material.opacity = 0.1 + Math.sin(t * 0.8 + h.userData.phase) * 0.08;
    });

    particles.rotation.y = t * 0.01;
    particles.rotation.x = t * 0.005;

    renderer.render(scene, camera);
  }
  animate();
}

// ─── FLOATING PETALS ──────────────────────────
function initFloatingPetals() {
  const layer  = document.getElementById('floating-layer');
  const ITEMS  = ['🌸','❤️','✦','🌹','◈','❋','✿','♥','🌺'];
  const COUNT  = window.innerWidth < 600 ? 12 : 22;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'float-petal';
    el.textContent = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const size = Math.random() * 0.8 + 0.5;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${size}rem;
      opacity: 0;
      animation-duration: ${Math.random() * 14 + 10}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    layer.appendChild(el);
  }
}

// ─── HERO FADE IN ─────────────────────────────
function initHeroFadeIn() {
  const els = document.querySelectorAll('.fade-in-up');
  els.forEach(el => {
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => {
      el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
    }, 400 + delay);
  });
}

// ─── LETTER TYPING ────────────────────────────
function initLetterTyping() {
  const el    = document.getElementById('letter-typed');
  const sign  = document.getElementById('letter-sign');
  if (!el) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      let i = 0;
      const paragraphs = LETTER_TEXT.split('\n');
      let html = '';
      let para = 0;
      let charInPara = 0;

      const typeNext = () => {
        if (para >= paragraphs.length) {
          setTimeout(() => {
            sign.style.opacity = '1';
          }, 400);
          return;
        }
        const line = paragraphs[para];
        if (charInPara < line.length) {
          html += line[charInPara];
          charInPara++;
          // reconstruct display
          const done = paragraphs.slice(0, para).join('<br/><br/>');
          el.innerHTML = (done ? done + '<br/><br/>' : '') + html;
          setTimeout(typeNext, Math.random() * 18 + 12);
        } else {
          para++;
          charInPara = 0;
          html = '';
          setTimeout(typeNext, 350);
        }
      };
      setTimeout(typeNext, 300);
    }
  }, { threshold: 0.3 });

  const section = document.getElementById('section-three');
  if (section) observer.observe(section);
}

// ─── PUNCH BUTTON ─────────────────────────────
const PUNCH_MESSAGES = [
  "I probably deserved that one.",
  "Okay... that one definitely landed.",
  "Still not enough? That's okay.",
  "Take your time, Roshnu.",
  "If it helps, keep going.",
];
let punchDynamicTimer = null;

document.getElementById('punch-btn') && document.getElementById('punch-btn').addEventListener('click', () => {
  punchCount++;
  const countEl = document.getElementById('punch-count');
  countEl.textContent = '×' + punchCount;
  countEl.style.transform = 'scale(1.4)';
  setTimeout(() => countEl.style.transform = 'scale(1)', 200);
  playPunch();

  // ripple
  const btn = document.getElementById('punch-btn');
  btn.style.transform = 'scale(0.9)';
  setTimeout(() => btn.style.transform = '', 120);

  // spawn mini hearts
  spawnMiniBurst(btn, 4, ['💔','✦','•']);

  // dynamic message after every punch (random pick)
  const dynEl = document.getElementById('punch-dynamic');
  if (dynEl) {
    clearTimeout(punchDynamicTimer);
    const msg = PUNCH_MESSAGES[Math.floor(Math.random() * PUNCH_MESSAGES.length)];
    dynEl.textContent = msg;
    dynEl.classList.add('show');
    punchDynamicTimer = setTimeout(() => dynEl.classList.remove('show'), 2600);
  }

  // reveal "Feeling a little better?" after 3 punches
  if (punchCount >= 3) {
    const enoughBtn = document.getElementById('enough-btn');
    if (enoughBtn && enoughBtn.style.display === 'none') {
      enoughBtn.style.display = 'inline-block';
      enoughBtn.style.opacity = '0';
      enoughBtn.style.transform = 'translateY(10px)';
      requestAnimationFrame(() => {
        enoughBtn.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        enoughBtn.style.opacity = '1';
        enoughBtn.style.transform = 'translateY(0)';
      });
    }
  }
});

document.getElementById('enough-btn') && document.getElementById('enough-btn').addEventListener('click', () => {
  unlockSection('section-three');
});

// ─── PROMISES ─────────────────────────────────
let currentPromise = 0;
function setPromise(idx) {
  const el = document.getElementById('promise-text');
  if (!el) return;
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = PROMISES[idx % PROMISES.length];
    el.style.opacity = '1';
    el.style.transition = 'opacity 0.4s';
  }, 200);
}

document.getElementById('draw-promise') && document.getElementById('draw-promise').addEventListener('click', () => {
  currentPromise = (currentPromise + 1) % PROMISES.length;
  setPromise(currentPromise);
  playChime();
});

// ─── PEACE BUTTON — MASSIVE BURST ─────────────
document.getElementById('peace-btn') && document.getElementById('peace-btn').addEventListener('click', () => {
  triggerMassiveBurst();
  playBurst();
  const peaceBtn = document.getElementById('peace-btn');
  if (peaceBtn) peaceBtn.style.display = 'none';

  // reveal "One final question..." CTA after burst settles
  setTimeout(() => {
    const cta = document.getElementById('reveal-finale');
    if (cta) {
      cta.style.display = 'inline-block';
      cta.style.opacity = '0';
      cta.style.transform = 'translateY(10px)';
      requestAnimationFrame(() => {
        cta.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cta.style.opacity = '1';
        cta.style.transform = 'translateY(0)';
      });
    }
  }, 2200);
});

// ─── MASSIVE BURST ────────────────────────────
function triggerMassiveBurst() {
  const layer = document.getElementById('burst-layer');
  const ITEMS = ['❤️','🌸','✦','🌺','◈','❋','🎈','✿','♥','🌹','💕','⭐','💫'];
  const COUNT = window.innerWidth < 600 ? 60 : 120;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < COUNT; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'burst-item';
      const angle = Math.random() * Math.PI * 2;
      const dist  = Math.random() * (window.innerHeight * 0.9) + 100;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist - Math.random() * 200;
      const tr = (Math.random() - 0.5) * 720;
      const dur = Math.random() * 1200 + 800;
      el.style.cssText = `
        left: ${cx}px; top: ${cy}px;
        font-size: ${Math.random() * 1.5 + 0.8}rem;
        --tx: ${tx}px; --ty: ${ty}px; --tr: ${tr}deg;
        animation-duration: ${dur}ms;
      `;
      el.textContent = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      layer.appendChild(el);
      setTimeout(() => el.remove(), dur + 100);
    }, Math.random() * 400);
  }

  // glow wave
  const wave = document.createElement('div');
  wave.style.cssText = `
    position: fixed; inset: 0; pointer-events: none; z-index: 499;
    background: radial-gradient(circle at 50% 50%, rgba(155,27,48,0.35), transparent 70%);
    animation: waveExpand 1.5s ease forwards;
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = `@keyframes waveExpand {
    0%   { opacity: 0; transform: scale(0.3); }
    30%  { opacity: 1; }
    100% { opacity: 0; transform: scale(3); }
  }`;
  document.head.appendChild(styleTag);
  document.body.appendChild(wave);
  setTimeout(() => { wave.remove(); styleTag.remove(); }, 1600);
}

// ─── MINI BURST ───────────────────────────────
function spawnMiniBurst(el, count, items) {
  const layer = document.getElementById('burst-layer');
  const rect  = el.getBoundingClientRect();
  const cx    = rect.left + rect.width  / 2;
  const cy    = rect.top  + rect.height / 2;
  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.className = 'burst-item';
    const angle = Math.random() * Math.PI * 2;
    const dist  = Math.random() * 80 + 30;
    div.style.cssText = `
      left: ${cx}px; top: ${cy}px;
      font-size: 1rem;
      --tx: ${Math.cos(angle)*dist}px;
      --ty: ${Math.sin(angle)*dist}px;
      --tr: ${(Math.random()-0.5)*360}deg;
      animation-duration: 700ms;
    `;
    div.textContent = items[Math.floor(Math.random() * items.length)];
    layer.appendChild(div);
    setTimeout(() => div.remove(), 800);
  }
}

// ─── MAGNETIC BUTTONS ─────────────────────────
function initMagneticButtons() {
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ─── FINALE ───────────────────────────────────
function initFinale() {
  // Finale quote reveal is now triggered directly when section-finale unlocks
  // (see unlockSection), so no scroll observer is needed here.
}

// ─── NO BUTTON CAT & MOUSE ────────────────────
function initNoButton() {
  noBtn  = document.getElementById('no-btn');
  yesBtn = document.getElementById('yes-btn');
  if (!noBtn || !yesBtn) return;

  const container = document.querySelector('.sq-buttons');

  function getRandomPos() {
    const cRect = container.getBoundingClientRect();
    const nRect = noBtn.getBoundingClientRect();
    const margin = 20;
    const maxX   = window.innerWidth  - nRect.width  - margin;
    const maxY_  = window.innerHeight - nRect.height - margin;
    return {
      x: Math.random() * (maxX - margin) + margin,
      y: Math.random() * (maxY_ - margin) + margin,
    };
  }

  function moveNoBtn() {
    const pos = getRandomPos();
    noBtn.style.position  = 'fixed';
    noBtn.style.left      = pos.x + 'px';
    noBtn.style.top       = pos.y + 'px';
    noBtn.style.zIndex    = '9990';
    noBtn.style.transition = 'left 0.15s ease, top 0.15s ease';
  }

  // On hover/touch, flee
  noBtn.addEventListener('mousemove', moveNoBtn);
  noBtn.addEventListener('touchstart', e => { e.preventDefault(); moveNoBtn(); }, { passive: false });
  noBtn.addEventListener('click', moveNoBtn); // in case they somehow click

  // YES handler
  yesBtn.addEventListener('click', () => {
    playBurst();
    spawnMiniBurst(yesBtn, 20, ['❤️','🌸','✦','🌺','💕']);
    triggerMassiveBurst();

    const sorryQ = document.getElementById('sorry-question');
    const yesR   = document.getElementById('yes-response');
    if (sorryQ) sorryQ.style.display = 'none';
    if (noBtn)  noBtn.style.display  = 'none';
    if (yesR)   yesR.style.display   = 'block';
  });
}

// ─── PUNCH & PROMISE: delayed init ────────────
// (buttons exist in HTML from the start, but we guard with checks above)
// Re-attach after DOMContentLoaded just to be safe
window.addEventListener('load', () => {
  // ensure promise default shown
  setPromise(0);
});
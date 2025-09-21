/* ---------------- QUOTES ---------------- */
window.quotes = window.quotes || [
  'Be where your feet are.',
  'Breathe in calm, breathe out tension.',
  'You are exactly where you need to be.',
  'Let thoughts pass like clouds.',
  'Inhale courage, exhale fear.',
  'Peace begins with a single breath.',
  'Slow down, you’re already here.',
  'Exhale what you can’t control.',
  'Notice the present moment.',
  'Stillness is strength.',
  'Start again—right now.',
  'Softer breath, softer day.',
  'Let the body lead the mind.',
  'Being over doing.',
  'Arrive, don’t strive.',
  'Kindness is your baseline.',
  'Peace is a practice.',
  'Anchor in what’s true.',
  'Breathe: this is temporary.',
  'A quiet mind sees clearly.',
  'Unclench, unwind, unbusy.',
  'Flow with what is.',
  'Presence over perfection.'
];

// Show quote on load (remember last)
(() => {
  const qEl = document.getElementById('quoteText');
  if (!qEl) return;
  const last = localStorage.getItem('last_quote');
  const start = last || window.quotes[Math.floor(Math.random()*window.quotes.length)] || '';
  qEl.textContent = start ? `"${start}"` : '';
})();

// Persist shown quote when clicking New Quote
(() => {
  const btn = document.getElementById('newQuote');
  const qEl = document.getElementById('quoteText');
  if (!btn || !qEl) return;
  btn.addEventListener('click', () => {
    const txt = qEl.textContent.replace(/^"|"$/g,'');
    localStorage.setItem('last_quote', txt);
    const pick = window.quotes[Math.floor(Math.random()*window.quotes.length)] || txt;
    qEl.textContent = `"${pick}"`;
  });
})();

// Keyboard shortcut: q = new quote
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'q') {
    const btn = document.getElementById('newQuote');
    btn && btn.click();
  }
});

// Show total sessions on load
(() => {
  const msg = document.getElementById('sessionMsg');
  if (!msg) return;
  const c = +localStorage.getItem('sessions') || 0;
  if (c > 0) msg.textContent = `Total sessions: ${c}`;
})();

// Guard timer if tab hidden
document.addEventListener('visibilitychange', () => {
  const el = document.getElementById('medTimer');
  if (!el) return;
  const txt = el.textContent || '00:00';
  const [mm, ss] = txt.split(':').map(n => +n || 0);
  if (mm < 0 || ss < 0) el.textContent = '00:00';
});

// ARIA for breathing circle
(() => {
  const circle = document.getElementById('breathCircle');
  if (!circle) return;
  circle.setAttribute('role','status');
  circle.setAttribute('aria-live','polite');
})();

/* ---------------- BACKGROUND ROTATION ---------------- */
const bgImages = [
  "https://i.pinimg.com/736x/1d/c8/61/1dc8619487310884c9d631d689ece1e7.jpg",
  "https://i.pinimg.com/736x/9a/33/46/9a3346b1173f198a38274bf454aec9cd.jpg",
  "https://i.pinimg.com/1200x/e5/7d/50/e57d509746579cd54b6cb4c6df97dc5e.jpg",
  "https://i.pinimg.com/736x/1a/49/7d/1a497d829b797c94cf2d81d371054610.jpg",
  "https://i.pinimg.com/1200x/57/9b/bc/579bbc201b838d4ce9d64ff98f778b79.jpg",
  "https://i.pinimg.com/1200x/b5/de/dc/b5dedcba950da0de55295edfa743a9c0.jpg",
  "https://i.pinimg.com/736x/3d/37/4a/3d374a5a8c0b0a7be1391bd705c17d8f.jpg",
  "https://i.pinimg.com/1200x/7e/c0/82/7ec082225592e135c5ca2553b0923cc6.jpg"
];

(() => {
  const sec = document.querySelector('.section');
  if (!sec || !bgImages.length) return;
  let idx = +(localStorage.getItem('gb_bg_idx') || Math.floor(Math.random()*bgImages.length));
  const apply = i => {
    const url = bgImages[i % bgImages.length];
    sec.style.background = `url('${url}') center/cover no-repeat`;
    localStorage.setItem('gb_bg_idx', String(i % bgImages.length));
  };
  apply(idx);
  setInterval(() => { idx = (idx + 1) % bgImages.length; apply(idx); }, 20000);
})();

/* ---------------- BREATHING LOOP ---------------- */
(() => {
  const circle = document.getElementById('breathCircle');
  const toggle = document.getElementById('toggleBreath');
  if (!circle || !toggle) return;

  circle.style.transition = 'transform 1s linear, background-color .25s ease, color .25s ease';

  let int = null, running = false, t = 0;

  function tick(){
    t++;
    const phase = t % 8; // 0..3 inhale, 4..7 exhale
    const scale = phase < 4 ? 1 + phase*0.1 : 1.4 - (phase-4)*0.1;
    circle.style.transform = `scale(${scale.toFixed(2)})`;
    circle.textContent = (phase < 4) ? 'Inhale' : 'Exhale';
  }

  const btn = toggle.cloneNode(true);
  toggle.replaceWith(btn);
  btn.addEventListener('click', () => {
    running = !running;
    if (running) {
      t = 0;
      if (int) clearInterval(int);
      int = setInterval(tick, 1000);
      btn.textContent = 'Stop Breathing';
    } else {
      if (int) clearInterval(int);
      circle.style.transform = 'scale(1)';
      circle.textContent = 'Paused';
      btn.textContent = 'Start Breathing';
    }
  });
})();

/* ---------------- AMBIENT SOUND ----------------
   Uses audio#ambient if audio/forest.mp3 exists.
   If it doesn’t, auto-fallback to generated brown-noise. */
(() => {
  const audioEl = document.getElementById('ambient');
  const playBtn = document.getElementById('playSound');
  if (!playBtn) return;

  let usingGenerated = false;
  let ctx, source, gain;

  function startGeneratedNoise(){
    if (usingGenerated) return;
    usingGenerated = true;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Brown noise generator
    const node = ctx.createScriptProcessor(4096, 1, 1);
    let lastOut = 0.0;
    node.onaudioprocess = e => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < output.length; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 0.25; // volume
      }
    };
    gain = ctx.createGain();
    gain.gain.value = 0.15; // gentle level
    node.connect(gain).connect(ctx.destination);
    source = node;
  }

  function stopGeneratedNoise(){
    if (!usingGenerated) return;
    usingGenerated = false;
    try { source && source.disconnect(); } catch {}
    try { gain && gain.disconnect(); } catch {}
    try { ctx && ctx.close(); } catch {}
    source = gain = ctx = null;
  }

  // Decide whether the <audio> has a playable source
  let useTag = false;
  if (audioEl) {
    const src = audioEl.querySelector('source');
    if (src && src.getAttribute('src')) useTag = true;
  }

  const btn = playBtn.cloneNode(true);
  playBtn.replaceWith(btn);

  btn.addEventListener('click', async () => {
    if (useTag && audioEl) {
      if (audioEl.paused) {
        try { await audioEl.play(); btn.textContent = 'Pause Ambient'; }
        catch { // if playback fails (blocked), fall back
          useTag = false;
          startGeneratedNoise(); btn.textContent = 'Pause Ambient';
        }
      } else {
        audioEl.pause(); btn.textContent = 'Toggle Ambient';
      }
    } else {
      // Generated fallback
      if (!usingGenerated) {
        startGeneratedNoise(); btn.textContent = 'Pause Ambient';
      } else {
        stopGeneratedNoise(); btn.textContent = 'Toggle Ambient';
      }
    }
  });
})();

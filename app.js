/*
 * ================================================
 *  RETO AHORRO 8 MILLONES
 *  Desarrollado por Deison Bm
 * ================================================
 */

// ---- CONFIGURACION -----------------------------

const API_URL = 'https://script.google.com/macros/s/AKfycbxT49PzJqFvU-QbFL2zq1LPqMTpdViet0AX2x-HU1_B4cJn7hnlOqa1fY_JnwmTCMD9/exec';

const META = 8_000_000;
const SKEY = 'ra8m_state';
const TKEY = 'ra8m_theme';
const AKEY = 'ra8m_auth';

// PIN secreto almacenado como hash djb2 — el codigo real es 2323
const _H = (s) => [...s].reduce((h, c) => Math.imul(31, h) + c.charCodeAt(0) | 0, 5381);
const _PIN_HASH = _H('2323');

// Distribucion exacta: 200 casillas = $8.000.000
const DIST = [
  [2_000,   20],
  [5_000,   20],
  [10_000,  30],
  [20_000,  30],
  [33_000,  20],
  [50_000,  30],
  [80_000,  30],
  [120_000, 20],
];

const COLORS = {
  2000:   '#34d399',
  5000:   '#22d3ee',
  10000:  '#818cf8',
  20000:  '#c084fc',
  33000:  '#f472b6',
  50000:  '#fb923c',
  80000:  '#f87171',
  120000: '#fbbf24',
};

// ---- ESTADO ------------------------------------

let casillas  = [];
let pinBuffer = '';
let filtro    = 'all';

// ---- ARRANQUE ----------------------------------

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  buildStars();
  initLogin();
  if (sessionStorage.getItem(AKEY) === '1') bootApp();
});

// ---- ESTRELLAS ANIMADAS (canvas login) ---------

function buildStars() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 130 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      o: Math.random(),
      s: Math.random() * 0.003 + 0.001,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      star.o += star.s;
      if (star.o > 1 || star.o < 0) star.s *= -1;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0,Math.min(1,star.o)).toFixed(2)})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// ---- LOGIN -------------------------------------

function initLogin() {
  document.querySelectorAll('.kbtn[data-n]').forEach(btn => {
    btn.addEventListener('click', () => pressKey(btn.dataset.n));
  });
  document.getElementById('kbtn-del').addEventListener('click', delKey);

  document.addEventListener('keydown', e => {
    if (document.getElementById('login-screen').classList.contains('hidden')) return;
    if (e.key >= '0' && e.key <= '9') pressKey(e.key);
    if (e.key === 'Backspace') delKey();
  });
}

function pressKey(n) {
  if (pinBuffer.length >= 4) return;
  pinBuffer += n;
  updateDots();
  if (pinBuffer.length === 4) setTimeout(checkPin, 180);
}

function delKey() {
  pinBuffer = pinBuffer.slice(0, -1);
  updateDots();
}

function updateDots() {
  for (let i = 0; i < 4; i++) {
    const d = document.getElementById(`pd${i}`);
    d.classList.toggle('filled', i < pinBuffer.length);
    d.classList.remove('shake');
  }
}

function checkPin() {
  if (_H(pinBuffer) === _PIN_HASH) {
    // Correcto: animar a verde y entrar
    sessionStorage.setItem(AKEY, '1');
    for (let i = 0; i < 4; i++) {
      const d = document.getElementById(`pd${i}`);
      d.style.background   = '#00e5a0';
      d.style.borderColor  = '#00e5a0';
      d.style.boxShadow    = '0 0 12px #00e5a0';
    }
    setTimeout(bootApp, 480);
  } else {
    // Incorrecto: sacudir y mostrar error
    for (let i = 0; i < 4; i++) {
      document.getElementById(`pd${i}`).classList.add('shake');
    }
    const msg = document.getElementById('pin-msg');
    msg.classList.remove('hidden');
    pinBuffer = '';
    setTimeout(() => {
      updateDots();
      msg.classList.add('hidden');
    }, 1300);
  }
}

// ---- INICIAR APP -------------------------------

function bootApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');

  generarCasillas();
  cargarLocal();
  renderLegend();
  renderGrid();
  updateDash();
  bindEvents();
  syncFromAPI();
}

// ---- GENERACION DE CASILLAS --------------------

function generarCasillas() {
  const base = [];
  DIST.forEach(([monto, qty]) => {
    for (let i = 0; i < qty; i++) {
      base.push({ monto, done: false, updatedAt: null });
    }
  });

  // Mezcla aleatoria Fisher-Yates
  for (let i = base.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [base[i], base[j]] = [base[j], base[i]];
  }

  casillas = base.map((c, i) => ({ id: i + 1, ...c }));
}

// ---- ALMACENAMIENTO LOCAL ----------------------

function cargarLocal() {
  try {
    const saved = JSON.parse(localStorage.getItem(SKEY));
    if (Array.isArray(saved) && saved.length === 200) casillas = saved;
  } catch (_) {}
}

function guardarLocal() {
  localStorage.setItem(SKEY, JSON.stringify(casillas));
}

// ---- RENDER ------------------------------------

function renderLegend() {
  const leg = document.getElementById('legend');
  leg.innerHTML = '';
  DIST.forEach(([monto]) => {
    const div = document.createElement('div');
    div.className = 'leg-item';
    div.innerHTML = `<span class="leg-dot" style="background:${COLORS[monto]}"></span>${fmt(monto)}`;
    leg.appendChild(div);
  });
}

function renderGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  casillas.forEach(c => grid.appendChild(makeCasilla(c)));
  aplicarFiltro();
}

function makeCasilla(c) {
  const div = document.createElement('div');
  div.className = 'casilla' + (c.done ? ' done' : '');
  div.dataset.id = c.id;
  div.style.setProperty('--cc', COLORS[c.monto] || '#ffffff');

  div.innerHTML = `
    <span class="cas-num">#${String(c.id).padStart(3, '0')}</span>
    <span class="cas-amount">${fmt(c.monto)}</span>
    <i class="fa-solid fa-circle-check cas-check"></i>
    <div class="cas-particles"></div>
  `;

  div.addEventListener('click', () => marcarCasilla(c.id));
  return div;
}

// ---- MARCAR CASILLA (solo se puede marcar, no desmarcar) ---

function marcarCasilla(id) {
  const c = casillas.find(x => x.id === id);
  if (!c || c.done) return; // Si ya esta marcada, ignorar

  c.done      = true;
  c.updatedAt = new Date().toISOString();

  const el = document.querySelector(`.casilla[data-id="${id}"]`);
  if (el) {
    el.classList.add('done');
    el.classList.add('popping');
    el.addEventListener('animationend', () => el.classList.remove('popping'), { once: true });
    spawnParticles(el, COLORS[c.monto]);
  }

  guardarLocal();
  updateDash();
  aplicarFiltro();
  showToast(`+${fmt(c.monto)} guardado`);
  enviarAPI(c);
}

// ---- PARTICULAS DE CELEBRACION -----------------

function spawnParticles(el, color) {
  const container = el.querySelector('.cas-particles');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const p = document.createElement('div');
    p.className = 'cas-p';
    p.style.cssText = `
      left: ${15 + Math.random() * 70}%;
      top:  ${15 + Math.random() * 70}%;
      background: ${color};
      animation-delay: ${i * 28}ms;
      animation-duration: ${380 + Math.random() * 220}ms;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 750);
  }
}

// ---- DASHBOARD ---------------------------------

function updateDash() {
  const done      = casillas.filter(c => c.done);
  const saved     = done.reduce((s, c) => s + c.monto, 0);
  const remaining = META - saved;
  const pct       = Math.min((saved / META) * 100, 100);
  const pending   = casillas.filter(c => !c.done).length;

  document.getElementById('stat-saved').textContent      = fmt(saved);
  document.getElementById('stat-remaining').textContent  = fmt(remaining);
  document.getElementById('stat-count').textContent      = done.length;
  document.getElementById('stat-done-count').textContent = done.length;
  document.getElementById('prog-n').textContent          = done.length;
  document.getElementById('prog-fill').style.width       = `${pct}%`;

  document.getElementById('fc-all').textContent  = 200;
  document.getElementById('fc-pend').textContent = pending;
  document.getElementById('fc-done').textContent = done.length;

  // Anillo SVG
  const circumference = 327;
  const offset = circumference - (circumference * pct / 100);
  const ring = document.getElementById('ring-fill');
  if (ring) ring.style.strokeDashoffset = offset;
  const rPct = document.getElementById('ring-pct');
  if (rPct) rPct.textContent = `${Math.round(pct)}%`;
}

// ---- FILTROS -----------------------------------

function aplicarFiltro() {
  document.querySelectorAll('.casilla').forEach(el => {
    const c = casillas.find(x => x.id === parseInt(el.dataset.id));
    if (!c) return;
    let show = true;
    if (filtro === 'pending') show = !c.done;
    if (filtro === 'done')    show = c.done;
    el.classList.toggle('f-hide', !show);
  });
}

// ---- EVENTOS -----------------------------------

function bindEvents() {

  // Cambiar tema
  document.getElementById('btn-theme').addEventListener('click', toggleTheme);

  // Abrir modal de reset
  document.getElementById('btn-reset').addEventListener('click', () => {
    document.getElementById('modal').classList.remove('hidden');
  });

  // Cancelar reset
  document.getElementById('m-cancel').addEventListener('click', () => {
    document.getElementById('modal').classList.add('hidden');
  });

  // Confirmar reset
  document.getElementById('m-confirm').addEventListener('click', () => {
    document.getElementById('modal').classList.add('hidden');
    resetReto();
  });

  // Cerrar sesion
  document.getElementById('btn-logout').addEventListener('click', () => {
    sessionStorage.removeItem(AKEY);
    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    pinBuffer = '';
    updateDots();
    document.getElementById('pin-msg').classList.add('hidden');
  });

  // Filtros
  document.querySelectorAll('.fpill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.fpill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filtro = btn.dataset.f;
      aplicarFiltro();
    });
  });

  // Cerrar modal al hacer clic fuera
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target.id === 'modal') e.target.classList.add('hidden');
  });
}

// ---- TEMA CLARO / OSCURO -----------------------

function applyTheme() {
  const t = localStorage.getItem(TKEY) || 'dark';
  document.body.className = t;
  updateThemeIcon(t);
}

function toggleTheme() {
  const isDark = document.body.classList.contains('dark');
  const next   = isDark ? 'light' : 'dark';
  document.body.className = next;
  localStorage.setItem(TKEY, next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  if (theme === 'dark') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

// ---- REINICIAR RETO ----------------------------

function resetReto() {
  casillas.forEach(c => { c.done = false; c.updatedAt = null; });
  guardarLocal();
  renderGrid();
  updateDash();
  showToast('Reto reiniciado');
  resetAPI();
}

// ---- API GOOGLE SHEETS -------------------------

async function syncFromAPI() {
  setSyncState('syncing');
  try {
    const res  = await fetch(`${API_URL}?action=getAll`);
    const data = await res.json();

    if (data?.casillas?.length) {
      data.casillas.forEach(remote => {
        const local = casillas.find(c => c.id === remote.id);
        if (local) {
          local.done      = remote.completada;
          local.updatedAt = remote.fechaActualizacion;
        }
      });
      guardarLocal();
      renderGrid();
      updateDash();
    }

    setSyncState('online');
    setStatus(`Sincronizado a las ${new Date().toLocaleTimeString()}`);
  } catch (_) {
    setSyncState('offline');
    setStatus('Sin conexion — datos locales activos');
  }
}

async function enviarAPI(c) {
  if (!API_URL) return;
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'update',
        id: c.id,
        monto: c.monto,
        completada: c.done,
        fechaActualizacion: c.updatedAt,
      }),
    });
    setStatus(`Guardado en la nube — ${new Date().toLocaleTimeString()}`);
  } catch (_) {
    setStatus('Error al guardar en la nube');
  }
}

async function resetAPI() {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'resetAll' }),
    });
  } catch (_) {}
}

// ---- UTILIDADES --------------------------------

function fmt(n) {
  return '$' + n.toLocaleString('es-CO');
}

function setStatus(msg) {
  const el = document.getElementById('status-bar');
  if (el) el.textContent = msg;
}

function setSyncState(state) {
  const dot = document.getElementById('badge-dot');
  const txt = document.getElementById('badge-txt');
  if (!dot || !txt) return;
  if (state === 'online')  { dot.classList.remove('offline'); txt.textContent = 'En linea'; }
  if (state === 'offline') { dot.classList.add('offline');    txt.textContent = 'Local'; }
  if (state === 'syncing') { dot.classList.remove('offline'); txt.textContent = 'Sincronizando...'; }
}

let toastTimer;
function showToast(msg) {
  const el  = document.getElementById('toast');
  const txt = document.getElementById('toast-txt');
  if (!el || !txt) return;
  txt.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2600);
}
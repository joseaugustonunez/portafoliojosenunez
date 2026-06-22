// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  if (!themeIcon) return;
  if (theme === 'light') {
    themeIcon.className = 'fas fa-sun';
    themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
    themeToggle.setAttribute('title', 'Cambiar a modo oscuro');
  } else {
    themeIcon.className = 'fas fa-moon';
    themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
    themeToggle.setAttribute('title', 'Cambiar a modo claro');
  }
}

const savedTheme = localStorage.getItem('theme');
const preferredTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
applyTheme(preferredTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  });
}

// Active nav link highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if(window.scrollY >= s.offsetTop - 100) cur = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#'+cur ? 'var(--cyan)' : '';
  });
});

// Form
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target;
  btn.innerHTML = '<i class="fas fa-check"></i> ¡Mensaje enviado!';
  btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
    btn.style.background = '';
  }, 3000);
}

// Parallax subtle on hero
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  const bg = document.querySelector('.hero-bg');
  if(bg) bg.style.transform = `translate(${x*0.3}px, ${y*0.3}px)`;
});

// Posición inicial fija (no cambia) en toda la sección hero
const orbitItems = Array.from(document.querySelectorAll('#inicio .orbit-item'));
const hero = document.querySelector('#inicio');

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function setFloatingPosition(item) {
  if (!hero) return;

  const w = hero.clientWidth;
  const h = hero.clientHeight;
  const photoW = Math.min(380, w * 0.78);
  const photoH = photoW;
  const maxX = w * 0.46;
  const maxY = h * 0.44;

  let x = 0;
  let y = 0;
  let attempts = 0;

  do {
    x = randomRange(-maxX, maxX);
    y = randomRange(-maxY, maxY);
    attempts += 1;
  } while (Math.abs(x) < photoW * 0.4 && Math.abs(y) < photoH * 0.4 && attempts < 25);

  item.style.setProperty('--x', `${x.toFixed(1)}px`);
  item.style.setProperty('--y', `${y.toFixed(1)}px`);
}

orbitItems.forEach(item => setFloatingPosition(item));

// Física de iconos flotando en gravedad cero (como sólidos en el espacio)
(() => {
  const hero = document.querySelector('#inicio');
  const items = document.querySelectorAll('#inicio .orbit-item');
  if (!hero || !items.length) return;

  const DAMPING = 0.985;
  const MOUSE_FORCE = 0.5;
  const MOUSE_RADIUS = 200;
  const MAX_SPEED = 3;
  const IDLE_DRIFT = 0.015;
  const COLLISION_RADIUS = 26;

  const state = [];
  items.forEach(item => {
    const x = parseFloat(item.style.getPropertyValue('--x')) || 0;
    const y = parseFloat(item.style.getPropertyValue('--y')) || 0;
    state.push({
      item, x, y,
      vx: (Math.random() - 0.5) * IDLE_DRIFT,
      vy: (Math.random() - 0.5) * IDLE_DRIFT,
    });
  });

  let mouseX = -9999, mouseY = -9999, mouseInside = false;

  function tick() {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    const maxX = w * 0.46;
    const maxY = h * 0.44;

    state.forEach(s => {
      if (mouseInside) {
        const r = s.item.getBoundingClientRect();
        const ix = r.left + r.width / 2;
        const iy = r.top + r.height / 2;
        const dx = ix - mouseX;
        const dy = iy - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
          s.vx += (dx / dist) * force;
          s.vy += (dy / dist) * force;
        }
      }

      s.vx += (Math.random() - 0.5) * IDLE_DRIFT;
      s.vy += (Math.random() - 0.5) * IDLE_DRIFT;

      const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      if (speed > MAX_SPEED) {
        s.vx = (s.vx / speed) * MAX_SPEED;
        s.vy = (s.vy / speed) * MAX_SPEED;
      }

      s.x += s.vx;
      s.y += s.vy;

      s.vx *= DAMPING;
      s.vy *= DAMPING;

      if (s.x > maxX) { s.x = maxX; s.vx *= -0.5; }
      if (s.x < -maxX) { s.x = -maxX; s.vx *= -0.5; }
      if (s.y > maxY) { s.y = maxY; s.vy *= -0.5; }
      if (s.y < -maxY) { s.y = -maxY; s.vy *= -0.5; }
    });

    // Colisiones entre iconos
    for (let i = 0; i < state.length; i++) {
      for (let j = i + 1; j < state.length; j++) {
        const a = state[i], b = state[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = COLLISION_RADIUS * 2;

        if (dist < minDist && dist > 0) {
          const overlap = (minDist - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;

          a.x -= nx * overlap;
          a.y -= ny * overlap;
          b.x += nx * overlap;
          b.y += ny * overlap;

          const dvx = a.vx - b.vx;
          const dvy = a.vy - b.vy;
          const dvn = dvx * nx + dvy * ny;

          if (dvn > 0) {
            a.vx -= dvn * nx;
            a.vy -= dvn * ny;
            b.vx += dvn * nx;
            b.vy += dvn * ny;
          }
        }
      }
    }

    state.forEach(s => {
      s.item.style.setProperty('--x', `${s.x.toFixed(1)}px`);
      s.item.style.setProperty('--y', `${s.y.toFixed(1)}px`);
    });

    requestAnimationFrame(tick);
  }

  hero.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseInside = true;
  });
  hero.addEventListener('mouseleave', () => { mouseInside = false; });

  hero.addEventListener('touchmove', e => {
    const t = e.touches[0];
    if (t) { mouseX = t.clientX; mouseY = t.clientY; mouseInside = true; }
  }, { passive: true });
  hero.addEventListener('touchend', () => { mouseInside = false; });
  hero.addEventListener('touchcancel', () => { mouseInside = false; });

  tick();
})();
// ===== LOADER =====
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');

    if (!loader) return;

    loader.classList.add('hide');

    setTimeout(() => {
        loader.style.display = 'none';
    }, 500);
});
const glow = document.querySelector('.cursor-glow');

if (hero && glow) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    glow.style.left = x + 'px';
    glow.style.top = y + 'px';
  });
}

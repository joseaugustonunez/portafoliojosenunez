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

// Repulsión magnética — mouse y touch
(() => {
  const hero = document.querySelector('#inicio');
  const items = document.querySelectorAll('#inicio .orbit-item');
  if (!hero || !items.length) return;

  let rafId;

  function repel(mx, my) {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafId = null;
      items.forEach(item => {
        const r = item.getBoundingClientRect();
        const ix = r.left + r.width / 2;
        const iy = r.top + r.height / 2;

        const dx = ix - mx;
        const dy = iy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 220;
        const maxPush = 40;

        if (dist < radius && dist > 0) {
          const force = 1 - dist / radius;
          item.style.setProperty('--mx', `${(dx / dist * force * maxPush).toFixed(1)}px`);
          item.style.setProperty('--my', `${(dy / dist * force * maxPush).toFixed(1)}px`);
        } else {
          item.style.setProperty('--mx', '0px');
          item.style.setProperty('--my', '0px');
        }
      });
    });
  }

  function resetRepel() {
    if (rafId) cancelAnimationFrame(rafId);
    items.forEach(item => {
      item.style.setProperty('--mx', '0px');
      item.style.setProperty('--my', '0px');
    });
  }

  hero.addEventListener('mousemove', e => repel(e.clientX, e.clientY));
  hero.addEventListener('mouseleave', resetRepel);

  hero.addEventListener('touchmove', e => {
    const t = e.touches[0];
    if (t) repel(t.clientX, t.clientY);
  }, { passive: true });
  hero.addEventListener('touchend', resetRepel);
  hero.addEventListener('touchcancel', resetRepel);
})();

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
  item.style.setProperty('--delay', `${randomRange(0, 4).toFixed(2)}s`);
  item.style.setProperty('--duration', `${randomRange(6, 10).toFixed(1)}s`);
}

orbitItems.forEach(item => setFloatingPosition(item));
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

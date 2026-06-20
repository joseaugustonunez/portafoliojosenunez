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

// Pause float animation on hover for icons
document.querySelectorAll('.orbit-item').forEach(item => {
  const icon = item.querySelector('.tech-icon');
  if (!icon) return;
  item.addEventListener('mouseenter', () => {
    icon.style.animationPlayState = 'paused';
    item.style.animationPlayState = 'paused';
  });
  item.addEventListener('mouseleave', () => {
    icon.style.animationPlayState = 'running';
    item.style.animationPlayState = 'running';
  });
});

// Random floating for hero icons
const orbitItems = Array.from(document.querySelectorAll('.orbit-system .orbit-item'));

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function setRandomPosition(item, delay = 0) {
  const orbitSystem = document.querySelector('.orbit-system');
  if (!orbitSystem) return;

  const size = Math.min(orbitSystem.clientWidth, orbitSystem.clientHeight);
  const photoRadius = size * 0.23;
  const maxX = orbitSystem.clientWidth * 0.46;
  const maxY = orbitSystem.clientHeight * 0.38;

  let x = 0;
  let y = 0;
  let attempts = 0;

  do {
    x = randomRange(-maxX, maxX);
    y = randomRange(-maxY, maxY);
    attempts += 1;
  } while ((Math.abs(x) < photoRadius && Math.abs(y) < photoRadius) && attempts < 12);

  item.style.setProperty('--x', `${x.toFixed(1)}px`);
  item.style.setProperty('--y', `${y.toFixed(1)}px`);
  item.style.transitionDelay = `${delay}s`;
}

function shuffleHeroIcons() {
  orbitItems.forEach((item, index) => {
    setRandomPosition(item, index * 0.08);
  });
}

shuffleHeroIcons();
setInterval(shuffleHeroIcons, 3200);
// ===== LOADER =====
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');

    if (!loader) return;

    loader.classList.add('hide');

    setTimeout(() => {
        loader.style.display = 'none';
    }, 500);
});
const hero = document.querySelector('#inicio');
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
document.querySelectorAll('.tech-float').forEach(icon => {

  icon.addEventListener('mousemove', e => {

    const rect = icon.getBoundingClientRect();

    const x = (e.clientX - rect.left - rect.width/2) * 0.2;
    const y = (e.clientY - rect.top - rect.height/2) * 0.2;

    icon.style.transform =
      `translate(${x}px, ${y}px) scale(1.1)`;
  });

  icon.addEventListener('mouseleave', () => {
    icon.style.transform = '';
  });

});
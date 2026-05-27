// js/welcome.js

/**
 * Инициализация приветственной страницы
 */
export function initWelcome() {
  createFloatingElements();
  bindWelcomeEvents();
  setupScrollAnimations();
}

/**
 * Создание плавающих элементов фона
 */
function createFloatingElements() {
  const bg = document.querySelector('.bg-animation');
  if (!bg) return;

  for (let i = 0; i < 3; i++) {
    const el = document.createElement('div');
    el.className = 'floating';
    bg.appendChild(el);
  }
}

/**
 * Привязка событий
 */
function bindWelcomeEvents() {
  // Кнопка "Начать"
  const startBtn = document.getElementById('startBtn');
  startBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateSmooth('index');
  });

  // Кнопка "Узнать больше"
  const learnBtn = document.getElementById('learnBtn');
  learnBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToFeatures();
  });

  // Плавный скролл по якорям
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/**
 * Плавный переход на другую страницу
 */
function navigateSmooth(page) {
  const container = document.querySelector('.welcome-container');
  container?.classList.add('fade-out');

  setTimeout(() => {
    window.location.href = `${page}.html`;
  }, 300);
}

/**
 * Скролл к секции с фичами
 */
function scrollToFeatures() {
  const features = document.querySelector('.welcome-card');
  features?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Анимации при скролле
 */
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Наблюдаем за карточками фич
  document.querySelectorAll('.feature-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`;
    observer.observe(el);
  });
}

// Auto-init
if (document.querySelector('.welcome-container')) {
  initWelcome();
}
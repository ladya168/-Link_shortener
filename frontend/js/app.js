// js/app.js
import { shortenUrl, shortenUrlWithSlug } from './api.js';
import {
  showToast,
  showError,
  copyToClipboard,
  setLoadingState,
  toggleElement,
  isValidUrl,
  isValidSlug
} from './ui.js';

// ===== DOM Elements =====
const elements = {
  form: null,
  longUrlInput: null,
  useCustomSlug: null,
  customSlugContainer: null,
  customSlugInput: null,
  submitBtn: null,
  resultSection: null,
  shortUrlInput: null,
  copyBtn: null,
  errorMessage: null,
};

// ===== Инициализация =====
export function initApp() {
  cacheElements();
  bindEvents();
  focusOnLoad();
}

/**
 * Кэширование элементов DOM
 */
function cacheElements() {
  elements.form = document.getElementById('shortenForm');
  elements.longUrlInput = document.getElementById('longUrl');
  elements.useCustomSlug = document.getElementById('useCustomSlug');
  elements.customSlugContainer = document.getElementById('customSlugContainer');
  elements.customSlugInput = document.getElementById('customSlug');
  elements.submitBtn = document.getElementById('submitBtn');
  elements.resultSection = document.getElementById('result');
  elements.shortUrlInput = document.getElementById('shortUrl');
  elements.copyBtn = document.getElementById('copyBtn');
  elements.errorMessage = document.getElementById('errorMessage');
}

/**
 * Привязка обработчиков событий
 */
function bindEvents() {
  // Переключение кастомного слага
  elements.useCustomSlug?.addEventListener('change', (e) => {
    toggleElement(elements.customSlugContainer, e.target.checked);
    if (!e.target.checked && elements.customSlugInput) {
      elements.customSlugInput.value = '';
    }
  });

  // Отправка формы
  elements.form?.addEventListener('submit', handleFormSubmit);

  // Копирование ссылки
  elements.copyBtn?.addEventListener('click', () => {
    if (elements.shortUrlInput?.value) {
      copyToClipboard(elements.shortUrlInput.value, elements.copyBtn);
    }
  });

  // Автовыделение текста при клике
  elements.shortUrlInput?.addEventListener('click', (e) => e.target.select());

  // Скрытие ошибки при вводе
  elements.longUrlInput?.addEventListener('input', hideError);
  elements.customSlugInput?.addEventListener('input', hideError);

  // Горячие клавиши
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      elements.form?.requestSubmit();
    }
  });
}

/**
 * Фокус на поле ввода при загрузке
 */
function focusOnLoad() {
  elements.longUrlInput?.focus();
}

/**
 * Обработчик отправки формы
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  // Сброс состояния
  toggleElement(elements.resultSection, false);
  hideError();

  const longUrl = elements.longUrlInput?.value.trim();
  const useCustom = elements.useCustomSlug?.checked;
  const customSlug = useCustom ? elements.customSlugInput?.value.trim() : null;

  // Валидация
  if (!validateInput(longUrl, customSlug)) return;

  try {
    setLoadingState(elements.submitBtn, true);

    const shortUrl = useCustom
      ? await shortenUrlWithSlug(longUrl, customSlug)
      : await shortenUrl(longUrl);

    // Показ результата
    if (elements.shortUrlInput) elements.shortUrlInput.value = shortUrl;
    toggleElement(elements.resultSection, true);
    elements.shortUrlInput?.focus();
    elements.shortUrlInput?.select();

    showToast('Ссылка успешно сокращена!', 'success');

  } catch (error) {
    showError(error.message || 'Произошла ошибка при сокращении ссылки');
    console.error('API Error:', error);

  } finally {
    setLoadingState(elements.submitBtn, false);
  }
}

/**
 * Валидация входных данных
 */
function validateInput(longUrl, customSlug) {
  if (!longUrl || !isValidUrl(longUrl)) {
    showError('Пожалуйста, введите корректный URL (например, https://example.com)');
    elements.longUrlInput?.focus();
    return false;
  }

  if (customSlug) {
    if (!isValidSlug(customSlug)) {
      showError('Короткий адрес: только латиница, цифры, -, _ (3-50 символов)');
      elements.customSlugInput?.focus();
      return false;
    }
  }

  return true;
}

/**
 * Скрыть сообщение об ошибке
 */
function hideError() {
  if (elements.errorMessage) {
    elements.errorMessage.classList.remove('show');
  }
}

// Auto-init if this is the main module
if (document.getElementById('shortenForm')) {
  initApp();
}
// js/ui.js

/**
 * Показать/скрыть элемент с анимацией
 */
export function toggleElement(element, show, className = 'show') {
  if (show) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

/**
 * Показать тост-уведомление
 * @param {string} message - Текст уведомления
 * @param {'success'|'error'} type - Тип уведомления
 */
export function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * Показать ошибку в интерфейсе
 * @param {string} message - Текст ошибки
 */
export function showError(message) {
  const errorBox = document.getElementById('errorMessage');
  const errorText = document.getElementById('errorText');

  if (!errorBox || !errorText) return;

  errorText.textContent = message;
  errorBox.classList.add('show');

  setTimeout(() => {
    errorBox.classList.remove('show');
  }, 5000);
}

/**
 * Копировать текст в буфер обмена
 * @param {string} text - Текст для копирования
 * @param {HTMLElement} button - Кнопка для визуального фидбека
 */
export async function copyToClipboard(text, button = null) {
  try {
    await navigator.clipboard.writeText(text);

    if (button) {
      const originalHTML = button.innerHTML;
      button.classList.add('copied');
      button.innerHTML = '<i class="fas fa-check"></i><span>Скопировано!</span>';

      setTimeout(() => {
        button.classList.remove('copied');
        button.innerHTML = originalHTML;
      }, 2000);
    }

    showToast('Ссылка скопирована!', 'success');
    return true;
  } catch {
    // Fallback для старых браузеров
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    showToast('Ссылка скопирована!', 'success');
    return true;
  }
}

/**
 * Управление состоянием кнопки загрузки
 * @param {HTMLElement} button - Кнопка
 * @param {boolean} loading - Состояние загрузки
 */
export function setLoadingState(button, loading) {
  if (!button) return;

  if (loading) {
    button.classList.add('loading');
    button.disabled = true;
  } else {
    button.classList.remove('loading');
    button.disabled = false;
  }
}

/**
 * Плавный переход между страницами
 * @param {string} fromPage - Текущая страница
 * @param {string} toPage - Целевая страница
 */
export function navigateTo(fromPage, toPage) {
  const currentPage = document.getElementById(fromPage);
  const nextPage = document.getElementById(toPage);

  if (!currentPage || !nextPage) {
    window.location.href = toPage + '.html';
    return;
  }

  currentPage.classList.add('fade-out');

  setTimeout(() => {
    window.location.href = toPage + '.html';
  }, 300);
}

/**
 * Валидация URL
 */
export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Валидация слага
 */
export function isValidSlug(slug) {
  return /^[a-zA-Z0-9\-_]{3,50}$/.test(slug);
}
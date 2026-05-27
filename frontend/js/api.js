// js/api.js

/**
 * Конфигурация API
 */
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000',
  TIMEOUT: 10000, // 10 секунд
};

/**
 * Универсальный запрос к API
 * @param {string} endpoint - Эндпоинт ('/' или '/special')
 * @param {Object} data - Данные для отправки
 * @returns {Promise<Object>} - Ответ сервера
 */
export async function apiRequest(endpoint, data) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // Обработка ошибок
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw createApiError(response.status, errorData);
    }

    const result = await response.json();

    // Валидация ответа
    if (result.Status !== 'Ok' || !result.Body) {
      throw new Error(result.Body || 'Неизвестная ошибка API');
    }

    return result;

  } catch (error) {
    clearTimeout(timeout);

    if (error.name === 'AbortError') {
      throw new Error('Превышено время ожидания ответа сервера');
    }

    if (error.message.includes('Failed to fetch')) {
      throw new Error('Не удалось подключиться к серверу. Проверьте, что бэкенд запущен на 127.0.0.1:8000');
    }

    throw error;
  }
}

/**
 * Создание читаемой ошибки из ответа FastAPI
 * @param {number} status - HTTP статус
 * @param {Object} errorData - Данные ошибки
 * @returns {Error}
 */
function createApiError(status, errorData) {
  if (errorData.detail) {
    if (Array.isArray(errorData.detail)) {
      // FastAPI 422: массив валидационных ошибок
      return new Error(errorData.detail.map(e => e.msg).join('. '));
    }
    if (typeof errorData.detail === 'string') {
      return new Error(errorData.detail);
    }
    return new Error(JSON.stringify(errorData.detail));
  }
  return new Error(`Ошибка сервера: ${status}`);
}

/**
 * Сокращение обычной ссылки
 * @param {string} longUrl - Длинная ссылка
 */
export async function shortenUrl(longUrl) {
  const result = await apiRequest('/', { long_url: longUrl });
  return result.Body;
}

/**
 * Сокращение с кастомным слагом
 * @param {string} longUrl - Длинная ссылка
 * @param {string} specialSlug - Желаемый короткий адрес
 */
export async function shortenUrlWithSlug(longUrl, specialSlug) {
  const result = await apiRequest('/special', {
    long_url: longUrl,
    special_slug: specialSlug
  });
  return result.Body;
}
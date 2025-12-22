// Базовый URL API
const API_URL = 'https://api.perforyou.ru'; // Замените на ваш реальный URL API

// Функция для получения заголовков с токеном авторизации
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Обработчик ответов от API
const handleResponse = async (response) => {
  if (!response.ok) {
    // Если статус 401, значит токен истек или недействителен
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Пытаемся получить текст ошибки из ответа
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || 'Произошла ошибка при выполнении запроса';
    } catch (e) {
      errorMessage = errorText || 'Произошла ошибка при выполнении запроса';
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

// Аутентификация
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Можно также отправить запрос на сервер для инвалидации токена
};

// Товары
export const getProducts = async (page = 1, perPage = 50, sortField = 'name', sortDirection = 'asc') => {
  const response = await fetch(`${API_URL}/products?page=${page}&per_page=${perPage}&sort=${sortField}&direction=${sortDirection}`);
  return handleResponse(response);
};

export const searchProducts = async (query, category = null, minPrice = null, maxPrice = null, page = 1, perPage = 50, sortField = 'name', sortDirection = 'asc') => {
  let url = `${API_URL}/products/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&sort=${sortField}&direction=${sortDirection}`;

  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (minPrice) url += `&min_price=${minPrice}`;
  if (maxPrice) url += `&max_price=${maxPrice}`;

  const response = await fetch(url);
  return handleResponse(response);
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  return handleResponse(response);
};

// Корзина
export const getCartItems = async () => {
  const response = await fetch(`${API_URL}/cart`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  return handleResponse(response);
};

export const updateCartItem = async (itemId, quantity) => {
  const response = await fetch(`${API_URL}/cart/update/${itemId}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  });
  return handleResponse(response);
};

export const removeFromCart = async (itemId) => {
  const response = await fetch(`${API_URL}/cart/remove/${itemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Заказы
export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  return handleResponse(response);
};

export const getOrderById = async (id) => {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getUserOrders = async (page = 1, perPage = 10) => {
  const response = await fetch(`${API_URL}/orders/user?page=${page}&per_page=${perPage}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Административные функции для товаров
export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/admin/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: productData // FormData для загрузки файлов
  });
  return handleResponse(response);
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/admin/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: productData // FormData для загрузки файлов
  });
  return handleResponse(response);
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/admin/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// Административные функции для пользователей
export const getUsers = async (page = 1, perPage = 20) => {
  const response = await fetch(`${API_URL}/admin/users?page=${page}&per_page=${perPage}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const getUserById = async (id) => {
  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/admin/users`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
};

export const updateUser = async (id, userData) => {
  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// Административные функции для заказов
export const getAllOrders = async (page = 1, perPage = 20, status = null) => {
  let url = `${API_URL}/admin/orders?page=${page}&per_page=${perPage}`;
  if (status) url += `&status=${status}`;

  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const updateOrderStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/admin/orders/${id}/status`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });
  return handleResponse(response);
};
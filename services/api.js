// src/services/api.js
import { products, users, cart, orders } from './mockData';

// Функция для имитации задержки сети
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Аутентификация
export const login = async (email, password) => {
  await delay(800); // Имитация задержки сети

  const user = users.find(u => u.email === email);

  if (!user || user.password !== password) {
    throw new Error('Неверный email или пароль');
  }

  // Создаем фейковый токен
  const token = `fake-token-${Date.now()}`;

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

// Товары
export const getProducts = async (page = 1, perPage = 10) => {
  await delay(800);

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedProducts = products.slice(start, end);

  return {
    products: paginatedProducts,
    total_count: products.length
  };
};

// Поиск товаров
export const searchProducts = async (query) => {
  await delay(500);

  if (!query) {
    return getProducts(); // Возвращаем все товары, если запрос пустой
  }

  const searchQuery = query.toLowerCase();
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery)
  );

  return {
    products: filteredProducts,
    total_count: filteredProducts.length
  };
};

export const getProductById = async (id) => {
  await delay(500);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    throw new Error('Товар не найден');
  }

  return product;
};

export const createProduct = async (productData) => {
  await delay(800);

  const newProduct = {
    id: products.length + 1,
    ...productData,
    updated_date: new Date().toISOString().split('T')[0]
  };

  products.push(newProduct);

  return newProduct;
};

export const updateProduct = async (id, productData) => {
  await delay(800);

  const index = products.findIndex(p => p.id === parseInt(id));

  if (index === -1) {
    throw new Error('Товар не найден');
  }

  const updatedProduct = {
    ...products[index],
    ...productData,
    updated_date: new Date().toISOString().split('T')[0]
  };

  products[index] = updatedProduct;

  return updatedProduct;
};

export const deleteProduct = async (id) => {
  await delay(800);

  const index = products.findIndex(p => p.id === parseInt(id));

  if (index === -1) {
    throw new Error('Товар не найден');
  }

  products.splice(index, 1);

  return { success: true };
};

// Пользователи
export const getUsers = async (page = 1, perPage = 10) => {
  await delay(800);

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedUsers = users.slice(start, end).map(user => {
    // Не возвращаем пароли
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  return {
    users: paginatedUsers,
    total_count: users.length
  };
};

export const getUserById = async (id) => {
  await delay(500);

  const user = users.find(u => u.id === parseInt(id));

  if (!user) {
    throw new Error('Пользователь не найден');
  }

  // Не возвращаем пароль
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const createUser = async (userData) => {
  await delay(800);

  const newUser = {
    id: users.length + 1,
    ...userData,
    created_at: new Date().toISOString()
  };

  users.push(newUser);

  // Не возвращаем пароль
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const updateUser = async (id, userData) => {
  await delay(800);

  const index = users.findIndex(u => u.id === parseInt(id));

  if (index === -1) {
    throw new Error('Пользователь не найден');
  }

  const updatedUser = {
    ...users[index],
    ...userData
  };

  users[index] = updatedUser;

  // Не возвращаем пароль
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const deleteUser = async (id) => {
  await delay(800);

  const index = users.findIndex(u => u.id === parseInt(id));

  if (index === -1) {
    throw new Error('Пользователь не найден');
  }

  users.splice(index, 1);

  return { success: true };
};

// Корзина
export const getCartItems = async () => {
  await delay(500);
  return cart;
};

export const addToCart = async (productId, quantity = 1) => {
  await delay(500);

  const product = products.find(p => p.id === parseInt(productId));

  if (!product) {
    throw new Error('Товар не найден');
  }

  const existingItemIndex = cart.items.findIndex(item => item.product_id === parseInt(productId));

  if (existingItemIndex !== -1) {
    // Увеличиваем количество, если товар уже в корзине
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Добавляем новый товар в корзину
    cart.items.push({
      id: cart.items.length + 1,
      product_id: product.id,
      product: product,
      quantity: quantity,
      price: product.price
    });
  }

  // Пересчитываем общую сумму
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return cart;
};

export const updateCartItem = async (itemId, quantity) => {
  await delay(500);

  const itemIndex = cart.items.findIndex(item => item.id === parseInt(itemId));

  if (itemIndex === -1) {
    throw new Error('Товар не найден в корзине');
  }

  if (quantity <= 0) {
    // Удаляем товар из корзины
    cart.items.splice(itemIndex, 1);
  } else {
    // Обновляем количество
    cart.items[itemIndex].quantity = quantity;
  }

  // Пересчитываем общую сумму
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return cart;
};

export const removeFromCart = async (itemId) => {
  await delay(500);

  const itemIndex = cart.items.findIndex(item => item.id === parseInt(itemId));

  if (itemIndex === -1) {
    throw new Error('Товар не найден в корзине');
  }

  // Удаляем товар из корзины
  cart.items.splice(itemIndex, 1);

  // Пересчитываем общую сумму
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return cart;
};

export const clearCart = async () => {
  await delay(500);

  cart.items = [];
  cart.total = 0;

  return cart;
};

// Заказы
export const createOrder = async (orderData) => {
  await delay(800);

  const newOrder = {
    id: orders.length + 1,
    ...orderData,
    created_at: new Date().toISOString(),
    status: 'pending'
  };

  orders.push(newOrder);

  // Очищаем корзину после создания заказа
  await clearCart();

  return newOrder;
};

export const getOrders = async (page = 1, perPage = 10) => {
  await delay(800);

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedOrders = orders.slice(start, end);

  return {
    orders: paginatedOrders,
    total_count: orders.length
  };
};

export const getOrderById = async (id) => {
  await delay(500);

  const order = orders.find(o => o.id === parseInt(id));

  if (!order) {
    throw new Error('Заказ не найден');
  }

  return order;
};

export const updateOrderStatus = async (id, status) => {
  await delay(800);

  const orderIndex = orders.findIndex(o => o.id === parseInt(id));

  if (orderIndex === -1) {
    throw new Error('Заказ не найден');
  }

  orders[orderIndex].status = status;

  return orders[orderIndex];
};
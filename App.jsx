import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ProductList from './components/ProductList/ProductList';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import OrderConfirmation from './components/OrderConfirmation/OrderConfirmation';
import Orders from './components/Orders/Orders'; // Добавлен импорт компонента Orders
import Login from './components/Auth/Auth';
import NotFound from './components/NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminLayout from './components/Admin/AdminLayout/AdminLayout';
import AdminProducts from './components/Admin/Products/AdminProducts';
import ProductForm from './components/Admin/Products/ProductForm';
import AdminUsers from './components/Admin/Users/AdminUsers';
import UserForm from './components/Admin/Users/UserForm';
import { getCartItems } from './services/api';
import './App.scss';

// Импортируем Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

// Создаем отдельный компонент для выхода из системы
const LogoutRoute = () => {
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Создаем событие для обновления состояния авторизации
    window.dispatchEvent(new Event('auth-change'));
  }, []);

  return <Navigate to="/login" replace />;
};

function App() {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Используем useState вместо useMemo для отслеживания состояния авторизации
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  // Функция для проверки авторизации и роли пользователя
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserIsAdmin(user.role === 'admin');
      } catch (error) {
        setUserIsAdmin(false);
      }
    } else {
      setUserIsAdmin(false);
    }
  };

  // Эффект для отслеживания изменений в авторизации
  useEffect(() => {
    // Проверяем при монтировании компонента
    checkAuth();

    // Добавляем слушатель события для обновления состояния авторизации
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange); // Для синхронизации между вкладками

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Загрузка количества товаров в корзине при изменении состояния авторизации
  useEffect(() => {
    const fetchCartItemsCount = async () => {
      try {
        if (isLoggedIn) {
          const response = await getCartItems();
          const count = response.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
          setCartItemsCount(count);
        } else {
          setCartItemsCount(0);
        }
      } catch (error) {
        console.error('Error fetching cart items count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItemsCount();
  }, [isLoggedIn]);

  // Функция для обновления количества товаров в корзине
  const updateCartItemsCount = (count) => {
    setCartItemsCount(count);
  };

  // Функция для переключения видимости боковой панели
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Функция для закрытия боковой панели
  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <Router>
      <div className="app">
        {/* Показываем Header только для авторизованных пользователей */}
        {isLoggedIn && (
          <Header
            cartItemsCount={cartItemsCount}
            toggleSidebar={toggleSidebar}
            isLoggedIn={isLoggedIn}
            isAdmin={userIsAdmin}
          />
        )}

        {/* Боковое меню */}
        {isLoggedIn && (
          <Sidebar
            visible={sidebarVisible}
            onClose={closeSidebar}
            isAdmin={userIsAdmin}
          />
        )}

        <main className={`main ${sidebarVisible ? 'sidebar-visible' : ''}`}>
          {isLoading && isLoggedIn ? (
            <div className="loading-spinner">Загрузка...</div>
          ) : (
            <Routes>
              {/* Перенаправление с корневого маршрута на страницу входа, если пользователь не авторизован */}
              <Route path="/" element={
                isLoggedIn ?
                <ProductList updateCartItemsCount={updateCartItemsCount} /> :
                <Navigate to="/login" replace />
              } />

              {/* Публичные маршруты */}
              <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
              <Route path="/logout" element={<LogoutRoute />} />

              {/* Защищенные маршруты - доступны только авторизованным пользователям */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart updateCartItemsCount={updateCartItemsCount} />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout updateCartItemsCount={updateCartItemsCount} />
                </ProtectedRoute>
              } />
              <Route path="/order-confirmation/:id" element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />

              {/* Административные маршруты */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/admin/products" replace />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/add" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/add" element={<UserForm />} />
                <Route path="users/edit/:id" element={<UserForm />} />
              </Route>

              {/* Маршрут 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </main>

        {/* Пустой футер */}
        <footer className="footer">
          <div className="container">
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
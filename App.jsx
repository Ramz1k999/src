import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ProductList from './components/ProductList/ProductList';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import OrderConfirmation from './components/OrderConfirmation/OrderConfirmation';
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

function App() {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Проверяем, является ли пользователь администратором
  const isAdmin = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.role === 'admin';
    } catch (error) {
      return false;
    }
  };

  // Загрузка количества товаров в корзине при первом рендере
  useEffect(() => {
    const fetchCartItemsCount = async () => {
      try {
        // Проверяем, авторизован ли пользователь
        if (localStorage.getItem('token')) {
          const response = await getCartItems();
          const count = response.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
          setCartItemsCount(count);
        }
      } catch (error) {
        console.error('Error fetching cart items count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItemsCount();
  }, []);

  // Функция для обновления количества товаров в корзине
  const updateCartItemsCount = (count) => {
    setCartItemsCount(count);
  };

  // Функция для переключения видимости боковой панели
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Функция для обработки выхода из системы
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCartItemsCount(0);
    return <Navigate to="/" replace />;
  };

  return (
    <Router>
      <div className="app">
        <Header
          cartItemsCount={cartItemsCount}
          toggleSidebar={toggleSidebar}
          isLoggedIn={!!localStorage.getItem('token')}
          isAdmin={isAdmin()}
        />

        {localStorage.getItem('token') && (
          <Sidebar
            visible={sidebarVisible}
            onClose={() => setSidebarVisible(false)}
            isAdmin={isAdmin()}
          />
        )}

        <main className={`main ${sidebarVisible ? 'sidebar-visible' : ''}`}>
          {isLoading ? (
            <div className="loading-spinner">Загрузка...</div>
          ) : (
            <Routes>
              {/* Публичные маршруты */}
              <Route path="/" element={<ProductList updateCartItemsCount={updateCartItemsCount} />} />
              <Route path="/cart" element={<Cart updateCartItemsCount={updateCartItemsCount} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={handleLogout()} />

              {/* Защищенные маршруты для обычных пользователей */}
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout updateCartItemsCount={updateCartItemsCount} />
                </ProtectedRoute>
              } />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />

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
        <footer className="footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} PERFUME FOR YOU. Все права защищены.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true
  });

  useEffect(() => {
    // Функция для проверки авторизации
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      let isAdmin = false;

      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        isAdmin = user && user.role === 'admin';
      } catch (error) {
        console.error('Error parsing user data:', error);
        isAdmin = false;
      }

      setAuthState({
        isAuthenticated: !!token,
        isAdmin,
        isLoading: false
      });
    };

    checkAuth();

    // Добавляем слушатель события для обновления состояния авторизации
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange); // Для обновления при изменении localStorage в других вкладках

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Показываем индикатор загрузки, пока проверяем авторизацию
  if (authState.isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если требуется роль администратора, но пользователь не админ
  if (adminOnly && !authState.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
// components/ProtectedRoute/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  // Проверка роли пользователя
  const isAdmin = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.role === 'admin';
    } catch (error) {
      return false;
    }
  };

  if (!isAuthenticated) {
    // Перенаправляем на страницу входа с сохранением изначального URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если требуется роль администратора, но пользователь не админ
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
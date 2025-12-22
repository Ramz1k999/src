import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.scss';
import logoImage from '../../assets/images/logo.png';

const Sidebar = () => {
  const location = useLocation();

  // Проверяем, является ли пользователь администратором
  const isAdmin = () => {
    // Здесь можно использовать более сложную логику, например, декодирование JWT токена
    // или хранение роли пользователя в localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  };

  // Функция для определения активного пункта меню
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar__logo-container">
        <Link to="/" className="sidebar__logo-link">
          <img src={logoImage} alt="PERFUME FOR YOU" className="sidebar__logo-image" />
          <div className="sidebar__logo-text">
            <span className="sidebar__logo-title">PERFUME FOR YOU</span>
            <span className="sidebar__logo-tagline">PERFUME FOR YOU</span>
          </div>
        </Link>
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__menu">
          <li className="sidebar__menu-item">
            <Link
              to="/"
              className={`sidebar__menu-link ${isActive('/') && !isActive('/admin') ? 'active' : ''}`}
            >
              <i className="icon icon-products"></i>
              Товары
            </Link>
          </li>

          <li className="sidebar__menu-item">
            <Link
              to="/cart"
              className={`sidebar__menu-link ${isActive('/cart') ? 'active' : ''}`}
            >
              <i className="icon icon-cart"></i>
              Корзина
            </Link>
          </li>

          <li className="sidebar__menu-item">
            <Link
              to="/orders"
              className={`sidebar__menu-link ${isActive('/orders') ? 'active' : ''}`}
            >
              <i className="icon icon-orders"></i>
              Мои заказы
            </Link>
          </li>

          {/* Административные пункты меню */}
          {isAdmin() && (
            <>
              <li className="sidebar__menu-divider">
                <span>Администрирование</span>
              </li>

              <li className="sidebar__menu-item">
                <Link
                  to="/admin/products"
                  className={`sidebar__menu-link ${isActive('/admin/products') ? 'active' : ''}`}
                >
                  <i className="icon icon-admin-products"></i>
                  Управление товарами
                </Link>
              </li>

              <li className="sidebar__menu-item">
                <Link
                  to="/admin/orders"
                  className={`sidebar__menu-link ${isActive('/admin/orders') ? 'active' : ''}`}
                >
                  <i className="icon icon-admin-orders"></i>
                  Управление заказами
                </Link>
              </li>

              <li className="sidebar__menu-item">
                <Link
                  to="/admin/users"
                  className={`sidebar__menu-link ${isActive('/admin/users') ? 'active' : ''}`}
                >
                  <i className="icon icon-admin-users"></i>
                  Управление пользователями
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <a
          href="https://perforyou.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar__footer-link"
        >
          https://perforyou.ru
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
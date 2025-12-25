import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.scss';

const Sidebar = ({ visible, onClose, isAdmin }) => {
  return (
    <>
      {/* Затемнение фона при открытом меню */}
      {visible && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${visible ? 'sidebar--visible' : ''}`}>
        <div className="sidebar__header">
          <button className="sidebar__close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="sidebar__nav">
          <ul className="sidebar__menu">
            <li className="sidebar__menu-item">
              <NavLink to="/" className={({isActive}) =>
                isActive ? "sidebar__menu-link active" : "sidebar__menu-link"}
                onClick={onClose}>
                <i className="fas fa-box"></i>
                <span>Товары</span>
              </NavLink>
            </li>
            <li className="sidebar__menu-item">
              <NavLink to="/cart" className={({isActive}) =>
                isActive ? "sidebar__menu-link active" : "sidebar__menu-link"}
                onClick={onClose}>
                <i className="fas fa-shopping-cart"></i>
                <span>Корзина</span>
              </NavLink>
            </li>
            <li className="sidebar__menu-item">
              <NavLink to="/orders" className={({isActive}) =>
                isActive ? "sidebar__menu-link active" : "sidebar__menu-link"}
                onClick={onClose}>
                <i className="fas fa-clipboard-list"></i>
                <span>Мои заказы</span>
              </NavLink>
            </li>

            {isAdmin && (
              <>
                <li className="sidebar__menu-divider"></li>
                <li className="sidebar__menu-item">
                  <NavLink to="/admin/products" className={({isActive}) =>
                    isActive ? "sidebar__menu-link active" : "sidebar__menu-link"}
                    onClick={onClose}>
                    <i className="fas fa-boxes"></i>
                    <span>Управление товарами</span>
                  </NavLink>
                </li>
                <li className="sidebar__menu-item">
                  <NavLink to="/admin/users" className={({isActive}) =>
                    isActive ? "sidebar__menu-link active" : "sidebar__menu-link"}
                    onClick={onClose}>
                    <i className="fas fa-users"></i>
                    <span>Управление пользователями</span>
                  </NavLink>
                </li>
              </>
            )}

            <li className="sidebar__menu-divider"></li>
            <li className="sidebar__menu-item">
              <NavLink to="/logout" className={({isActive}) =>
                isActive ? "sidebar__menu-link active" : "sidebar__menu-link"}
                onClick={onClose}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Выйти</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
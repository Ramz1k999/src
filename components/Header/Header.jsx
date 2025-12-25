import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.scss';

const Header = ({ cartItemsCount = 0, toggleSidebar, isLoggedIn, isAdmin }) => {
  const [currency, setCurrency] = useState('RUB');
  const [exchangeRate, setExchangeRate] = useState(81.8);
  const [currentDate, setCurrentDate] = useState('');
  const location = useLocation();

  // Устанавливаем текущую дату при монтировании компонента
  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

  const toggleCurrency = () => {
    setCurrency(currency === 'RUB' ? 'USD' : 'RUB');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          {/* Левая часть с названием и кнопкой меню */}
          <div className="header__left">
            {/* Название магазина */}
            <Link to="/" className="header__logo">
              <span className="header__brand-name">SHOPOHOLIC</span>
            </Link>

            {/* Кнопка меню сразу после названия */}
            <button
              className="header__menu-button"
              onClick={toggleSidebar}
              aria-label="Меню"
            >
              <div className="hamburger">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>

          {/* Правая часть с элементами управления */}
          <div className="header__right">
            <div className="header__exchange-rate">
              Курс на {currentDate} - $1 = {exchangeRate}₽
            </div>

            <div className="currency-toggle">
              <span className="currency-symbol">$</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={currency === 'RUB'}
                  onChange={toggleCurrency}
                />
                <span className="slider round"></span>
              </label>
              <span className="currency-symbol">₽</span>
            </div>

            <Link to="/cart" className="header__cart">
              <i className="fas fa-shopping-cart"></i>
              {cartItemsCount > 0 && (
                <span className="header__cart-count">{cartItemsCount}</span>
              )}
            </Link>

            {isLoggedIn ? (
              <Link to="/logout" className="header__auth-button logout-button">
                <i className="fas fa-sign-out-alt"></i>
                Выйти
              </Link>
            ) : (
              <Link to="/login" className="header__auth-button login-button">
                <i className="fas fa-sign-in-alt"></i>
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
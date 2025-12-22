import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.scss';
import logoImage from '../../assets/images/logo.png';

const Header = ({ cartItemsCount = 0 }) => {
  const [currency, setCurrency] = useState('RUB'); // По умолчанию рубли
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(81.8);
  const [currentDate, setCurrentDate] = useState('');
  const location = useLocation();

  // Устанавливаем текущую дату при монтировании компонента
  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

  // Закрываем мобильное меню при изменении маршрута
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleCurrency = () => {
    setCurrency(currency === 'RUB' ? 'USD' : 'RUB');
    // Здесь можно добавить логику для изменения валюты в приложении
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <div className="header__logo">
            <Link to="/">
              <img src={logoImage} alt="PERFUME FOR YOU" />
              <span>PERFUME FOR YOU</span>
            </Link>
          </div>

          <button
            className={`header__menu-button ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Меню"
          >
            <span className="hamburger"></span>
          </button>

          <div className="header__exchange-rate">
            Курс на {currentDate} - $1 = {exchangeRate}₽
          </div>

          <div className={`header__controls ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <nav className="header__nav">
              <ul>
                <li><Link to="/">Главная</Link></li>
                <li><Link to="/cart">Корзина</Link></li>
                {isLoggedIn && <li><Link to="/orders">Мои заказы</Link></li>}
              </ul>
            </nav>

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
              <i className="icon-cart"></i>
              {cartItemsCount > 0 && (
                <span className="header__cart-count">{cartItemsCount}</span>
              )}
            </Link>

            {isLoggedIn ? (
              <Link to="/logout" className="header__auth-button logout-button">
                <i className="icon-logout"></i>
                Выйти
              </Link>
            ) : (
              <Link to="/login" className="header__auth-button login-button">
                <i className="icon-login"></i>
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
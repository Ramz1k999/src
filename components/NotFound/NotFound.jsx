// components/NotFound/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.scss';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found__content">
          <h1 className="not-found__title">404</h1>
          <p className="not-found__message">Страница не найдена</p>
          <p className="not-found__description">
            Запрашиваемая страница не существует или была удалена.
          </p>
          <Link to="/" className="not-found__button">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
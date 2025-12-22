import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../services/api';
import './OrderConfirmation.scss';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await getOrderById(id);
        setOrder(response);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Не удалось загрузить информацию о заказе. Пожалуйста, попробуйте позже.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="order-confirmation">
        <div className="container">
          <div className="order-confirmation__loading">Загрузка информации о заказе...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-confirmation">
        <div className="container">
          <div className="order-confirmation__error">{error}</div>
          <Link to="/" className="order-confirmation__button">Вернуться на главную</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="container">
        <div className="order-confirmation__content">
          <div className="order-confirmation__icon">
            <i className="icon-check-circle"></i>
          </div>

          <h1 className="order-confirmation__title">Заказ успешно оформлен!</h1>

          <div className="order-confirmation__details">
            <p className="order-confirmation__order-number">
              Номер заказа: <span>{order?.id || id}</span>
            </p>

            <p className="order-confirmation__message">
              Спасибо за ваш заказ! Мы отправили подтверждение на указанный вами email.
              Наш менеджер свяжется с вами в ближайшее время для уточнения деталей.
            </p>

            {order && (
              <div className="order-confirmation__summary">
                <h2 className="order-confirmation__summary-title">Информация о заказе</h2>

                <div className="order-confirmation__info-group">
                  <div className="order-confirmation__info-item">
                    <span className="order-confirmation__info-label">Дата заказа:</span>
                    <span className="order-confirmation__info-value">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="order-confirmation__info-item">
                    <span className="order-confirmation__info-label">Статус:</span>
                    <span className="order-confirmation__info-value order-confirmation__status">
                      Принят в обработку
                    </span>
                  </div>

                  <div className="order-confirmation__info-item">
                    <span className="order-confirmation__info-label">Способ доставки:</span>
                    <span className="order-confirmation__info-value">
                      {order.delivery_method === 'courier' ? 'Курьером' : 'Самовывоз'}
                    </span>
                  </div>

                  <div className="order-confirmation__info-item">
                    <span className="order-confirmation__info-label">Способ оплаты:</span>
                    <span className="order-confirmation__info-value">
                      {order.payment_method === 'card' ? 'Банковской картой' : 'Наличными при получении'}
                    </span>
                  </div>

                  <div className="order-confirmation__info-item">
                    <span className="order-confirmation__info-label">Сумма заказа:</span>
                    <span className="order-confirmation__info-value order-confirmation__total">
                      {order.total_amount.toFixed(1)} руб.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="order-confirmation__actions">
            <Link to="/" className="order-confirmation__button">
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
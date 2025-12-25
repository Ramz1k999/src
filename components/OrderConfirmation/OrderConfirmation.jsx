import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../services/api';
import './OrderConfirmation.scss';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const data = await getOrderById(parseInt(id));
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Ошибка при загрузке заказа. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' руб.';
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'В обработке';
      case 'processing':
        return 'Комплектуется';
      case 'shipped':
        return 'Отправлен';
      case 'delivered':
        return 'Доставлен';
      case 'cancelled':
        return 'Отменен';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'order-confirmation__status--pending';
      case 'processing':
        return 'order-confirmation__status--processing';
      case 'shipped':
        return 'order-confirmation__status--shipped';
      case 'delivered':
        return 'order-confirmation__status--delivered';
      case 'cancelled':
        return 'order-confirmation__status--cancelled';
      default:
        return '';
    }
  };

  if (isLoading) {
    return <div className="order-confirmation__loading">Загрузка заказа...</div>;
  }

  if (error) {
    return <div className="order-confirmation__error">{error}</div>;
  }

  if (!order) {
    return <div className="order-confirmation__error">Заказ не найден</div>;
  }

  return (
    <div className="order-confirmation">
      <h1 className="order-confirmation__title">Заказ #{order.id}</h1>

      <div className="order-confirmation__status-container">
        <span className={`order-confirmation__status ${getStatusClass(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
        <span className="order-confirmation__date">от {formatDate(order.created_at)}</span>
      </div>

      <div className="order-confirmation__details">
        <div className="order-confirmation__section">
          <h2 className="order-confirmation__section-title">Информация о доставке</h2>
          <p><strong>Адрес:</strong> {order.shipping_address}</p>
          <p><strong>Способ оплаты:</strong> {order.payment_method === 'card' ? 'Банковская карта' : 'Наличные'}</p>
        </div>

        <div className="order-confirmation__section">
          <h2 className="order-confirmation__section-title">Товары в заказе</h2>
          <div className="order-confirmation__table-container">
            <table className="order-confirmation__table">
              <thead>
                <tr>
                  <th>Название товара</th>
                  <th>Цена</th>
                  <th>Количество</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.product_id}>
                    <td>{item.product?.name || "Название товара отсутствует"}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="order-confirmation__total-label">Итого:</td>
                  <td className="order-confirmation__total-value">{formatPrice(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div className="order-confirmation__actions">
        <Link to="/orders" className="order-confirmation__back-button">
          <i className="fas fa-arrow-left"></i> Вернуться к списку заказов
        </Link>

        {order.status === 'pending' && (
          <button className="order-confirmation__cancel-button">
            <i className="fas fa-times"></i> Отменить заказ
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../services/api';
import './Orders.scss';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page) => {
    try {
      setIsLoading(true);
      const response = await getOrders(page);
      setOrders(response.orders || []);

      // Вычисляем общее количество страниц
      const totalCount = response.total_count || 0;
      const perPage = 10; // Предполагаем, что у нас 10 заказов на страницу
      setTotalPages(Math.ceil(totalCount / perPage));
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Ошибка при загрузке заказов. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
        return 'orders__status--pending';
      case 'processing':
        return 'orders__status--processing';
      case 'shipped':
        return 'orders__status--shipped';
      case 'delivered':
        return 'orders__status--delivered';
      case 'cancelled':
        return 'orders__status--cancelled';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="orders">
        <div className="container">
          <div className="orders__loading">Загрузка заказов...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders">
        <div className="container">
          <div className="orders__error">{error}</div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="container">
          <h1 className="orders__title">Мои заказы</h1>
          <div className="orders__empty">
            <p>У вас пока нет заказов.</p>
            <Link to="/" className="orders__shop-button">Перейти к покупкам</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <div className="container">
        <h1 className="orders__title">Мои заказы</h1>

        <div className="orders__table-container">
          <table className="orders__table">
            <thead>
              <tr>
                <th>№ заказа</th>
                <th>Дата</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>{formatPrice(order.total)}</td>
                  <td>
                    <span className={`orders__status ${getStatusClass(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>
                    <Link to={`/order-confirmation/${order.id}`} className="orders__view-button">
                      <i className="fas fa-eye"></i> Просмотр
                    </Link>
                    {order.status === 'pending' && (
                      <button className="orders__cancel-button">
                        <i className="fas fa-times"></i> Отменить
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="orders__pagination">
            <button
              className="orders__pagination-button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`orders__pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="orders__pagination-button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
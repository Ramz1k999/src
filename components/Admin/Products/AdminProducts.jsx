import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../../services/api';
import './AdminProducts.scss';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts(currentPage);

      // Если response это массив (как в случае с моковыми данными)
      const productsList = Array.isArray(response) ? response : (response.products || []);

      setProducts(productsList);

      // Вычисляем общее количество страниц
      const totalCount = Array.isArray(response) ? response.length : (response.total_count || 0);
      const perPage = 10; // Предполагаем, что у нас 10 товаров на страницу
      setTotalPages(Math.ceil(totalCount / perPage));
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Не удалось загрузить товары. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const confirmDelete = (productId) => {
    setDeleteConfirmation(productId);
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setDeleteConfirmation(null);
      fetchProducts(); // Обновляем список после удаления
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Не удалось удалить товар. Пожалуйста, попробуйте позже.');
    }
  };

  const formatPrice = (price) => {
    // Если цена уже отформатирована
    if (typeof price === 'string' && price.includes('₽')) {
      return price;
    }

    // Если есть готовое форматированное значение
    if (price && price.price_formatted) {
      return price.price_formatted;
    }

    // Иначе форматируем число
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Не указано';
    }

    try {
      const date = new Date(dateString);

      // Проверяем, является ли дата валидной
      if (isNaN(date.getTime())) {
        return 'Неверная дата';
      }

      return date.toLocaleDateString('ru-RU');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Ошибка формата';
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-products__header">
        <h1 className="admin-products__title">Управление товарами</h1>
        <Link to="/admin/products/add" className="admin-products__add-button">
          <i className="fas fa-plus"></i> Добавить товар
        </Link>
      </div>

      {loading ? (
        <div className="admin-products__loading">
          <div className="loading-spinner"></div>
          <p>Загрузка товаров...</p>
        </div>
      ) : error ? (
        <div className="admin-products__error">{error}</div>
      ) : products.length === 0 ? (
        <div className="admin-products__empty">Товары не найдены</div>
      ) : (
        <>
          <div className="admin-products__table-container">
            <table className="admin-products__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Цена</th>
                  <th>Количество</th>
                  <th>Обновлено</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.price_formatted || formatPrice(product.price)}</td>
                    <td>{product.quantity || product.stock}</td>
                    <td>{formatDate(product.updated_date || product.updated_at)}</td>
                    <td>
                      <div className="admin-products__actions">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="admin-products__edit-button"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          className="admin-products__delete-button"
                          onClick={() => confirmDelete(product.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="admin-products__pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`admin-products__page-button ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Модальное окно подтверждения удаления */}
      {deleteConfirmation && (
        <div className="admin-products__modal-overlay">
          <div className="admin-products__modal">
            <h3>Подтверждение удаления</h3>
            <p>Вы уверены, что хотите удалить этот товар?</p>
            <div className="admin-products__modal-actions">
              <button
                className="admin-products__modal-cancel"
                onClick={cancelDelete}
              >
                Отмена
              </button>
              <button
                className="admin-products__modal-confirm"
                onClick={() => handleDelete(deleteConfirmation)}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
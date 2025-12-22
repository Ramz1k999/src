import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/api';
import './AdminProducts.scss';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 20;

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts(currentPage, perPage);
      setProducts(response.products);
      setTotalPages(Math.ceil(response.total_count / perPage));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Не удалось загрузить товары. Пожалуйста, попробуйте позже.');
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await deleteProduct(id);
        // Обновляем список товаров
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Не удалось удалить товар. Пожалуйста, попробуйте позже.');
      }
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-products__header">
        <h1 className="admin-products__title">Управление товарами</h1>
        <Link to="/admin/products/add" className="admin-products__add-button">
          Добавить товар
        </Link>
      </div>

      {loading ? (
        <div className="admin-products__loading">Загрузка...</div>
      ) : error ? (
        <div className="admin-products__error">{error}</div>
      ) : (
        <>
          <div className="admin-products__table-container">
            <table className="admin-products__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Цена</th>
                  <th>Дата обновления</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.price_formatted}</td>
                    <td>{product.updated_date}</td>
                    <td className="admin-products__actions">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="admin-products__edit-button"
                      >
                        Редактировать
                      </Link>
                      <button
                        className="admin-products__delete-button"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Пагинация */}
          <div className="admin-products__pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`admin-products__page-button ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProducts;
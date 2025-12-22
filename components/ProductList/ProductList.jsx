import React, { useState, useEffect } from 'react';
import { getProducts, searchProducts } from '../../services/api';
import ProductTableRow from '../ProductTableRow/ProductTableRow';
import './ProductList.scss';

const ProductList = ({ updateCartItemsCount }) => {
  // Состояния для данных и UI
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantityFilter, setQuantityFilter] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const perPage = 50;

  // Загрузка товаров при монтировании компонента и при изменении параметров
  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortField, sortDirection]);

  // Функция для загрузки товаров
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Если есть поисковый запрос, используем поиск, иначе получаем все товары
      const response = searchTerm
        ? await searchProducts(searchTerm, null, null, null, currentPage, perPage, sortField, sortDirection)
        : await getProducts(currentPage, perPage, sortField, sortDirection);

      setProducts(response.products);
      setTotalProducts(response.total_count);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Не удалось загрузить товары. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Обработчик поиска
  const handleSearch = () => {
    setCurrentPage(1); // Сбрасываем страницу на первую при новом поиске
    fetchProducts();
  };

  // Обработчик нажатия клавиши Enter в поле поиска
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Обработчик изменения сортировки
  const handleSort = (field) => {
    // Если кликнули на то же поле, меняем направление сортировки
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Если на новое поле, устанавливаем его и сортировку по возрастанию
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Обработчик изменения страницы
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Прокручиваем страницу вверх при смене страницы
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(totalProducts / perPage);

  // Функция для отображения пагинации
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    // Определяем диапазон отображаемых страниц
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Корректируем startPage, если endPage достиг максимума
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Добавляем кнопку "Предыдущая"
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className="pagination__button"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &laquo;
        </button>
      );
    }

    // Добавляем первую страницу и многоточие, если нужно
    if (startPage > 1) {
      pages.push(
        <button
          key="1"
          className="pagination__button"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis" className="pagination__ellipsis">...</span>);
      }
    }

    // Добавляем страницы в диапазоне
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination__button ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Добавляем многоточие и последнюю страницу, если нужно
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="pagination__ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className="pagination__button"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Добавляем кнопку "Следующая"
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          className="pagination__button"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &raquo;
        </button>
      );
    }

    return <div className="product-list__pagination">{pages}</div>;
  };

  // Функция для прокрутки страницы вверх
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="product-list">
      <div className="container">
        <h1 className="product-list__title">Список товаров</h1>

        <div className="product-list__search">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="product-list__search-input"
          />
          <input
            type="number"
            placeholder="Количество"
            value={quantityFilter}
            onChange={(e) => setQuantityFilter(e.target.value)}
            className="product-list__quantity-input"
            min="0"
          />
          <button
            className="product-list__search-button"
            onClick={handleSearch}
          >
            <i className="icon-search"></i> Искать
          </button>
        </div>

        <div className="product-list__info">
          <i className="icon-info"></i> Всего {totalProducts} вида товаров
        </div>

        {loading ? (
          <div className="product-list__loading">Загрузка...</div>
        ) : error ? (
          <div className="product-list__error">{error}</div>
        ) : products.length === 0 ? (
          <div className="product-list__empty">По вашему запросу ничего не найдено</div>
        ) : (
          <>
            <div className="product-list__table-container">
              <table className="product-list__table">
                <thead>
                  <tr>
                    <th
                      className={`sortable ${sortField === 'name' ? `sorted-${sortDirection}` : ''}`}
                      onClick={() => handleSort('name')}
                    >
                      Название товара
                      {sortField === 'name' && (
                        <i className={`icon-sort-${sortDirection}`}></i>
                      )}
                    </th>
                    <th
                      className={`sortable ${sortField === 'price' ? `sorted-${sortDirection}` : ''}`}
                      onClick={() => handleSort('price')}
                    >
                      Цена
                      {sortField === 'price' && (
                        <i className={`icon-sort-${sortDirection}`}></i>
                      )}
                    </th>
                    <th
                      className={`sortable ${sortField === 'date' ? `sorted-${sortDirection}` : ''}`}
                      onClick={() => handleSort('date')}
                    >
                      Время обновления
                      {sortField === 'date' && (
                        <i className={`icon-sort-${sortDirection}`}></i>
                      )}
                    </th>
                    <th>Количество</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <ProductTableRow
                      key={product.id}
                      product={product}
                      updateCartItemsCount={updateCartItemsCount}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {renderPagination()}
          </>
        )}

        <button className="scroll-to-top" onClick={scrollToTop}>
          <i className="icon-arrow-up"></i>
        </button>
      </div>
    </div>
  );
};

export default ProductList;
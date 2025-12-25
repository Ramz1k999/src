import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCartItems, updateCartItem, removeFromCart } from '../../services/api';
import './Cart.scss';

const Cart = ({ updateCartItemsCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const response = await getCartItems();
      setCartItems(response.items || []);
      setTotalAmount(response.total || 0);

      // Обновляем счетчик товаров в корзине
      if (updateCartItemsCount) {
        const count = response.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        updateCartItemsCount(count);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Ошибка при загрузке корзины. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      await updateCartItem(itemId, quantity);
      await fetchCartItems(); // Обновляем корзину после изменения
    } catch (error) {
      console.error('Error updating cart item:', error);
      setError('Ошибка при обновлении товара в корзине.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      await fetchCartItems(); // Обновляем корзину после удаления
    } catch (error) {
      console.error('Error removing cart item:', error);
      setError('Ошибка при удалении товара из корзины.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' руб.';
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="cart">
        <div className="container">
          <div className="cart__loading">Загрузка корзины...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart">
        <div className="container">
          <div className="cart__error">{error}</div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <div className="container">
          <h1 className="cart__title">Корзина</h1>
          <div className="cart__empty">
            <p>Ваша корзина пуста.</p>
            <Link to="/" className="cart__continue-shopping">Перейти к покупкам</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="container">
        <h1 className="cart__title">Корзина</h1>

        <div className="cart__actions">
          <Link to="/checkout" className="cart__checkout-button">
            Оформить выбранные товары
          </Link>
          <button className="cart__print-button" onClick={handlePrint}>
            Распечатать
          </button>
        </div>

        <div className="cart__table-container">
          <table className="cart__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Название товара</th>
                <th>Цена</th>
                <th>Количество</th>
                <th>Стоимость</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className="cart__product-name">
                    {item.product?.name || "Название товара отсутствует"}
                  </td>
                  <td>{formatPrice(item.price)}</td>
                  <td>
                    <div className="cart__quantity-control">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        className="cart__quantity-input"
                      />
                    </div>
                  </td>
                  <td>{formatPrice(item.price * item.quantity)}</td>
                  <td>
                    <div className="cart__item-actions">
                      <button
                        className="cart__remove-button"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label="Удалить товар"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                      <button
                        className="cart__favorite-button"
                        aria-label="Добавить в избранное"
                      >
                        <i className="fas fa-heart"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"></td>
                <td className="cart__total-label">Итого:</td>
                <td className="cart__total-value" colSpan="2">{formatPrice(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Cart;
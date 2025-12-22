import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCartItems, updateCartItem, removeFromCart } from '../../services/api';
import './Cart.scss';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await getCartItems();
      setCartItems(response.items || []);
      calculateTotals(response.items || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Не удалось загрузить товары в корзине. Пожалуйста, попробуйте позже.');
      setLoading(false);
    }
  };

  const calculateTotals = (items) => {
    const total = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setTotalCost(total);
    setTotalItems(count);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      if (newQuantity < 1) newQuantity = 1;
      await updateCartItem(itemId, newQuantity);

      // Обновляем локальное состояние
      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      calculateTotals(updatedItems);
    } catch (err) {
      console.error('Error updating cart item:', err);
      // Можно добавить уведомление об ошибке
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);

      // Обновляем локальное состояние
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      calculateTotals(updatedItems);
    } catch (err) {
      console.error('Error removing cart item:', err);
      // Можно добавить уведомление об ошибке
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cart">
      <div className="container">
        <h1 className="cart__title">Корзина</h1>

        {loading ? (
          <div className="cart__loading">Загрузка...</div>
        ) : error ? (
          <div className="cart__error">{error}</div>
        ) : cartItems.length === 0 ? (
          <div className="cart__empty">
            <p>Ваша корзина пуста</p>
            <Link to="/" className="cart__continue-shopping">Продолжить покупки</Link>
          </div>
        ) : (
          <>
            <div className="cart__actions">
              <Link to="/checkout" className="cart__checkout-button">
                <i className="icon-check"></i> Оформить выбранные товары
              </Link>
              <button className="cart__print-button" onClick={handlePrint}>
                <i className="icon-print"></i> Распечатать
              </button>
            </div>

            <div className="cart__table-container">
              <table className="cart__table">
                <thead>
                  <tr>
                    <th className="cart__table-number">#</th>
                    <th className="cart__table-name">Название товара</th>
                    <th className="cart__table-price">Цена</th>
                    <th className="cart__table-quantity">Количество</th>
                    <th className="cart__table-total">Стоимость</th>
                    <th className="cart__table-actions"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={item.id} className="cart__item">
                      <td className="cart__item-number">{index + 1}</td>
                      <td className="cart__item-name">{item.product_name}</td>
                      <td className="cart__item-price">{item.price_formatted}</td>
                      <td className="cart__item-quantity">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                          className="cart__quantity-input"
                        />
                      </td>
                      <td className="cart__item-total">
                        {(parseFloat(item.price) * item.quantity).toFixed(1)} руб.
                      </td>
                      <td className="cart__item-actions">
                        <button
                          className="cart__remove-button"
                          onClick={() => handleRemoveItem(item.id)}
                          title="Удалить"
                        >
                          <i className="icon-trash"></i>
                        </button>
                        <button
                          className="cart__edit-button"
                          title="Редактировать"
                        >
                          <i className="icon-edit"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="cart__total-row">
                    <td colSpan="3"></td>
                    <td className="cart__total-label">{totalItems}</td>
                    <td className="cart__total-value">{totalCost.toFixed(1)} руб.</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <i className="icon-arrow-up"></i>
        </button>
      </div>
    </div>
  );
};

export default Cart;
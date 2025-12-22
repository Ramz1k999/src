import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartItems, createOrder } from '../../services/api';
import './Checkout.scss';

const Checkout = ({ updateCartItemsCount }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
    deliveryMethod: 'courier',
    comment: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await getCartItems();
      setCartItems(response.items || []);
      calculateTotal(response.items || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Не удалось загрузить товары в корзине. Пожалуйста, попробуйте позже.');
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    setTotalCost(total);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Очищаем ошибку при изменении поля
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Пожалуйста, укажите ФИО';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Пожалуйста, укажите номер телефона';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Неверный формат номера телефона';
    }

    if (!formData.email.trim()) {
      errors.email = 'Пожалуйста, укажите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Неверный формат email';
    }

    if (formData.deliveryMethod === 'courier' && !formData.address.trim()) {
      errors.address = 'Пожалуйста, укажите адрес доставки';
    }

    if (formData.deliveryMethod === 'courier' && !formData.city.trim()) {
      errors.city = 'Пожалуйста, укажите город';
    }

    if (formData.deliveryMethod === 'courier' && !formData.postalCode.trim()) {
      errors.postalCode = 'Пожалуйста, укажите почтовый индекс';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Прокручиваем к первой ошибке
      const firstErrorField = document.querySelector('.form-group.has-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      setIsSubmitting(true);

      // Подготавливаем данные для отправки
      const orderData = {
        customer_info: {
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
        },
        payment_method: formData.paymentMethod,
        delivery_method: formData.deliveryMethod,
        comment: formData.comment,
      };

      // Отправляем заказ
      const response = await createOrder(orderData);

      // Обновляем счетчик товаров в корзине (теперь 0)
      updateCartItemsCount(0);

      // Перенаправляем на страницу подтверждения заказа
      navigate(`/order-confirmation/${response.order_id}`);

    } catch (err) {
      console.error('Error creating order:', err);
      setError('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте позже.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout">
        <div className="container">
          <h1 className="checkout__title">Оформление заказа</h1>
          <div className="checkout__loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout">
        <div className="container">
          <h1 className="checkout__title">Оформление заказа</h1>
          <div className="checkout__error">{error}</div>
          <button
            className="checkout__back-button"
            onClick={() => navigate('/cart')}
          >
            Вернуться в корзину
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout">
        <div className="container">
          <h1 className="checkout__title">Оформление заказа</h1>
          <div className="checkout__empty">
            <p>Ваша корзина пуста. Добавьте товары в корзину, чтобы оформить заказ.</p>
            <button
              className="checkout__continue-button"
              onClick={() => navigate('/')}
            >
              Перейти к покупкам
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="container">
        <h1 className="checkout__title">Оформление заказа</h1>

        <div className="checkout__content">
          <div className="checkout__form-container">
            <form className="checkout__form" onSubmit={handleSubmit}>
              <div className="checkout__section">
                <h2 className="checkout__section-title">Контактная информация</h2>

                <div className={`form-group ${formErrors.fullName ? 'has-error' : ''}`}>
                  <label htmlFor="fullName">ФИО*</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Иванов Иван Иванович"
                  />
                  {formErrors.fullName && <div className="error-message">{formErrors.fullName}</div>}
                </div>

                <div className={`form-group ${formErrors.phone ? 'has-error' : ''}`}>
                  <label htmlFor="phone">Телефон*</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+7 (999) 123-45-67"
                  />
                  {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
                </div>

                <div className={`form-group ${formErrors.email ? 'has-error' : ''}`}>
                  <label htmlFor="email">Email*</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@mail.com"
                  />
                  {formErrors.email && <div className="error-message">{formErrors.email}</div>}
                </div>
              </div>

              <div className="checkout__section">
                <h2 className="checkout__section-title">Способ доставки</h2>

                <div className="form-group radio-group">
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="courier"
                      name="deliveryMethod"
                      value="courier"
                      checked={formData.deliveryMethod === 'courier'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="courier">Курьером</label>
                  </div>

                  <div className="radio-option">
                    <input
                      type="radio"
                      id="pickup"
                      name="deliveryMethod"
                      value="pickup"
                      checked={formData.deliveryMethod === 'pickup'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="pickup">Самовывоз</label>
                  </div>
                </div>

                {formData.deliveryMethod === 'courier' && (
                  <div className="delivery-address">
                    <div className={`form-group ${formErrors.address ? 'has-error' : ''}`}>
                      <label htmlFor="address">Адрес доставки*</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Улица, дом, квартира"
                      />
                      {formErrors.address && <div className="error-message">{formErrors.address}</div>}
                    </div>

                    <div className="form-row">
                      <div className={`form-group ${formErrors.city ? 'has-error' : ''}`}>
                        <label htmlFor="city">Город*</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Москва"
                        />
                        {formErrors.city && <div className="error-message">{formErrors.city}</div>}
                      </div>

                      <div className={`form-group ${formErrors.postalCode ? 'has-error' : ''}`}>
                        <label htmlFor="postalCode">Индекс*</label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="123456"
                        />
                        {formErrors.postalCode && <div className="error-message">{formErrors.postalCode}</div>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="checkout__section">
                <h2 className="checkout__section-title">Способ оплаты</h2>

                <div className="form-group radio-group">
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="card">Банковской картой</label>
                  </div>

                  <div className="radio-option">
                    <input
                      type="radio"
                      id="cash"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="cash">Наличными при получении</label>
                  </div>
                </div>
              </div>

              <div className="checkout__section">
                <h2 className="checkout__section-title">Комментарий к заказу</h2>

                <div className="form-group">
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Дополнительная информация по заказу"
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div className="checkout__actions">
                <button
                  type="button"
                  className="checkout__back-button"
                  onClick={() => navigate('/cart')}
                >
                  Вернуться в корзину
                </button>

                <button
                  type="submit"
                  className="checkout__submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
                </button>
              </div>
            </form>
          </div>

          <div className="checkout__summary">
            <div className="checkout__summary-content">
              <h2 className="checkout__summary-title">Ваш заказ</h2>

              <div className="checkout__items">
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout__item">
                    <div className="checkout__item-name">
                      {item.product_name} <span className="checkout__item-quantity">× {item.quantity}</span>
                    </div>
                    <div className="checkout__item-price">
                      {(parseFloat(item.price) * item.quantity).toFixed(1)} руб.
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout__summary-divider"></div>

              <div className="checkout__summary-total">
                <div className="checkout__summary-total-label">Итого:</div>
                <div className="checkout__summary-total-value">{totalCost.toFixed(1)} руб.</div>
              </div>

              <div className="checkout__summary-note">
                <p>Нажимая на кнопку "Оформить заказ", вы соглашаетесь с условиями обработки персональных данных и пользовательским соглашением.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
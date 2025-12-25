// components/ProductTableRow/ProductTableRow.jsx
import React, { useState } from 'react';
import { addToCart, getCartItems } from '../../services/api';
import './ProductTableRow.scss';

const ProductTableRow = ({ product, updateCartItemsCount }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      await addToCart(product.id, quantity);

      // Обновляем счетчик товаров в корзине
      const cartResponse = await getCartItems();
      const count = cartResponse.items.reduce((sum, item) => sum + item.quantity, 0);
      updateCartItemsCount(count);

      // Можно добавить уведомление об успешном добавлении в корзину
      setIsLoading(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Можно добавить уведомление об ошибке
      setIsLoading(false);
    }
  };

  return (
    <tr className="product-row">
      <td className="product-row__name">{product.name}</td>
      <td className="product-row__price">{product.price_formatted}</td>
      <td className="product-row__date">{product.updated_date}</td>
      <td className="product-row__quantity">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          className="product-row__quantity-input"
        />
      </td>
      <td className="product-row__actions">
        <button
          className={`product-row__cart-button ${isLoading ? 'loading' : ''}`}
          onClick={handleAddToCart}
          disabled={isLoading}
          aria-label="Добавить в корзину"
        >
          <i className="fas fa-shopping-cart"></i>
        </button>
      </td>
    </tr>
  );
};

export default ProductTableRow;
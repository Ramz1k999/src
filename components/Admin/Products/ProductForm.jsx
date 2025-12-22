import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, createProduct, updateProduct } from '../../services/api';
import './ProductForm.scss';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
    stock: '1'
  });
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const product = await getProductById(id);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category: product.category || '',
        image: null, // Изображение нужно загружать заново
        stock: product.stock.toString()
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Не удалось загрузить данные товара. Пожалуйста, попробуйте позже.');
      setLoading(false);
    }
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

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });

    if (formErrors.image) {
      setFormErrors({
        ...formErrors,
        image: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Название товара обязательно';
    }

    if (!formData.price.trim()) {
      errors.price = 'Цена товара обязательна';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      errors.price = 'Цена должна быть положительным числом';
    }

    if (!isEditing && !formData.image) {
      errors.image = 'Изображение товара обязательно';
    }

    if (!formData.stock.trim()) {
      errors.stock = 'Количество товара обязательно';
    } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      errors.stock = 'Количество должно быть неотрицательным числом';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Создаем FormData для отправки файла
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', formData.price);
      productData.append('category', formData.category);
      productData.append('stock', formData.stock);

      if (formData.image) {
        productData.append('image', formData.image);
      }

      if (isEditing) {
        await updateProduct(id, productData);
      } else {
        await createProduct(productData);
      }

      navigate('/admin/products');
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Не удалось сохранить товар. Пожалуйста, попробуйте позже.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="product-form__loading">Загрузка...</div>;
  }

  return (
    <div className="product-form">
      <h1 className="product-form__title">
        {isEditing ? 'Редактирование товара' : 'Добавление нового товара'}
      </h1>

      {error && <div className="product-form__error">{error}</div>}

      <form className="product-form__form" onSubmit={handleSubmit}>
        <div className={`form-group ${formErrors.name ? 'has-error' : ''}`}>
          <label htmlFor="name">Название товара*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          {formErrors.name && <div className="error-message">{formErrors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="5"
          ></textarea>
        </div>

        <div className={`form-group ${formErrors.price ? 'has-error' : ''}`}>
          <label htmlFor="price">Цена*</label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />
          {formErrors.price && <div className="error-message">{formErrors.price}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Категория</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          />
        </div>

        <div className={`form-group ${formErrors.image ? 'has-error' : ''}`}>
          <label htmlFor="image">Изображение{!isEditing && '*'}</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
          />
          {formErrors.image && <div className="error-message">{formErrors.image}</div>}
        </div>

        <div className={`form-group ${formErrors.stock ? 'has-error' : ''}`}>
          <label htmlFor="stock">Количество на складе*</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            min="0"
          />
          {formErrors.stock && <div className="error-message">{formErrors.stock}</div>}
        </div>

        <div className="product-form__actions">
          <button
            type="button"
            className="product-form__cancel-button"
            onClick={() => navigate('/admin/products')}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="product-form__submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
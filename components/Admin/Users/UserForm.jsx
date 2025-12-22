import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, createUser, updateUser } from '../../../services/api';
import './UserForm.scss';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    address: '',
    company: ''
  });
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const user = await getUserById(id);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Пароль не возвращается с сервера
        role: user.role || 'user',
        phone: user.phone || '',
        address: user.address || '',
        company: user.company || ''
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Не удалось загрузить данные пользователя. Пожалуйста, попробуйте позже.');
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

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Имя пользователя обязательно';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Неверный формат email';
    }

    if (!isEditing && !formData.password) {
      errors.password = 'Пароль обязателен для нового пользователя';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Пароль должен содержать не менее 6 символов';
    }

    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Неверный формат номера телефона';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Генерация случайного пароля
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({
      ...formData,
      password
    });
    setShowPassword(true); // Показываем пароль после генерации
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        address: formData.address,
        company: formData.company
      };

      if (formData.password) {
        userData.password = formData.password;
      }

      if (isEditing) {
        await updateUser(id, userData);
      } else {
        await createUser(userData);
      }

      navigate('/admin/users');
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Не удалось сохранить пользователя. Пожалуйста, попробуйте позже.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="user-form__loading">Загрузка...</div>;
  }

  return (
    <div className="user-form">
      <h1 className="user-form__title">
        {isEditing ? 'Редактирование пользователя' : 'Создание нового пользователя'}
      </h1>

      {error && <div className="user-form__error">{error}</div>}

      <form className="user-form__form" onSubmit={handleSubmit}>
        <div className={`form-group ${formErrors.name ? 'has-error' : ''}`}>
          <label htmlFor="name">Имя пользователя*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Иванов Иван Иванович"
          />
          {formErrors.name && <div className="error-message">{formErrors.name}</div>}
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

        <div className={`form-group ${formErrors.password ? 'has-error' : ''}`}>
          <label htmlFor="password">
            {isEditing ? 'Новый пароль' : 'Пароль*'}
          </label>
          <div className="password-input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Минимум 6 символов"
            />
            <button
              type="button"
              className="generate-password-button"
              onClick={generateRandomPassword}
              title="Сгенерировать пароль"
            >
              <i className="icon-refresh"></i>
            </button>
            <button
              type="button"
              className="toggle-password-button"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              <i className={`icon-${showPassword ? 'eye-off' : 'eye'}`}></i>
            </button>
          </div>
          {formErrors.password && <div className="error-message">{formErrors.password}</div>}
          {isEditing && <div className="form-hint">Оставьте пустым, если не хотите менять пароль</div>}
        </div>

        <div className="form-group">
          <label htmlFor="role">Роль</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="user">Пользователь</option>
            <option value="admin">Администратор</option>
          </select>
        </div>

        <div className={`form-group ${formErrors.phone ? 'has-error' : ''}`}>
          <label htmlFor="phone">Телефон</label>
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

        <div className="form-group">
          <label htmlFor="company">Компания</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Название компании"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Адрес</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Полный адрес"
            rows="3"
          ></textarea>
        </div>

        <div className="user-form__actions">
          <button
            type="button"
            className="user-form__cancel-button"
            onClick={() => navigate('/admin/users')}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="user-form__submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
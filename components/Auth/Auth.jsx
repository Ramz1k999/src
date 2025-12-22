import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../services/api';
import './Auth.scss';
import logoImage from '../../assets/images/logo.png';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Если пользователь уже авторизован, перенаправляем на главную
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

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

    // Очищаем общую ошибку логина
    if (loginError) {
      setLoginError(null);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Пожалуйста, введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Неверный формат email';
    }

    if (!formData.password) {
      errors.password = 'Пожалуйста, введите пароль';
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
      const response = await login(formData.email, formData.password);

      // Сохраняем токен и данные пользователя
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Перенаправляем пользователя
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo);
    } catch (error) {
      console.error('Auth error:', error);
      setLoginError(error.message || 'Неверный email или пароль. Пожалуйста, попробуйте снова.');
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__logo">
          <img src={logoImage} alt="PERFUME FOR YOU" />
          <h1>PERFUME FOR YOU</h1>
        </div>

        <h2 className="login__title">Вход в систему</h2>

        {loginError && (
          <div className="login__error">
            {loginError}
          </div>
        )}

        <form className="login__form" onSubmit={handleSubmit}>
          <div className={`login__form-group ${formErrors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Введите ваш email"
              autoComplete="email"
            />
            {formErrors.email && <div className="login__error-message">{formErrors.email}</div>}
          </div>

          <div className={`login__form-group ${formErrors.password ? 'has-error' : ''}`}>
            <label htmlFor="password">Пароль</label>
            <div className="login__password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Введите ваш пароль"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login__toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                <i className={`icon-${showPassword ? 'eye-off' : 'eye'}`}></i>
              </button>
            </div>
            {formErrors.password && <div className="login__error-message">{formErrors.password}</div>}
          </div>

          <button
            type="submit"
            className="login__submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="login__footer">
          <p>Если у вас нет учетной записи или вы забыли пароль, пожалуйста, обратитесь к администратору.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
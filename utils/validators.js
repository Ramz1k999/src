// Валидация email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Валидация телефона
export const isValidPhone = (phone) => {
  const re = /^\+?[0-9]{10,15}$/;
  return re.test(String(phone).replace(/\s/g, ''));
};
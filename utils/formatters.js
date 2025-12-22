// Форматирование цены
export const formatPrice = (price, currency = 'RUB') => {
  if (currency === 'RUB') {
    return `${parseFloat(price).toFixed(1)} руб.`;
  } else {
    return `$${(parseFloat(price) / 81.8).toFixed(2)}`;
  }
};

// Форматирование даты
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};
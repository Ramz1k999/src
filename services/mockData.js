// src/services/mockData.js

// Моковые товары без фотографий и описаний
export const products = [
  {
    id: 1,
    name: "Chanel No. 5",
    price: 8500,
    price_formatted: "8 500 ₽",
    stock: 15,
    updated_date: "2023-05-15"
  },
  {
    id: 2,
    name: "Dior Sauvage",
    price: 7200,
    price_formatted: "7 200 ₽",
    stock: 10,
    updated_date: "2023-06-20"
  },
  {
    id: 3,
    name: "Yves Saint Laurent Black Opium",
    price: 6800,
    price_formatted: "6 800 ₽",
    stock: 8,
    updated_date: "2023-04-10"
  },
  {
    id: 4,
    name: "Tom Ford Tobacco Vanille",
    price: 15000,
    price_formatted: "15 000 ₽",
    stock: 5,
    updated_date: "2023-03-25"
  },
  {
    id: 5,
    name: "Jo Malone English Pear & Freesia",
    price: 9200,
    price_formatted: "9 200 ₽",
    stock: 12,
    updated_date: "2023-07-05"
  }
];

// Моковые пользователи
export const users = [
  {
    id: 1,
    name: "Администратор",
    email: "admin@example.com",
    password: "admin123", // В реальном приложении пароли должны быть хешированы
    role: "admin",
    created_at: "2023-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Пользователь",
    email: "user@example.com",
    password: "user123", // В реальном приложении пароли должны быть хешированы
    role: "user",
    created_at: "2023-01-02T00:00:00Z"
  }
];

// Моковая корзина
export const cart = {
  id: 1,
  user_id: 2,
  items: [
    {
      id: 1,
      product_id: 1,
      product: products[0],
      quantity: 1,
      price: 8500
    }
  ],
  total: 8500
};

// Моковые заказы
export const orders = [
  {
    id: 1,
    user_id: 2,
    total_amount: 8500,
    status: "completed",
    delivery_method: "courier",
    payment_method: "card",
    created_at: "2023-07-10T00:00:00Z",
    items: [
      {
        product_id: 1,
        quantity: 1,
        price: 8500
      }
    ]
  }
];
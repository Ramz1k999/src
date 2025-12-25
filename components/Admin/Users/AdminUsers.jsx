import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../../../services/api';
import './AdminUsers.scss';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers(currentPage);

      // Если response это массив (как в случае с моковыми данными)
      const usersList = Array.isArray(response) ? response : (response.users || []);

      setUsers(usersList);

      // Вычисляем общее количество страниц
      const totalCount = Array.isArray(response) ? response.length : (response.total_count || 0);
      const perPage = 10; // Предполагаем, что у нас 10 пользователей на страницу
      setTotalPages(Math.ceil(totalCount / perPage));
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Не удалось загрузить пользователей. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const confirmDelete = (userId) => {
    setDeleteConfirmation(userId);
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setDeleteConfirmation(null);
      fetchUsers(); // Обновляем список после удаления
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Не удалось удалить пользователя. Пожалуйста, попробуйте позже.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Не указано';
    }

    try {
      const date = new Date(dateString);

      // Проверяем, является ли дата валидной
      if (isNaN(date.getTime())) {
        return 'Неверная дата';
      }

      return date.toLocaleDateString('ru-RU');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Ошибка формата';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'user':
        return 'Пользователь';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div className="admin-users">
      <div className="admin-users__header">
        <h1 className="admin-users__title">Управление пользователями</h1>
        <Link to="/admin/users/add" className="admin-users__add-button">
          <i className="fas fa-plus"></i> Добавить пользователя
        </Link>
      </div>

      {loading ? (
        <div className="admin-users__loading">
          <div className="loading-spinner"></div>
          <p>Загрузка пользователей...</p>
        </div>
      ) : error ? (
        <div className="admin-users__error">{error}</div>
      ) : users.length === 0 ? (
        <div className="admin-users__empty">Пользователи не найдены</div>
      ) : (
        <>
          <div className="admin-users__table-container">
            <table className="admin-users__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Дата регистрации</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{getRoleLabel(user.role)}</td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>
                      <div className="admin-users__actions">
                        <Link
                          to={`/admin/users/edit/${user.id}`}
                          className="admin-users__edit-button"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          className="admin-users__delete-button"
                          onClick={() => confirmDelete(user.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="admin-users__pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`admin-users__page-button ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Модальное окно подтверждения удаления */}
      {deleteConfirmation && (
        <div className="admin-users__modal-overlay">
          <div className="admin-users__modal">
            <h3>Подтверждение удаления</h3>
            <p>Вы уверены, что хотите удалить этого пользователя?</p>
            <div className="admin-users__modal-actions">
              <button
                className="admin-users__modal-cancel"
                onClick={cancelDelete}
              >
                Отмена
              </button>
              <button
                className="admin-users__modal-confirm"
                onClick={() => handleDelete(deleteConfirmation)}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
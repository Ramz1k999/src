import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../../services/api';
import './AdminUsers.scss';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 20;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers(currentPage, perPage);
      setUsers(response.users);
      setTotalPages(Math.ceil(response.total_count / perPage));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Не удалось загрузить пользователей. Пожалуйста, попробуйте позже.');
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await deleteUser(id);
        // Обновляем список пользователей
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Не удалось удалить пользователя. Пожалуйста, попробуйте позже.');
      }
    }
  };

  return (
    <div className="admin-users">
      <div className="admin-users__header">
        <h1 className="admin-users__title">Управление пользователями</h1>
        <Link to="/admin/users/add" className="admin-users__add-button">
          Добавить пользователя
        </Link>
      </div>

      {loading ? (
        <div className="admin-users__loading">Загрузка...</div>
      ) : error ? (
        <div className="admin-users__error">{error}</div>
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
                    <td>{user.role}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="admin-users__actions">
                      <Link
                        to={`/admin/users/edit/${user.id}`}
                        className="admin-users__edit-button"
                      >
                        Редактировать
                      </Link>
                      <button
                        className="admin-users__delete-button"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Пагинация */}
          <div className="admin-users__pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`admin-users__page-button ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUsers;
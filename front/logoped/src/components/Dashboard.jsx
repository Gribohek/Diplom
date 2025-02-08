import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const AdminDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingChild, setEditingChild] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    title: "",
    score: 0,
    completed: false,
  });

  useEffect(() => {
    const fetchChildren = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setError("Вы не авторизованы");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:4200/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Не удалось получить данные пользователя");
        }

        const data = await response.json();
        setUserData(data);
        setFormData({
          username: data.username,
          lastName: data.lastName,
          firstName: data.firstName,
          middleName: data.middleName || "", // Убедитесь, что это поле необязательное
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }

      if (!token) {
        setError("Вы не авторизованы");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:4200/admin/children", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Не удалось получить информацию о детях");
        }

        const data = await response.json();
        setChildren(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const handleDelete = async (id) => {
    const token = Cookies.get("token");
    if (!token) {
      setError("Вы не авторизованы");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4200/admin/children/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Не удалось удалить ребенка");
      }

      // Обновляем список детей с удаленным ребенком
      setChildren(children.filter((child) => child.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEdit = (child) => {
    setEditingChild(child);
    setFormData({
      firstName: child.firstName,
      lastName: child.lastName,
      middleName: child.middleName,
      title: child.title,
      score: child.score,
      completed: child.completed,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "completed" ? e.target.checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    try {
      const response = await fetch(
        `http://localhost:4200/admin/children/${editingChild.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Не удалось обновить информацию о ребенке");
      }

      // Обновляем список детей
      const updatedChild = await response.json();
      setChildren(
        children.map((child) =>
          child.id === updatedChild.id ? updatedChild : child
        )
      );
      setEditingChild(null); // Закрываем форму редактирования
    } catch (e) {
      setError(e.message);
    }
  };

  const handleCancel = () => {
    setEditingChild(null);
  };
  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    if (!token) {
      setError("Вы не авторизованы");
      return;
    }

    try {
      const response = await fetch("http://localhost:4200/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Не удалось обновить данные пользователя");
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      setEditing(false);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDeleteAccount = async () => {
    const token = Cookies.get("token");

    if (!token) {
      setError("Вы не авторизованы");
      return;
    }

    if (window.confirm("Вы уверены, что хотите удалить аккаунт?")) {
      try {
        const response = await fetch("http://localhost:4200/users/me", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Не удалось удалить аккаунт");
        }

        alert("Аккаунт успешно удален");
        // Завершение сессии
        Cookies.remove("token");
        // Перенаправление на страницу входа (например, на главную)
        window.location.href = "/login"; // замените на нужный путь
      } catch (e) {
        setError(e.message);
      }
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <h1>Личный кабинет терапевта</h1>
      {userData && userData.role === "THERAPIST" ? (
        <div className="user-info">
          {editing ? (
            <form onSubmit={handleUpdate}>
              <label>
                Логин :
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Фамилия:
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required // Сделаем обязательным
                />
              </label>
              <label>
                Имя:
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required // Сделаем обязательным
                />
              </label>
              <label>
                Отчество (необязательно):
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </label>
              <button type="submit">Сохранить</button>
              <button type="button" onClick={handleEditToggle}>
                Отмена
              </button>
            </form>
          ) : (
            <div>
              <p>Логин: {userData.username}</p>
              <p>Фамилия: {userData.lastName}</p>
              <p>Имя: {userData.firstName}</p>
              <p>Отчество: {userData.middleName}</p>
              <button onClick={handleEditToggle}>Редактировать</button>
              <button onClick={handleDeleteAccount}>Удалить аккаунт</button>
            </div>
          )}
          <h3>Дети:</h3>
          <table>
            <thead>
              <tr>
                <th>Фамилия</th>
                <th>Имя</th>
                <th>Отчество</th>
                <th>Название игры</th>
                <th>Уровень</th>
                <th>Завершено</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {children.length > 0 ? (
                children.map((child) => (
                  <tr key={child.id}>
                    <td>{child.lastName}</td>
                    <td>{child.firstName}</td>
                    <td>{child.middleName}</td>
                    <td>{child.title ?? "-"}</td>
                    <td>{child.score ?? 0}</td>
                    <td>{child.completed ? "Да" : "Нет"}</td>
                    <td>
                      <button onClick={() => handleEdit(child)}>
                        Редактировать
                      </button>
                      <button onClick={() => handleDelete(child.id)}>
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Нет данных о детях.</td>
                </tr>
              )}
            </tbody>
          </table>

          {editingChild && (
            <div>
              <h3>Редактировать ребенка</h3>
              <form onSubmit={handleSubmit}>
                <label>
                  Имя:
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    required
                  />
                </label>
                <label>
                  Фамилия:
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    required
                  />
                </label>
                <label>
                  Отчество:
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleFormChange}
                  />
                </label>
                <button type="submit">Сохранить</button>
                <button type="button" onClick={handleCancel}>
                  Отмена
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h1>Личный кабинет</h1>
          {userData &&
            userData.role === "CHILD" && ( // Отображаем только для роли "child"
              <div className="user-info">
                {editing ? (
                  <form onSubmit={handleUpdate}>
                    <label>
                      Логин :
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label>
                      Фамилия:
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required // Сделаем обязательным
                      />
                    </label>
                    <label>
                      Имя:
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required // Сделаем обязательным
                      />
                    </label>
                    <label>
                      Отчество (необязательно):
                      <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                      />
                    </label>
                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={handleEditToggle}>
                      Отмена
                    </button>
                  </form>
                ) : (
                  <div>
                    <p>Фамилия: {userData.lastName}</p>
                    <p>Имя: {userData.firstName}</p>
                    <p>Отчество: {userData.middleName}</p>
                    <p>Игра: {userData.title}</p>
                    <p>Уровень: {userData.score}</p>
                    <button onClick={handleEditToggle}>Редактировать</button>
                    <button onClick={handleDeleteAccount}>
                      Удалить аккаунт
                    </button>
                  </div>
                )}
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import "./Dashboard.css";
import * as XLSX from "xlsx";

const AdminDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]);
  const [editingChild, setEditingChild] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
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
        const response = await fetch("http://localhost:4200/users/children", {
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

    const fetchData = async () => {
      await fetchChildren(); // Получение данных пользователя
    };
    fetchData();
  }, []);
  const fetchUserGames = async () => {
    const token = Cookies.get("token");

    try {
      const response = await fetch("http://localhost:4200/users/game", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не удалось получить данные об играх");
      }

      const data = await response.json();
      setGames(data);
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => {
    if (userData) {
      fetchUserGames(); // Получение игр пользователя
    }
  }, [userData]);
  const handleDelete = async (id) => {
    const token = Cookies.get("token");
    if (!token) {
      setError("Вы не авторизованы");
      return;
    }
    if (window.confirm("Вы уверены, что хотите удалить аккаунт?"))
      try {
        const response = await fetch(
          `http://localhost:4200/users/children/${id}`,
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
        `http://localhost:4200/users/children/${editingChild.id}`,
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
      setChildren((prevChildren) =>
        prevChildren.map((child) =>
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
      setUserData((prevUserData) => ({
        ...prevUserData,
        ...updatedData,
      }));
      setEditing(false);
    } catch (e) {
      setError(e.message);
    }
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Фильтрация детей по фамилии
  const filteredChildren = children.filter(
    (child) =>
      child.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (child.middleName &&
        child.middleName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
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
  function exportToXLSX() {
    const data = [];
    const headers = [
      "Фамилия",
      "Имя",
      "Отчество",
      "Название игры",
      "Очки",
      "Завершено",
    ];

    // Добавим заголовки
    data.push(headers);

    filteredChildren.forEach((child) => {
      if (child.games.length > 0) {
        child.games.forEach((game, index) => {
          if (index === 0) {
            // Добавляем информацию о ребенке для первой игры
            data.push([
              child.lastName,
              child.firstName,
              child.middleName,
              game.title || "игр нет",
              game.score || 0,
              game.completed ? "Да" : "Нет",
            ]);
          } else {
            // Для остальных игр добавляем только данные об игре
            data.push([
              "", // Фамилия
              "", // Имя
              "", // Отчество
              game.title || "игр нет",
              game.score || 0,
              game.completed ? "Да" : "Нет",
            ]);
          }
        });
      } else {
        // Если у ребенка нет игр
        data.push([
          child.lastName,
          child.firstName,
          child.middleName,
          "Игры отсутствуют",
          "",
          "",
        ]);
      }
    });

    // Создаем лист и книгу
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Отчет");

    // Экспортируем в Excel
    XLSX.writeFile(wb, "report.xlsx");
  }

  // Кнопка для вызова функции

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <Header />
      {userData && userData.role === "THERAPIST" ? (
        <div className="user-info">
          <h1>Личный кабинет терапевта</h1>
          {editing ? (
            <form onSubmit={handleUpdate} className="edit-form">
              <div className="form-field">
                <label>
                  Логин:
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label>
                  Фамилия:
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label>
                  Имя:
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label>
                  Отчество (необязательно):
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </label>
              </div>
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
              <div>
                <Link to="/register">Заегистрировать нового ребенка</Link>
              </div>
              <input
                type="text"
                placeholder="Поиск по ребекна"
                value={searchTerm}
                onChange={handleSearchChange}
              />
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
                <th>Очки</th>
                <th>Завершено</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredChildren.length > 0 ? (
                filteredChildren.map((child) =>
                  child.games.length > 0 ? (
                    child.games.map((game, index) => (
                      <tr key={game.id}>
                        {index === 0 && (
                          <>
                            <td rowSpan={child.games.length}>
                              {child.lastName}
                            </td>
                            <td rowSpan={child.games.length}>
                              {child.firstName}
                            </td>
                            <td rowSpan={child.games.length}>
                              {child.middleName}
                            </td>
                          </>
                        )}
                        <td>{game.title ?? "игр нет"}</td>
                        <td>{game.score ?? 0}</td>
                        <td>{game.completed ? "Да" : "Нет"}</td>

                        {index === 0 && (
                          <td
                            rowSpan={child.games.length}
                            className="action-buttons"
                          >
                            <button onClick={() => handleEdit(child)}>
                              Редактировать
                            </button>
                            <button onClick={() => handleDelete(child.id)}>
                              Удалить
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr key={child.id}>
                      <td>{child.lastName}</td>
                      <td>{child.firstName}</td>
                      <td>{child.middleName}</td>
                      <td colSpan={3}>Игры отсутствуют</td>
                      <td>
                        <button onClick={() => handleEdit(child)}>
                          Редактировать
                        </button>
                        <button onClick={() => handleDelete(child.id)}>
                          Удалить
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={7}>Нет данных для отображения</td>
                </tr>
              )}
            </tbody>
          </table>
          <button className="export" onClick={exportToXLSX}>
            Экспортировать в XLSX
          </button>
          {editingChild && (
            <div>
              <h3>Редактировать ребенка</h3>
              <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-field">
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
                </div>
                <div className="form-field">
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
                </div>
                <div className="form-field">
                  <label>
                    Отчество:
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleFormChange}
                    />
                  </label>
                </div>
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
          {userData &&
            userData.role === "CHILD" && ( // Отображаем только для роли "child"
              <div className="user-info">
                <h1>Личный кабинет</h1>
                {editing ? (
                  <form onSubmit={handleUpdate} className="edit-form">
                    <div className="form-field">
                      <label>
                        Логин:
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          required
                        />
                      </label>
                    </div>
                    <div className="form-field">
                      <label>
                        Фамилия:
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </label>
                    </div>
                    <div className="form-field">
                      <label>
                        Имя:
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </label>
                    </div>
                    <div className="form-field">
                      <label>
                        Отчество (необязательно):
                        <input
                          type="text"
                          name="middleName"
                          value={formData.middleName}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
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
                    <div>
                      <h2>Ваши игры:</h2>
                      <ul>
                        {games.map((game) => (
                          <li key={game.id}>
                            <h3>{game.title}</h3>
                            <p>
                              Счет:{" "}
                              {game.score !== null
                                ? game.score
                                : "Не установлен"}
                            </p>
                            <p>Завершена: {game.completed ? "Да" : "Нет"}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
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

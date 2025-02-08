import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Header from "./Header"; // Импортируем заголовок, если он нужен

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    lastName: "",
    firstName: "",
    middleName: "", // Это поле может быть не обязательным
  });

  const fetchUserData = async () => {
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

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
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
                <button onClick={handleDeleteAccount}>Удалить аккаунт</button>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default Dashboard;

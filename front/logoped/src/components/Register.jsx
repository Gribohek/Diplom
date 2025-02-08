import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Cookies from "js-cookie"; // Импортируйте js-cookie

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    username: "",
    password: "",
    role: "CHILD",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [usernameExists, setUsernameExists] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "username") {
      setUsernameExists(false);
    }
  };

  const checkUsernameExists = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:4200/auth/check-username?username=${username}`
      );
      return response.data.exists; // Предполагается, что сервер возвращает { exists: true/false }
    } catch (error) {
      console.error("Ошибка проверки логина:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.middleName && formData.middleName.length < 2) {
      setError("Поле 'Отчество' должно содержать минимум 2 символа.");
      return;
    }

    // Проверяем доступность логина
    const usernameTaken = await checkUsernameExists(formData.username);
    if (usernameTaken) {
      setUsernameExists(true);
      setError("Этот логин уже занят. Пожалуйста, выберите другой.");
      return;
    }

    try {
      // Отправляем данные для регистрации
      await axios.post("http://localhost:4200/auth/register", formData);

      // Логинимся после успешной регистрации
      const loginResponse = await axios.post(
        "http://localhost:4200/auth-v2/login",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      Cookies.set("token", loginResponse.data.accessToken, { expires: 1 });

      setSuccess("Регистрация успешна!");

      // Очистка формы
      setFormData({
        firstName: "",
        lastName: "",
        middleName: "",
        username: "",
        password: "",
        role: "CHILD",
      });

      // Перенаправление на главную страницу
      navigate("/");
    } catch (err) {
      setError("Регистрация не удалась. Пожалуйста, попробуйте снова.");
    }
  };

  return (
    <div>
      <Header />
      <div>
        <h2>Регистрация</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Имя:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Фамилия:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Отчество:</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Логин:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {usernameExists && (
              <p style={{ color: "red" }}>Этот логин уже занят.</p>
            )}
          </div>
          <div>
            <label>Пароль:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Роль:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="CHILD">Ребёнок</option>
              <option value="THERAPIST">Терапевт</option>
              <option value="ADMIN">Администратор</option>
            </select>
          </div>
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
    </div>
  );
};

export default Register;

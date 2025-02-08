import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Cookies from "js-cookie"; // Импортируем библиотеку js-cookie

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Инициализация useNavigate

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4200/auth-v2/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const loginResponse = await response.json();
        Cookies.set("token", loginResponse.accessToken, {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        });

        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Неверный логин или пароль");
      }
    } catch (error) {
      setError("Ошибка сети. Попробуйте снова.");
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Логин"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          onChange={handleChange}
          required
        />
        <button type="submit">Войти</button>
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
        {/* Отображение ошибки */}
      </form>
    </div>
  );
};

export default Login;

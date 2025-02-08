import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie"; // Импорт библиотеки js-cookie

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Проверка наличия токена в куках при загрузке компонента
    const token = Cookies.get("token"); // Получаем токен из куки
    if (token) {
      setIsAuthenticated(true); // Пользователь авторизован
    }
  }, []);

  const onLogoClick = () => {
    window.location.href = "/"; // Перезагрузка страницы
  };

  const handleLogout = () => {
    Cookies.remove("token"); // Удаляем токен из куки
    setIsAuthenticated(false); // Обновляем состояние аутентификации
    // Дополнительно, вы можете перенаправить пользователя на главную страницу или на страницу входа
    window.location.href = "/"; // Возвращаем на главную страницу
  };

  return (
    <header className="header">
      <div className="logo" onClick={onLogoClick}>
        Логотип
      </div>
      <nav className="nav">
        {!isAuthenticated && (
          <>
            <Link to="/register">Регистрация</Link>
            <Link to="/login">Вход</Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <Link to="/dashboard">Личный кабинет</Link>
            <button onClick={handleLogout}>Выйти</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;

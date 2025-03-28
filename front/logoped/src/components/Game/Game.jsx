import React from "react";
import { Link } from "react-router-dom"; // Убедитесь, что вы импортируете Link, если используете React Router
import Header from "../Header/Header"; // Убедитесь, что вы импортируете Header, если он у вас есть
import Cookies from "js-cookie";
// Функция для получения userId по имени пользователя
const token = Cookies.get("token");

// Функция для получения userId по username
const getUserIdByUsername = async (username) => {
  console.log("Username being fetched:", username); // Логируем значение username
  try {
    const response = await fetch(`http://localhost:4200/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при получении пользователя");
    }

    const userData = await response.json();
    return userData.id; // Предполагаем, что ответ содержит поле id
  } catch (error) {
    console.error("Ошибка:", error);
  }
};

// Функция для добавления или обновления игры
const submitGameResult = async (userId, title, score, completed) => {
  try {
    const response = await fetch(`http://localhost:4200/games/user/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при получении игр пользователя");
    }

    const userGames = await response.json();

    // Найти игру по названию
    const existingGame = userGames.find((game) => game.title === title);

    if (existingGame) {
      // Если игра существует, обновляем счет
      const newScore = existingGame.score + 100; // Можете изменить это значение по необходимости
      await updateGameScore(existingGame.id, newScore);
    } else {
      // Если игра не существует, создаем новую запись
      await createNewGame(userId, title, score, completed);
    }
  } catch (error) {
    console.error("Ошибка:", error);
  }
};

// Функция для создания новой игры
const createNewGame = async (userId, title, score, completed = true) => {
  const gameData = {
    title,
    score,
    completed, // По умолчанию устанавливаем completed как true
    userId,
  };

  try {
    const response = await fetch("http://localhost:4200/games", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    });

    if (!response.ok) {
      throw new Error("Ошибка при добавлении новой игры");
    }

    const result = await response.json();
    console.log("Игра успешно добавлена:", result);
  } catch (error) {
    console.error("Ошибка:", error);
  }
};

// Функция для обновления счета игры
const updateGameScore = async (gameId, newScore) => {
  try {
    const response = await fetch(`http://localhost:4200/games/${gameId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score: newScore }),
    });

    if (!response.ok) {
      throw new Error("Ошибка при обновлении счета игры");
    }

    const result = await response.json();
    console.log("Счет игры успешно обновлен:", result);
  } catch (error) {
    console.error("Ошибка:", error);
  }
};
// Функция, вызываемая при завершении игры
const onGameComplete = async (user) => {
  const username = user.username; // Извлекаем username
  const title = "Что звучит";
  const score = 100; // Начальный счет
  const completed = true;
  // Получаем userId по имени пользователя
  const userId = await getUserIdByUsername(username);

  if (userId) {
    // Обновляем прогресс игры
    await submitGameResult(userId, title, score, completed);
  } else {
    console.error("Не удалось получить userId");
  }
};

const IframeComponent = () => {
  return (
    <div className="homepage">
      <Header />
      <aside className="sidebar">
        <ul className="menu">
          <li>
            <Link to="/section1">Психологическая база речи</Link>
          </li>
          <li>
            <Link to="/section2">Развитие лексической стороны речи</Link>
          </li>
          <li>
            <Link to="/section3">Развитие грамматической стороны речи</Link>
          </li>
          <li>
            <Link to="/section4">Развитие связной речи</Link>
          </li>
          <li>
            <Link to="/section5">Обучение грамоте</Link>
          </li>
          <li>
            <Link to="/section6">Звукопроизношение</Link>
          </li>
          <li>
            <Link to="/section7">Мелкая моторика</Link>
          </li>
          <li>
            <Link to="/section8">Игры и игровые упражнения</Link>
          </li>
        </ul>
      </aside>

      <main
        className="main-content"
        style={{
          display: "flex",
          flexDirection: "column", // Устанавливаем вертикальное направление
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          width: "100vw",
          overflow: "auto",
        }}
      >
        <iframe
          src="https://learningapps.org/watch?v=prcyof8nk20"
          style={{ border: "0px", width: "100%", height: "500px" }}
          allowFullScreen
          webkitAllowFullScreen
          mozAllowFullScreen
          title="Что звучит?"
        />
        <button onClick={onGameComplete} style={{ marginTop: "20px" }}>
          Завершить игру и сохранить прогресс
        </button>
      </main>
    </div>
  );
};

export default IframeComponent;

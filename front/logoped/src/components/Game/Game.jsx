import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../Header/Header.jsx";
import "../HomePage/HomePage.css";
import { Link } from "react-router-dom";
import Kartochki from "./Gamekartochki.jsx";
import GameZvuk from "./GameZvuk.jsx";

function IframeComponent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeGame, setActiveGame] = useState(null); // 'sound' или 'kartochki'
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
      // Проверка доступа к микрофону при загрузке компонента
      navigator.mediaDevices.getUserMedia({ audio: true }).catch((err) => {
        console.error("Microphone access denied:", err);
      });
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const openSoundGame = () => {
    setActiveGame("sound");
  };

  const openCardsGame = () => {
    setActiveGame("kartochki");
  };

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

      <div className="main-content">
        <h1>Логопедические игры</h1>

        <div className="game-selector">
          <button
            onClick={openSoundGame}
            className={`game-button ${activeGame === "sound" ? "active" : ""}`}
          >
            Игра "Повтори звук"
          </button>
          <button
            onClick={openCardsGame}
            className={`game-button ${
              activeGame === "kartochki" ? "active" : ""
            }`}
          >
            Игра "Найти одинаковые карточки"
          </button>
        </div>

        {activeGame === "sound" && (
          <div className="game-container">
            <GameZvuk />
          </div>
        )}

        {activeGame === "kartochki" && (
          <div className="game-container">
            <h2>Игра "Найти одинаковые карточки"</h2>
            <Kartochki />
          </div>
        )}
      </div>
    </div>
  );
}

export default IframeComponent;

// src/components/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // Импортируем CSS для стилей
import Header from "./Header";

const HomePage = () => {
  return (
    <div className="homepage">
      <Header />
      <aside className="sidebar">
        <ul className="menu">
          <li>
            <Link to="/section1">Раздел 1</Link>
          </li>
          <li>
            <Link to="/section2">Раздел 2</Link>
          </li>
          <li>
            <Link to="/section3">Раздел 3</Link>
          </li>
          <li>
            <Link to="/section4">Раздел 4</Link>
          </li>
          <li>
            <Link to="/section5">Раздел 5</Link>
          </li>
          <li>
            <Link to="/section6">Раздел 6</Link>
          </li>
          <li>
            <Link to="/section7">Раздел 7</Link>
          </li>
          <li>
            <Link to="/section8">Раздел 8</Link>
          </li>
        </ul>
      </aside>
      <main className="main-content">
        <h1>Добро пожаловать на наш логопедический сайт!</h1>
        <p>
          На нашем сайте вы найдете профессиональные услуги логопедов,
          информацию о различных речевых нарушениях, а также ресурсы для
          родителей и детей, которые нуждаются в помощи.
        </p>
        <p>
          Мы предлагаем индивидуальные занятия, консультации, а также группы для
          детей, чтобы улучшить их коммуникативные навыки и уверенность в себе.
        </p>
        <p>
          Для получения более подробной информации, пожалуйста,
          зарегистрируйтесь или войдите в систему!
        </p>
      </main>
    </div>
  );
};

export default HomePage;

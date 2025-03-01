// src/components/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // Импортируем CSS для стилей
import Header from "../Header/Header";

const HomePage = () => {
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
            <Link to="/section3">Развитие граматической стороны речи</Link>
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
      <main className="main-content">
        <h1>Добро пожаловать на наш логопедический сайт!</h1>
        <p>
          Мы рады приветствовать вас в нашем увлекательном и познавательном
          мире, созданном для поддержки развития речи ваших детей. Наша система
          предлагает разнообразные образовательные материалы и игры, которые
          помогут детям развивать навыки общения, расширять словарный запас и
          уверенно выражать свои мысли.
        </p>
        <p>
          <h2>Для родителей </h2>На этом сайте вы найдете методические
          материалы, которые помогут вам поддерживать и развивать речевые навыки
          вашего ребенка. Мы предлагаем: Рекомендации по развитию речи: Узнайте,
          как правильно организовать занятия и какие методы использовать для
          эффективного обучения. Статьи и советы: Полезные материалы о том, как
          создать благоприятную языковую среду для вашего ребенка.
        </p>
        <h2>Для детей </h2>
        <p>
          Наш раздел с играми предлагает увлекательные и развивающие задания,
          которые сделают обучение интересным и веселым. Здесь вы найдете: Игры
          на развитие речи: Интерактивные задания, которые помогут детям учиться
          через игру. Упражнения для тренировки навыков: Разнообразные
          упражнения, направленные на развитие фонематического слуха,
          артикуляции и словарного запаса.
        </p>
        <h2>Начните обучение уже сегодня! </h2>
        <p>
          Присоединяйтесь к нам и откройте для вашего ребенка мир увлекательного
          обучения! Зарегистрируйтесь в личном кабинете, чтобы получить доступ
          ко всем материалам и отслеживать прогресс вашего ребенка. Мы уверены,
          что вместе мы сможем сделать процесс обучения интересным и
          эффективным!
        </p>
      </main>
    </div>
  );
};

export default HomePage;

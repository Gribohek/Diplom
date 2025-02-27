// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import HomePage from "./components/HomePage/HomePage.jsx";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Game from "./components/Game/Game";
import BazaRechi from "./components/section1/BazaRechi.jsx";

function App() {
  const handleLogoClick = () => {
    // Логика для перехода на домашнюю страницу, если необходимо
    window.location.href = "/"; // Перезагрузка страницы
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage onLogoClick={handleLogoClick} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/section1" element={<BazaRechi />} />
        <Route path="/section2" element={<Game />} />
        <Route path="/section3" element={<Game />} />
        <Route path="/section4" element={<Game />} />
        <Route path="/section5" element={<Game />} />
        <Route path="/section6" element={<Game />} />
        <Route path="/section7" element={<Game />} />
        <Route path="/section8" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Game from "./components/Game/Game";

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
        <Route path="/section8" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

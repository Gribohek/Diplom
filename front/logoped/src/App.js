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
import Leksik from "./components/section2/Leksik.jsx";
import Gramatik from "./components/section3/Gramatik.jsx";
import Svjaz from "./components/section4/Svjaz.jsx";
import ObychenieGramote from "./components/section5/ObychenieGramote.jsx";
import Zvuk from "./components/section6/Zvuk.jsx";
import Motorika from "./components/section7/Motorika.jsx";

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
        <Route path="/section2" element={<Leksik />} />
        <Route path="/section3" element={<Gramatik />} />
        <Route path="/section4" element={<Svjaz />} />
        <Route path="/section5" element={<ObychenieGramote />} />
        <Route path="/section6" element={<Zvuk />} />
        <Route path="/section7" element={<Motorika />} />
        <Route path="/section8" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div className="app-wrapper">
      <div className="header">
        <img src="https://avatars.mds.yandex.net/i?id=51d948b1123d31083ce323ff97ea511ee1d2247a-10465625-images-thumbs&n=13"></img>
      </div>
      <div className="leftmenu">
        <div>Это важно</div>
        <div>Это интересно</div>
      </div>
      <div className="rightmenu">
        <div>Лексика</div>
        <div>Граматика</div>
        <div>Игры</div>
      </div>
      <div className="content">
        <div>Общая инфа</div>
      </div>
    </div>
  );
};

export default App;

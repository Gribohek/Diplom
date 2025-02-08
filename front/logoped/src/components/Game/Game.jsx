// src/components/Game.js
import React, { useState } from "react";
import items from "../../data/items";

const Game = () => {
  const [selectedSound, setSelectedSound] = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const [score, setScore] = useState(0);
  const [randomItem, setRandomItem] = useState(
    items[Math.floor(Math.random() * items.length)]
  );

  const handleSoundClick = (item) => {
    const audio = new Audio(item.sound);
    audio.play();
    setSelectedSound(item.name);
  };

  const handleConfirm = (item) => {
    if (selectedSound === item.name) {
      setScore(score + 1);
    }
    setConfirmed(item.name);
    setTimeout(() => {
      setConfirmed(null);
      setRandomItem(items[Math.floor(Math.random() * items.length)]);
      setSelectedSound(null);
    }, 1000);
  };

  return (
    <div>
      <h1>Соотнесите картинки со звуками!</h1>
      <div>
        <img
          src={randomItem.img}
          alt={randomItem.name}
          style={{ width: "200px", height: "200px" }}
        />
      </div>
      <div>
        {items.map((item) => (
          <button key={item.id} onClick={() => handleSoundClick(item)}>
            {item.name}
          </button>
        ))}
      </div>
      {confirmed && (
        <div>
          {selectedSound === confirmed ? (
            <p>Правильно! Ваш счет: {score}</p>
          ) : (
            <p>Неправильно! Попробуйте снова.</p>
          )}
        </div>
      )}
      <p>Текущий счет: {score}</p>
    </div>
  );
};

export default Game;

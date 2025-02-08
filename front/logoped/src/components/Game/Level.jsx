import React, { useEffect } from "react";
import Audio from "./Audio";

const Level = ({ levelData, onNextLevel, setProgress }) => {
  useEffect(() => {
    // Установить прогресс исходя из уровня
    setProgress(0); // например, 0%
  }, [levelData, setProgress]);

  const handleMatch = (correct) => {
    if (correct) {
      setProgress(100); // Указывается, что уровень пройден
      onNextLevel(); // Переход к следующему уровню
    } else {
      alert("Попробуйте еще раз!");
      setProgress(50); // Примерный прогресс для неправильного ответа
    }
  };

  return (
    <div>
      <h2>{levelData.title}</h2>
      <Audio soundUrl={levelData.soundUrl} />
      <div>
        {levelData.images.map((image, index) => (
          <button key={index} onClick={() => handleMatch(image.isCorrect)}>
            <img src={image.url} alt={image.alt} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Level;

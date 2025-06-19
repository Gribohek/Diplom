import "./Gamekartochki.css";
import pathIconKvad from "../../data/assets/Game/GreenKvad.jpg";
import pathIconKrug from "../../data/assets/Game/Krug.png";
import pathIconScr from "../../data/assets/Game/Kavad.png";
import pathIconMnog from "../../data/assets/Game/MnogUgol.png";
import pathIconZvezd from "../../data/assets/Game/Zvezd.png";
import pathIconTreug from "../../data/assets/Game/Treugol.png";

import pathIconVibr from "../../data/assets/Game/Vibrano.png";
import { useState, useEffect } from "react";

const initialArrayCards = [
  { id: 1, img: pathIconKvad },
  { id: 2, img: pathIconKrug },
  { id: 3, img: pathIconScr },
  { id: 4, img: pathIconMnog },
  { id: 5, img: pathIconZvezd },
  { id: 6, img: pathIconTreug },
];

const idsArray = initialArrayCards.map((card) => card.id);
const pairOfArrayCards = [...initialArrayCards, ...initialArrayCards];
function Kartochki() {
  const [arrayCards, setArrayCards] = useState([]);
  const [openedCards, setOpenedCards] = useState([]);
  const [matched, setMatched] = useState([]);

  const shuffle = (array) => {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  useEffect(() => {
    setArrayCards(shuffle(pairOfArrayCards));
  }, []);

  const flipCard = (index) => () => {
    if (matched.includes(arrayCards[index].id)) return;

    if (
      openedCards[openedCards.length - 1] !== index &&
      openedCards.length < 2
    ) {
      setOpenedCards((opened) => [...opened, index]);
    }
  };

  useEffect(() => {
    if (openedCards < 2) return;
    const firstMatched = arrayCards[openedCards[0]];
    const secondMatched = arrayCards[openedCards[1]];
    if (secondMatched && firstMatched.id === secondMatched.id) {
      setMatched([...matched, firstMatched.id]);
    }
    if (openedCards.length === 2) setTimeout(() => setOpenedCards([]), 1000);
  }, [openedCards]);

  const handleGameRestart = () => {
    setOpenedCards([]);
    setMatched([]);
    setArrayCards(shuffle(pairOfArrayCards));
  };

  //Автоматическая отсылка на сохранку
  useEffect(() => {
    if (matched.length === initialArrayCards.length) {
      saveResults();
    }
  });
  //Сохранение
  const saveResults = () => {
    console.log("Результаты сохранены:");
  };

  return (
    <div>
      <Header />
      <div className="container">
        <p
          className={`gamezover ${
            idsArray.every((item) => matched.includes(item))
              ? ""
              : "hidengamezover"
          }`}
        >
          Игра окончена
        </p>
        <div className="cards">
          {arrayCards.map((item, index) => {
            let isFlipped = false;

            if (openedCards.includes(index)) isFlipped = true;
            if (matched.includes(item.id)) isFlipped = true;
            return (
              <div
                key={index}
                className={`card ${isFlipped ? "flipped" : ""}`}
                onClick={flipCard(index)}
              >
                <div className="inner">
                  <div className="front">
                    <img src={item.img} width="100" alt="front-card" />
                  </div>
                  <div className="back">
                    <img src={pathIconVibr} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button className="button-restart" onClick={handleGameRestart}>
          Начать заново
        </button>
      </div>
    </div>
  );
}

export default Kartochki;

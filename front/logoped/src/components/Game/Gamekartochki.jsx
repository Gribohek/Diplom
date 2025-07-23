import "./Gamekartochki.css";
import pathIconKvad from "../../data/assets/Game/GreenKvad.jpg";
import pathIconKrug from "../../data/assets/Game/Krug.png";
import pathIconScr from "../../data/assets/Game/Kavad.png";
import pathIconMnog from "../../data/assets/Game/MnogUgol.png";
import pathIconZvezd from "../../data/assets/Game/Zvezd.png";
import pathIconTreug from "../../data/assets/Game/Treugol.png";
import pathIconVibr from "../../data/assets/Game/Vibrano.png";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

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
  const [currentScore, setCurrentScore] = useState(0); // Текущий счет игры
  const [totalScore, setTotalScore] = useState(0); // Общий накопленный счет
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingGame, setExistingGame] = useState(null);

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

  const fetchUserData = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setError("Для сохранения результатов необходимо войти в систему");
      setLoading(false);
      return;
    }

    try {
      // Получаем данные пользователя
      const userResponse = await fetch("http://localhost:4200/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Ошибка авторизации");
      }

      const userData = await userResponse.json();
      setUserData(userData);

      // Получаем все игры пользователя
      const gamesResponse = await fetch(
        `http://localhost:4200/games/user/${userData.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (gamesResponse.ok) {
        const gamesData = await gamesResponse.json();
        // Ищем игру с нужным названием
        const memoryGame = gamesData.find(
          (game) => game.title === "Найти одинаковые карточки "
        );

        if (memoryGame) {
          setExistingGame(memoryGame);
          setTotalScore(memoryGame.score || 0); // Устанавливаем общий счет из БД
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setArrayCards(shuffle(pairOfArrayCards));
    fetchUserData();
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
    if (openedCards.length < 2) return;

    const firstMatched = arrayCards[openedCards[0]];
    const secondMatched = arrayCards[openedCards[1]];

    if (secondMatched && firstMatched.id === secondMatched.id) {
      setMatched([...matched, firstMatched.id]);
      setCurrentScore((prevScore) => prevScore + 100); // Увеличиваем текущий счет
    }

    if (openedCards.length === 2) setTimeout(() => setOpenedCards([]), 1000);
  }, [openedCards]);

  const handleGameRestart = () => {
    setOpenedCards([]);
    setMatched([]);
    setCurrentScore(0);
    setArrayCards(shuffle(pairOfArrayCards));
  };

  const saveResults = async () => {
    const token = Cookies.get("token");
    if (!token || !userData) {
      console.log("Результаты не сохранены - пользователь не авторизован");
      return;
    }

    try {
      const newTotalScore = totalScore + currentScore; // Суммируем общий и текущий счет

      if (existingGame) {
        // Обновляем существующую игру с новым суммарным счетом
        const response = await fetch(
          `http://localhost:4200/games/${existingGame.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              score: newTotalScore, // Отправляем сумму старого и нового счета
              completed: true,
            }),
          }
        );

        if (!response.ok) throw new Error("Ошибка обновления результатов");

        const updatedGame = await response.json();
        setExistingGame(updatedGame);
        setTotalScore(newTotalScore);
        console.log("Результаты обновлены", updatedGame);
      } else {
        // Создаем новую игру
        const response = await fetch("http://localhost:4200/games", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: "Найти одинаковые карточки ",
            score: currentScore, // Для новой игры используем текущий счет
            completed: true,
            userId: userData.id,
          }),
        });

        if (!response.ok) throw new Error("Ошибка сохранения результатов");

        const data = await response.json();
        setExistingGame(data);
        setTotalScore(currentScore);
        console.log("Результаты сохранены:", data);
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  useEffect(() => {
    if (matched.length === initialArrayCards.length) {
      saveResults();
    }
  }, [matched]);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="ntcontainer">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => (window.location.href = "/login")}>
            Войти
          </button>
        </div>
      )}

      <div className="game-header">
        {userData && (
          <div className="user-info">Игрок: {userData.firstName}</div>
        )}
        <div className="score">Текущий счет: {currentScore}</div>
        <div className="total-score">Общий счет: {totalScore}</div>
      </div>

      <p
        className={`gamezover ${
          idsArray.every((item) => matched.includes(item))
            ? ""
            : "hidengamezover"
        }`}
      >
        Игра окончена! Вы заработали: {currentScore} очков
      </p>

      <div className="okcards">
        {arrayCards.map((item, index) => {
          let isFlipped =
            openedCards.includes(index) || matched.includes(item.id);

          return (
            <div
              key={index}
              className={`epcard ${isFlipped ? "ggflipped" : ""}`}
              onClick={flipCard(index)}
            >
              <div className="orinner">
                <div className="pbfront">
                  <img src={item.img} width="100" alt="card-front" />
                </div>
                <div className="ekback">
                  <img src={pathIconVibr} alt="card-back" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="rtbutton-restart" onClick={handleGameRestart}>
        Начать заново
      </button>
    </div>
  );
}

export default Kartochki;

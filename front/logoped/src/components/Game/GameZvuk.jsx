import React, { useState, useEffect, useRef } from "react";
import "../HomePage/HomePage.css";
import zvuk_a from "../../data/assets/Game/sounds/gen-6.mp3";
import zvuk_b from "../../data/assets/Game/sounds/gen-7.mp3";
import zvuk_v from "../../data/assets/Game/sounds/gen-8.mp3";
import zvuk_g from "../../data/assets/Game/sounds/gen-9.mp3";
import zvuk_d from "../../data/assets/Game/sounds/gen-10.mp3";
import zvuk_e from "../../data/assets/Game/sounds/gen-11.mp3";
import zvuk_zh from "../../data/assets/Game/sounds/gen-13.mp3";
import zvuk_z from "../../data/assets/Game/sounds/gen-14.mp3";
import zvuk_i from "../../data/assets/Game/sounds/gen-15.mp3";
import zvuk_k from "../../data/assets/Game/sounds/gen-17.mp3";
import zvuk_l from "../../data/assets/Game/sounds/gen-18.mp3";
import zvuk_m from "../../data/assets/Game/sounds/gen-19.mp3";
import zvuk_n from "../../data/assets/Game/sounds/gen-20.mp3";
import zvuk_o from "../../data/assets/Game/sounds/gen-21.mp3";
import zvuk_p from "../../data/assets/Game/sounds/gen-22.mp3";
import zvuk_r from "../../data/assets/Game/sounds/gen-23.mp3";
import zvuk_s from "../../data/assets/Game/sounds/gen-24.mp3";
import zvuk_t from "../../data/assets/Game/sounds/gen-25.mp3";
import zvuk_u from "../../data/assets/Game/sounds/gen-26.mp3";
import zvuk_f from "../../data/assets/Game/sounds/gen-27.mp3";
import zvuk_h from "../../data/assets/Game/sounds/gen-28.mp3";
import zvuk_ts from "../../data/assets/Game/sounds/gen-29.mp3";
import zvuk_ch from "../../data/assets/Game/sounds/gen-30.mp3";
import zvuk_sh from "../../data/assets/Game/sounds/gen-31.mp3";
import zvuk_shch from "../../data/assets/Game/sounds/gen-32.mp3";
import zvuk_y2 from "../../data/assets/Game/sounds/gen-34.mp3";
import zvuk_e2 from "../../data/assets/Game/sounds/gen-36.mp3";
import zvuk_yu from "../../data/assets/Game/sounds/gen-37.mp3";
import zvuk_ya from "../../data/assets/Game/sounds/gen-38.mp3";
import Cookies from "js-cookie";

const SoundGame = () => {
  const letters = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЫЭЮЯ".split("");

  // Состояния
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [similarity, setSimilarity] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingGames, setExistingGames] = useState({});

  // Рефы
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const timerRef = useRef(null);
  const audioBufferRef = useRef(null);
  const recordedAudioRef = useRef(null);

  // Инициализация AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    return () => {
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Звуки букв
  const letterSounds = {
    А: zvuk_a,
    Б: zvuk_b,
    В: zvuk_v,
    Г: zvuk_g,
    Д: zvuk_d,
    Е: zvuk_e,
    Ж: zvuk_zh,
    З: zvuk_z,
    И: zvuk_i,
    К: zvuk_k,
    Л: zvuk_l,
    М: zvuk_m,
    Н: zvuk_n,
    О: zvuk_o,
    П: zvuk_p,
    Р: zvuk_r,
    С: zvuk_s,
    Т: zvuk_t,
    У: zvuk_u,
    Ф: zvuk_f,
    Х: zvuk_h,
    Ц: zvuk_ts,
    Ч: zvuk_ch,
    Ш: zvuk_sh,
    Щ: zvuk_shch,
    Ы: zvuk_y2,
    Э: zvuk_e2,
    Ю: zvuk_yu,
    Я: zvuk_ya,
  };

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("Требуется авторизация");
          return;
        }

        const userRes = await fetch("http://localhost:4200/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) throw new Error("Ошибка авторизации");

        const user = await userRes.json();
        setUserData(user);

        const gamesRes = await fetch(
          `http://localhost:4200/games/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (gamesRes.ok) {
          const games = await gamesRes.json();
          const gamesMap = {};
          games.forEach((g) => {
            if (g.title.startsWith("Повтори звук: ")) {
              gamesMap[g.title.split(": ")[1]] = g;
            }
          });
          setExistingGames(gamesMap);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const saveResults = async (letter, score) => {
    if (!userData) return;

    try {
      const token = Cookies.get("token");
      if (!token) return;

      const gameTitle = `Повтори звук: ${letter}`;
      const existing = existingGames[letter];

      if (existing) {
        if (score > existing.score) {
          await fetch(`http://localhost:4200/games/${existing.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ score }),
          });
        }
      } else {
        await fetch("http://localhost:4200/games", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: gameTitle,
            score,
            completed: true,
            userId: userData.id,
          }),
        });
      }
    } catch (err) {
      console.error("Ошибка сохранения:", err);
    }
  };

  const handleLetterClick = async (letter) => {
    setSelectedLetter(letter);
    const game = existingGames[letter];
    setSimilarity(game?.score || null);
    playLetterSound(letter);
    audioBufferRef.current = await loadReferenceAudio(letter);
  };

  const playLetterSound = (letter) => {
    if (!letterSounds[letter]) return;
    const audio = new Audio(letterSounds[letter]);
    audio.play().catch((e) => console.error("Ошибка воспроизведения:", e));
  };

  const loadReferenceAudio = async (letter) => {
    if (!letterSounds[letter]) return null;
    try {
      const response = await fetch(letterSounds[letter]);
      const arrayBuffer = await response.arrayBuffer();
      return await audioContextRef.current.decodeAudioData(arrayBuffer);
    } catch (err) {
      console.error("Ошибка загрузки аудио:", err);
      return null;
    }
  };

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 10) {
            stopRecording();
            return 10;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setRecordingTime(0);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = analyzeRecording;
      mediaRecorderRef.current.start();

      setIsRecording(true);
      setRecordedAudioUrl(null);
    } catch (err) {
      console.error("Ошибка микрофона:", err);
      alert("Не удалось получить доступ к микрофону");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
      mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
    }
  };

  const analyzeRecording = async () => {
    if (!selectedLetter || !audioBufferRef.current) return;

    setIsAnalyzing(true);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setRecordedAudioUrl(audioUrl);

      // Фиксированный результат 88% вместо реального анализа
      const fixedScore = 0;
      setSimilarity(fixedScore);
      saveResults(selectedLetter, fixedScore);
    } catch (err) {
      console.error("Ошибка анализа:", err);
      alert("Ошибка при анализе записи");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const playRecordedSound = () => {
    if (!recordedAudioUrl) return;

    if (recordedAudioRef.current) {
      recordedAudioRef.current.pause();
      recordedAudioRef.current.currentTime = 0;
    }

    recordedAudioRef.current = new Audio(recordedAudioUrl);
    recordedAudioRef.current
      .play()
      .catch((e) => console.error("Ошибка воспроизведения:", e));
  };

  const getResultText = () => {
    const fixedScore = 0; // Всегда используем 88% для текста результата
    if (fixedScore >= 85) return "Отлично! Идеальное совпадение!";
    if (fixedScore >= 70) return "Хорошо! Почти получилось!";
    if (fixedScore >= 50) return "Неплохо, но можно лучше";
    return "Попробуй еще раз!";
  };

  const getLetterColor = (score) => {
    if (score == null) return "transparent";
    if (score >= 85) return "#4CAF50";
    if (score >= 70) return "#8BC34A";
    if (score >= 50) return "#FFC107";
    return "#F44336";
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="game-container">
      <h1>Повтори звук</h1>
      <p>Выбери букву, послушай звук и попробуй повторить</p>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => (window.location.href = "/login")}>
            Войти
          </button>
        </div>
      )}

      {userData && <div className="user-info">Игрок: {userData.firstName}</div>}

      <div className="letters-grid">
        {letters.map((letter) => {
          const game = existingGames[letter];
          const displayScore = game?.score;

          return (
            <button
              key={letter}
              className={`letter-btn ${
                selectedLetter === letter ? "active" : ""
              }`}
              onClick={() => handleLetterClick(letter)}
            >
              {letter}
              {displayScore != null && (
                <span
                  className="letter-indicator"
                  style={{ backgroundColor: getLetterColor(displayScore) }}
                />
              )}
            </button>
          );
        })}
      </div>

      {selectedLetter && (
        <div className="control-panel">
          <div className="current-letter">Выбрана: {selectedLetter}</div>

          <div className="buttons">
            <button
              className={`record-btn ${isRecording ? "recording" : ""}`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isAnalyzing}
            >
              {isRecording ? "⏹ Стоп" : "🎤 Запись"}
            </button>

            <button
              className="play-btn"
              onClick={() => playLetterSound(selectedLetter)}
              disabled={isAnalyzing}
            >
              ▶ Воспроизвести
            </button>

            {recordedAudioUrl && (
              <button
                className="play-recorded-btn"
                onClick={playRecordedSound}
                disabled={isAnalyzing}
              >
                ▶ Прослушать запись
              </button>
            )}
          </div>

          {isRecording && (
            <div className="recording-indicator">
              <div className="pulse"></div>
              <span>Идет запись: {recordingTime.toFixed(1)} сек</span>
            </div>
          )}

          {isAnalyzing && (
            <div className="analyzing-indicator">
              <div className="spinner"></div>
              <span>Анализ записи...</span>
            </div>
          )}

          {similarity !== null && !isAnalyzing && (
            <div className="result">
              <div className="similarity">
                <div className="similarity-bar" style={{ width: `0%` }} />
                <span>0% совпадения</span>
              </div>
              <div className="result-text">{getResultText()}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SoundGame;

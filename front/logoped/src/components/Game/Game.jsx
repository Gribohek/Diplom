import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import audioFile from "../../data/assets/Zvuk/gen-6.mp3";
import Header from "../Header/Header.jsx";
import "../HomePage/HomePage.css";
import { Link } from "react-router-dom";
import Kartochki from "./Gamekartochki.jsx";

const sounds = [
  {
    id: 1,
    name: "А",
    audio: audioFile,
  },
  {
    id: 2,
    name: "О",
    audio: "https://www.soundjay.com/buttons/sounds/button-10.mp3",
  },
  {
    id: 3,
    name: "У",
    audio: "https://www.soundjay.com/buttons/sounds/button-11.mp3",
  },
  {
    id: 4,
    name: "М",
    audio: "https://www.soundjay.com/buttons/sounds/button-21.mp3",
  },
  {
    id: 5,
    name: "П",
    audio: "https://www.soundjay.com/buttons/sounds/button-22.mp3",
  },
];

function IframeComponent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [activeGame, setActiveGame] = useState(null); // 'sound' или 'other'
  const navigate = useNavigate();

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
      navigator.mediaDevices.getUserMedia({ audio: true }).catch((err) => {
        console.error("Microphone access denied:", err);
        setFeedback("Для игры нужно разрешение на использование микрофона");
      });
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const playSound = (sound) => {
    setCurrentSound(sound);
    setFeedback("Слушайте звук...");
    setRecordedAudio(null);

    if (audioRef.current) {
      audioRef.current.src = sound.audio;
      audioRef.current.play().then(() => {
        setFeedback('Теперь нажмите "Записать" и повторите звук');
      });
    }
  };

  const startRecording = () => {
    if (!currentSound) {
      setFeedback("Сначала выберите звук");
      return;
    }

    setFeedback("Говорите сейчас...");
    setIsRecording(true);
    audioChunksRef.current = [];

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudio(audioUrl);
          comparePronunciation();
        };
        mediaRecorderRef.current.start();
      })
      .catch((err) => {
        console.error("Recording error:", err);
        setFeedback("Ошибка записи. Проверьте микрофон.");
        setIsRecording(false);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const comparePronunciation = () => {
    setAttempts((prev) => prev + 1);
    const isCorrect = Math.random() > 0.3;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setFeedback("Сходство с оригиналом 0%");
    } else {
      setFeedback("Попробуйте еще раз. Слушайте внимательнее.");
    }
  };

  const playRecordedAudio = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio);
      audio.play();
    }
  };

  const openSoundGame = () => {
    setActiveGame("sound");
  };

  const openOtherGame = () => {
    setActiveGame("kartochki");
  };

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
      <div className="main-content">
        <h1>Логопедические игры</h1>

        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          <button
            onClick={openSoundGame}
            className="button"
            style={activeGame === "sound" ? { backgroundColor: "#2ec4b6" } : {}}
          >
            Игра "Повтори звук"
          </button>
          <button
            onClick={openOtherGame}
            className="button"
            style={activeGame === "other" ? { backgroundColor: "#2ec4b6" } : {}}
          >
            Игра "Найти одинаковые краточки
          </button>
        </div>

        {activeGame === "sound" && (
          <>
            <h2>Игра "Повтори звук"</h2>
            <div className="highlight" style={{ marginBottom: "20px" }}>
              Правильно: {score} из {attempts}
            </div>

            <div
              className="sound-buttons"
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              {sounds.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => playSound(sound)}
                  className={`button ${
                    currentSound?.id === sound.id ? "active" : ""
                  }`}
                  style={
                    currentSound?.id === sound.id
                      ? { backgroundColor: "#2ec4b6" }
                      : {}
                  }
                >
                  {sound.name}
                </button>
              ))}
            </div>

            {currentSound && (
              <div className="control-panel" style={{ marginBottom: "20px" }}>
                <p>
                  Текущий звук: <strong>{currentSound.name}</strong>
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={startRecording}
                    disabled={isRecording}
                    className="button"
                    style={isRecording ? { backgroundColor: "#cccccc" } : {}}
                  >
                    {isRecording ? "Идет запись..." : "Записать"}
                  </button>
                  {isRecording && (
                    <button onClick={stopRecording} className="button">
                      Остановить
                    </button>
                  )}
                </div>
              </div>
            )}

            {feedback && (
              <div className="highlight" style={{ marginBottom: "20px" }}>
                {feedback}
              </div>
            )}

            {recordedAudio && (
              <div
                className="playback"
                style={{ display: "flex", gap: "10px" }}
              >
                <button onClick={playRecordedAudio} className="button">
                  Прослушать запись
                </button>
                <button
                  onClick={() => playSound(currentSound)}
                  className="button"
                >
                  Прослушать оригинал
                </button>
              </div>
            )}

            <audio ref={audioRef} hidden />
          </>
        )}

        {activeGame === "kartochki" && (
          <div>
            <h2>Игра "Найти одинаковые краточки"</h2>
            <p>Здесь будет содержимое второй игры</p>
            <Kartochki />
          </div>
        )}
      </div>
    </div>
  );
}

export default IframeComponent;

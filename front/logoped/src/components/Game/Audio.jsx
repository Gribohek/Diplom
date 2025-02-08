import React from "react";

const Audio = ({ soundUrl }) => {
  return (
    <audio controls>
      <source src={soundUrl} type="audio/mpeg" />
      Ваш браузер не поддерживает аудио.
    </audio>
  );
};

export default Audio;

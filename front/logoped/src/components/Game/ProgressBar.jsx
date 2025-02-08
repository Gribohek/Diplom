import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div style={{ width: "100%", backgroundColor: "#ddd" }}>
      <div
        style={{
          width: `${progress}%`,
          height: "20px",
          backgroundColor: progress === 100 ? "green" : "blue",
        }}
      />
    </div>
  );
};

export default ProgressBar;

import React, { useState } from "react";
import { useTTS } from "../hooks/useTTS";

export const Player: React.FC = () => {
  const [speed, setSpeed] = useState(1);
  const { speak, stop, isSpeaking, words, currentWordIndex } = useTTS();
  const [selectedText, setSelectedText] = useState("");

  function handleSelection() {
    const selected = window.getSelection()?.toString().trim();
    if (selected) {
      setSelectedText(selected);
      speak(selected, speed);
    }
  }

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "#fff",
      padding: "10px 15px",
      borderRadius: "12px",
      boxShadow: "0px 2px 10px rgba(0,0,0,0.15)",
      width: "250px"
    }}>
      <div>
        <button onClick={handleSelection} disabled={isSpeaking}>
          ▶ Read Selection
        </button>
        <button onClick={stop} disabled={!isSpeaking}>
          ⏹ Stop
        </button>
      </div>
      <div>
        <label>Speed: </label>
        <input
          type="number"
          min="0.5"
          max="3"
          step="0.1"
          value={speed}
          onChange={e => setSpeed(parseFloat(e.target.value))}
        />
      </div>

      {/* Highlighted text display */}
      {words.length > 0 && (
        <div style={{ marginTop: "10px", fontSize: "14px", lineHeight: "1.5" }}>
          {words.map((word, i) => (
            <span
              key={i}
              style={{
                backgroundColor: i === currentWordIndex ? "black" : "transparent",
                padding: "2px",
                borderRadius: "3px"
              }}
            >
              {word}{" "}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

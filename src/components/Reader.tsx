// components/Reader.tsx
import React, { useState } from "react";
import { useTTS } from "../hooks/useTTS";

export default function Reader() {
  const [text, setText] = useState("Hello, this is a Speechify-like reader.");
  const { speak, stop, isSpeaking, words, currentWordIndex } = useTTS();

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <textarea
        rows={4}
        style={{ width: "100%", marginBottom: 10 }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div style={{ marginBottom: 10 }}>
        {words.length > 0
          ? words.map((word, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: idx === currentWordIndex ? "yellow" : "transparent",
                  padding: "0 2px",
                }}
              >
                {word}{" "}
              </span>
            ))
          : text}
      </div>
      <button onClick={() => speak(text)} disabled={isSpeaking}>
        ▶ Speak
      </button>
      <button onClick={stop} disabled={!isSpeaking}>
        ⏹ Stop
      </button>
    </div>
  );
}

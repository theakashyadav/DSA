import { useRef, useState } from "react";
import { LRUCache } from "../utils/LRUCache";

const cache = new LRUCache<string, SpeechSynthesisUtterance>(5);

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  function speak(text: string, speed: number = 1) {
    if (speechSynthesis.speaking) speechSynthesis.cancel();

    const splitWords = text.split(/\s+/);
    setWords(splitWords);
    setCurrentWordIndex(null);

    let utterance: SpeechSynthesisUtterance;
    if (cache.has(text)) {
      utterance = cache.get(text)!;
    } else {
      utterance = new SpeechSynthesisUtterance(text);
      cache.set(text, utterance);
    }

    utterance.rate = speed;

    utterance.onboundary = (event) => {
      const charIndex = event.charIndex;
      let count = 0;
      for (let i = 0; i < splitWords.length; i++) {
        count += splitWords[i].length + 1;
        if (count > charIndex) {
          setCurrentWordIndex(i);
          break;
        }
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentWordIndex(null);
    };

    setIsSpeaking(true);
    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }

  function stop() {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentWordIndex(null);
  }

  return { speak, stop, isSpeaking, words, currentWordIndex };
}

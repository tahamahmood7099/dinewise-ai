"use client";

import React, { useState } from "react";
import { Mic, MicOff } from "lucide-react";

interface VoiceSearchButtonProps {
  onSearch: (transcript: string) => void;
}

export default function VoiceSearchButton({ onSearch }: VoiceSearchButtonProps) {
  const [isListening, setIsListening] = useState(false);

  const startListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please type your query.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN"; // Indian English / Hinglish recognition
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript) {
          onSearch(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={startListening}
      className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
        isListening
          ? "bg-rose-500 text-white animate-pulse"
          : "text-slate-400 hover:text-orange-500 hover:bg-slate-200 dark:hover:bg-slate-700"
      }`}
      title={isListening ? "Listening... Speak now (English/Hindi)" : "Search by voice (Web Speech API)"}
    >
      {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
}

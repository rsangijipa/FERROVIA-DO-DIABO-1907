"use client";

import { useEffect, useState, useRef } from "react";
import { useSFX } from "@/hooks/useSFX";

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  playSound?: boolean;
}

export function Typewriter({
  text,
  speed = 30,
  className = "",
  onComplete,
  playSound = true,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [prevText, setPrevText] = useState(text);
  const { playTick } = useSFX();
  const index = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (text !== prevText) {
    setPrevText(text);
    setDisplayText("");
  }

  useEffect(() => {
    index.current = 0;
    const tick = () => {
      if (index.current < text.length) {
        setDisplayText((prev) => prev + text.charAt(index.current));
        if (playSound && text.charAt(index.current) !== " ") {
          playTick();
        }
        index.current++;
        timerRef.current = setTimeout(tick, speed);
      } else if (onComplete) {
        onComplete();
      }
    };

    timerRef.current = setTimeout(tick, speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed, playSound, playTick, onComplete]);

  return <span className={className}>{displayText}</span>;
}

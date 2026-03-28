"use client";

import { useEffect, useRef, useState } from "react";
import { useSpring, motion, useMotionValue } from "framer-motion";
import { useSFX } from "@/hooks/useSFX";

interface AnimatedNumberProps {
  value: number;
  format?: (val: number) => string;
  className?: string;
  playSound?: boolean;
}

export function AnimatedNumber({
  value,
  format = (val) => Math.round(val).toString(),
  className = "",
  playSound = true,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const { playTick } = useSFX();
  const playedValues = useRef<Set<number>>(new Set());
  const [displayValue, setDisplayValue] = useState(format(0));

  useEffect(() => {
    // Reset played values when target value changes significantly
    playedValues.current.clear();
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(format(latest));
      
      if (playSound) {
        const currentInt = Math.floor(latest);
        if (!playedValues.current.has(currentInt)) {
          playTick();
          playedValues.current.add(currentInt);
        }
      }
    });

    return () => unsubscribe();
  }, [springValue, format, playSound, playTick]);

  return <motion.span className={className}>{displayValue}</motion.span>;
}

"use client";

import { useEffect, useRef } from "react";

type LockTextProps = {
  text: string;
  speed?: number;      // ms between frames
  step?: number;       // how fast letters lock in
  className?: string;
};

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export default function ScrambleResolveText({
  text,
  speed = 40,
  step = 0.33,
  className = "",
}: LockTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    let iteration = 0;

    const interval = setInterval(() => {
      if (!ref.current) return;

      ref.current.innerText = text
        .split("")
        .map((char, i) => {
          if (i < iteration) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      iteration += step;

      if (iteration >= text.length) {
        ref.current.innerText = text;
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, step]);

  return (
    <span
      ref={ref}
      className={`${className}`}
      aria-label={text}
    >
      {text}
    </span>
  );
}

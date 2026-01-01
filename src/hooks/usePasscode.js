import { useRef } from "react";

export function usePasscode(length = 6) {
  const refs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d$/.test(value)) {
      e.target.value = "";
      return;
    }

    if (index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const getValue = () =>
    refs.current.map((i) => i?.value || "").join("");

  const clear = () => {
    refs.current.forEach((i) => i && (i.value = ""));
    refs.current[0]?.focus();
  };

  return { refs, handleChange, handleKeyDown, getValue, clear };
}
